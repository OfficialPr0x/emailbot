import { createLogger } from '../utils/logger.js';
import fetch from 'node-fetch';
import * as helpers from '../utils/helpers.js';

const logger = createLogger('OpenRouterController');

/**
 * OpenRouter AI Controller for generating realistic profiles and intelligent form analysis
 * Uses OpenRouter's unified API with multiple model fallbacks for maximum reliability
 * Documentation: https://openrouter.ai/docs/quickstart
 */
export class OpenRouterController {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey || process.env.OPENROUTER_API_KEY;
    this.apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    
    // Model hierarchy with automatic fallback
    this.models = [
      options.primaryModel || process.env.OPENROUTER_PRIMARY_MODEL || 'anthropic/claude-3.5-sonnet',
      options.fallbackModel1 || process.env.OPENROUTER_FALLBACK_MODEL || 'openai/gpt-4o',
      'google/gemini-pro-1.5', // Cost-effective final fallback
      'meta-llama/llama-3.1-70b-instruct', // Free fallback
    ];
    
    this.currentModelIndex = 0;
    this.siteUrl = options.siteUrl || 'https://github.com/emailbot';
    this.siteName = options.siteName || 'EmailBot Account Creator';
  }

  /**
   * Make a request to OpenRouter API with automatic model fallback
   * @param {Array} messages - Chat messages
   * @param {Object} options - Additional options
   * @returns {Promise<string>}
   */
  async makeRequest(messages, options = {}) {
    const {
      temperature = 0.8,
      maxTokens = 2000,
      timeout = 10000,  // Reduced from 30s to 10s - faster timeout
      retryCount = 0,
    } = options;

    const currentModel = this.models[this.currentModelIndex];
    logger.info('Making OpenRouter API request', { model: currentModel, retryCount });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': this.siteUrl,
          'X-Title': this.siteName,
        },
        body: JSON.stringify({
          model: currentModel,
          messages,
          temperature,
          max_tokens: maxTokens,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
      }

      const data = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from OpenRouter API');
      }

      // Reset model index on success
      if (this.currentModelIndex > 0) {
        logger.info('Request successful with fallback model, resetting to primary');
        this.currentModelIndex = 0;
      }

      return data.choices[0].message.content;
    } catch (error) {
      logger.error('OpenRouter API request failed', { 
        error: error.message, 
        model: currentModel,
        retryCount 
      });

      // Try fallback model if available
      if (this.currentModelIndex < this.models.length - 1 && retryCount < 3) {
        logger.warn(`Trying fallback model: ${this.models[this.currentModelIndex + 1]}`);
        this.currentModelIndex++;
        return this.makeRequest(messages, { ...options, retryCount: retryCount + 1 });
      }

      // Reset model index for next request
      this.currentModelIndex = 0;
      throw error;
    }
  }

  /**
   * Generate a realistic user profile using AI
   * @returns {Promise<Object>} Generated profile
   */
  async generateProfileInfo() {
    logger.info('Generating realistic user profile with AI');

    const prompt = `Generate a realistic user profile for a new Gmail/Instagram account. The profile should be for a real-sounding person with believable details.

Please provide the following information in JSON format:
{
  "firstName": "realistic first name",
  "lastName": "realistic last name",
  "username": "creative username (8-15 characters, can include numbers)",
  "birthDate": "YYYY-MM-DD (age between 18-35)",
  "gender": "male or female",
  "bio": "interesting bio (50-150 characters)",
  "interests": ["interest1", "interest2", "interest3"],
  "location": "City, State/Country",
  "occupation": "realistic occupation",
  "profileDescription": "A brief personality description"
}

Make it diverse and realistic. Respond ONLY with valid JSON, no additional text.`;

    try {
      const messages = [
        {
          role: 'system',
          content: 'You are an expert at creating realistic social media profiles. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ];

      const response = await this.makeRequest(messages);
      
      // Parse JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON in response');
      }

      const profile = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      const requiredFields = ['firstName', 'lastName', 'username', 'birthDate', 'gender'];
      for (const field of requiredFields) {
        if (!profile[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Generate additional fields
      profile.email = this.generateEmail(profile.firstName, profile.lastName, profile.username);
      profile.password = this.generatePassword();
      profile.phoneNumber = this.generatePhoneNumber();
      profile.fullName = `${profile.firstName} ${profile.lastName}`;

      logger.info('Profile generated successfully', {
        username: profile.username,
        email: profile.email,
      });

      return profile;
    } catch (error) {
      logger.error('Failed to generate profile with AI', { error: error.message });
      
      // Fallback to basic profile generation
      return this.generateBasicProfile();
    }
  }

  /**
   * Analyze page structure and suggest selectors
   * @param {string} pageHtml - HTML of the page
   * @param {string} fieldType - Type of field to find (e.g., 'username', 'password')
   * @returns {Promise<Array<string>>} Array of suggested selectors
   */
  async analyzePageStructure(pageHtml, fieldType) {
    logger.info('Analyzing page structure with AI', { fieldType });

    const prompt = `Analyze this HTML and find the best CSS selectors for the "${fieldType}" field.

HTML (truncated):
${pageHtml.substring(0, 5000)}

Provide a JSON array of 10 different CSS selectors that could target the ${fieldType} field, ordered by likelihood of success:
["selector1", "selector2", "selector3", ...]

Consider:
- Input name attributes
- Input type attributes
- ARIA labels
- Placeholder text
- ID attributes
- Class names
- Parent element context

Respond ONLY with a valid JSON array of selectors.`;

    try {
      const messages = [
        {
          role: 'system',
          content: 'You are an expert at analyzing HTML forms and creating CSS selectors. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ];

      const response = await this.makeRequest(messages, { maxTokens: 1000 });
      
      // Parse JSON array from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const selectors = JSON.parse(jsonMatch[0]);
        logger.info('AI suggested selectors', { fieldType, count: selectors.length });
        return selectors;
      }
      
      throw new Error('No valid JSON array in response');
    } catch (error) {
      logger.error('Failed to analyze page structure', { error: error.message });
      return [];
    }
  }

  /**
   * Generate alternative selectors for a field
   * @param {string} fieldName - Name of the field
   * @param {Object} context - Context information about the page
   * @returns {Promise<Array<string>>}
   */
  async generateAlternativeSelectors(fieldName, context = {}) {
    logger.info('Generating alternative selectors', { fieldName });

    const prompt = `Generate 15 different CSS selectors that could target a "${fieldName}" input field in a Google signup form.

Context:
- Current page: ${context.pageUrl || 'Google account signup'}
- Step: ${context.step || 'unknown'}
- Previous fields: ${JSON.stringify(context.previousFields || [])}

Provide creative selectors including:
- Attribute selectors
- ARIA label selectors
- Class-based selectors
- Position-based selectors
- Parent/child relationship selectors

Respond with ONLY a JSON array: ["selector1", "selector2", ...]`;

    try {
      const messages = [
        {
          role: 'system',
          content: 'You are an expert at creating CSS selectors for web automation. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ];

      const response = await this.makeRequest(messages, { maxTokens: 1000 });
      
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return [];
    } catch (error) {
      logger.error('Failed to generate alternative selectors', { error: error.message });
      return [];
    }
  }

  /**
   * Detect form flow changes and provide guidance
   * @param {string} pageHtml - Current page HTML
   * @param {string} expectedStep - Expected step name
   * @returns {Promise<Object>}
   */
  async detectFormFlowChanges(pageHtml, expectedStep) {
    logger.info('Detecting form flow changes', { expectedStep });

    const prompt = `Analyze this HTML to determine what step of the Google signup flow this is.

Expected step: ${expectedStep}
HTML (truncated):
${pageHtml.substring(0, 5000)}

Provide a JSON response:
{
  "detectedStep": "name_page | birthday_page | username_page | terms_page | success_page | error_page",
  "confidence": 0.0-1.0,
  "fieldsPresent": ["field1", "field2"],
  "suggestions": "What to do next"
}

Respond ONLY with valid JSON.`;

    try {
      const messages = [
        {
          role: 'system',
          content: 'You are an expert at analyzing web forms. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ];

      const response = await this.makeRequest(messages, { maxTokens: 800 });
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return { detectedStep: 'unknown', confidence: 0, suggestions: 'Could not analyze' };
    } catch (error) {
      logger.error('Failed to detect form flow changes', { error: error.message });
      return { detectedStep: 'unknown', confidence: 0, suggestions: 'Analysis failed' };
    }
  }

  /**
   * Generate a basic profile without AI (fallback)
   * @returns {Object}
   */
  generateBasicProfile() {
    logger.info('Generating basic profile (fallback)');

    const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'Austin'];
    const occupations = ['Designer', 'Developer', 'Photographer', 'Writer', 'Artist', 'Student', 'Entrepreneur', 'Marketing', 'Teacher', 'Engineer'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const username = helpers.generateUsername(firstName, lastName);
    
    const profile = {
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      username,
      email: this.generateEmail(firstName, lastName, username),
      password: this.generatePassword(),
      birthDate: this.generateBirthDate(),
      gender: Math.random() > 0.5 ? 'male' : 'female',
      bio: `${occupations[Math.floor(Math.random() * occupations.length)]} from ${cities[Math.floor(Math.random() * cities.length)]}`,
      interests: ['Travel', 'Photography', 'Food', 'Music', 'Art', 'Technology', 'Fitness', 'Reading'].sort(() => Math.random() - 0.5).slice(0, 3),
      location: cities[Math.floor(Math.random() * cities.length)],
      occupation: occupations[Math.floor(Math.random() * occupations.length)],
      phoneNumber: this.generatePhoneNumber(),
      profileDescription: 'A creative and passionate individual',
    };

    logger.info('Basic profile generated', { username: profile.username });
    return profile;
  }

  /**
   * Generate email address
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} username
   * @returns {string}
   */
  generateEmail(firstName, lastName, username) {
    const domains = ['gmail.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    
    const options = [
      `${firstName.toLowerCase()}.${lastName.toLowerCase()}${helpers.randomInt(1, 999)}`,
      `${firstName.toLowerCase()}${lastName.toLowerCase()}${helpers.randomInt(1, 999)}`,
      username,
    ];
    
    const localPart = options[Math.floor(Math.random() * options.length)];
    return `${localPart}@${domain}`;
  }

  /**
   * Generate a secure password
   * @returns {string}
   */
  generatePassword() {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*';
    
    let password = '';
    password += upper[Math.floor(Math.random() * upper.length)];
    password += lower[Math.floor(Math.random() * lower.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    const allChars = upper + lower + numbers + special;
    for (let i = 0; i < 8; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Generate a birth date (18-35 years old)
   * @returns {string} YYYY-MM-DD
   */
  generateBirthDate() {
    const today = new Date();
    const year = today.getFullYear() - helpers.randomInt(18, 35);
    const month = String(helpers.randomInt(1, 12)).padStart(2, '0');
    const day = String(helpers.randomInt(1, 28)).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  /**
   * Generate a phone number
   * @returns {string}
   */
  generatePhoneNumber() {
    const areaCode = helpers.randomInt(200, 999);
    const prefix = helpers.randomInt(200, 999);
    const lineNumber = helpers.randomInt(1000, 9999);
    
    return `+1${areaCode}${prefix}${lineNumber}`;
  }

  /**
   * Generate Instagram post caption
   * @param {Object} profile - User profile
   * @param {number} postNumber - Post number
   * @returns {Promise<string>}
   */
  async generatePostCaption(profile, postNumber = 1) {
    logger.info('Generating post caption', { postNumber });

    const prompt = `Generate a casual Instagram post caption for ${profile.firstName}, a ${profile.occupation} from ${profile.location}.

Interests: ${profile.interests.join(', ')}

Create a natural, authentic caption that fits their personality. Keep it under 100 characters. Include 1-2 relevant emojis. Respond ONLY with the caption text.`;

    try {
      const messages = [
        {
          role: 'system',
          content: 'You are an expert at writing engaging social media captions. Keep them authentic and casual.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ];

      const caption = await this.makeRequest(messages, { maxTokens: 100 });
      return caption.trim();
    } catch (error) {
      logger.error('Failed to generate caption', { error: error.message });
      
      // Fallback captions
      const fallbacks = [
        'Living my best life ✨',
        'Good vibes only 🌟',
        'Making memories 📸',
        'Just another day in paradise 🌴',
        'Grateful for moments like these 🙏',
      ];
      
      return fallbacks[postNumber % fallbacks.length];
    }
  }
}

export default OpenRouterController;

