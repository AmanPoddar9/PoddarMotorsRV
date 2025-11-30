# PoddarMotors: Real Value

Website for Real Value: Poddar Motors

## Troubleshooting login CORS errors
If the browser console shows `Access-Control-Allow-Origin` missing for requests from `https://www.poddarmotors.com` to the Vercel API (for example `poddar-motors-rv-hkxu.vercel.app/api/auth/login`), it usually means the backend did not complete the response or the request was routed somewhere that bypassed the Express CORS middleware. The server is configured to allow `https://www.poddarmotors.com`, `https://poddarmotors.com`, `http://localhost:3000`, and the deployed Vercel domains, with credentials enabled and preflight handled centrally. 【F:server/index.js†L40-L61】

Common causes and fixes:
- **Backend not reachable**: A network failure or server error on Vercel will surface as a CORS message even though the request never reached Express. Verify the deployment is healthy via `/api/health` and check server logs for 5xx errors. 【F:server/index.js†L65-L71】
- **Origin mismatch**: Ensure the frontend is using one of the allowed origins above. Default HTTP/HTTPS ports are normalized away, so `:443`/`:80` should not block a valid site. 【F:server/index.js†L40-L90】
- **New domains**: Set `CORS_ORIGINS` (comma-separated) to append additional origins without code changes; trailing slashes and default ports are ignored automatically. 【F:server/index.js†L40-L90】
- **Blocked third-party scripts**: Errors like `net::ERR_BLOCKED_BY_CLIENT` for `connect.facebook.net` are caused by ad/tracker blockers and do not affect authentication; remove or silence those warnings if necessary.

If login calls need cookies or tokens, keep `withCredentials` enabled on the client to match the `credentials: true` CORS setting. 【F:server/index.js†L49-L54】
**Preflight headers**: Common headers such as `Authorization` and `Content-Type` are always allowed, and any `Access-Control-Request-Headers` sent by the browser are reflected so OPTIONS checks do not fail with missing `Access-Control-Allow-Headers`. 【F:server/index.js†L16-L21】【F:server/index.js†L92-L109】
