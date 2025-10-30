# Presale Backend Setup Guide

This document outlines the backend API endpoints and logic required to support the Founder's Pass presale system.

## Overview

The presale system requires:
- Payment processing via Stripe
- License key generation and storage
- Real-time keys remaining counter
- Purchase tracking for social proof
- Email notifications

## Required API Endpoints

### 1. Create Checkout Session

**Endpoint:** `POST /api/stripe/create-checkout-session`

**Purpose:** Creates a Stripe checkout session for Founder's Pass purchase

**Request Body:**
```json
{
  "email": "customer@example.com",
  "product": "founders-pass",
  "amount": 99700,
  "successUrl": "https://yourdomain.com/payment-success?session_id={CHECKOUT_SESSION_ID}",
  "cancelUrl": "https://yourdomain.com/?payment=cancelled"
}
```

**Response:**
```json
{
  "id": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

**Implementation Notes:**
- Create a Stripe Checkout Session with mode: 'payment'
- Include metadata: { product: 'founders-pass', keyNumber: XX }
- Set payment_method_types: ['card']
- Configure success and cancel URLs
- Store session ID in database for verification

### 2. Stripe Webhook Handler

**Endpoint:** `POST /api/stripe/webhook`

**Purpose:** Handle Stripe events (payment confirmation, failures, etc.)

**Events to Handle:**
- `checkout.session.completed` - Payment successful
- `charge.succeeded` - Charge confirmed
- `charge.failed` - Payment failed

**On Payment Success:**
1. Verify the checkout session
2. Generate unique license key
3. Store purchase record in database:
   - Email
   - License key
   - Purchase timestamp
   - Key number (1-100)
   - Payment ID
4. Decrement keys remaining counter
5. Send confirmation email with license key
6. Add to recent purchases list

**Security:**
- Verify webhook signature using Stripe signing secret
- Use `stripe.webhooks.constructEvent()`

### 3. Verify Payment

**Endpoint:** `POST /api/stripe/verify-payment`

**Purpose:** Verify a payment was successful and retrieve license key

**Request Body:**
```json
{
  "sessionId": "cs_test_..."
}
```

**Response:**
```json
{
  "success": true,
  "licenseKey": "FOUNDER-XXXX-XXXX-XXXX",
  "keyNumber": 23,
  "purchaseDate": "2025-10-30T12:00:00Z"
}
```

### 4. Get Keys Remaining

**Endpoint:** `GET /api/presale/keys-remaining`

**Purpose:** Get current count of remaining founder keys

**Response:**
```json
{
  "remaining": 77,
  "total": 100,
  "claimed": 23,
  "percentageClaimed": 23
}
```

**Implementation:**
- Query database for count of successful purchases
- Cache result with short TTL (30 seconds)
- Return calculated remaining keys

### 5. Get Recent Purchases

**Endpoint:** `GET /api/presale/recent-purchases`

**Purpose:** Get recent purchase data for social proof ticker

**Response:**
```json
{
  "purchases": [
    {
      "name": "@alex_marketing",
      "time": "2min ago",
      "timestamp": "2025-10-30T11:58:00Z"
    },
    {
      "name": "@sarah_growth",
      "time": "5min ago",
      "timestamp": "2025-10-30T11:55:00Z"
    }
  ]
}
```

**Implementation:**
- Return last 5-10 purchases
- Anonymize email addresses (e.g., "a***@gmail.com" → "@alex_marketing")
- Calculate relative time strings
- Cache with 1-minute TTL

## Database Schema

### Purchases Table

```sql
CREATE TABLE presale_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  license_key VARCHAR(50) UNIQUE NOT NULL,
  key_number INTEGER UNIQUE NOT NULL CHECK (key_number >= 1 AND key_number <= 100),
  stripe_session_id VARCHAR(255) UNIQUE NOT NULL,
  stripe_payment_intent_id VARCHAR(255),
  amount_paid INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'usd',
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_purchases_email ON presale_purchases(email);
CREATE INDEX idx_purchases_created_at ON presale_purchases(created_at DESC);
```

## License Key Generation

**Format:** `FOUNDER-XXXX-XXXX-XXXX`

**Example Implementation (Node.js):**
```javascript
function generateLicenseKey() {
  const segments = [];
  for (let i = 0; i < 3; i++) {
    const segment = Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase();
    segments.push(segment);
  }
  return `FOUNDER-${segments.join('-')}`;
}
```

**Security:**
- Generate cryptographically secure random keys
- Verify uniqueness before storing
- Store hashed version for verification

## Email Notifications

### Purchase Confirmation Email

**Subject:** "🎉 Welcome to the Founder's Pass - License Key Inside"

**Content:**
- Thank you message
- License key prominently displayed
- Instructions for activation (post-launch)
- Access to private Founder Discord channel
- Launch date reminder (November 15th)
- Support contact information

### Email Service Integration

Recommended services:
- SendGrid
- Postmark
- AWS SES
- Mailgun

## Environment Variables

Required environment variables:

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Database
DATABASE_URL=postgresql://...

# Email Service
SENDGRID_API_KEY=...
FROM_EMAIL=noreply@yourdomain.com

# Application
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://yourdomain.com
```

