---
description: How to add a new feature to the Admin Portal, including RBAC, Navigation, and Design consistency.
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

## 3. Update Navigation
Add the link to the Admin Sidebar/Navbar, ensuring it's hidden for users without permission.

1.  **Open** `client/src/app/components/AdminNavbar.jsx`
2.  **Add Permission Check**:
    ```javascript
    const canAccessFeature = hasPermission('feature_name.manage');
    ```
3.  **Add Link**:
    ```jsx
    {hasPermission('feature_name.manage') && (
        <Link href="/admin/[feature-name]" ...>
            [Feature Label]
        </Link>
    )}
    ```

## 4. Backend Route Protection (If applicable)
If your feature has backend API routes, protect them using middleware.

1.  In your route file (`server/routes/[featureRoutes].js`), use the auth middleware (and ensuring you check user role/permissions if strict backend RBAC is implemented, otherwise frontend hiding is the first layer).

## 5. Deployment
- Push changes and verify that:
    - The new page loads with the correct design.
    - The link appears in the Navbar *only* for Admins or users with the new permission.
    - You can assign this permission to an employee via the "User Management" page.
