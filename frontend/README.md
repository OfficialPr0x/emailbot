# MyG Bot Dashboard - React Frontend

🎨 **Sexy as fuck, unicorn-level Instagram-style dashboard** for managing your Instagram bot accounts.

## ✨ Features

- **Modern Instagram-Inspired Design**: Beautiful gradients, smooth animations, glass morphism
- **Real-Time Updates**: WebSocket integration for live monitoring
- **Complete CRM**: Manage all your accounts in one place
- **Live Monitoring**: See account creation happening in real-time
- **Analytics Dashboard**: Beautiful charts and insights
- **Account Generation Wizard**: Step-by-step account creation
- **Dark Mode**: Full dark mode support
- **Responsive**: Works on all devices

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The dashboard will be available at `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Base UI components (Button, Card, etc.)
│   │   ├── Layout.jsx    # Main layout with sidebar
│   │   ├── Sidebar.jsx   # Navigation sidebar
│   │   └── Header.jsx    # Top header
│   ├── pages/            # Page components
│   │   ├── Dashboard.jsx      # Main dashboard with stats
│   │   ├── Accounts.jsx       # Account management (CRM)
│   │   ├── CreateAccount.jsx  # Account creation wizard
│   │   ├── LiveMonitor.jsx    # Real-time monitoring
│   │   ├── Analytics.jsx      # Charts and insights
│   │   └── Settings.jsx       # Settings page
│   ├── services/         # API and WebSocket services
│   │   ├── api.js        # API client
│   │   └── socket.js     # WebSocket client
│   ├── store/            # State management (Zustand)
│   │   └── useStore.js   # Global state
│   ├── lib/              # Utilities
│   │   └── utils.js      # Helper functions
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 🎨 Design System

### Colors
- **Primary**: Purple gradient (#8B5CF6)
- **Instagram Gradient**: Purple → Pink (#833AB4 → #FD1D1D)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444)

### Components
- **Cards**: Elevated with shadows and hover effects
- **Buttons**: Gradient options with smooth transitions
- **Badges**: Colored status indicators
- **Progress**: Animated progress bars
- **Charts**: Recharts with custom styling

## 🔌 Backend Integration

The frontend connects to the backend API at `http://localhost:3000`:

- **REST API**: `/api/*` endpoints
- **WebSocket**: Real-time updates via Socket.IO

## 📊 State Management

Using **Zustand** for simple, powerful state management:

```javascript
const { accounts, addAccount, updateAccount } = useStore()
```

## 🌐 Real-Time Features

WebSocket events:
- `account:created` - New account created
- `account:updated` - Account updated
- `job:progress` - Job progress updates
- `job:complete` - Job completed
- `job:error` - Job error
- `activity` - New activity

## 🎭 Pages

### Dashboard
- Overview statistics
- Account growth chart
- Recent activity feed
- Quick actions

### Accounts (CRM)
- Grid/list view of all accounts
- Search and filters
- Account details cards
- Edit/delete actions

### Create Account
- 3-step wizard
- Configuration options
- Live progress tracking
- Success screen

### Live Monitor
- Active jobs display
- Real-time activity feed
- Live progress bars

### Analytics
- Weekly performance charts
- Status distribution
- Success rate metrics
- Trend analysis

### Settings
- API configuration
- Proxy settings
- Automation options
- Notification preferences

## 🛠️ Development

### Prerequisites
- Node.js 18+
- Backend server running

### Environment
The frontend proxies API requests to the backend via Vite config.

### Building
```bash
npm run build
```

Output will be in `dist/` directory.

## 🚀 Deployment

### Option 1: Serve with backend
Build the frontend and serve the `dist/` folder from your backend.

### Option 2: Separate deployment
Deploy to Vercel/Netlify and configure API URL.

### Option 3: Docker
Include in Docker container with backend.

## 🎯 SaaS Features

Ready to sell as a SaaS:
- **User accounts**: Add authentication
- **Subscription plans**: Integrate Stripe
- **Usage limits**: Track account creation
- **White-label**: Easy to rebrand
- **Multi-tenant**: Database per user

## 📱 Mobile Responsive

Fully responsive design:
- Desktop: Full sidebar and dual-column layouts
- Tablet: Collapsed sidebar option
- Mobile: Stack layouts, drawer menu

## 🎨 Customization

### Theming
Edit `tailwind.config.js` and `src/index.css` for custom colors.

### Branding
- Logo: Update in `Sidebar.jsx`
- Name: Search and replace "MyG Bot"
- Colors: Update gradient classes

## 🐛 Troubleshooting

### WebSocket not connecting
Check backend is running on port 3000 and WebSocket server is initialized.

### API requests failing
Check proxy configuration in `vite.config.js`.

### Build errors
Clear `node_modules` and reinstall:
```bash
rm -rf node_modules
npm install
```

## 📄 License

MIT License - See root LICENSE file

---

Built with ❤️ using React, Vite, Tailwind CSS, and a whole lot of sexy gradients 🎨

