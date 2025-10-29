# 🚀 Getting Started - MyG Instagram Bot

## 🎯 The Fastest Way To Start

### ⚡ **5-Minute Setup**

```bash
# 1. Install dependencies
npm install && cd frontend && npm install && cd ..

# 2. Setup database
npx prisma generate && npx prisma migrate dev --name init

# 3. Start everything
npm run dev:all

# 4. Open browser
# Visit: http://localhost:5173
```

**DONE!** You're ready to create Instagram accounts! 🎉

---

## 📱 Using the Dashboard

### **1. Dashboard** (Home Page)
- See your account statistics
- View growth charts
- Monitor recent activity
- Access quick actions

### **2. Create Your First Account**

**Step 1:** Click "Create Account" in the sidebar

**Step 2:** Configure settings:
- Add proxy URL (optional but recommended)
- Enable AI profile generation (recommended)
- Choose headless mode

**Step 3:** Click "Start Creation"
- Watch the progress bar move
- See each stage complete
- Get notified when done

**Step 4:** View your new account
- Goes to "Accounts" page automatically
- Click to see details
- Edit or manage as needed

### **3. Manage Accounts**
- Click "Accounts" in sidebar
- Search by email or username
- Filter by status (active, pending, failed)
- Edit or delete accounts
- Export your data

### **4. Monitor Live**
- Click "Live Monitor"
- See active account creations
- Watch real-time progress
- View activity feed

### **5. View Analytics**
- Click "Analytics"
- See weekly performance
- Check success rates
- View status distribution

---

## 🎯 Common Tasks

### **Create Multiple Accounts**
1. Go to "Create Account"
2. Create one account
3. When done, click "Create Another"
4. Repeat!

### **Use With Proxy**
1. Go to "Settings"
2. Enter your proxy URL
3. Click "Test Proxy Connection"
4. Save settings
5. All new accounts will use proxy

### **Export Accounts**
1. Go to "Accounts"
2. Click "Export All"
3. Download CSV/JSON file

### **Check Success Rate**
1. Go to "Analytics"
2. See success rate card
3. View trend charts

---

## 🔧 Configuration

### **Environment Variables**

Create/edit `.env` file:

```env
# Required for AI profiles
DEEPSEEK_API_KEY=sk-your-key-here

# Optional but recommended
PROXY_URL=http://your-proxy:port

# Server config
PORT=3000
HOST=localhost
```

### **Dashboard Settings**

Click "Settings" in sidebar to configure:
- **API Configuration**: DeepSeek API key
- **Proxy Settings**: Proxy URL and testing
- **Automation Options**: Toggle features
- **Notifications**: Enable/disable alerts

---

## 📊 Understanding the Dashboard

### **Stats Cards**
- **Total Accounts**: All accounts created
- **Active**: Working accounts
- **Creating**: Currently being created
- **Success Rate**: Percentage of successful creations

### **Status Colors**
- 🟢 **Green (Active)**: Account working fine
- 🟡 **Yellow (Pending)**: Being created/verified
- 🔴 **Red (Failed)**: Creation failed

### **Activity Feed**
- Real-time updates
- Shows all actions
- Color-coded by type
- Timestamps for each event

---

## 🎨 Tips & Tricks

### **For Best Results**
1. ✅ Use a residential proxy
2. ✅ Enable AI profile generation
3. ✅ Run in non-headless mode first (to see what's happening)
4. ✅ Don't create too many accounts too quickly
5. ✅ Monitor the "Live Monitor" page

### **If Something Goes Wrong**
1. Check "Live Monitor" for error messages
2. Look at logs in `logs/` folder
3. Check screenshots in `screenshots/` folder
4. Try with different proxy
5. Run in visible browser mode to debug

### **Speed Up Creation**
1. Use headless mode (`headless: true`)
2. Use a fast proxy
3. Disable image posting initially
4. Run multiple instances with different proxies

---

## 🚀 Advanced Usage

### **Run Backend Only**
```bash
npm run dev
```
Access API at http://localhost:3000

### **Run Frontend Only**
```bash
cd frontend
npm run dev
```
Dashboard at http://localhost:5173

### **Build for Production**
```bash
# Frontend
cd frontend
npm run build

# Backend
npm start
```

### **Use the API Directly**
```bash
curl -X POST http://localhost:3000/api/create-account \
  -H "Content-Type: application/json" \
  -d '{"useAiProfile": true, "headless": false}'
```

### **View Database**
```bash
npx prisma studio
```
Opens at http://localhost:5555

---

## 🆘 Troubleshooting

### **"Cannot find module"**
```bash
npm install
npx prisma generate
```

### **"Port already in use"**
Change port in `.env`:
```env
PORT=3001
```

### **"Database error"**
Reset database:
```bash
npx prisma migrate reset
```

### **"Frontend won't start"**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### **"WebSocket not connecting"**
1. Make sure backend is running
2. Check port 3000 is accessible
3. Clear browser cache
4. Restart both servers

---

## 📚 Learn More

- **Full Documentation**: See `README.md`
- **Setup Guide**: See `FRONTEND_SETUP.md`
- **Architecture**: See `ARCHITECTURE.md`
- **Quick Start**: See `QUICKSTART.md`

---

## 🎉 Next Steps

1. ✅ Create your first account
2. ✅ Explore the dashboard features
3. ✅ Set up a proxy for better results
4. ✅ Configure AI profile generation
5. ✅ Create multiple accounts
6. ✅ View analytics and insights

---

## 💡 Pro Tips

**Want to sell this as a SaaS?**
- Add user authentication
- Integrate payment system (Stripe)
- Set up subscription plans
- Add usage limits per plan
- Deploy to cloud server

**Want to scale?**
- Switch to PostgreSQL
- Add Redis caching
- Use job queue (Bull)
- Deploy multiple workers
- Set up load balancer

---

**You're all set! Start creating accounts and enjoy your sexy dashboard! 🦄✨**

Questions? Check the documentation files or open an issue!