## Stripe Configuration

### Product Setup

1. Create product in Stripe Dashboard:
   - Name: "Founder's Pass - Lifetime Access"
   - Description: "Lifetime access to all Architect-tier features"
   - Price: $997.00 one-time

2. Configure Checkout Settings:
   - Enable email collection
   - Customize success page
   - Add product images/branding

### Webhook Setup

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `charge.succeeded`
   - `charge.failed`
4. Copy webhook signing secret to environment variables

## Testing

### Test Mode

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires authentication: `4000 0025 0000 3155`

### Test Workflow

1. Create checkout session
2. Complete payment with test card
3. Verify webhook received
4. Check license key generated
5. Verify email sent
6. Check keys remaining decremented

## Security Considerations

1. **Rate Limiting:** Limit checkout session creation (e.g., 5 per IP per hour)
2. **Webhook Verification:** Always verify Stripe webhook signatures
3. **HTTPS Only:** All endpoints must use HTTPS in production
4. **Input Validation:** Validate all input parameters
5. **Database Transactions:** Use transactions for purchase creation
6. **Key Validation:** Prevent duplicate purchases per email
7. **Fraud Prevention:** Monitor for suspicious patterns

## Deployment Checklist

- [ ] Database migrations applied
- [ ] Stripe webhook endpoint configured
- [ ] Environment variables set
- [ ] Email service configured and tested
- [ ] SSL certificate installed
- [ ] Rate limiting enabled
- [ ] Error monitoring configured (Sentry, etc.)
- [ ] Backup system in place
- [ ] Test purchase completed successfully
- [ ] Keys remaining counter accurate

## Monitoring

Key metrics to monitor:
- Total purchases
- Keys remaining
- Payment failures
- Webhook delivery failures
- Email delivery rates
- API response times
- Database query performance

## Support & Troubleshooting

### Common Issues

**Issue:** Webhook not receiving events
- **Solution:** Verify webhook endpoint is publicly accessible, check Stripe dashboard logs

**Issue:** Duplicate license keys generated
- **Solution:** Add unique constraint on license_key column, implement retry logic

**Issue:** Email not delivered
- **Solution:** Check email service logs, verify FROM_EMAIL is authorized

## WebSocket Integration (Optional)

For real-time keys remaining updates:

**Event:** `presale:purchase`

**Payload:**
```json
{
  "keysRemaining": 76,
  "recentPurchase": {
    "name": "@new_founder",
    "time": "Just now"
  }
}
```

Emit this event after successful purchase to update all connected clients in real-time.

## Additional Resources

- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Webhook Documentation](https://stripe.com/docs/webhooks)
- [Stripe Testing Guide](https://stripe.com/docs/testing)

