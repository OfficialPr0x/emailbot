// Geocoding utility for converting location strings to lat/lng coordinates
// Optimized for performance with static city database and localStorage caching

// Comprehensive city database with major cities worldwide
const CITY_DATABASE = {
  // North America
  'vancouver, canada': { lat: 49.2827, lng: -123.1207 },
  'toronto, canada': { lat: 43.6532, lng: -79.3832 },
  'montreal, canada': { lat: 45.5017, lng: -73.5673 },
  'new york, usa': { lat: 40.7128, lng: -74.0060 },
  'new york, united states': { lat: 40.7128, lng: -74.0060 },
  'los angeles, usa': { lat: 34.0522, lng: -118.2437 },
  'los angeles, united states': { lat: 34.0522, lng: -118.2437 },
  'chicago, usa': { lat: 41.8781, lng: -87.6298 },
  'san francisco, usa': { lat: 37.7749, lng: -122.4194 },
  'seattle, usa': { lat: 47.6062, lng: -122.3321 },
  'miami, usa': { lat: 25.7617, lng: -80.1918 },
  'boston, usa': { lat: 42.3601, lng: -71.0589 },
  'austin, usa': { lat: 30.2672, lng: -97.7431 },
  'denver, usa': { lat: 39.7392, lng: -104.9903 },
  'mexico city, mexico': { lat: 19.4326, lng: -99.1332 },
  
  // Europe
  'london, uk': { lat: 51.5074, lng: -0.1278 },
  'london, united kingdom': { lat: 51.5074, lng: -0.1278 },
  'paris, france': { lat: 48.8566, lng: 2.3522 },
  'berlin, germany': { lat: 52.5200, lng: 13.4050 },
  'madrid, spain': { lat: 40.4168, lng: -3.7038 },
  'rome, italy': { lat: 41.9028, lng: 12.4964 },
  'amsterdam, netherlands': { lat: 52.3676, lng: 4.9041 },
  'barcelona, spain': { lat: 41.3851, lng: 2.1734 },
  'vienna, austria': { lat: 48.2082, lng: 16.3738 },
  'stockholm, sweden': { lat: 59.3293, lng: 18.0686 },
  'copenhagen, denmark': { lat: 55.6761, lng: 12.5683 },
  'dublin, ireland': { lat: 53.3498, lng: -6.2603 },
  'lisbon, portugal': { lat: 38.7223, lng: -9.1393 },
  'prague, czech republic': { lat: 50.0755, lng: 14.4378 },
  'warsaw, poland': { lat: 52.2297, lng: 21.0122 },
  'budapest, hungary': { lat: 47.4979, lng: 19.0402 },
  'athens, greece': { lat: 37.9838, lng: 23.7275 },
  'moscow, russia': { lat: 55.7558, lng: 37.6173 },
  'istanbul, turkey': { lat: 41.0082, lng: 28.9784 },
  
  // Asia
  'tokyo, japan': { lat: 35.6762, lng: 139.6503 },
  'osaka, japan': { lat: 34.6937, lng: 135.5023 },
  'seoul, south korea': { lat: 37.5665, lng: 126.9780 },
  'beijing, china': { lat: 39.9042, lng: 116.4074 },
  'shanghai, china': { lat: 31.2304, lng: 121.4737 },
  'hong kong, china': { lat: 22.3193, lng: 114.1694 },
  'singapore, singapore': { lat: 1.3521, lng: 103.8198 },
  'bangkok, thailand': { lat: 13.7563, lng: 100.5018 },
  'mumbai, india': { lat: 19.0760, lng: 72.8777 },
  'delhi, india': { lat: 28.7041, lng: 77.1025 },
  'bangalore, india': { lat: 12.9716, lng: 77.5946 },
  'dubai, uae': { lat: 25.2048, lng: 55.2708 },
  'dubai, united arab emirates': { lat: 25.2048, lng: 55.2708 },
  'kuala lumpur, malaysia': { lat: 3.1390, lng: 101.6869 },
  'manila, philippines': { lat: 14.5995, lng: 120.9842 },
  'jakarta, indonesia': { lat: -6.2088, lng: 106.8456 },
  'ho chi minh, vietnam': { lat: 10.8231, lng: 106.6297 },
  'hanoi, vietnam': { lat: 21.0285, lng: 105.8542 },
  'taipei, taiwan': { lat: 25.0330, lng: 121.5654 },
  
  // Middle East
  'tel aviv, israel': { lat: 32.0853, lng: 34.7818 },
  'riyadh, saudi arabia': { lat: 24.7136, lng: 46.6753 },
  'doha, qatar': { lat: 25.2854, lng: 51.5310 },
  'cairo, egypt': { lat: 30.0444, lng: 31.2357 },
  
  // Oceania
  'sydney, australia': { lat: -33.8688, lng: 151.2093 },
  'melbourne, australia': { lat: -37.8136, lng: 144.9631 },
  'brisbane, australia': { lat: -27.4698, lng: 153.0251 },
  'auckland, new zealand': { lat: -36.8485, lng: 174.7633 },
  'wellington, new zealand': { lat: -41.2865, lng: 174.7762 },
  
  // South America
  'sao paulo, brazil': { lat: -23.5505, lng: -46.6333 },
  'rio de janeiro, brazil': { lat: -22.9068, lng: -43.1729 },
  'buenos aires, argentina': { lat: -34.6037, lng: -58.3816 },
  'santiago, chile': { lat: -33.4489, lng: -70.6693 },
  'bogota, colombia': { lat: 4.7110, lng: -74.0721 },
  'lima, peru': { lat: -12.0464, lng: -77.0428 },
  
  // Africa
  'johannesburg, south africa': { lat: -26.2041, lng: 28.0473 },
  'cape town, south africa': { lat: -33.9249, lng: 18.4241 },
  'lagos, nigeria': { lat: 6.5244, lng: 3.3792 },
  'nairobi, kenya': { lat: -1.2864, lng: 36.8172 },
  'casablanca, morocco': { lat: 33.5731, lng: -7.5898 },
}

