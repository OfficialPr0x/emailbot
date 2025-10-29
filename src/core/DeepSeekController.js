import { createLogger } from '../utils/logger.js';
import fetch from 'node-fetch';
import * as helpers from '../utils/helpers.js';

const logger = createLogger('DeepSeekController');

/**
 * DeepSeek AI Controller for generating realistic profiles and content
 */
export class DeepSeekController {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey || process.env.DEEPSEEK_API_KEY;
    this.apiUrl = options.apiUrl || process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
    this.model = options.model || 'deepseek-chat';
  }

  /**
   * Make a request to DeepSeek API
   * @param {Array} messages - Chat messages
   * @param {Object} options - Additional options
   * @returns {Promise<string>}
   */
  async makeRequest(messages, options = {}) {
    const {
      temperature = 0.8,
      maxTokens = 2000,
      timeout = 30000,
    } = options;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature,
          max_tokens: maxTokens,
        }),
        timeout,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`DeepSeek API error: ${response.status} - ${error}`);
      }

      const data = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from DeepSeek API');
      }

      return data.choices[0].message.content;
    } catch (error) {
      logger.error('DeepSeek API request failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Generate a realistic user profile
   * @returns {Promise<Object>} Generated profile
   */
  async generateProfileInfo() {
    logger.info('Generating realistic user profile');

    const prompt = `Generate a realistic user profile for a new social media account. The profile should be for a real-sounding person with believable details.

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
      logger.error('Failed to generate profile', { error: error.message });
      
      // Fallback to basic profile generation
      return this.generateBasicProfile();
    }
  }

  /**
   * Generate a basic profile without AI (fallback)
   * @returns {Object}
   */
  generateBasicProfile() {
    logger.info('Generating basic profile (fallback)');

    const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'William'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'];
    const occupations = ['Designer', 'Developer', 'Photographer', 'Writer', 'Artist', 'Student', 'Entrepreneur', 'Marketing'];
    
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
      interests: ['Travel', 'Photography', 'Food', 'Music', 'Art'].slice(0, 3),
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

  /**
   * Analyze form structure (for advanced form filling)
   * @param {string} formHtml - HTML of the form
   * @returns {Promise<Object>}
   */
  async analyzeFormStructure(formHtml) {
    logger.info('Analyzing form structure');

    const prompt = `Analyze this HTML form and identify the fields:

${formHtml}

Provide a JSON response with field information:
{
  "fields": [
    {
      "type": "input type (text, email, password, etc.)",
      "selector": "CSS selector to target this field",
      "label": "field label or purpose",
      "required": true/false
    }
  ]
}

Respond ONLY with valid JSON.`;

    try {
      const messages = [
        {
          role: 'system',
          content: 'You are an expert at analyzing HTML forms. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ];

      const response = await this.makeRequest(messages);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('No valid JSON in response');
    } catch (error) {
      logger.error('Failed to analyze form', { error: error.message });
      return { fields: [] };
    }
  }
}

export default DeepSeekController;

