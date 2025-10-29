# Fix and Start Script for MyG Instagram Bot
Write-Host "`n🔧 Fixing MyG Instagram Bot...`n" -ForegroundColor Cyan

# Step 1: Kill any existing Node processes on port 3000
Write-Host "1️⃣ Killing processes on port 3000..." -ForegroundColor Yellow
$processes = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($processes) {
    foreach ($proc in $processes) {
        Stop-Process -Id $proc -Force -ErrorAction SilentlyContinue
        Write-Host "   ✅ Killed process $proc" -ForegroundColor Green
    }
} else {
    Write-Host "   ✅ Port 3000 is free" -ForegroundColor Green
}

# Step 2: Check if Playwright is installed
Write-Host "`n2️⃣ Checking Playwright..." -ForegroundColor Yellow
$chromiumPath = "$env:LOCALAPPDATA\ms-playwright\chromium-1194\chrome-win\chrome.exe"
if (Test-Path $chromiumPath) {
    Write-Host "   ✅ Playwright Chromium already installed" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Playwright Chromium not found" -ForegroundColor Red
    Write-Host "   📥 Downloading Playwright Chromium (~150MB)..." -ForegroundColor Yellow
    Write-Host "   ⏳ This may take a few minutes depending on your connection..." -ForegroundColor Yellow
    
    # Increase timeout
    $env:PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT = "600000"
    
    try {
        npx playwright install chromium
        Write-Host "   ✅ Playwright installed successfully!" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ Playwright installation failed" -ForegroundColor Red
        Write-Host "   💡 Try manually: npx playwright install chromium" -ForegroundColor Yellow
        Write-Host "   💡 Or check your internet connection" -ForegroundColor Yellow
        exit 1
    }
}

# Step 3: Start the application
Write-Host "`n3️⃣ Starting application..." -ForegroundColor Yellow
Write-Host "   🚀 Starting backend and frontend..." -ForegroundColor Cyan
Write-Host "`n" -ForegroundColor White
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "   ✅ Setup Complete!" -ForegroundColor Green
Write-Host "   📡 Backend will start on: http://localhost:3000" -ForegroundColor White
Write-Host "   🌐 Frontend will start on: http://localhost:5173" -ForegroundColor White
Write-Host "   📚 After servers start, open: http://localhost:5173" -ForegroundColor Yellow
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "`n⏳ Starting servers (this may take 10-15 seconds)...`n" -ForegroundColor Yellow

npm run dev:all

