# 🔐 Clerk Authentication Setup Guide

## What's Been Implemented

✅ **Clerk React SDK** installed and configured  
✅ **Custom-branded Sign In page** matching your design system  
✅ **Custom-branded Sign Up page** with trust badges and animations  
✅ **Protected Dashboard page** with route guards  
✅ **Navigation component** with auth-aware buttons  
✅ **Dark theme styling** with Instagram gradient branding  
✅ **Mobile-responsive** authentication UI  

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create a Clerk Account

1. Go to [https://clerk.com](https://clerk.com)
2. Sign up for a free account
3. Create a new application
4. Choose "React" as your framework

### Step 2: Get Your Publishable Key

1. In your Clerk Dashboard, navigate to **API Keys** page:
   - https://dashboard.clerk.com/last-active?path=api-keys
2. Select **React** framework
3. Copy your **Publishable Key** (starts with `pk_test_...`)

### Step 3: Configure Environment Variables

1. Create a `.env.local` file in the `website/` directory:

```bash
cd website
touch .env.local
```

2. Add your Clerk Publishable Key:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

⚠️ **Important:** Make sure to replace `pk_test_your_actual_key_here` with your actual key from Clerk!

### Step 4: Start the Development Server

```bash
cd website
npm run dev
```

Your website will be running at `http://localhost:5173` (or another port if 5173 is busy)

---

## 📱 Features Implemented

### Custom Sign In Page (`/sign-in`)
- ✨ Branded with your dark theme and Instagram gradients
- 🎨 Glass morphism design matching your website
- 🔐 Social OAuth buttons (Google, GitHub, etc.)
- 📧 Email/Password authentication
- 🔄 "Remember me" functionality
- 💫 Animated background effects
- 📱 Fully mobile-responsive

### Custom Sign Up Page (`/sign-up`)
- ✨ Same beautiful branding as Sign In
- 🎯 Trust badges and social proof
- 📊 Real-time validation
- 🚀 Quick setup indicators
- 💳 Feature highlights (AI-Powered, Automated, Secure)

### Protected Dashboard (`/dashboard`)
- 🛡️ Route protection (must be signed in to access)
- 👤 User profile display with avatar
- 📊 Stats cards (ready for backend integration)
- ⚡ Quick actions grid
- 🔗 Backend API integration instructions
- 🎨 Fully branded with your design system

### Navigation Component
- 🔄 Dynamically shows Login/Dashboard based on auth state
- 👤 Clerk UserButton for account management
- 📱 Mobile menu with auth options
- 🎯 Seamless user experience

---

## 🔧 Customization Options

### Clerk Dashboard Settings

In your Clerk Dashboard, you can customize:

1. **Authentication Options:**
   - Enable/disable social OAuth (Google, GitHub, Facebook, etc.)
   - Configure email verification
   - Set up SMS OTP
   - Enable multi-factor authentication

2. **Branding:**
   - Upload your logo
   - Customize button colors (already styled in code)
   - Set custom domains

3. **User Management:**
   - View all users
   - Manage user sessions
   - Configure user metadata
   - Set up webhooks

### Code Customization

The Clerk components are styled in:
- `website/src/pages/SignIn.jsx` - Sign In page styling
- `website/src/pages/SignUp.jsx` - Sign Up page styling
- `website/src/components/Navigation.jsx` - Auth buttons

All styling uses your existing design tokens:
- `bg-gradient-instagram` - Your Instagram gradient
- `glass` - Glass morphism effect
- `border-white/10` - Subtle borders
- Purple accent colors (`text-purple-400`, etc.)

---

## 🔗 Backend Integration

### Connect to Your API (localhost:3000)

The Dashboard page is ready to integrate with your backend. Here's how:

1. **Get User Token:**

```javascript
import { useAuth } from '@clerk/clerk-react'

function YourComponent() {
  const { getToken } = useAuth()
  
  async function callBackend() {
    const token = await getToken()
    
    const response = await fetch('http://localhost:3000/api/create-account', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // your data
      })
    })
  }
}
```

2. **Verify Token in Backend:**

Install Clerk backend SDK:
```bash
npm install @clerk/clerk-sdk-node
```

Verify the token in your API routes:

```javascript
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node'

app.use(ClerkExpressWithAuth({
  // Your Clerk secret key
}))

app.post('/api/create-account', (req, res) => {
  const userId = req.auth.userId // Clerk user ID
  
  // Your logic here
})
```

### Feature Gating Example

```javascript
import { useUser } from '@clerk/clerk-react'

function FeatureComponent() {
  const { user } = useUser()
  
  // Check user metadata for subscription tier
  const subscriptionTier = user?.publicMetadata?.subscriptionTier || 'free'
  
  if (subscriptionTier === 'pro') {
    return <ProFeature />
  }
  
  return <UpgradePrompt />
}
```

---

## 📋 Routes Summary

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page |
| `/sign-in` | Public | Custom sign in page |
| `/sign-up` | Public | Custom sign up page |
| `/dashboard` | Protected | User dashboard (requires auth) |
| `/docs` | Public | Documentation |
| `/api-reference` | Public | API reference |

---

## 🔒 Security Best Practices

✅ **Environment Variables:** Never commit `.env.local` to git (already in `.gitignore`)  
✅ **HTTPS:** Use HTTPS in production  
✅ **Token Verification:** Always verify Clerk tokens on the backend  
✅ **Session Management:** Clerk handles this automatically  
✅ **CORS:** Configure proper CORS on your backend  

---

## 🎨 Design System Colors

Your Clerk components are styled with:

```css
/* Primary Colors */
Purple: #a855f7 (primary-500)
Pink: #E1306C (instagram-pink)
Orange: #FD1D1D (instagram-orange)

/* Backgrounds */
Dark: #030712 (gray-950)
Glass: rgba(255, 255, 255, 0.05) with backdrop blur

/* Gradients */
Instagram: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)
Purple: linear-gradient(135deg, #667eea, #764ba2)
```

---

## 🐛 Troubleshooting

### "Missing Clerk Publishable Key" Error
- Make sure `.env.local` exists in the `website/` directory
- Verify the key starts with `pk_test_` or `pk_live_`
- Restart the dev server after adding environment variables

### Components Not Showing
- Clear browser cache
- Check browser console for errors
- Verify Clerk package is installed: `npm list @clerk/clerk-react`

### Styling Issues
- Make sure Tailwind CSS is compiled: `npm run dev`
- Check that all imports are correct
- Verify `index.css` is imported in `main.jsx`

---

## 📚 Additional Resources

- [Clerk React Documentation](https://clerk.com/docs/quickstarts/react)
- [Clerk Dashboard](https://dashboard.clerk.com/)
- [Clerk Community](https://clerk.com/discord)
- [API Reference](https://clerk.com/docs/reference/clerkjs)

---

## ✨ Next Steps

1. **Test the Auth Flow:**
   - Visit `/sign-up` and create a test account
   - Verify email (or configure test mode)
   - Access `/dashboard` as authenticated user
   - Try signing out and back in

2. **Configure OAuth Providers:**
   - Enable Google OAuth in Clerk Dashboard
   - Add other social providers as needed
   - Test social sign-in flow

3. **Backend Integration:**
   - Set up Clerk webhook for user events
   - Implement API authentication
   - Add user metadata for feature gating
   - Connect dashboard to real backend data

4. **Production Deployment:**
   - Get production Clerk keys
   - Update `.env` with `VITE_CLERK_PUBLISHABLE_KEY`
   - Configure custom domain in Clerk
   - Set up proper HTTPS

---

🎉 **You're all set!** Your website now has beautiful, branded authentication powered by Clerk!

