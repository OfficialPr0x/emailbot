# Real-Time Monitoring Visual Guide

## New Account Creation Interface

### Layout Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Create New Account                           │
│              Set up a new Instagram account with AI             │
└─────────────────────────────────────────────────────────────────┘

Progress Steps:  ① ──── ② ──── ③

┌─────────────────────────────────────────────────────────────────┐
│  🔵 Creating Your Account                                       │
│     Watch the magic happen in real-time                         │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 🔵 Creating Gmail account...                    55%       │ │
│  │ ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░            │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  ✅ Workflow Stages                                             │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ ✅ Generate Profile                                100%   │ │
│  │ ✅ Create Gmail                                    100%   │ │
│  │ 🔄 Gmail Verification                              55%    │ │
│  │    ██████████░░░░░░░░░░                                   │ │
│  │ ⏰ Create Instagram                                        │ │
│  │ ⏰ Setup Profile                                           │ │
│  │ ⏰ Complete                                                │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  💻 Live Action Log                              🔴 Live        │
│     Real-time updates from the automation process               │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ ┌─────────────────────────────────────────────────────┐  │ │
│  │ │ 🔵 3:45:10 PM [profile_generation]                  │  │ │
│  │ │    Starting profile generation...                   │  │ │
│  │ ├─────────────────────────────────────────────────────┤  │ │
│  │ │ 🔵 3:45:12 PM [profile_generation]                  │  │ │
│  │ │    Contacting AI service...                         │  │ │
│  │ ├─────────────────────────────────────────────────────┤  │ │
│  │ │ ✅ 3:45:15 PM [profile_generation]                  │  │ │
│  │ │    ✓ Profile created for John Smith                │  │ │
│  │ ├─────────────────────────────────────────────────────┤  │ │
│  │ │ 🔵 3:45:20 PM [gmail_creation]                      │  │ │
│  │ │    Initializing Gmail bot...                        │  │ │
│  │ ├─────────────────────────────────────────────────────┤  │ │
│  │ │ 🔵 3:45:22 PM [gmail_creation]                      │  │ │
│  │ │    Launching browser instance...                    │  │ │
│  │ ├─────────────────────────────────────────────────────┤  │ │
│  │ │ 🔵 3:45:25 PM [gmail_creation]                      │  │ │
│  │ │    Navigating to Gmail signup...                    │  │ │
│  │ ├─────────────────────────────────────────────────────┤  │ │
│  │ │ 🔵 3:45:28 PM [gmail_creation]                      │  │ │
│  │ │    Filling account details...                       │  │ │
│  │ └─────────────────────────────────────────────────────┘  │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Color Coding

### Log Entry Types

**🔵 Info (Blue)**
```
┌─────────────────────────────────────────────────────┐
│ 🔵 3:45:10 PM [gmail_creation]                      │
│    Navigating to Gmail signup...                    │
└─────────────────────────────────────────────────────┘
Background: Blue tint
Border: Blue left accent
Text: Light gray
```

**✅ Success (Green)**
```
┌─────────────────────────────────────────────────────┐
│ ✅ 3:45:40 PM [gmail_created]                       │
│    ✓ Gmail created: john.smith@gmail.com           │
└─────────────────────────────────────────────────────┘
Background: Green tint
Border: Green left accent
Text: Light green
```

**⚠️ Warning (Yellow)**
```
┌─────────────────────────────────────────────────────┐
│ ⚠️ 3:45:35 PM [gmail_creation]                      │
│    Retrying verification step...                    │
└─────────────────────────────────────────────────────┘
Background: Yellow tint
Border: Yellow left accent
Text: Light yellow
```

**❌ Error (Red)**
```
┌─────────────────────────────────────────────────────┐
│ ❌ 3:45:50 PM [error]                               │
│    Error: Proxy connection failed                   │
└─────────────────────────────────────────────────────┘
Background: Red tint
Border: Red left accent
Text: Light red
```

## Stage Status Icons

| Icon | Status | Description |
|------|--------|-------------|
| ⏰ | Pending | Stage not started yet (gray) |
| 🔄 | In Progress | Currently executing (blue, spinning) |
| ✅ | Complete | Successfully finished (green) |
| ❌ | Error | Failed with error (red) |

## Real-Time Behavior

