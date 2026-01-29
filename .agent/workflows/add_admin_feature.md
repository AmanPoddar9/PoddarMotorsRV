---
description: How to add a new feature to the Admin Portal, including RBAC, Navigation (Dashboard Cards), and Design consistency.
---

Follow this workflow whenever you add a new module (e.g., "Manage Events", "HR", "Inventory") to the Admin Panel.

## 1. Create the Frontend Page
Create a new directory in `client/src/app/admin/[feature-name]` and add `page.jsx`.

**Design Requirements:**
- Use the standard "Admin Dashboard" layout.
- Wrap the page in `<div className="min-h-screen bg-black text-white p-6 md:p-10">`.
- Use the standard Header with Gradient Text:
  ```jsx
  <h1 className="text-3xl font-bold bg-gradient-to-r from-custom-accent to-yellow-500 bg-clip-text text-transparent">
    [Feature Name]
  </h1>
  ```
- Use `bg-custom-jet` for cards and containers.
- Use `text-custom-platinum` for secondary text.
- **API Calls**: Always import and use `API_URL` from `../../config/api` instead of hardcoding localhost.

## 2. Define Permissions (RBAC)
To restrict access to this feature, you must add a new permission string.

1.  **Open** `client/src/app/admin/users/page.jsx`
2.  **Locate** the `PERMISSIONS` constant.
3.  **Add** your new permission to the appropriate category (or create a new one).
    ```javascript
    'New Category': [
        { id: 'feature_name.manage', label: 'Manage [Feature Name]' },
    ]
    ```
    *Naming Convention*: `[resource].[action]` (e.g., `events.manage`, `reports.view`).

## 3. Update Navigation (Dashboard Card)
**Do NOT** add links to the topmost Navbar (`AdminNavbar.jsx`) to keep it clean. Instead, add a card to the main Admin Dashboard.

1.  **Open** `client/src/app/admin/home/page.jsx`
2.  **Locate** the `adminSections` array.
3.  **Add your Feature Card**:
    ```javascript
    {
      title: '[Feature Name]',
      description: '[Short Description]',
      icon: <FiIconName className="w-8 h-8" />,
      href: '/admin/[feature-path]',
      color: 'bg-[color]-600', // Pick a unique color
      permission: 'feature_name.manage' // Must match the permission ID from Step 2
    }
    ```

### COMPLEX FEATURES (Sub-Dashboard)
If your feature has multiple sub-pages (e.g., "HR" has "Jobs" and "Applications"):
1.  Create a **Sub-Dashboard** at `/admin/[feature]/page.jsx` (e.g., `/admin/hr/page.jsx`).
2.  This page should display its own grid of cards linking to the sub-features.
3.  Link the Main Dashboard card (Step 3) to this Sub-Dashboard.

## 4. Backend Route Protection
1.  In your route file (`server/routes/[featureRoutes].js`), ensure routes are correct (e.g., `router.post('/')` not `router.post('/apply')` if mounted at `/api/careers/apply`).
2.  Use standardized response formats.

## 5. Verification
- **RBAC Test**: Create a test "Employee" user, assign only the new permission, login, and verify they can see the Card on the dashboard and access the page.
- **End-to-End Test**: Create a script (e.g., `test_feature.sh`) to verify API endpoints (Create/Read/Update/Delete).
