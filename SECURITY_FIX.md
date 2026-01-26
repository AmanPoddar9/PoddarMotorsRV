# 🔒 AWS Security Fix - URGENT ACTION REQUIRED

## ✅ What Was Fixed

I've secured your AWS credentials by:
1. ✅ Moved AWS credentials from hardcoded values to environment variables
2. ✅ Updated `server/routes/uploadRoutes.js` to use env variables
3. ✅ Updated `client/src/app/api/route.js` to use env variables
4. ✅ Added `.env.local` to `.gitignore`
5. ✅ Created `.env.example` templates for both client and server

---

## 🚨 CRITICAL: You Must Rotate AWS Credentials NOW

**WHY:** The exposed credentials were in your code and likely committed to GitHub. Anyone who accessed your repository can see them.

### Step-by-Step AWS Credential Rotation

#### 1. **Sign in to AWS Console**
   - Go to: https://console.aws.amazon.com/
   - Sign in with your AWS account

#### 2. **Navigate to IAM (Identity and Access Management)**
   - Search for "IAM" in the AWS Console search bar
   - Click on "IAM"

#### 3. **Find the Compromised User**
   - Click "Users" in the left sidebar
   - Look for the user with access key: `[REDACTED]`
   - Click on the username

#### 4. **Delete the Old Access Key**
   - Click on "Security credentials" tab
   - Find the access key `[REDACTED]`
   - Click "Actions" → "Delete"
   - Confirm deletion

#### 5. **Create New Access Key**
   - Still in the "Security credentials" tab
   - Click "Create access key"
   - Choose "Application running outside AWS"
   - Click "Next" → "Create access key"
   - **IMPORTANT:** Download or copy both:
     - Access Key ID
     - Secret Access Key
   - Store them securely (you'll need them in the next step)

#### 6. **Update Your Environment Variables**

**Local Development:**

Update `server/.env`:
```bash
AWS_ACCESS_KEY_ID=your_new_access_key_id
AWS_SECRET_ACCESS_KEY=your_new_secret_access_key
```

Update `client/.env.local`:
```bash
AWS_ACCESS_KEY_ID=your_new_access_key_id
AWS_SECRET_ACCESS_KEY=your_new_secret_access_key
```

**Vercel Production:**

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add these variables (if not already present):
   - `AWS_ACCESS_KEY_ID` = your new access key ID
   - `AWS_SECRET_ACCESS_KEY` = your new secret access key
   - `AWS_REGION` = ap-south-1
   - `AWS_S3_BUCKET` = realvaluestorage
5. Make sure to set them for "Production", "Preview", and "Development"
6. Click "Save"

#### 7. **Redeploy Your Application**

After updating Vercel environment variables:

```bash
# From your project root
git add .
git commit -m "fix: Remove hardcoded AWS credentials, use environment variables"
git push
```

Vercel will automatically redeploy with the new environment variables.

---

## 🔍 Check for Unauthorized Access

### 1. Review S3 Bucket Activity
   - Go to AWS Console → S3
   - Click on your bucket `realvaluestorage`
   - Check for any unusual files or deletions

### 2. Check AWS CloudTrail (Optional but Recommended)
   - Go to AWS Console → CloudTrail
   - Look for any suspicious API calls made with the old credentials
   - Check for unauthorized access from unfamiliar IP addresses

### 3. Review AWS Billing
   - Go to AWS Console → Billing Dashboard
   - Check for any unexpected charges
   - Set up billing alerts if not already configured

---

## 🛡️ Additional Security Recommendations

### 1. **Set Up S3 Bucket Policies**
Restrict your S3 bucket to only allow specific operations:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowPublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::realvaluestorage/*"
    }
  ]
}
```

### 2. **Create IAM User with Minimal Permissions**
Instead of using root credentials, create an IAM user with ONLY S3 permissions:

1. IAM → Users → Create user
2. Attach policy: `AmazonS3FullAccess` (or custom policy for just your bucket)
3. Create access keys for this user only

### 3. **Enable AWS Billing Alerts**
1. AWS Console → Billing → Budgets
2. Create a budget (e.g., $10/month)
3. Set up email alerts

### 4. **Use AWS Secrets Manager (Advanced)**
For production applications, consider using AWS Secrets Manager to rotate credentials automatically.

---

## ✅ Verification Checklist

- [ ] Deleted old AWS access key from IAM
- [ ] Created new AWS access key
- [ ] Updated `server/.env` with new credentials
- [ ] Updated `client/.env.local` with new credentials
- [ ] Added AWS env vars to Vercel project settings
- [ ] Redeployed application to Vercel
- [ ] Tested image upload functionality on local
- [ ] Tested image upload functionality on production
- [ ] Reviewed S3 bucket for unauthorized access
- [ ] Checked AWS billing for unexpected charges
- [ ] Set up AWS billing alerts

---

## 🧪 Test Your Changes

### Local Testing:
```bash
# Terminal 1: Start server
cd server
npm start

# Terminal 2: Start client
cd client
npm run dev
```

Then try uploading images in the admin panel to verify S3 uploads work.

### Production Testing:
After deploying to Vercel, test the image upload functionality on your live site.

---

## 📝 Future Best Practices

1. **Never commit secrets to Git**
   - Always use `.env` files (already in `.gitignore`)
   - Use environment variables for all sensitive data

2. **Use environment-specific configurations**
   - Development: `.env.local`
   - Production: Vercel environment variables

3. **Regular security audits**
   - Review AWS IAM permissions quarterly
   - Rotate credentials every 90 days
   - Monitor AWS CloudTrail logs

4. **Scan GitHub repository**
   ```bash
   # Check if credentials were committed to Git history
   git log --all --full-history --source --pretty=format:'%h %s' --grep='AWS\|secret\|key' -i
   ```

---

## 🆘 Need Help?

If you encounter any issues:
1. Check the error logs in Vercel deployment
2. Verify environment variables are set correctly in Vercel
3. Ensure the new AWS credentials have proper S3 permissions
4. Test with a simple S3 upload script to verify credentials work

---

**Last Updated:** November 29, 2025  
**Status:** ✅ Code secured, ⚠️ AWS credentials need rotation
