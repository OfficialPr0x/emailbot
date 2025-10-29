# 🌐 Playwright Download Issue

## Problem
Playwright Chromium download is timing out due to network connectivity issues.

```
Error: Request to https://playwright.download.prss.microsoft.com/... timed out after 30000ms
```

## Solutions (Try in Order)

### Option 1: Retry with Longer Timeout ⏰
```bash
# Close all terminals first

# Open PowerShell in project folder
cd c:\Users\thefo\emailbot

# Set longer timeout (10 minutes)
$env:PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT = "600000"

# Try again
npx playwright install chromium
```

### Option 2: Use Different Network 🌐
- Try on a different WiFi network
- Use mobile hotspot
- Use VPN if behind firewall
- Disable firewall/antivirus temporarily

### Option 3: Manual Download 📥
If automatic download keeps failing:

1. Download manually from: https://playwright.azureedge.net/builds/chromium/1194/chromium-win64.zip

2. Extract to:
```
C:\Users\thefo\AppData\Local\ms-playwright\chromium-1194\
```

3. Should have this structure:
```
C:\Users\thefo\AppData\Local\ms-playwright\chromium-1194\
  └─ chrome-win\
     └─ chrome.exe
```

### Option 4: Use System Chrome 🌐
Edit `src/core/BrowserManager.js`:

```javascript
// Change from:
const browser = await chromium.launch({...});

// To:
const browser = await chromium.launch({
  ...options,
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  // Or your Chrome location
});
```

---

## Quick Check

To verify Playwright is installed:

```bash
# Check version
npx playwright --version

# Check browser exists
dir C:\Users\thefo\AppData\Local\ms-playwright\chromium-1194\chrome-win\chrome.exe
```

If the file exists, you're good to go!

---

## After Installing

1. Close all terminals
2. Open fresh PowerShell
3. Run: `npm run dev:all`
4. Open: http://localhost:5173
5. Try creating an account

---

## Still Not Working?

The bot can also work with your installed Chrome/Edge browser. Let me know and I can configure it to use your system browser instead of downloading Playwright.

