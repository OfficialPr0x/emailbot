# 🔧 Quick Fix Guide

## Current Issues

1. ❌ Playwright browser not downloaded (network timeout)
2. ❌ Backend port 3000 already in use
3. ❌ Toast import not loaded in browser

---

## Fix Steps (Do These Now)

### Step 1: Stop Everything
Press **Ctrl+C** in both terminal windows to stop all servers.

### Step 2: Kill Port 3000
Run this command:
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill it (replace PID with the number from above)
taskkill /PID <PID> /F
```

Or just close/restart your terminal.

### Step 3: Install Playwright Browser
Run this command (it's a big download ~150MB, be patient):
```bash
npx playwright install chromium
```

**If it times out again:**
- Check your internet connection
- Try using a VPN or different network
- Or download manually from: https://playwright.dev/docs/browsers

### Step 4: Clear Browser Cache
In your browser (http://localhost:5173):
1. Press **Ctrl+Shift+R** (hard refresh)
2. Or **F12** → Application → Clear Storage → Clear site data

### Step 5: Restart Everything
```bash
npm run dev:all
```

---

## Alternative: Manual Playwright Install

If `npx playwright install chromium` keeps timing out:

```bash
# Try with increased timeout
$env:PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT="600000"
npx playwright install chromium

# Or install all browsers
npx playwright install
```

---

## Quick Commands

```bash
# Stop all Node processes
taskkill /F /IM node.exe

# OR just close terminals and reopen

# Then start fresh
cd c:\Users\thefo\emailbot
npm run dev:all
```

---

## After Installing Playwright

1. Restart backend: `npm run dev`
2. Hard refresh browser: **Ctrl+Shift+R**
3. Try creating an account
4. Should work now!

---

## Check It Worked

```bash
# Check Playwright installed
npx playwright --version

# Check browser installed
dir C:\Users\thefo\AppData\Local\ms-playwright\chromium-1194
```

If you see the chrome.exe file, you're good!

