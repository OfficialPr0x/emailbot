# Quick Start: Testing Real-Time Features

## Prerequisites

✅ Backend running on port 3000  
✅ Frontend running on port 5173  
✅ OpenRouter API key configured  
✅ Proxies configured in proxies.txt

## Start Servers

### Terminal 1 - Backend
```bash
npm start
```

**Expected Output:**
```
✓ Database connected
✓ WebSocket server initialized
✓ API Server listening on http://localhost:3000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## Testing Steps

### 1. Navigate to Create Account Page
```
http://localhost:5173/create
```

### 2. Initial View
You should see:
- ✅ Step 1: Ready to Create Account
- ✅ Three feature cards (Proxy, AI, Automation)
- ✅ Big "Create Instagram Account" button

### 3. Click Create Button
- Page transitions to Step 2
- You'll see 3 cards appear:
  1. **Progress Overview**
  2. **Workflow Stages** (all pending)
  3. **Live Action Log** (empty, waiting)

### 4. Start the Process
Click "**Start Creating Now**" button

### 5. Watch Real-Time Updates! 🎉

**You should immediately see:**

#### Progress Overview Card
- Percentage starts incrementing: 5% → 10% → 15%...
- Current stage updates: "Starting profile generation..."
- Progress bar animates smoothly

#### Workflow Stages Card
- First stage (Generate Profile) shows spinning loader 🔄
- Other stages remain pending ⏰
- As each stage completes, checkmark ✅ appears

#### Live Action Log Card
- "Live" badge appears and pulses 🔴
- Log entries start appearing:
  ```
  🔵 Initializing account creation process...
  🔵 Connecting to automation server...
  🔵 Sending request to backend...
  ✅ Backend accepted request, starting workflow...
  🔵 Starting profile generation...
  🔵 Contacting AI service...
  ✅ Profile created for [Name]
  ```
- Auto-scrolls to show latest entries
- Each entry fades in smoothly

## What to Look For

### ✅ Good Signs

1. **WebSocket Connection**
   - Check browser console: `✅ Socket connected`
   - "Live" badge appears and pulses
   - Logs update in real-time

2. **Progress Updates**
   - Percentage increases smoothly
   - Stage messages change every 2-5 seconds
   - Progress bar animates without jumping

3. **Stage Tracking**
   - Current stage has spinning loader
   - Completed stages have green checkmarks
   - Future stages remain gray

4. **Log Quality**
   - Color-coded entries (blue, green)
   - Timestamps on each entry
   - Stage labels visible
   - Messages are descriptive

5. **Animations**
   - Logs fade in smoothly
   - Progress bar transitions smoothly
   - Icons animate (spin, pulse)
   - Auto-scroll works

### ❌ Issues to Watch For

1. **No Updates**
   - Check: WebSocket connection in console
   - Check: Backend server is running
   - Check: No CORS errors

2. **Stuck Progress**
   - Check: Browser console for errors
   - Check: Backend logs for exceptions
   - Check: Proxy configuration

3. **Missing Logs**
   - Check: WebSocket events in console
   - Check: `emitProgressUpdate()` calls in backend
   - Verify: Event handlers are registered

4. **Styling Issues**
   - Check: Tailwind CSS is compiling
   - Check: Custom CSS is loaded
   - Verify: No CSS errors in console

## Browser Console Commands

### Check WebSocket Status
```javascript
// In browser console
console.log(window.io); // Should show Socket.io client
```

### Monitor WebSocket Events
```javascript
// Already logging in console
// Look for:
// "Job progress: { ... }"
// "Activity: { ... }"
```

### Check Component State
```javascript
// Use React DevTools
// Find CreateAccount component
// Inspect state: logs, stages, progress
```

## Expected Timeline

| Time | Progress | Stage | What's Happening |
|------|----------|-------|------------------|
| 0:00 | 0% | Initialization | Starting process |
| 0:05 | 10% | Profile Generation | AI creates profile |
| 0:15 | 20% | Gmail Creation | Browser launches |
| 0:30 | 40% | Gmail Verification | Form filling |
| 1:00 | 50% | Instagram Creation | Instagram signup |
| 1:30 | 70% | Instagram Profile | Profile setup |
| 2:00 | 82% | Profile Complete | Bio, picture added |
| 2:30 | 100% | Complete | Database save |

**Total Time:** 2-3 minutes

## Success Indicators

When everything works, you'll see:

1. **Progress Overview**: Shows 100%
2. **Workflow Stages**: All have green checkmarks ✅
3. **Live Action Log**: Ends with:
   ```
   ✅ 🎉 Account creation completed successfully!
   ```
4. **Page Transitions**: Auto-moves to Step 3 (Success screen)
5. **Toast Notification**: Green success message
6. **Database**: New account appears in Accounts page

## Troubleshooting

### Logs Not Updating

**Solution 1: Check WebSocket**
```bash
# Backend console should show:
Client connected { id: 'xxx' }
```

**Solution 2: Check CORS**
```javascript
// In src/api/server.js
// Verify CORS is allowing connections
```

**Solution 3: Restart Servers**
```bash
# Kill and restart both servers
```

### Progress Stuck

**Solution 1: Check Backend Logs**
```bash
# Look for errors in terminal
# Check error.log file
```

**Solution 2: Verify API Key**
```bash
# Check .env file
OPENROUTER_API_KEY=sk-...
```

**Solution 3: Test Proxy**
```bash
# Manually test proxy from proxies.txt
```

### Styling Broken

**Solution 1: Rebuild Frontend**
```bash
cd frontend
npm run dev
```

**Solution 2: Clear Cache**
```bash
# In browser: Ctrl+Shift+Delete
# Clear cached images and files
```

## Recording a Demo

To capture the experience:

1. Open browser to Create Account page
2. Start screen recording
3. Click through to Step 2
4. Start account creation
5. Show all 3 cards updating in real-time
6. Capture success message
7. Stop recording

**Recommended Tools:**
- OBS Studio (free)
- ShareX (Windows)
- Screencast-O-Matic

## Next Steps

After successful test:
1. ✅ Document any issues found
2. ✅ Test error scenarios (invalid proxy, etc.)
3. ✅ Test on different browsers
4. ✅ Show to team/users for feedback
5. ✅ Consider additional enhancements

## Need Help?

Check these docs:
- `REALTIME_MONITORING.md` - Feature overview
- `REALTIME_UPDATES_IMPLEMENTATION.md` - Technical details
- `VISUAL_GUIDE.md` - UI layout reference

---

**Ready to test? Start both servers and navigate to the Create Account page!** 🚀

