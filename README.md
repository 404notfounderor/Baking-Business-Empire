# 🧁 Sweet Bakery Empire - Updated Game Setup Guide

## New Features Added

### 📅 Day & Week Tracking
- **Day Display**: Shows current game day number and day of the week (e.g., "Day 3 (Wednesday)")
- **Week Cycle**: Runs Monday through Sunday, then repeats
- **Weekly Cost Planning**: Helps track when weekly costs ($100) will be deducted every 7th day

### 💰 End-of-Day Profit System  
- **Delayed Payments**: Order profits are no longer credited instantly
- **Pending Profits**: Track your daily earnings in real-time with "Pending Today: $XXX" display
- **End Day Payout**: All pending profits are credited to your balance when you click "End Day"
- **Daily Summary**: Get a summary popup showing total daily earnings before advancing to next day

## Updated Gameplay Flow

1. **Start Your Day**: See your current balance and day (e.g., "Day 1 (Monday)")
2. **Fulfill Orders**: Complete customer orders throughout the day
3. **Track Pending Profits**: Watch your "Pending Today" amount grow as you complete orders
4. **End Your Day**: Click "End Day" to receive all pending profits and advance to the next day
5. **Weekly Costs**: Every 7th day, automatic costs ($100) are deducted from your balance

## File Structure
```
sweet-bakery-updated/
├── index.html          # Updated game HTML with new UI elements
├── style.css           # Enhanced styling for day tracking and pending profits
├── app.js             # Updated game logic with delayed profit system
└── README.md          # This updated setup guide
```

## Local Setup Instructions

### Quick Start
1. Download all game files to a folder named `sweet-bakery-updated`
2. Start a local web server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx http-server . -p 8000
   
   # PHP
   php -S localhost:8000
   ```
3. Open `http://localhost:8000` in your browser
4. Click "Play as Guest" for demo mode

### Google OAuth Setup (Optional)
1. Get Google OAuth Client ID from [Google Cloud Console](https://console.cloud.google.com/)
2. Replace `YOUR_GOOGLE_CLIENT_ID` in `index.html` with your actual Client ID
3. Add your domain to authorized origins in Google Cloud Console

## New UI Elements Explained

### Header Display
```
Balance: $750 | Day 3 (Wednesday) | Pending Today: $125
```
- **Balance**: Your current banked money
- **Day Tracking**: Current game day and day of the week
- **Pending Today**: Money earned today but not yet banked

### End Day Button
- Click when you're done with orders for the day
- Shows summary: "Day 3 Complete! You earned $125 today"
- Adds all pending profits to your main balance
- Advances to next day of the week

## Game Strategy Tips

### Financial Planning
- **Track Pending Profits**: Know how much you'll earn before ending the day
- **Weekly Cost Preparation**: Save at least $100 for weekly costs every 7th day
- **Cash Flow Management**: Plan ingredient purchases around end-of-day payouts

### Weekly Schedule
- **Monday-Sunday Cycle**: Plan your week knowing costs come every 7th day
- **Weekend Strategy**: Use knowledge of upcoming weekly costs to manage spending

## Technical Details

### New Game State Properties
- `currentDay`: Tracks game day number (1, 2, 3, etc.)
- `currentDayOfWeek`: Tracks day of week (0=Monday, 6=Sunday)
- `pendingProfits`: Array of completed orders awaiting payout
- `dailyProfitsTotal`: Running total of pending profits for display

### Local Storage
- All game progress saves automatically in browser localStorage
- New tracking data is preserved between sessions
- Clear browser data to reset the game

### Browser Compatibility
- Chrome 60+ ✅
- Firefox 55+ ✅  
- Safari 12+ ✅
- Edge 79+ ✅

## Troubleshooting

### Common Issues
1. **Profits not showing**: Ensure orders are fully completed (all ingredients purchased)
2. **Day not advancing**: Click "End Day" button after completing orders
3. **Pending profits reset**: This happens normally when you end the day
4. **Weekly costs unexpected**: Check if you've completed 7 game days

### Debug Mode
- Open browser Developer Tools (F12)
- Check Console for any error messages
- Verify localStorage is enabled for game saving

## Game Balance Changes

### More Strategic Gameplay
- **Planning Required**: Must complete orders before ending day to get paid
- **Risk Management**: Balance between order completion and ingredient costs
- **Time Management**: Decide when to end day vs. take more orders

### Realistic Business Simulation  
- **Cash Flow**: Mimics real business where payments come at day's end
- **Weekly Expenses**: Fixed costs every 7 days require planning
- **Profit Tracking**: Clear separation between earned vs. banked money

## Files Overview

### index.html (Updated)
- Added day tracking display in header
- Added pending profits indicator  
- Enhanced end day functionality
- Improved responsive design for new elements

### style.css (Enhanced)
- New styles for day/week display
- Pending profits styling with distinct visual identity
- Enhanced header layout for additional information
- Improved mobile responsiveness for new UI elements

### app.js (Major Updates)
- `dayNames` array for week cycling
- `pendingProfits` tracking system
- Updated order completion logic (no instant payment)
- Enhanced end day function with profit summary
- Improved localStorage with new game state properties

## Tips for Success

1. **Complete Multiple Orders**: Build up pending profits before ending day
2. **Monitor Weekly Costs**: Save money for every 7th day expenses  
3. **Plan Ingredient Purchases**: Buy efficiently to maximize profits
4. **Track Your Week**: Use day names to anticipate weekly cost deductions
5. **Strategic Day Ending**: End day only when you have good daily profits

Enjoy the more strategic and realistic bakery management experience! 🧁✨