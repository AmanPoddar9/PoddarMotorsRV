# PoddarMotors: Real Value

Website for Real Value: Poddar Motors

## Deployment checklist

- Keep `client/src/app/components/Footer.jsx` marked with the `'use client'` directive because it relies on the `useLanguage` hook from the language context. Removing the directive will reintroduce the server-side rendering error on the home page.
- Run `npm run build` locally before pushing to ensure the Next.js production build succeeds; this catches any regressions that could block the deployment pipeline.
