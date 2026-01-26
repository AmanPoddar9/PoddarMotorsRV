---
description: Perform safety checks before deployment (Git, Env, Build)
---

# Pre-Deployment Safety Check

// turbo-all
Follow these steps to ensure the application is ready for deployment.

1.  **Check Git Status**
    *   **Command:** `git status`
    *   **Goal:** Ensure there are no uncommitted changes that should be included.

2.  **Verify Environment Variables**
    *   **Action:** Check that `.env` exists in both `client/` and `server/` (if applicable) or root.
    *   **Command:** `ls -la client/.env server/.env` (Adjust based on actual locations)

3.  **Check for Critical Keys (Server)**
    *   **Command:** `grep -E "MONGO_URI|AWS_ACCESS_KEY|JWT_SECRET" server/.env`
    *   **Goal:** Ensure critical keys are not missing (do not print values, just check existence).

4.  **Dry Run Build (Client)**
    *   **Command:** `cd client && npm run build`
    *   **Goal:** Verify that the Next.js app builds without errors.

5.  **Dry Run Start (Server)**
    *   **Command:** `cd server && node -c index.js`
    *   **Goal:** Check for syntax errors in the main server file.

6.  **Report**
    *   If all steps pass, confirm to the user that the system is **READY FOR DEPLOYMENT**.