### Initial State (Before Starting)
```
Progress: 0%
Current Stage: "Waiting to start..."
Logs: Empty with "Waiting for process to start..." message
Stages: All showing ⏰ (pending)
```

### During Execution
```
Progress: Smoothly animates from 0% → 100%
Current Stage: Updates every 2-5 seconds with new message
Logs: New entries fade in from top
       Auto-scrolls to show latest entry
       "Live" badge pulses in corner
Stages: Current stage shows 🔄 (spinning)
        Completed stages show ✅
        Future stages show ⏰
```

### On Completion
```
Progress: 100%
Current Stage: "🎉 Account creation completed successfully!"
Logs: Final success message in green
Stages: All showing ✅ (complete)
Success Card: Appears with bouncing checkmark
```

### On Error
```
Progress: Stops at failure point
Current Stage: "❌ Error: [error message]"
Logs: Error entry in red appears
Stages: Failed stage shows ❌
       Previous stages show ✅
       Future stages show ⏰
Toast: Red error notification
```

## Example Log Sequence

### Full Successful Flow

```
🔵 10:23:01 [profile_generation]    Starting profile generation...
🔵 10:23:03 [profile_generation]    Contacting AI service...
✅ 10:23:08 [profile_generation]    ✓ Profile created for Sarah Johnson

🔵 10:23:10 [gmail_creation]        Initializing Gmail bot...
🔵 10:23:12 [gmail_creation]        Launching browser instance...
🔵 10:23:15 [gmail_creation]        Navigating to Gmail signup...
🔵 10:23:18 [gmail_creation]        Filling account details...
✅ 10:23:45 [gmail_created]         Gmail verification complete
✅ 10:23:47 [gmail_created]         ✓ Gmail created: sarah.johnson@gmail.com

🔵 10:23:50 [instagram_creation]    Preparing Instagram setup...
🔵 10:23:52 [instagram_creation]    Initializing Instagram bot...
🔵 10:23:55 [instagram_creation]    Launching browser for Instagram...
🔵 10:24:00 [instagram_creation]    Navigating to Instagram signup...
🔵 10:24:03 [instagram_creation]    Filling registration form...
✅ 10:24:30 [instagram_profile]     Setting up profile details...
✅ 10:24:35 [instagram_profile]     ✓ Instagram created: @sarah_johnson_2024

🔵 10:24:38 [instagram_profile]     Configuring profile bio...
🔵 10:24:41 [instagram_profile]     Adding profile picture...
✅ 10:24:45 [instagram_profile]     ✓ Profile setup complete

🔵 10:24:48 [completed]             Finalizing account...
🔵 10:24:50 [completed]             Saving to database...
✅ 10:24:52 [completed]             🎉 Account creation completed successfully!
```

## Responsive Design

### Desktop (Wide Screen)
- All 3 cards visible simultaneously
- Log viewer: 384px height (h-96)
- Full width cards

### Tablet (Medium Screen)
- Cards stack vertically
- Log viewer: 384px height
- Cards adjust to container width

### Mobile (Small Screen)
- Cards stack vertically
- Log viewer: Consider reducing height
- Touch-friendly scrolling

## Animation Details

### Fade In Up
New log entries animate from below:
- Duration: 0.3s
- Easing: ease-out
- Transform: translateY(10px) → translateY(0)
- Opacity: 0 → 1

### Pulse Glow
Live indicator and active icons pulse:
- Duration: 2s
- Loop: infinite
- Opacity: 1 → 0.5 → 1

### Progress Bar
Smooth width transition:
- Duration: 0.5s
- Easing: ease-in-out
- Color: Purple gradient

### Spinner
Rotating loader icon:
- Duration: 1s
- Loop: infinite
- Transform: rotate(360deg)

## Accessibility

- **Screen Readers**: Announce progress updates
- **Keyboard Navigation**: All interactive elements accessible
- **Color Contrast**: Meets WCAG AA standards
- **Focus Indicators**: Visible focus states
- **ARIA Labels**: Proper labeling for assistive technology

## Performance Metrics

- **Initial Render**: < 100ms
- **Log Entry Animation**: 300ms
- **WebSocket Latency**: < 50ms
- **Auto-scroll**: Smooth 60fps
- **Memory Usage**: ~5MB for 100 logs

---

**Tip**: Keep browser console open to see WebSocket events in real-time!