// Country center coordinates for fallback
const COUNTRY_CENTERS = {
  'usa': { lat: 37.0902, lng: -95.7129 },
  'united states': { lat: 37.0902, lng: -95.7129 },
  'canada': { lat: 56.1304, lng: -106.3468 },
  'uk': { lat: 55.3781, lng: -3.4360 },
  'united kingdom': { lat: 55.3781, lng: -3.4360 },
  'france': { lat: 46.2276, lng: 2.2137 },
  'germany': { lat: 51.1657, lng: 10.4515 },
  'spain': { lat: 40.4637, lng: -3.7492 },
  'italy': { lat: 41.8719, lng: 12.5674 },
  'australia': { lat: -25.2744, lng: 133.7751 },
  'japan': { lat: 36.2048, lng: 138.2529 },
  'china': { lat: 35.8617, lng: 104.1954 },
  'india': { lat: 20.5937, lng: 78.9629 },
  'brazil': { lat: -14.2350, lng: -51.9253 },
  'mexico': { lat: 23.6345, lng: -102.5528 },
  'russia': { lat: 61.5240, lng: 105.3188 },
  'south korea': { lat: 35.9078, lng: 127.7669 },
  'singapore': { lat: 1.3521, lng: 103.8198 },
  'netherlands': { lat: 52.1326, lng: 5.2913 },
  'sweden': { lat: 60.1282, lng: 18.6435 },
  'norway': { lat: 60.4720, lng: 8.4689 },
  'denmark': { lat: 56.2639, lng: 9.5018 },
  'poland': { lat: 51.9194, lng: 19.1451 },
  'argentina': { lat: -38.4161, lng: -63.6167 },
  'chile': { lat: -35.6751, lng: -71.5430 },
  'colombia': { lat: 4.5709, lng: -74.2973 },
  'south africa': { lat: -30.5595, lng: 22.9375 },
  'egypt': { lat: 26.8206, lng: 30.8025 },
  'turkey': { lat: 38.9637, lng: 35.2433 },
  'uae': { lat: 23.4241, lng: 53.8478 },
  'united arab emirates': { lat: 23.4241, lng: 53.8478 },
  'saudi arabia': { lat: 23.8859, lng: 45.0792 },
  'israel': { lat: 31.0461, lng: 34.8516 },
  'new zealand': { lat: -40.9006, lng: 174.8860 },
  'thailand': { lat: 15.8700, lng: 100.9925 },
  'vietnam': { lat: 14.0583, lng: 108.2772 },
  'philippines': { lat: 12.8797, lng: 121.7740 },
  'indonesia': { lat: -0.7893, lng: 113.9213 },
  'malaysia': { lat: 4.2105, lng: 101.9758 },
}

