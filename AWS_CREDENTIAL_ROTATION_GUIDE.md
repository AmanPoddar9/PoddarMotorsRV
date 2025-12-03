   # 🚨 URGENT: AWS Credential Rotation Guide

**Status:** ⚠️ CRITICAL - Do this IMMEDIATELY before anything else  
**Time Required:** 15-20 minutes  
**Difficulty:** Beginner-friendly with screenshots

---

## ⚠️ Why This is Urgent

Your AWS credentials were **hardcoded in your source code** and likely pushed to GitHub. This means:
- ❌ Anyone with access to your code can use your AWS account
- ❌ They could upload unlimited files to your S3 bucket (costing you money)
- ❌ They could delete all your car images
- ❌ They could access customer data stored in S3

**The exposed credentials:**
- Access Key ID: `AKIAZQ3DNQ6CJUV7YGIH`
- Secret Access Key: `YbuXKOh95Dm7FeAxgnVoZQyQep366YRuW9a6D2/l`

---

## 📋 Step-by-Step Rotation Process

### Step 1: Log into AWS Console

1. Go to: https://console.aws.amazon.com/
2. Sign in with your AWS account email and password
3. Make sure you're in the **Mumbai (ap-south-1)** region (top right corner)

---

### Step 2: Navigate to IAM (Identity and Access Management)

1. In the search bar at the top, type **"IAM"**
2. Click on **"IAM"** from the results
3. You should see the IAM Dashboard

---

### Step 3: Find and Delete the Compromised Access Key

1. In the left sidebar, click **"Users"**
2. Find the user that has the compromised key (might be named "realvalue-s3-user" or similar)
3. Click on the username
4. Click the **"Security credentials"** tab
5. Scroll down to **"Access keys"** section
6. Find the key starting with `AKIAZQ3DNQ6CJUV7YGIH`
7. Click **"Actions"** → **"Deactivate"** (this stops it from working immediately)
8. Wait 5 minutes to ensure no processes are using it
9. Click **"Actions"** → **"Delete"**
10. Confirm deletion

**✅ Checkpoint:** The old compromised key is now deleted and cannot be used.

---

### Step 4: Create a New IAM User with Minimal Permissions

**Why a new user?** Best practice is to create a dedicated user just for S3 uploads, with no other permissions.

1. In IAM Dashboard, click **"Users"** in the left sidebar
2. Click **"Create user"** button (top right)
3. **User name:** Enter `poddarmotors-s3-upload`
4. **Uncheck** "Provide user access to the AWS Management Console" (this user is for your app, not humans)
5. Click **"Next"**

---

### Step 5: Set Permissions (S3 Only)

1. Select **"Attach policies directly"**
2. In the search box, type **"S3"**
3. Find and check **"AmazonS3FullAccess"** 
   - ⚠️ Note: We'll restrict this further in Step 7 for better security
4. Click **"Next"**
5. Review and click **"Create user"**

**✅ Checkpoint:** New user created with S3 access only.

---

### Step 6: Create Access Keys for the New User

1. Click on the newly created user **"poddarmotors-s3-upload"**
2. Click the **"Security credentials"** tab
3. Scroll down to **"Access keys"** section
4. Click **"Create access key"**
5. Select **"Application running outside AWS"**
6. Click **"Next"**
7. (Optional) Add description: "Poddar Motors website S3 uploads"
8. Click **"Create access key"**

**🔴 CRITICAL:** You will now see your new credentials:
- **Access key ID:** Something like `AKIAXXXXXXXXXXXXXXXX`
- **Secret access key:** Something like `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**📝 IMPORTANT:** 
- Click **"Download .csv file"** and save it somewhere safe
- **DO NOT CLOSE THIS PAGE** until you've saved the credentials
- You can only see the secret key once - if you lose it, you'll have to create new keys

**✅ Checkpoint:** New access keys created and saved securely.

---

### Step 7: Restrict Permissions to Specific Bucket (RECOMMENDED)

For better security, let's limit this user to only access your specific S3 bucket.

1. Go back to the user page for `poddarmotors-s3-upload`
2. Click **"Add permissions"** → **"Create inline policy"**
3. Click the **"JSON"** tab
4. Replace everything with this code:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::realvaluestorage",
                "arn:aws:s3:::realvaluestorage/*"
            ]
        }
    ]
}
```

5. Click **"Review policy"**
6. Name it: `S3-RealValueStorage-Only`
7. Click **"Create policy"**
8. Go back to the user's **"Permissions"** tab
9. Find **"AmazonS3FullAccess"** and click **"Remove"**

**✅ Checkpoint:** User can now only access your specific S3 bucket, nothing else.

---

### Step 8: Update Your Local Environment Files

Now we need to update your code to use the new credentials.

#### Server Environment File

1. Open: `/Users/amanpoddar/Documents/GitHub/PoddarMotorsRV/server/.env`
2. Find these lines:
   ```
   AWS_ACCESS_KEY_ID=AKIAZQ3DNQ6CJUV7YGIH
   AWS_SECRET_ACCESS_KEY=YbuXKOh95Dm7FeAxgnVoZQyQep366YRuW9a6D2/l
   ```
3. Replace with your NEW credentials from Step 6:
   ```
   AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
   AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   AWS_REGION=ap-south-1
   AWS_S3_BUCKET=realvaluestorage
   ```

#### Client Environment File

1. Open: `/Users/amanpoddar/Documents/GitHub/PoddarMotorsRV/client/.env.local`
2. Update the same AWS credentials there too

**✅ Checkpoint:** Local environment files updated with new credentials.

---

