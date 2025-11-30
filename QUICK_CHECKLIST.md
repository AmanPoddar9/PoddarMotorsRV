# 🎯 Security Fix - Quick Action Checklist

**Date:** November 29, 2025  
**Status:** Code Secured ✅ | AWS Rotation Pending ⚠️

---

## ✅ COMPLETED

- [x] Removed hardcoded AWS credentials from source code (3 files)
- [x] Removed hardcoded Cloudinary credentials from source code
- [x] Added all credentials to .env files (server + client)
- [x] Protected .env files with .gitignore
- [x] Created .env.example templates
- [x] Verified environment variables are loading correctly

---

## 🚨 URGENT - DO THIS NOW

### 1. Rotate AWS Credentials (15 minutes)

**Why:** The old credentials were exposed in code and likely in Git history.

**Steps:**
1. Sign in to AWS Console: https://console.aws.amazon.com/iam/
2. Go to IAM → Users → Find user with key `AKIAZQ3DNQ6CJUV7YGIH`
3. Delete the old access key
4. Create NEW access key
5. Download/copy the new credentials

**Update Local Environment:**
```bash
# Edit server/.env
# Replace AWS_ACCESS_KEY_ID with new value
# Replace AWS_SECRET_ACCESS_KEY with new value

# Edit client/.env.local  
# Replace AWS_ACCESS_KEY_ID with new value
# Replace AWS_SECRET_ACCESS_KEY with new value
```

---

### 2. Configure Vercel Environment Variables (10 minutes)

**Why:** Production deployment needs the new credentials.

**Steps:**
1. Go to https://vercel.com/dashboard
2. Select your Poddar Motors project
3. Go to Settings → Environment Variables
4. Add these variables for **Production, Preview, and Development**:

```
AWS_ACCESS_KEY_ID = <your_new_key>
AWS_SECRET_ACCESS_KEY = <your_new_secret>
AWS_REGION = ap-south-1
AWS_S3_BUCKET = realvaluestorage
```

5. Click Save for each one

---

### 3. Test Locally (5 minutes)

```bash
# Terminal 1 - Start server
cd server
npm start

# Terminal 2 - Start client
cd client
npm run dev
```

**Test:** Try uploading images in admin panel at http://localhost:3000/admin

---

### 4. Deploy to Production (5 minutes)

```bash
# From project root
git add .
git commit -m "security: Move credentials to environment variables"
git push
```

**Vercel will auto-deploy.**

**Test:** Try uploading images in admin panel at https://www.poddarmotors.com/admin

---

## 🛡️ RECOMMENDED - DO THIS WEEK

### 5. Set Up AWS Billing Alert (5 minutes)

1. AWS Console → Billing Dashboard
2. Create Budget → Set $10/month threshold
3. Add email alert

### 6. Review S3 Bucket Access (10 minutes)

1. AWS Console → S3 → realvaluestorage
2. Check for unfamiliar files
3. Review access logs (if enabled)

### 7. Check MongoDB Usage (5 minutes)

1. MongoDB Atlas: https://cloud.mongodb.com
2. View Metrics → Check storage usage
3. If approaching 512MB, plan to upgrade to M2 ($9/month)

---

## 📋 VERIFICATION

After completing all steps, verify:

- [ ] AWS credentials rotated
- [ ] Old AWS key deleted from IAM
- [ ] Local .env files updated with new credentials
- [ ] Vercel environment variables configured
- [ ] Local testing successful (image upload works)
- [ ] Git committed and pushed
- [ ] Production deployment successful
- [ ] Production testing successful (image upload works)
- [ ] AWS billing alert configured
- [ ] S3 bucket reviewed (no unauthorized files)
- [ ] MongoDB usage checked

---

## 📚 Reference Documents

- **Detailed AWS Rotation Guide:** `SECURITY_FIX.md`
- **Complete Summary:** `SECURITY_COMPLETE.md`
- **Infrastructure Analysis:** `INFRASTRUCTURE_ASSESSMENT.md`

---

## 🆘 If Something Goes Wrong

### Image uploads fail locally:
- Check: `server/.env` and `client/.env.local` have correct AWS credentials
- Check: Run `npm start` from `server` directory (not root)
- Check: Run `npm run dev` from `client` directory (not root)

### Image uploads fail on Vercel:
- Check: Vercel environment variables are set correctly
- Check: Deployed version has latest code (check commit hash)
- Check: Vercel deployment logs for errors

### AWS bills look high:
- Check: S3 bucket size and request counts
- Check: CloudTrail for unauthorized access
- Contact AWS support if needed

---

**Time Commitment:**
- Urgent tasks: ~35 minutes
- Recommended tasks: ~20 minutes
- **TOTAL: ~55 minutes**

**Your website security depends on completing the urgent tasks ASAP! 🚀**
