# 🔧 Troubleshooting Guide

## Common Errors & Solutions

### Error 1: WebSocket Connection Failed
```
WebSocket connection to 'ws://localhost:3000/socket.io/' failed
```

**Cause**: Backend server is not running

**Solution**:
```bash
# Start backend server
npm run dev

# Or start both backend + frontend
npm run dev:all
```

---

### Error 2: API 500 Error - /api/accounts/stats
```
Failed to load resource: the server responded with a status of 500 (Internal Server Error)
```

**Cause**: Database not initialized or Prisma client out of sync

**Solution**:
```bash
# 1. Generate Prisma client
npx prisma generate

# 2. Run migrations
npx prisma migrate dev --name init

# 3. Restart backend
npm run dev
```

---

### Error 3: Toast is not defined
```
Uncaught (in promise) ReferenceError: toast is not defined
```

**Cause**: Missing `react-hot-toast` import

**Solution**: ✅ Already fixed! Make sure you have the latest code.

---

### Error 4: Module not found errors

**Solution**:
```bash
# Reinstall dependencies
npm install
cd frontend && npm install && cd ..

# Clear cache
npm run setup
```

---

### Error 5: Database locked

**Solution**:
```bash
# Close all Prisma Studio instances
# Then restart

# Or delete and recreate database
rm prisma/dev.db
npx prisma migrate dev --name init
```

---

### Error 6: Port already in use

**Backend (Port 3000)**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

**Frontend (Port 5173)**:
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5173 | xargs kill -9
```

---

### Error 7: ECONNREFUSED when creating accounts

**Cause**: DeepSeek API key missing or invalid

**Solution**:
```bash
# 1. Get API key from https://platform.deepseek.com/
# 2. Add to .env
DEEPSEEK_API_KEY=sk-your-key-here

# 3. Restart backend
```

---

### Error 8: Playwright browser not found

**Solution**:
```bash
npx playwright install chromium
```

---

### Error 9: React Router warnings

```
React Router Future Flag Warning: v7_startTransition
React Router Future Flag Warning: v7_relativeSplatPath
```

**Cause**: Future React Router version warnings (not critical)

**Solution**: Safe to ignore, or add to `frontend/src/main.jsx`:
```javascript
<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
```

---

## Quick Fixes Checklist

### Backend Won't Start
- [ ] Run `npm install`
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma migrate dev`
- [ ] Check `.env` file exists
- [ ] Check port 3000 is free
- [ ] Check logs in `logs/` folder

### Frontend Won't Start
- [ ] Run `cd frontend && npm install`
- [ ] Check port 5173 is free
- [ ] Clear browser cache
- [ ] Check `frontend/src/services/api.js` has correct backend URL

### Database Issues
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma migrate dev`
- [ ] Check `prisma/dev.db` exists
- [ ] Open `npx prisma studio` to verify schema

### Bot Creation Fails
- [ ] Check backend is running
- [ ] Check `DEEPSEEK_API_KEY` in `.env`
- [ ] Check browser opens (if headless: false)
- [ ] Check proxy settings
- [ ] Check logs in `logs/error.log`

---

## Development Workflow

### Clean Start (Recommended)
```bash
# 1. Stop all servers (Ctrl+C)

# 2. Clean install
npm run setup

# 3. Setup database
npm run setup:db

# 4. Start everything
npm run dev:all

# 5. Open browser
# http://localhost:5173
```

---

## Verify Everything Works

### Test 1: Backend Running
```bash
# Check health endpoint
curl http://localhost:3000/health

# Expected: {"status":"ok","timestamp":"..."}
```

### Test 2: Database Connected
```bash
npx prisma studio
# Opens: http://localhost:5555
# See: Empty tables (normal for fresh install)
```

### Test 3: Frontend Connected
- Open: http://localhost:5173
- See: Dashboard loads
- Check: No console errors (F12)

### Test 4: WebSocket Connected
- Open: http://localhost:5173
- Press F12 → Network → WS filter
- See: Connected socket

---

## Still Having Issues?

### Check Logs
```bash
# Backend logs
cat logs/combined.log
cat logs/error.log

# Or on Windows
type logs\combined.log
type logs\error.log
```

### Check Ports
```bash
# Backend should be on 3000
curl http://localhost:3000/health

# Frontend should be on 5173
curl http://localhost:5173
```

### Check Database
```bash
# Open Prisma Studio
npx prisma studio

# Check migrations
npx prisma migrate status
```

### Full Reset (Nuclear Option)
```bash
# 1. Stop all servers

# 2. Delete database
rm prisma/dev.db
rm prisma/dev.db-journal

# 3. Delete node_modules
rm -rf node_modules
rm -rf frontend/node_modules

# 4. Fresh install
npm run setup
npm run setup:db

# 5. Start
npm run dev:all
```

---

## Environment Variables

Required `.env` file:
```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# DeepSeek AI (get from: https://platform.deepseek.com/)
DEEPSEEK_API_KEY=your_key_here

# Optional
PROXY_URL=
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
HEADLESS=false
```

---

## System Requirements

- ✅ Node.js 18+
- ✅ npm 8+
- ✅ 2GB+ RAM
- ✅ 500MB+ disk space
- ✅ Internet connection

---

## Getting Help

1. **Check logs** first: `logs/error.log`
2. **Check database**: `npx prisma studio`
3. **Check this file** for your error
4. **Check documentation**: `START_HERE.md`, `QUICK_START_PRODUCTION.md`

---

**Last Updated**: October 28, 2024  
**Version**: 2.0.0

