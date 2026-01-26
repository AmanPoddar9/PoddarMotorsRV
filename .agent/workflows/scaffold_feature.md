---
description: Scaffold a new full-stack feature (Model, Controller, Route, Frontend Page)
---

# Scaffold New Feature Workflow

Follow these steps to create a new feature module consistently.
**Goal:** Create a standardized set of files for a new feature named `[FeatureName]`.

1.  **Analyze Requirements**
    *   Determine the `[FeatureName]` (e.g., `Auction`, `Dropshipping`).
    *   Identify necessary data fields for the Model.

2.  **Backend: Create Model**
    *   **File:** `server/models/[FeatureName].js` (PascalCase, singular)
    *   **Template:**
        ```javascript
        const mongoose = require('mongoose');

        const [FeatureName]Schema = new mongoose.Schema({
            // Add specific fields here based on requirements
            createdAt: {
                type: Date,
                default: Date.now
            }
        });

        module.exports = mongoose.model('[FeatureName]', [FeatureName]Schema);
        ```

3.  **Backend: Create Controller**
    *   **File:** `server/controllers/[FeatureName]Controller.js` (camelCase)
    *   **Template:**
        ```javascript
        const [FeatureName] = require('../models/[FeatureName]');

        exports.create[FeatureName] = async (req, res) => {
            try {
                const newItem = new [FeatureName](req.body);
                await newItem.save();
                res.status(201).json({ success: true, data: newItem });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
        };

        exports.getAll[FeatureName]s = async (req, res) => {
            try {
                const items = await [FeatureName].find();
                res.status(200).json({ success: true, data: items });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        };
        // Add getOne, update, delete as needed
        ```

4.  **Backend: Create Route**
    *   **File:** `server/routes/[featureName]Routes.js` (camelCase)
    *   **Template:**
        ```javascript
        const express = require('express');
        const router = express.Router();
        const [FeatureName]Controller = require('../controllers/[FeatureName]Controller');

        router.post('/', [FeatureName]Controller.create[FeatureName]);
        router.get('/', [FeatureName]Controller.getAll[FeatureName]s);

        module.exports = router;
        ```

5.  **Backend: Register Route**
    *   **Action:** Edit `server/index.js` to import and use the new route.
    *   **Code:**
        ```javascript
        // Import
        const [featureName]Routes = require('./routes/[featureName]Routes');
        // Use
        app.use('/api/[featureName]s', [featureName]Routes);
        ```

6.  **Frontend: Create Page**
    *   **File:** `client/src/app/[featureName]/page.jsx` (lowercase folder)
    *   **Template:**
        ```jsx
        'use client';
        import React, { useState, useEffect } from 'react';
        import axios from 'axios';

        export default function [FeatureName]Page() {
            const [items, setItems] = useState([]);

            useEffect(() => {
                const fetchItems = async () => {
                    try {
                        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/[featureName]s`);
                        setItems(res.data.data);
                    } catch (error) {
                        console.error('Error fetching data:', error);
                    }
                };
                fetchItems();
            }, []);

            return (
                <div className="min-h-screen bg-gray-50 p-6">
                    <h1 className="text-3xl font-bold mb-6">[FeatureName]s</h1>
                    {/* Render items here */}
                </div>
            );
        }
        ```

7.  **Verify**
    *   Run the server and client.
    *   Visit the new page.
    *   Verify data fetching work.
