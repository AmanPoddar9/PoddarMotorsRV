# Walkthrough

## What was fixed
1. **Sitemap build error** – `client/src/app/sitemap.ts` now uses `process.env.NEXT_PUBLIC_API_URL` instead of hard‑coded `localhost:4000`.
2. **Backend deployment** – Added missing `cookie-parser` dependency, exported the Express app, and fixed `vercel.json` routes.
3. **Environment variables** – Backend now has `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`; Frontend has `NEXT_PUBLIC_API_URL`.
4. **Authentication cookie** – Updated `server/routes/authRoutes.js` to set the cookie with `sameSite: 'none'`, `secure: true` and a 2‑hour max‑age so the token works across the separate frontend and backend domains.
5. **User creation** – Generated a correct bcrypt hash for password `Admin@123` and added the admin user to MongoDB.
6. **Dependencies** – Added `cookie-parser` to `server/package.json` and pushed the change.

## How to verify
1. **Deployments** – Both the frontend (`poddar-motors-rv`) and backend (`poddar-motors-rv-hkxu`) should show a green check in Vercel after the recent pushes.
2. **Login** – Open `https://www.poddarmotors.com/admin/login` and log in with:
   - Email: `admin@poddarmotors.com`
   - Password: `Admin@123`
   You should stay on the dashboard after login.
3. **Sitemap** – The build should complete without the `Error fetching blogs for sitemap` message.
4. **RBAC** – After creating the other two users (blogEditor and bookingManager) you can test that they only see the sections they are allowed to.

## Next steps (optional)
- Create the remaining two users (`blog@poddarmotors.com` and `workshop@poddarmotors.com`) using the same hash or run the script when the network issue is resolved.
- Update passwords in MongoDB if you want unique passwords per role.
- Monitor Vercel logs for any unexpected errors.
