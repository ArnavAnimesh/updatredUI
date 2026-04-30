# Project Work Distribution Plan

## Saturday - Sunday (Completed Work):

#### **👤 Member 1 - Backend Systems Architect:** disha

- `nodeapp/index.js` (server setup, middleware, DB connection, route mounting)
- `nodeapp/models/userModel.js` (user schema with regex validation, secret question)
- `nodeapp/authUtils.js` (generateToken, validateToken, checkRole)
- `nodeapp/.env` (environment config)

#### **👤 Member 2 - Backend API Logic Developer:** animesh

- `nodeapp/controllers/userController.js` (signup, login, forgot password controllers)
- `nodeapp/routers/userRouter.js` (all user auth routes)

#### **👤 Member 3 - Frontend State and Routing Manager:** faiz

- `reactapp/src/store.js` (Redux store setup)
- `reactapp/src/slices/userSlice.js` (auth state, role, username)
- `reactapp/src/App.jsx` (AuthRoute, ProtectedRoute, cookie rehydration on reload)
- `reactapp/src/apiConfig.js` (Axios base config)

#### **👤 Member 4 - Frontend UI/UX Specialist:** surbhi

- `reactapp/src/Components/Reusable/Input.jsx` (reusable input component)
- `reactapp/src/Components/Reusable/Button.jsx` (reusable button component)
- `reactapp/src/Components/HomePage.jsx` (hero section with background image and contact us section)
- `reactapp/src/MentorComponents/MentorNavbar.jsx` (mentor role navbar with logout confirm)
- `reactapp/src/EntrepreneurComponents/EntrepreneurNavbar.jsx` (entrepreneur role navbar with logout confirm)

#### **👤 Member 5 - Frontend Feature Developer:** prashant

- `reactapp/src/Components/Login.jsx` (login form, regex validation, redux dispatch, cookie, role redirect)
- `reactapp/src/Components/Signup.jsx` (signup form, regex validation, redirect to home on success)
- `reactapp/src/Components/ForgotPassword.jsx` (secret answer check, password reset, redirect to login)

---

## Monday: Startup Profiles & Reusable Components (COMPLETED)

#### **👤 Member 1 - Backend Systems Architect:** faiz

- `nodeapp/controllers/startupProfileController.js` (Implemented `createProfile` and `getAllProfiles` base logic)
- `nodeapp/routers/startupProfileRoutes.js` (Mounted all startup endpoints)
- `nodeapp/index.js` (Registered startup routes at `/api/startup`)

#### **👤 Member 2 - Backend API Logic Developer:** surbhi

- `nodeapp/controllers/startupProfileController.js` (Added case-insensitive regex search, server-side pagination, and sort)
- `nodeapp/controllers/startupProfileController.js` (Implemented `updateProfile` and `deleteProfile` with ownership checks)
- `nodeapp/models/StartupProfile.js` (Applied `min: 0` constraints and validation error messages)

#### **👤 Member 3 - Frontend State and Routing Manager:** animesh

- `reactapp/src/services/startupService.js` (Built full CRUD Axios service: Create, Get All, Update, Delete)
- `reactapp/src/slices/startupSlice.js` (Managed profile list state, loading, and pagination metadata)
- `reactapp/src/App.jsx` (Refactored `MainLayout` to dynamically render role-based navbars)
- `reactapp/src/App.jsx` (Implemented `RootRoute` logic to switch between Landing and Dashboard)

#### **👤 Member 4 - Frontend UI/UX Specialist:** disha

- `reactapp/src/Components/Reusable/Table.jsx`, `Pagination.jsx`, `Loader.jsx` (Created core data display library)
- `reactapp/src/Components/HomePage.jsx` (Optimized layout by removing internal navbar imports)
- `reactapp/src/Components/Reusable/Input.jsx` (Enhanced to support standard HTML attributes like `min`)
- `reactapp/src/Components/LandingPage.jsx` (Designed and implemented the premium public marketing page)

#### **👤 Member 5 - Frontend Feature Developer:** prashant

- `reactapp/src/MentorComponents/StartupProfileForm.jsx` (Created dynamic form for both listing and editing)
- `reactapp/src/MentorComponents/ViewStartupProfiles.jsx` (Built searchable table with edit/delete actions)
- `reactapp/src/EntrepreneurComponents/ViewStartupOpportunities.jsx` (Created the entrepreneur browsing interface)
- `reactapp/src/MentorComponents/MentorNavbar.jsx` & `EntrepreneurNavbar.jsx` (Implemented hover-based navigation dropdowns)
- `reactapp/src/Components/Reusable/ConfirmDialog.jsx`, `Modal.jsx`, `EmptyState.jsx` (Added interactive UI feedback)

