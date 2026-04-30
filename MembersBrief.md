# StartupNest Team — Member Contribution Briefs

This document explains the individual contributions of each team member for Monday's milestone. It is written in simple English to help beginners understand the role of each file and the logic used.

---

## 👤 Member 1: The Systems Architect (Backend Foundation)

**Files Worked On:**

- `nodeapp/controllers/startupProfileController.js` (Core CRUD logic)
- `nodeapp/routers/startupProfileRoutes.js` (Route mapping)
- `nodeapp/index.js` (Route mounting)

**What they did:**
Member 1 built the "skeleton" of the startup profile system. They defined how the server should react when someone wants to create a profile or see a list of profiles.

**Key Concepts Used:**

- **Controllers**: Functions that handle the incoming requests and send back responses.
- **Routers**: The logic that tells the server "if someone visits this URL, run this specific controller function."
- **Middleware**: Security checks (like checking if a user is a Mentor) that run before the main logic.
- **Mounting**: Attaching all the startup routes to the main app so they are accessible at `/api/startup`.

**Work Flow:**

1. Created the `createProfile` and `getAllProfiles` functions.
2. Mapped these functions to URLs in the router.
3. Connected the router to the main server in `index.js`.

---

## 👤 Member 2: The API Logic Developer (Advanced Backend)

**Files Worked On:**

- `nodeapp/controllers/startupProfileController.js` (Advanced logic)
- `nodeapp/models/StartupProfile.js` (Database schema & validation)

**What they did:**
Member 2 added the "intelligence" to the backend. They made sure the database is secure and that the data coming out is organized.

**Key Concepts Used:**

- **Mongoose Schema**: A set of rules for what data can be stored (e.g., "Funding cannot be negative").
- **Regex (Regular Expressions)**: A tool used to search for keywords inside long descriptions.
- **Server-Side Pagination**: Only sending 20 items at a time to the frontend to keep the app fast.
- **CRUD (Update & Delete)**: Logic to modify or remove records while making sure only the owner can do it.

**Work Flow:**

1. Updated the database model with `min: 0` constraints.
2. Added search and pagination filters to the list logic.
3. Built the `updateProfile` and `deleteProfile` functions with security checks.

---

## 👤 Member 3: The State & Routing Manager (Frontend Integration)

**Files Worked On:**

- `reactapp/src/services/startupService.js` (API communication)
- `reactapp/src/slices/startupSlice.js` (Redux state)
- `reactapp/src/App.jsx` (Global routing & Layouts)

**What they did:**
Member 3 connected the frontend to the backend and managed how users move through the app.

**Key Concepts Used:**

- **Axios**: A library used to send "messages" (API calls) to the Node.js server.
- **Redux Slices**: A way to store data (like the list of startups) so every component can access it easily.
- **Layout Pattern**: Creating a "frame" (Navbar + Content) so the menu stays the same while pages change.
- **Dynamic Routing**: Showing different navbars based on whether the user is a Mentor or Entrepreneur.

**Work Flow:**

1. Built the service layer to talk to the backend.
2. Set up Redux to remember the data fetched from the API.
3. Created the `MainLayout` and `RootRoute` to handle the app's navigation logic.

---

## 👤 Member 4: The UI/UX Specialist (Reusable Components & Branding)

**Files Worked On:**

- `reactapp/src/Components/LandingPage.jsx` (Marketing page)
- `reactapp/src/Components/Reusable/Table.jsx`, `Pagination.jsx`, `Loader.jsx`
- `reactapp/src/Components/Reusable/Input.jsx` (Enhanced with props)
- `reactapp/src/Components/HomePage.jsx` (Layout cleanup)

**What they did:**
Member 4 made the app look professional and created tools that other developers can reuse to save time.

**Key Concepts Used:**