### Step 9: Update Vercel Environment Variables

Your production site on Vercel also needs the new credentials.

1. Go to: https://vercel.com/dashboard
2. Click on your **"PoddarMotorsRV"** project
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in the left sidebar
5. Find these variables and click **"Edit"** for each:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`
   - `AWS_S3_BUCKET`

6. Update each one with the new values
7. Make sure to select **all environments** (Production, Preview, Development)
8. Click **"Save"** for each one

**✅ Checkpoint:** Vercel production environment updated.

---

### Step 10: Test Locally

Let's make sure everything works before deploying.

1. Open Terminal
2. Navigate to server folder:
   ```bash
   cd /Users/amanpoddar/Documents/GitHub/PoddarMotorsRV/server
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. In a new terminal tab, start the client:
   ```bash
   cd /Users/amanpoddar/Documents/GitHub/PoddarMotorsRV/client
   npm run dev
   ```
5. Open browser to: http://localhost:3000
6. Log into admin panel
7. Try uploading a car image
8. **If it works:** ✅ Credentials are correct!
9. **If it fails:** Check the error message and verify credentials

---

### Step 11: Deploy to Production

1. Stop the local servers (Ctrl+C in both terminals)
2. Commit and push your changes:
   ```bash
   cd /Users/amanpoddar/Documents/GitHub/PoddarMotorsRV
   git add .
   git commit -m "Update AWS credentials in environment files"
   git push
   ```

**⚠️ WAIT!** Before pushing, let's make sure the credentials are NOT in the code:

3. Check these files to ensure NO hardcoded credentials:
   ```bash
   # This should show NO results (empty output)
   grep -r "AKIAZQ3DNQ6C" .
   grep -r "YbuXKOh95Dm7" .
   ```

4. If you see any results, those files still have hardcoded credentials - remove them!

5. Once verified, push to GitHub:
   ```bash
   git push
   ```

6. Vercel will automatically deploy
7. Wait 2-3 minutes for deployment to complete
8. Test image upload on your live site: https://poddarmotors.com

**✅ Checkpoint:** Production site updated and working with new credentials.

---

### Step 12: Check for Unauthorized Access (IMPORTANT)

Let's see if anyone used the old credentials.

1. Go to AWS Console: https://console.aws.amazon.com/
2. Search for **"CloudTrail"** in the top search bar
3. Click **"Event history"** in the left sidebar
4. Set the time range to **"Last 30 days"**
5. Look for any suspicious activity:
   - Uploads you didn't make
   - Deletes you didn't authorize
   - Access from unknown IP addresses

**If you see suspicious activity:**
- Check your S3 bucket for unknown files
- Check AWS billing for unexpected charges
- Consider enabling S3 bucket logging for future monitoring

---

### Step 13: Set Up Billing Alerts (Prevent Surprise Charges)

1. Go to: https://console.aws.amazon.com/billing/
2. Click **"Billing preferences"** in the left sidebar
3. Check **"Receive Billing Alerts"**
4. Click **"Save preferences"**
5. Go to CloudWatch: https://console.aws.amazon.com/cloudwatch/
6. Make sure you're in **"US East (N. Virginia)"** region (billing metrics only work here)
7. Click **"Alarms"** → **"Create alarm"**
8. Click **"Select metric"** → **"Billing"** → **"Total Estimated Charge"**
9. Select **"USD"** and click **"Select metric"**
10. Set threshold to **$10** (or whatever amount you want to be alerted at)
11. Click **"Next"**
12. Create a new SNS topic with your email
13. Click **"Create alarm"**
14. **Check your email** and confirm the subscription

**✅ Checkpoint:** You'll now get an email if AWS charges exceed $10.

---

## 📋 Final Checklist

- [ ] Old AWS access key deleted
- [ ] New IAM user created with S3-only permissions
- [ ] New access keys generated and saved securely
- [ ] Server `.env` file updated
- [ ] Client `.env.local` file updated
- [ ] Vercel environment variables updated
- [ ] Tested locally - image uploads work
- [ ] Verified NO hardcoded credentials in code
- [ ] Pushed to GitHub and deployed to production
- [ ] Tested on live site - image uploads work
- [ ] Checked CloudTrail for unauthorized access
- [ ] Set up AWS billing alerts

---

## 🆘 Troubleshooting

### "Access Denied" error when uploading images

**Cause:** New IAM user doesn't have correct permissions  
**Fix:** Go back to Step 7 and verify the inline policy is correct

### "Invalid Access Key ID" error

**Cause:** Credentials not updated correctly  
**Fix:** Double-check Step 8 - make sure you copied the full access key and secret

### Images upload locally but not on Vercel

**Cause:** Vercel environment variables not updated  
**Fix:** Go back to Step 9 and verify all variables are set for all environments

### Can't find the old access key in IAM

**Cause:** It might be under a different user  
**Fix:** Check all users in IAM → Users, or search for the access key ID in CloudTrail

---

## 📞 Need Help?

If you get stuck at any step:
1. Take a screenshot of the error
2. Note which step you're on
3. Ask me and I'll help you troubleshoot

---

## 🎯 What's Next?

After completing this rotation:
1. ✅ Your AWS account is secure
2. ✅ Old credentials can't be used by anyone
3. ✅ New credentials are properly protected in environment variables
4. ✅ You have billing alerts to prevent surprise charges

Now we can proceed with the other security improvements (helmet, rate limiting, etc.) with peace of mind!

---

**Last Updated:** December 1, 2025  
**Estimated Time:** 15-20 minutes  
**Difficulty:** Beginner-friendly ⭐⭐☆☆☆