---

## Tuesday: Startup Submissions & Shortlisting (COMPLETED)

#### **👤 Member 1 - Backend Systems Architect:** disha

- `nodeapp/routers/startupSubmissionRoutes.js` (Mounted `GET /my-submissions` and entrepreneur `DELETE` routes)
- `reactapp/src/App.jsx` (Configured `ProtectedRoute` to redirect to landing page `/` for better UX)
- `nodeapp/controllers/startupSubmissionController.js` (Ensured consistent 10-record pagination across all submission endpoints)

#### **👤 Member 2 - Backend API Logic Developer:** prashant

- `nodeapp/controllers/startupSubmissionController.js` (Enhanced `getEntrepreneurSubmissions` with regex-based category search)
- `nodeapp/controllers/startupSubmissionController.js` (Implemented `deleteEntrepreneurSubmission` with strict ownership validation)
- `nodeapp/controllers/startupSubmissionController.js` (Added server-side funding limit validation vs mentor profile settings)

#### **👤 Member 3 - Frontend State and Routing Manager:** faiz

- `reactapp/src/services/startupSubmissionService.js` (Updated `getMySubmissions` for pagination/search and added `deleteMySubmission`)
- `reactapp/src/App.jsx` (Integrated `MySubmissions` component and managed navigation state)
- `reactapp/src/EntrepreneurComponents/ViewStartupOpportunities.jsx` (Synchronized submission state to handle button disabling)

#### **👤 Member 4 - Frontend UI/UX Specialist:** animesh

- `reactapp/src/Components/Reusable/ConfirmDialog.jsx` (Added `showCancel` and `cancelText` props for single-button 'Success' modals)
- `reactapp/src/Components/Reusable/Button.jsx` (Fixed alignment by restoring `w-full` and optimizing login/signup layouts)
- `reactapp/src/Components/HomePage.jsx` (Redesigned as a non-scrollable, split-screen dashboard using `h-[calc(100vh-80px)]`)
- `reactapp/src/MentorComponents/MentorNavbar.jsx` & `EntrepreneurNavbar.jsx` (Balanced button padding and badge alignment)

#### **👤 Member 5 - Frontend Feature Developer:** surbhi

- `reactapp/src/EntrepreneurComponents/SubmitIdea.jsx` (Implemented success modal, dynamic label limit display, and inline funding validation)
- `reactapp/src/EntrepreneurComponents/MySubmissions.jsx` (Created the full dashboard with search, PDF viewer, and profile detail modal)
- `reactapp/src/EntrepreneurComponents/ViewStartupOpportunities.jsx` (Implemented "Already Applied" logic to prevent duplicate submissions)
- `reactapp/src/MentorComponents/StartupSubmissions.jsx` (Refined Mentor actions to strictly allow View, Shortlist, and Reject only)

---

## Wednesday: Admin Dashboard & Advanced Filtering

_To be filled after previous day is complete._

---

## Thursday: Integration, Testing & Final Polish

_To be filled after previous day is complete._

---

## 🛠️ Appendix: Technical Workflow Details

### 1. The "Browse Opportunities" Flow (`ViewStartupOpportunities.jsx`)
- **Initialization**: Page asks the server for Mentor Profiles and the User's submission history simultaneously.
- **Debounce Logic**: A 500ms timer waits for the user to stop typing before sending a search query to the backend.
- **Button Locking**: The component compares the list of profiles with the user's history; if a match is found, the button is disabled and labeled "Already Applied."
- **Data Suitcase (Navigation State)**: When "Submit Idea" is clicked, the app "packs" the `profileId`, `category`, and `fundingLimit` into a hidden state object and carries it to the next page.

### 2. The "Digital Post Office" Flow (`startupSubmissionService.js`)
- **POST (Create)**: Sends new ideas + PDF files. Uses `multipart/form-data` to handle file uploads correctly.
- **GET (Retrieve)**: Fetches pitch history or mentor inboxes. Supports pagination (10 per page) and search parameters.
- **PUT (Update)**: Specifically used by mentors to change a pitch status to "Shortlisted" or "Rejected."
- **DELETE (Remove)**: Used by both entrepreneurs and mentors to withdraw or clean up submission records.
- **Error Handling**: Every call uses a `try-catch` block to ensure that if a request fails, the user gets a helpful notification instead of a broken page.
