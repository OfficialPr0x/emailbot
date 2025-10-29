/**
 * CLI Banner for MyG Instagram Bot
 */

export const banner = `
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║    ███╗   ███╗██╗   ██╗ ██████╗     ██████╗  ██████╗ ████████╗    ║
║    ████╗ ████║╚██╗ ██╔╝██╔════╝     ██╔══██╗██╔═══██╗╚══██╔══╝    ║
║    ██╔████╔██║ ╚████╔╝ ██║  ███╗    ██████╔╝██║   ██║   ██║       ║
║    ██║╚██╔╝██║  ╚██╔╝  ██║   ██║    ██╔══██╗██║   ██║   ██║       ║
║    ██║ ╚═╝ ██║   ██║   ╚██████╔╝    ██████╔╝╚██████╔╝   ██║       ║
║    ╚═╝     ╚═╝   ╚═╝    ╚═════╝     ╚═════╝  ╚═════╝    ╚═╝       ║
║                                                              ║
║           Automated Account Creation System                  ║
║                    v1.0.0                                    ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

🤖 AI-Powered | 🔒 Stealth Mode | 🌐 Proxy Support | 📊 Real-time Progress

`;

export const features = [
  '✨ Create Gmail accounts automatically',
  '📸 Create Instagram accounts with Gmail',
  '🧠 AI-powered realistic profile generation',
  '🎯 Multi-strategy form filling',
  '🔄 Automatic verification handling',
  '🌐 Full proxy support',
  '📈 Real-time progress tracking',
  '🛡️ Advanced stealth techniques',
];

export const quickStart = `
📚 Quick Start:
   
   1. Configure: Edit .env file with your settings
   2. Test:      npm test
   3. Create:    npm run example:full
   
📖 Documentation:
   
   • README.md - Full documentation
   • QUICKSTART.md - 5-minute guide
   • SETUP.md - Detailed setup
   • API Docs: http://localhost:3000/api/docs
   
⚠️  Educational purposes only. Use responsibly.
`;

export function displayBanner() {
  console.log(banner);
  console.log('🎯 Features:');
  features.forEach((feature) => console.log(`   ${feature}`));
  console.log(quickStart);
}

export default { banner, features, quickStart, displayBanner };

