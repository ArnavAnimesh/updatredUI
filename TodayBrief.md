# StartupNest — Today's Technical Brief

This document provides a detailed breakdown of the work completed today. It explains how each file works, the logic applied across the stack, and the full end-to-end user journey.

---

## 1. File-by-File Breakdown

### **A. Backend (Node.js & MongoDB)**

#### **`nodeapp/models/StartupProfile.js`**
- **What it does:** Defines the "Blueprint" for a startup opportunity.
- **How it does it:** Uses Mongoose to specify exactly what fields a profile must have (Category, Description, Funding, Equity, etc.). It includes strict validation rules, such as `min: 0` for numbers and `minlength` for text, to ensure bad data never enters the database.

#### **`nodeapp/routers/startupProfileRoutes.js`**
- **What it does:** Acts as the "Post Office" for all profile-related requests.
- **How it does it:** Maps incoming URLs (like `/create`, `/all`, `/update/:id`) to the correct logic in the controller. It uses `validateToken` and `checkRole('Mentor')` middleware to ensure only logged-in mentors can create, update, or delete profiles.

#### **`nodeapp/controllers/startupProfileController.js`**
- **What it does:** The "Brain" of the backend. It contains the actual instructions for every action.
- **How it does it:**
    - **`createProfile`**: Takes user input, attaches the Mentor's ID, and saves it.
    - **`getAllProfiles`**: Handles the complex logic for **Server-Side Pagination** (showing 20 items at a time) and **API Search** (using Regex to find keywords in descriptions).
    - **`updateProfile` & `deleteProfile`**: Finds a specific record and modifies/removes it, but only after checking that the current user is the owner of that record.

---

### **B. Frontend (React & Redux)**

#### **`reactapp/src/App.jsx`**
- **What it does:** Manages the "Traffic Control" of the app.
- **How it does it:** 
    - Uses a `RootRoute` to check if a user is logged in. If yes, it sends them to `/home`; if no, it shows the `LandingPage`.
    - It uses a `MainLayout` that dynamically swaps the Top Navbar based on whether the user is a Mentor or an Entrepreneur.

#### **`reactapp/src/Components/LandingPage.jsx`**
- **What it does:** The public face of the website for new visitors.
- **How it does it:** Uses a premium design with Tailwind CSS to show a Hero section and feature cards. It provides clear "Sign In" and "Sign Up" paths.

#### **`reactapp/src/Components/HomePage.jsx`**
- **What it does:** The "Welcome Mat" for logged-in users.
- **How it does it:** Displays a beautiful hero image and contact information. It is wrapped by the `MainLayout` in `App.jsx`, so it always shows the correct navbar.

#### **`reactapp/src/MentorComponents/MentorNavbar.jsx` & `EntrepreneurNavbar.jsx`**
- **What it does:** Role-specific navigation.
- **How it does it:** Both use a **Hover-based Dropdown** pattern. Instead of separate links everywhere, we grouped "Startup Profiles" (for Mentors) and "Startup Ideas" (for Entrepreneurs) into clean menus that appear when you hover over them.

#### **`reactapp/src/MentorComponents/StartupProfileForm.jsx`**
- **What it does:** A "Two-in-One" form for adding or editing profiles.
- **How it does it:** It checks if it received "Profile Data" during navigation. If it did, it pre-fills the fields and changes the heading to "Update Profile". It also prevents negative numbers from being typed into the funding/equity boxes.

#### **`reactapp/src/MentorComponents/ViewStartupProfiles.jsx`**
- **What it does:** The Mentor's control panel.
- **How it does it:** Fetches a list of profiles from the API. It features a Search bar with **Debouncing** (waits for you to stop typing before searching) and buttons to Edit or Delete records.

#### **`reactapp/src/services/startupService.js`**
- **What it does:** The "Messenger" between React and the Backend.
- **How it does it:** Uses Axios to make `GET`, `POST`, `PUT`, and `DELETE` requests to the Node.js server.

---

## 2. Key Logic Applied

### **State Management (Redux)**
We use `startupSlice.js` to store the list of profiles globally. When a user searches or changes a page, Redux updates the state, and the UI automatically re-renders without a page refresh.

### **Validation Logic**
- **Frontend**: In `StartupProfileForm.jsx`, we check every field before the user clicks "Confirm". If a field is empty or a number is negative, we show a red error message and block the API call.
- **Backend**: Even if someone bypasses the frontend, the Mongoose model in `StartupProfile.js` will catch invalid data and return a `400 Bad Request` error.

### **Routing & Layouts**
We implemented a **Layout Pattern**. Instead of putting a Navbar in every single page, we defined them once in `App.jsx`. This makes the code cleaner and ensures the Navbar never "flickers" when you navigate between pages.

---

## 3. The Full End-to-End Flow

1.  **Visiting the Site**: A new user visits `localhost:3000/`. The `RootRoute` sees they aren't logged in and shows the **Landing Page**.
2.  **Signing In**: The user clicks "Sign In", enters their credentials, and the `userSlice` (Redux) marks them as `isAuthenticated`.
3.  **Redirection**: `App.jsx` sees they are now logged in and redirects them to `/home`.
4.  **Creating a Profile (Mentor)**:
    - The Mentor hovers over "Startup Profiles" in the Navbar and clicks "Add Profile".
    - They fill out the form. If they try to enter `-100` for funding, the form blocks it.
    - On clicking "Create", a **Confirm Dialog** pops up.
    - Once confirmed, `startupService` sends the data to the backend.
5.  **Managing Profiles**:
    - The Mentor goes to "View Profiles".
    - They see a table with 20 items. If they have more, they use the **Pagination** buttons at the bottom.
    - They type "FinTech" in the search bar. The app waits 500ms (Debounce) and then fetches only FinTech profiles.
6.  **Updating**:
    - They click "Edit" on a profile.
    - They are taken to the form, which is already filled with the old data.
    - They save changes, and a **Toast Notification** appears saying "Profile updated successfully!".
7.  **Logging Out**:
    - They click Logout, confirm the choice, and are sent back to the **Landing Page**.

---
**Document Status:** Finalized for Monday Milestone.
