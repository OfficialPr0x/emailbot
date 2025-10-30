# Start Presale Website

## Quick Start

To view the presale landing page:

```bash
cd website
npm run dev
```

Then open your browser to: `http://localhost:5173`

## What You'll See

✨ **Presale Landing Page Features:**

1. **Hero Section**
   - "PRESALE NOW LIVE - 100 KEYS ONLY" badge
   - Countdown timer to November 15th
   - Keys remaining counter (77/100)
   - "Claim Your Founder's Pass - $997" CTA

2. **Stats Bar**
   - Keys claimed: 23/100
   - Keys remaining: 77
   - Time to launch: 16 days
   - Live ticker showing recent purchases

3. **Features Section**
   - 6 features with golden "Founder" badges
   - Premium features highlighted
   - "Claim Your Founder's Pass" CTA

4. **Founder Perks Section** (NEW!)
   - 8 exclusive founder benefits
   - Value comparison display
   - Beautiful grid layout

5. **Pricing Section**
   - Single Founder's Pass card
   - $997 one-time (was $1,997)
   - All 18 features listed
   - Payment modal integration

6. **FAQ Section**
   - 5 new presale-specific questions
   - Clear lifetime access messaging

7. **CTA Section**
   - "Only 100 Founders. No Subscriptions. Ever."
   - Urgency messaging
   - Payment modal integration

8. **Navigation**
   - "77 Keys Left" badge
   - "Get Founder's Pass" CTA button

## Interactive Features

Click any "Claim Your Founder's Pass" button to open the payment modal:
- Shows all features
- Email capture
- Stripe payment integration (ready for backend)
- Trust indicators

## Next Steps

1. **Test the UI**: Navigate through the page and test all interactions
2. **Configure Backend**: Follow `PRESALE_BACKEND_SETUP.md` to set up payment processing
3. **Add Stripe Keys**: Create `.env` file with your Stripe test keys
4. **Customize**: Adjust any copy, pricing, or dates as needed

## Environment Setup (Optional for Full Testing)

Create `website/.env`:

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key_here
VITE_API_URL=http://localhost:3000
```

## Notes

- Payment modal is fully functional but requires backend integration
- All counters are hardcoded (77 keys, 23 sold, etc.)
- Countdown is set to November 15th, 2025, 12:00 PM EST
- Live purchase ticker rotates through demo data

Enjoy your presale landing page! 🚀