- **Reusable Components**: Creating a generic "Table" or "Button" so we don't have to rewrite the code for every page.
- **Hero Sections**: Large, eye-catching parts of the page that tell the user what the app is about.
- **Grid Layouts**: Using Tailwind CSS to make the page look good on both phones and computers.
- **Props**: Passing data into a component to change how it looks (e.g., changing a button's color).

**Work Flow:**

1. Built the foundational components like Tables and Loaders.
2. Designed the premium Landing Page for new users.
3. Cleaned up the Home Page to work with the new layout system.

---

## 👤 Member 5: The Feature Developer (Interactive UI)

**Files Worked On:**

- `reactapp/src/MentorComponents/StartupProfileForm.jsx` (The main form)
- `reactapp/src/MentorComponents/ViewStartupProfiles.jsx` (Mentor's Dashboard)
- `reactapp/src/EntrepreneurComponents/ViewStartupOpportunities.jsx` (Entrepreneur's Browser)
- `reactapp/src/MentorComponents/MentorNavbar.jsx` & `EntrepreneurNavbar.jsx` (Dropdowns)
- `reactapp/src/Components/Reusable/ConfirmDialog.jsx` & `EmptyState.jsx`

**What they did:**
Member 5 built the actual pages where users do their work. They focused on making the app interactive and helpful.

**Key Concepts Used:**

- **Form Handling**: Taking what a user types and sending it to the server.
- **Debouncing**: Waiting for a user to stop typing before starting a search to save server power.
- **Conditional Rendering**: Showing "Edit" text if updating, and "Create" text if adding new.
- **Hover Menus**: Using Tailwind's `group-hover` to show dropdowns without needing extra Javascript.

2. Created the dynamic Form for adding and editing profiles.
3. Added the hover dropdowns and confirmation popups to make the app feel premium.

---

## 🗓️ TUESDAY: Startup Submissions & Shortlisting

---

## 👤 Member 1: The Systems Architect (Backend Foundation)

**Files Worked On:**

- `nodeapp/routers/startupSubmissionRoutes.js` (Route management)
- `reactapp/src/App.jsx` (Global navigation logic)
- `nodeapp/controllers/startupSubmissionController.js` (Pagination standards)

**What they did:**
Member 1 focused on the "plumbing" of the new submission system. They made sure that the new pages we created have proper "addresses" (URLs) on the server and that the app knows exactly where to send users after they log out.

**Functions & Logic:**

- **Route Mapping**: In `startupSubmissionRoutes.js`, they registered the `GET /my-submissions` and `DELETE /delete/:id` paths. This tells the server: "If an Entrepreneur wants to see their pitches or delete one, use these specific logic functions."
- **Redirect Logic**: In `App.jsx`, they updated the `ProtectedRoute`. Now, if a user is not logged in, they are sent back to the Landing Page (`/`) instead of a boring login screen, making the app feel more modern.
- **Pagination Sync**: They updated the controllers to ensure that every list in the app shows exactly 10 items per page, keeping the user experience consistent everywhere.

**Key Concepts Used:**

- **Redirection**: Automatically sending a user to a different page based on whether they are logged in or not.
- **URL Routing**: Creating the digital paths that connect the frontend buttons to the backend database.

**Work Flow:**

1. Defined the new digital paths for Entrepreneur submissions.
2. Improved the security rules to redirect unauthorized users to the Landing Page.
3. Synchronized the "10 items per page" rule across the entire backend.

---

## 👤 Member 2: The API Logic Developer (Advanced Backend)

**Files Worked On:**

- `nodeapp/controllers/startupSubmissionController.js` (Submission logic)

**What they did:**
Member 2 built the "brain" of the submission system. They wrote the complex rules that decide who can see what, how to search through pitches, and how to protect the mentors' funding limits.

**Functions & Logic:**

- **`getEntrepreneurSubmissions`**: This function fetches all ideas submitted by the logged-in user. It uses **Regex** to let users search for categories (like "Fintech") and **Pagination** to show 10 at a time.
- **`deleteEntrepreneurSubmission`**: A security-heavy function that deletes a pitch. It first checks if the `userId` of the pitch matches the ID of the person trying to delete it. This prevents someone from deleting another person's work.
- **`createSubmission` (Validation)**: They added a check that compares the money an entrepreneur asks for (`expectedFunding`) against the mentor's maximum limit. If the entrepreneur asks for too much, the server sends back an error message.

**Key Concepts Used:**

- **Case-Insensitive Regex**: A search tool that finds words regardless of whether they are CAPITALIZED or lowercase.
- **Ownership Validation**: A security check that ensures a user can only modify or delete data that belongs to them.
- **Backend Validation**: Double-checking the data on the server to make sure it's correct, even if someone tries to bypass the frontend rules.

**Work Flow:**

1. Built the searchable list for entrepreneurs to see their pitch history.
2. Created the secure delete function to allow users to manage their submissions.
3. Implemented the "Funding Limit" guard to protect mentor interests.

---

## 👤 Member 3: The State & Routing Manager (Frontend Integration) - **faiz**

**Files Worked On:**
- `reactapp/src/services/startupSubmissionService.js` (API communication layer)
- `reactapp/src/App.jsx` (Central routing and navigation logic)
- `reactapp/src/EntrepreneurComponents/ViewStartupOpportunities.jsx` (Navigation state management)

**What they did:**
Member 3 (faiz) acted as the "Digital Bridge," ensuring that information moves smoothly between the user's screen and the server. They were responsible for updating the communication protocols (services) and ensuring that when a user moves from one page to another, all their important data (like the mentor's funding limit) travels with them.

**Exact Code & Logic Contributions:**

#### 1. `reactapp/src/services/startupSubmissionService.js`
Faiz upgraded the API service to handle the new search and deletion features for entrepreneurs.
- **Lines 30-37 (`getMySubmissions`)**: 
  - **What he did**: Updated the function to accept a `params` object.
  - **Why**: This allows the frontend to send the current page number and search keyword to the backend.
  - **Code**: `getMySubmissions: async (params = {}) => { ... await api.get('/submission/my-submissions', { params }); }`
- **Lines 43-50 (`deleteMySubmission`)**:
  - **What he did**: Created a brand new function to handle submission removal.
  - **Why**: To allow entrepreneurs to withdraw their pitches directly from their dashboard.
  - **Code**: `deleteMySubmission: async (id) => { ... await api.delete(`/submission/delete/${id}`); }`

#### 2. `reactapp/src/App.jsx`
Faiz managed the registration of the new features in the main application skeleton.
- **Line 30**: Added the import for the new `MySubmissions` component.
- **Line 151**: Registered the secure route for the submissions dashboard.
  - **Code**: `<Route path="/entrepreneur/my-submissions" element={<MySubmissions />} />`
  - **Logic**: Placed this inside the `ProtectedRoute` for Entrepreneurs to ensure only logged-in entrepreneurs can see it.

#### 3. `reactapp/src/EntrepreneurComponents/ViewStartupOpportunities.jsx`
Faiz optimized how data is passed during navigation to enable real-time validation.
- **Lines 88-91 (`handleSubmitIdea`)**:
  - **What he did**: Modified the navigation function to accept `fundingLimit` as a third parameter.
  - **Logic**: It now bundles the `profileId`, `category`, and `fundingLimit` into the `state` object of the `navigate` function.
  - **Code**: `navigate('/submit-idea', { state: { profileId, category, fundingLimit } });`
- **Line 126**: Updated the "Submit Idea" button's click handler to actually pass that `fundingLimit` from the list view to the function above.

**Key Concepts Used:**
- **Navigation State**: A way to "hand over" data from one page to the next without saving it in a database or making a new API call.
- **Axios Params**: Attaching extra info (like `page=2`) to the end of a URL automatically so the backend knows what to filter.
- **Route Registration**: Telling the React application that a specific web address (URL) now corresponds to a specific visual component.

**Work Flow:**
1. Upgraded the **Service Layer** so the frontend can "talk" to the new backend endpoints.
2. Wired up the **Routing** so the new "My Submissions" page is accessible and secure.
3. Implemented **State Passing** logic so the submission form knows exactly what the mentor's funding limit is before the user even starts typing.

---

## 👤 Member 4: The UI/UX Specialist (Reusable Components & Layouts)

**Files Worked On:**

- `reactapp/src/Components/Reusable/ConfirmDialog.jsx` (Modal enhancements)
- `reactapp/src/Components/Reusable/Button.jsx` (Alignment fixes)
- `reactapp/src/Components/HomePage.jsx` (Full redesign)
- `reactapp/src/MentorComponents/MentorNavbar.jsx` (Visual balancing)

**What they did:**
Member 4 was the "interior designer." They fixed alignment issues that made the app look messy and redesigned the Home Page to make a stunning first impression.

**Functions & Logic:**

- **Modal Flexibility**: They updated `ConfirmDialog.jsx` with a `showCancel` property. This allows us to use the same popup for "Success" messages (where you only need an "OK" button) and "Confirm" messages (where you need "Yes" and "No").
- **Layout Redesign**: In `HomePage.jsx`, they used `h-[calc(100vh-80px)]` and `overflow-hidden`. This is a math trick that makes the page take up exactly the remaining screen space, preventing the user from needing to scroll.
- **Visual Alignment**: They adjusted the "Badges" (the username display) and the "Logout" buttons in the top bar so they are perfectly centered with each other.

**Key Concepts Used:**

- **Viewport Units (vh)**: A way to measure sizes based on the user's screen height (100vh = full screen).
- **Flexbox Alignment**: Using CSS tools like `items-center` to make sure text and icons sit perfectly on the same horizontal line.
- **Optional Props**: Adding settings to a component (like `cancelText`) that have a default value but can be changed if needed.

**Work Flow:**

1. Upgraded the reusable Dialog component to support success messages.
2. Fixed the full-width button alignment in the Login and Signup forms.
3. Redesigned the Home Page to be a beautiful, non-scrollable dashboard.

---

## 👤 Member 5: The Feature Developer (Interactive UI)

**Files Worked On:**

- `reactapp/src/EntrepreneurComponents/SubmitIdea.jsx` (Submission form)
- `reactapp/src/EntrepreneurComponents/MySubmissions.jsx` (Submissions dashboard)
- `reactapp/src/EntrepreneurComponents/ViewStartupOpportunities.jsx` (Browse logic)
- `reactapp/src/MentorComponents/StartupSubmissions.jsx` (Mentor dashboard)

**What they did:**
Member 5 built the "working parts" of the new features. They created the forms where entrepreneurs enter their data and the dashboard where mentors review it.

**Functions & Logic:**

- **Real-time Validation**: In `SubmitIdea.jsx`, they wrote logic that checks the "Funding" field as the user types. If the number is too high, it shows an error message and **disables** the Submit button so the user can't make a mistake.
- **"Already Applied" Logic**: In the browse list, they added a check that compares the list of startups with the user's previous submissions. If they've already applied to one, the button turns gray and says "Already Applied."
- **Action Refinement**: In `StartupSubmissions.jsx`, they changed the mentor's options. Now, a mentor can only View, Shortlist, or Reject. They also made sure the "Reject" option stays available even after a mentor shortlists someone.

**Key Concepts Used:**

- **State Syncing**: Sharing information between two different pages (like knowing which items were submitted while on the browse page).
- **Inline Validation**: Showing an error message right next to the input field the moment a user makes a mistake.
- **PDF Viewing**: Using `window.open` to let users view their uploaded documents in a new browser tab.

**Work Flow:**

1. Built the smart submission form with funding guards.
2. Created the "My Submissions" dashboard for entrepreneurs to track their pitches.
3. Refined the Mentor's dashboard to focus on the Shortlist/Reject workflow.
