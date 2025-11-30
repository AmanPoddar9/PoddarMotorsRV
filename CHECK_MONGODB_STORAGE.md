# How to Check MongoDB Storage Usage

## Option 1: MongoDB Atlas Dashboard (Easiest)

1. Go to: https://cloud.mongodb.com
2. Sign in with your MongoDB Atlas account
3. Click on your cluster (probably named "Cluster0")
4. Look at the "Metrics" tab
5. Check "Data Size" - should be under 512MB for free tier

## Option 2: Using MongoDB Compass

1. Open MongoDB Compass
2. Connect using your connection string
3. View → Database Stats
4. Check "Data Size"

## Option 3: Using Code (Ask Engineer)

```javascript
// In MongoDB shell or Node.js
db.stats()

// Look for:
// - dataSize: Total size in bytes
// - storageSize: Total storage used
// - indexes: Index size
```

## What to Look For:

- **Under 400MB:** 🟢 You're safe, plenty of room
- **400-500MB:** 🟡 Warning, start planning to upgrade
- **Over 500MB:** 🔴 Urgent, upgrade to M2 tier ($9/month)

## Current Connection String Location:

Your MongoDB URI is in: `server/.env`
```
MONGO_URI='mongodb+srv://suryaansh2002:suryaansh2002@cluster0...'
```

⚠️ **Note:** This username/password is also visible in my logs. Consider rotating this too!

## How Often to Check:

- **Now:** Just to know where you stand
- **Weekly:** If you're adding lots of cars
- **Monthly:** If your inventory is stable