const CACHE_KEY = 'geocoding_cache'
const CACHE_EXPIRY = 30 * 24 * 60 * 60 * 1000 // 30 days

// Load cache from localStorage
function loadCache() {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        return data
      }
    }
  } catch (e) {
    console.warn('Failed to load geocoding cache:', e)
  }
  return {}
}

// Save cache to localStorage
function saveCache(cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: cache,
      timestamp: Date.now(),
    }))
  } catch (e) {
    console.warn('Failed to save geocoding cache:', e)
  }
}

// Initialize cache
let geocodingCache = loadCache()

/**
 * Normalize location string for consistent lookup
 * @param {string} location - Raw location string
 * @returns {string} Normalized location string
 */
function normalizeLocation(location) {
  if (!location) return ''
  return location.toLowerCase().trim()
}

/**
 * Generate a stable random position based on account ID
 * Used for accounts with no location data
 * @param {string} accountId - Unique account identifier
 * @returns {{lat: number, lng: number}}
 */
function generateStableRandomPosition(accountId) {
  // Simple hash function to generate consistent random values
  let hash = 0
  for (let i = 0; i < accountId.length; i++) {
    hash = ((hash << 5) - hash) + accountId.charCodeAt(i)
    hash = hash & hash // Convert to 32-bit integer
  }
  
  // Generate lat/lng from hash
  const lat = ((hash % 180) - 90) // -90 to 90
  const lng = (((hash >> 8) % 360) - 180) // -180 to 180
  
  return { lat, lng }
}

/**
 * Calculate distance between two coordinates in km (haversine formula)
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Geocode a location string to latitude/longitude coordinates
 * @param {string} location - Location string (e.g., "Vancouver, Canada")
 * @param {string} accountId - Account ID for stable random fallback
 * @returns {{lat: number, lng: number}}
 */
export function geocodeLocation(location, accountId) {
  // Check if location exists
  if (!location) {
    return accountId ? generateStableRandomPosition(accountId) : { lat: 0, lng: 0 }
  }

  const normalized = normalizeLocation(location)
  
  // Check cache first
  if (geocodingCache[normalized]) {
    return geocodingCache[normalized]
  }
  
  // Check city database
  if (CITY_DATABASE[normalized]) {
    const coords = CITY_DATABASE[normalized]
    geocodingCache[normalized] = coords
    saveCache(geocodingCache)
    return coords
  }
  
  // Try to extract country and use country center
  const parts = location.split(',').map(p => p.trim().toLowerCase())
  if (parts.length >= 2) {
    const country = parts[parts.length - 1]
    if (COUNTRY_CENTERS[country]) {
      const coords = COUNTRY_CENTERS[country]
      geocodingCache[normalized] = coords
      saveCache(geocodingCache)
      return coords
    }
  }
  
  // Fallback to stable random position if we have accountId
  if (accountId) {
    const coords = generateStableRandomPosition(accountId)
    geocodingCache[normalized] = coords
    saveCache(geocodingCache)
    return coords
  }
  
  // Ultimate fallback
  return { lat: 0, lng: 0 }
}

/**
 * Batch geocode multiple accounts
 * @param {Array} accounts - Array of account objects with location property
 * @returns {Array} Accounts with added coordinates {lat, lng}
 */
export function geocodeAccounts(accounts) {
  return accounts.map(account => ({
    ...account,
    coordinates: geocodeLocation(account.location, account.id)
  }))
}

/**
 * Find accounts within a certain distance of a point
 * @param {Array} accounts - Array of accounts with coordinates
 * @param {number} centerLat - Center latitude
 * @param {number} centerLng - Center longitude
 * @param {number} radiusKm - Radius in kilometers
 * @returns {Array} Filtered accounts
 */
export function findAccountsInRadius(accounts, centerLat, centerLng, radiusKm) {
  return accounts.filter(account => {
    if (!account.coordinates) return false
    const distance = calculateDistance(
      centerLat,
      centerLng,
      account.coordinates.lat,
      account.coordinates.lng
    )
    return distance <= radiusKm
  })
}

/**
 * Clear geocoding cache
 */
export function clearGeocodingCache() {
  geocodingCache = {}
  localStorage.removeItem(CACHE_KEY)
}

export default {
  geocodeLocation,
  geocodeAccounts,
  calculateDistance,
  findAccountsInRadius,
  clearGeocodingCache,
}

