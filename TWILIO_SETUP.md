# Twilio Call Automation - Quick Setup Guide

## 📋 Prerequisites Checklist

Before the system can work, you need:

- [ ] Twilio account created at [twilio.com](https://www.twilio.com)
- [ ] Business verification completed (required for India)
- [ ] Indian phone number purchased (~₹800/month)
- [ ] Account SID and Auth Token from Twilio Console
- [ ] Server deployed and publicly accessible (for webhooks)

---

## 🚀 Quick Start (5 Steps)

### 1. Update Environment Variables

Edit `/server/.env` and add your Twilio credentials:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+91XXXXXXXXXX
BUSINESS_NAME=Poddar Motors RV
BUSINESS_ADDRESS=Your showroom address, Bangalore
BUSINESS_PHONE=+91XXXXXXXXXX
WEBSITE_URL=https://poddarmotorsrv.in
SALES_FORWARDING_NUMBER=+91XXXXXXXXXX
```

### 2. Seed Message Templates

```bash
cd server
node scripts/seed-templates.js
```

This creates default SMS and WhatsApp templates.

### 3. Deploy Your Server

Make sure your server is publicly accessible (e.g., on Vercel).

### 4. Configure Twilio Webhooks

In Twilio Console → Phone Numbers → Your Number:

**When a call comes in:**
- Webhook: `https://your-server.vercel.app/api/twilio/voice`
- HTTP Method: POST

**Messaging:**
- Status Callback: `https://your-server.vercel.app/api/twilio/message-status`
- HTTP Method: POST

### 5. Test It!

1. Call your Twilio number from your mobile
2. Listen to IVR and press 1 or 2
3. Check for SMS on your phone
4. View call log at `/admin/call-automation`

---

## 💡 How It Works

```
Customer calls → IVR greeting → Customer presses button
                                        ↓
                        ┌───────────────┼───────────────┐
                        ↓               ↓               ↓
                    Press 1         Press 2         Press 3
                  (Car Buying)    (Workshop)    (Speak to Team)
                        ↓               ↓               ↓
                   Send SMS        Send SMS      Forward call to
                   Send WhatsApp   Send WhatsApp  sales executive
                   End call        End call
```

---

## 📊 Admin Dashboard

Access at: `/admin/call-automation`

**Features:**
- Real-time call statistics
- SMS/WhatsApp delivery tracking
- Service distribution charts
- Call history with filters
- Mark calls as contacted
- Flag leads for follow-up

---

## 💰 Expected Costs

For 500 calls/day (~15,000/month):

- Voice calls: ~₹45,000
- SMS: ~₹3,000
- WhatsApp: ~₹13,500 (optional)
- Phone rental: ~₹800
- **Total: ~₹62,300/month** (or ~₹48,800 without WhatsApp)

---

## 🔧 Customization

### Change IVR Greeting

Edit `server/controllers/twilioController.js` line 28-37

### Update Message Templates

Run the seed script again after editing:
`server/scripts/seed-templates.js`

### Modify Business Hours

Update call forwarding logic in:
`server/controllers/twilioController.js`

---

## ❓ Troubleshooting

**No calls coming through?**
- Check webhook URL is correct
- Verify server is publicly accessible
- Check Twilio Console → Debugger for errors

**SMS not sending?**
- Verify TWILIO_PHONE_NUMBER in .env
- Check Twilio account balance
- Review admin dashboard for error messages

**WhatsApp not working?**
- WhatsApp requires separate Business API approval
- Can take 3-5 business days
- Start with SMS-only first

---

## 📞 Next Steps

1. Create Twilio account
2. Get your credentials
3. Update .env file
4. Configure webhooks
5. Test with a call
6. Monitor costs for first week
7. Optimize based on usage

The system is ready to deploy! Once configured, it will automatically handle all incoming calls and send information via SMS/WhatsApp.
