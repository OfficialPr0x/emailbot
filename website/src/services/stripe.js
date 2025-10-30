import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe with publishable key
// For development, use test key. For production, use live key.
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'
)

/**
 * Create a checkout session for Founder's Pass purchase
 * @param {string} email - Customer email
 * @param {string} successUrl - Redirect URL on success
 * @param {string} cancelUrl - Redirect URL on cancel
 * @returns {Promise<object>} Checkout session details
 */
export async function createCheckoutSession(email, successUrl, cancelUrl) {
  try {
    // Call your backend API to create a Stripe checkout session
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        product: 'founders-pass',
        amount: 99700, // $997.00 in cents
        successUrl,
        cancelUrl,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create checkout session')
    }

    const session = await response.json()
    return session
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

/**
 * Redirect to Stripe checkout
 * @param {string} sessionId - Stripe checkout session ID
 */
export async function redirectToCheckout(sessionId) {
  const stripe = await stripePromise
  const { error } = await stripe.redirectToCheckout({
    sessionId,
  })

  if (error) {
    console.error('Error redirecting to checkout:', error)
    throw error
  }
}

/**
 * Verify payment status
 * @param {string} sessionId - Stripe checkout session ID
 * @returns {Promise<object>} Payment verification result
 */
export async function verifyPayment(sessionId) {
  try {
    const response = await fetch('/api/stripe/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    })

    if (!response.ok) {
      throw new Error('Failed to verify payment')
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error verifying payment:', error)
    throw error
  }
}

/**
 * Get keys remaining count
 * @returns {Promise<number>} Number of keys remaining
 */
export async function getKeysRemaining() {
  try {
    const response = await fetch('/api/presale/keys-remaining')
    
    if (!response.ok) {
      throw new Error('Failed to fetch keys remaining')
    }

    const data = await response.json()
    return data.remaining
  } catch (error) {
    console.error('Error fetching keys remaining:', error)
    // Return default value on error
    return 100
  }
}

/**
 * Get recent purchases for social proof ticker
 * @returns {Promise<Array>} Array of recent purchase objects
 */
export async function getRecentPurchases() {
  try {
    const response = await fetch('/api/presale/recent-purchases')
    
    if (!response.ok) {
      throw new Error('Failed to fetch recent purchases')
    }

    const data = await response.json()
    return data.purchases
  } catch (error) {
    console.error('Error fetching recent purchases:', error)
    // Return empty array on error
    return []
  }
}

export { stripePromise }

