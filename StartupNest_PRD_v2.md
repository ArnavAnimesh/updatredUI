# PRT — StartupNest

**Version:** 3.0.0  
**Date:** 2026-04-26  
**Stack:** MongoDB · Express · React · Node.js (MERN) · Redux Toolkit · Tailwind CSS  
**Basis:** Updated SME requirements + existing StartupNest PRD/SRS + code style reference

---

## 1. Purpose

This document defines the Product Requirement Template (PRT) for **StartupNest** after the SME change request. It supersedes the earlier functional expectations wherever there is a conflict.

The application is a full-stack MERN platform for **Mentors** and **Entrepreneurs**. Mentors create startup opportunity profiles and review submissions. Entrepreneurs browse those opportunities and submit startup ideas. The system must be secure, role-aware, responsive, reusable, and built in a beginner-friendly code style.

The baseline PRD already defines the core two-role product structure, the MERN stack, and the mentor/entrepreneur flows. The updated SME requirements add strict frontend/backend debouncing, server-side pagination, API-driven search, regex validation, toast-based errors, reusable UI components, Redux Toolkit, and strict authorization rules. fileciteturn0file2 fileciteturn0file1

---

## 2. Product Goals

1. Deliver a clean modern UI with Tailwind CSS.
2. Enforce authentication and authorization for every protected route.
3. Keep lists fast with server-side pagination and backend search.
4. Reduce unnecessary requests using debouncing on both frontend and backend.
5. Keep code understandable for beginners through a consistent, verbose, reusable style.
6. Avoid fragile logic by validating every input and handling every async operation with try/catch.
7. Reuse shared UI and logic components instead of duplicating code.
8. Store only the JWT token in cookies; no other user data should be persisted in local storage.

---

## 3. Users and Roles

### 3.1 Roles

| Role         | Responsibilities                                                                                                                        |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Mentor       | Register, login, manage startup profiles, view startup submissions, shortlist/reject submissions, reset password                        |
| Entrepreneur | Register, login, browse opportunities, submit ideas, view own submissions, update profile details allowed by the system, reset password |

### 3.2 Authorization Rules

- Every protected API must require a valid JWT.
- Every role-specific API must verify the role before executing business logic.
- Unauthorized access must return clear HTTP responses:
  - `401` for missing or invalid authentication
  - `403` for valid authentication but forbidden role
- Frontend route protection must match backend enforcement. Client-side checks are not enough.

The original code style reference already uses JWT middleware, role checks, and controller-level try/catch patterns. Those patterns remain the baseline, but the new implementation must be stricter and more complete. fileciteturn0file0 fileciteturn0file1

---

## 4. Scope

### 4.1 Included

- Authentication and authorization
- Registration and login
- Forgot password using a static secret question
- Role-based dashboards
- Mentor startup profile management
- Entrepreneur opportunity browsing and startup idea submission
- Submission review flow
- Search, filter, sort, pagination
- Confirmation prompts for destructive actions and updates
- Toast notifications
- Reusable loading screen, input fields, table layout, modal, confirm dialog, and empty state components
- Redux Toolkit state management
- Server-side processing for complex queries
- Full regex validation on client and server

### 4.2 Not Included

- Payments
- External email delivery
- Social login
- Multi-language support
- Offline mode
- Real-time chat
- Push notifications

---

## 5. Functional Requirements

## 5.1 Authentication Module

### 5.1.1 Register

#### Fields

- `userName`
- `email`
- `mobile`
- `password`
- `confirmPassword`
- `role`
- `secretQuestionAnswer`

#### Rules

- `userName`: required, trimmed, 3–50 chars, alphanumeric + underscore only
- `email`: required, valid email regex, unique
- `mobile`: required, exactly 10 digits, unique
- `password`: required, minimum length, strong pattern per agreed regex
- `confirmPassword`: must match password
- `role`: required, must be either Mentor or Entrepreneur
- `secretQuestionAnswer`: required for forgot-password flow

#### Behavior

- Validate on every change and again on submit.
- Block submission if any validation fails.
- Show inline field errors and a toast for global failure.
- Hash password before storage.
- Store only the JWT in cookie after login; do not store profile data in localStorage.

### 5.1.2 Login

#### Fields

- `email`
- `password`

#### Behavior

- Validate with regex before API call.
- Submit to backend only after debounced input stabilization if login includes live validation or assistance checks.
- On success:
  - set auth state in Redux Toolkit
  - store JWT in cookie
  - route user to the correct dashboard based on role
- On failure:
  - show toast error
  - keep form state intact

### 5.1.3 Forgot Password

#### Requirement

A static secret question must be used as the key to reset the password.

#### Flow

1. User opens Forgot Password page.
2. User enters email.
3. System checks the account and shows the secret question.
4. User answers the secret question.
5. If the answer matches, user can set a new password.
6. Password is updated after validation.
7. User is redirected to login.

#### Rules

- Secret question text can be static.
- Answer comparison must be server-side.
- Password reset must require full regex validation.
- The reset flow must use try/catch at every async step.

### 5.1.4 Logout

- Show confirmation prompt before logout.
- On confirm, clear Redux auth state and remove JWT cookie.
- Do not leave stale role state in memory.

---

## 5.2 Role-Based Authentication and Authorization

### 5.2.1 Backend

- `validateToken` verifies the JWT.
- `checkRole` or equivalent middleware checks allowed role.
- Middleware must be applied at route level.
- Controllers must not assume request identity without middleware verification.

### 5.2.2 Frontend

- Use protected routes.
- Block unauthorized pages before rendering them.
- Redirect unauthenticated users to login.
- Redirect forbidden roles to an unauthorized page.

---

## 5.3 Mentor Module

### 5.3.1 Startup Profile Management

Mentors can:

- create startup profiles
- view their own profiles
- update profiles
- delete profiles
- search profiles
- paginate through profile lists

#### List Requirements

- 20 records per page
- server-side pagination
- backend search only through API hit
- debounced search input on frontend
- reusable table component
- loading screen during fetch

#### Validation

- use regex for text fields where appropriate
- numeric fields must reject empty, NaN, negative, and out-of-range values
- update and delete must show confirmation prompts

### 5.3.2 Startup Submission Review

Mentors can:

- view all submissions
- search by keyword
- filter by status
- sort by supported fields
- approve/shortlist
- reject
- open detail view

#### Rules

- delete and update actions require confirmation prompts
- status change actions require confirmation before API call
- all actions must show proper success/error toast messages
- all list pages must use pagination with 20 records per page

---

## 5.4 Entrepreneur Module

### 5.4.1 Opportunity Browsing

Entrepreneurs can:

- view mentor startup profiles
- search through opportunities by API
- paginate results
- use debounced search on frontend

### 5.4.2 Submission Management

Entrepreneurs can:

- create startup submissions
- view own submissions
- update allowed fields where supported
- delete submissions only when allowed by business rules

#### Rules

- show confirmation before update or delete where applicable
- server-side validation is mandatory
- submit button should be disabled or blocked if the form is invalid

---

## 6. Search, Debouncing, Pagination, and Server-Side Processing

### 6.1 Debouncing

Debouncing is mandatory in both layers:

#### Frontend

- Search inputs must wait before firing API requests.
- Use a custom debounce hook or a debounced state pattern.
- The displayed value can change instantly, but the API-triggering value must be delayed.

#### Backend

- Backend search endpoints must not be written as naive full-collection scans.
- Use query throttling, request limiting, indexed fields, and query normalization where needed.
- For expensive endpoints, apply server-side query guards and efficient filters.

### 6.2 Pagination

#### Rules

- Every records-list view must show exactly 20 records per page.
- Use server-side pagination for all list APIs.
- API responses must include:
  - current page
  - page size
  - total records
  - total pages
  - data array
- Pagination controls must disable previous/next at boundaries.
- Search and filter changes must reset pagination to page 1.

### 6.3 Advanced Search

- Search must be performed through backend API calls.
- Search should support multiple fields where relevant.
- Complex filters must be processed on the server.
- Regex-based search is required for supported text fields.
- Queries must remain safe and validated.

### 6.4 Server-Side Processing

For complex queries:

- sort on the server
- filter on the server
- paginate on the server
- calculate totals on the server
- avoid sending entire collections to the frontend

---

## 7. Validation Requirements

### 7.1 Regex Validation

- Regex validation is mandatory for all text inputs where format matters.
- Validation must exist in the UI and again in the API.
- Invalid values must not reach the controller business logic.

### 7.2 Required Validation Rules

- Empty fields: reject
- Min/max length: enforce
- Number range: enforce
- Email format: enforce
- Mobile number format: enforce
- Role enum: enforce
- Password strength: enforce
- File type and size: enforce where file upload exists

### 7.3 Edge Case Handling

No edge cases should remain unhandled.

This means handling:

- empty API responses
- null or undefined values
- invalid IDs
- duplicate records
- unauthorized requests
- expired tokens
- network failure
- server failure
- invalid filters
- invalid pagination values
- invalid sort parameters
- duplicate submission attempts
- double-clicks on delete/update actions

---

## 8. Reusable Component Requirements

The UI must be built around reusable components. Reuse should be preferred over duplication.

### 8.1 Shared Components

- Loader
- InputField
- SelectField
- TextAreaField
- PasswordField
- Button
- SearchBar
- Table
- TableRow
- Pagination
- Modal
- ConfirmDialog
- ToastContainer
- EmptyState
- ErrorState
- ProtectedRoute

### 8.2 Reuse Rules

- Do not hardcode repetitive inputs in individual pages.
- Do not duplicate loaders for each module.
- Do not duplicate table layout logic.
- Use props to make shared components flexible.
- Keep field labels, validation messages, and error rendering consistent.

---

## 9. State Management Requirements

### 9.1 Redux Toolkit Mandatory Use

Redux Toolkit must be used for:

- authentication state
- role state
- loading state
- global error state
- success toasts where needed
- pagination metadata where needed
- submission status state where needed

### 9.2 State Rules

- Do not store sensitive information in Redux beyond what is required in memory.
- Do not store non-token user data in localStorage.
- JWT token must be kept in cookie only.
- Derived values should be computed with `useMemo` where possible.
- Stable callback handlers should use `useCallback`.

### 9.3 Rendering Optimization

- Use `useMemo` to memoize filtered lists, derived columns, and computed config objects.
- Use `useCallback` for handlers passed to child components.
- Avoid unnecessary React re-renders.
- Avoid creating new inline objects and functions inside large mapped UI blocks unless unavoidable.

---

## 10. UI / UX Requirements

### 10.1 Styling

- Tailwind CSS only for styling.
- UI must feel modern, smooth, and consistent.
- Cards, forms, tables, tabs, and modals should share the same spacing and visual language.
- Use responsive layouts for mobile, tablet, and desktop.
- Prefer a clean neutral theme with one primary accent color.

### 10.2 UX Behavior

- Loading states must be visible.
- Errors must be clear and near the relevant field when possible.
- Global errors must use toast messages.
- Destructive actions must require confirmation.
- Success feedback must be immediate.
- Forms must preserve user input on validation failure.

### 10.3 Toast Messages

- Use toast for API errors, validation failures, and successful actions.
- Toasts should be brief and readable.
- Use consistent success/error/warning styles.

---

## 11. Code Style and Writing Pattern

This section defines the code writing pattern expected for this project.

The reference implementation already follows a simple `express` + `mongoose` + controller/router pattern and beginner-level React form structure with explicit state handling and try/catch blocks. The new code must keep that clarity but improve consistency, safety, and reuse. fileciteturn0file0

### 11.1 Backend Writing Pattern

#### Required pattern

- Use separate files for routes, controllers, models, middleware, utilities, and validators.
- Keep route files small.
- Keep business logic in controllers.
- Keep schema logic in models.
- Keep JWT and auth helpers in middleware or utility files.
- Wrap every async controller in try/catch.
- Return consistent JSON responses.

#### Preferred code shape

- Use descriptive names.
- Use multi-step logic instead of dense one-liners.
- Prefer readable variable names over short abbreviations.
- Validate parameters before DB access.
- Check for missing records before mutation.
- Handle duplicate data and bad IDs explicitly.
- Keep each function focused on one task.

#### Example style expectation

```js
const getAllStartupProfiles = async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 20,
      searchValue = "",
      sortBy = "createdAt",
      sortValue = "desc",
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(pageSize);
    const skip = (pageNumber - 1) * limitNumber;

    const query = {};

    if (searchValue) {
      const searchRegex = new RegExp(searchValue, "i");
      query.$or = [
        { category: searchRegex },
        { targetIndustry: searchRegex },
        { description: searchRegex },
      ];
    }

    const sortOrder = {};
    sortOrder[sortBy] = sortValue === "asc" ? 1 : -1;

    const totalRecords = await StartupProfile.countDocuments(query);
    const data = await StartupProfile.find(query)
      .sort(sortOrder)
      .skip(skip)
      .limit(limitNumber);

    return res.status(200).json({
      success: true,
      message: "Profiles fetched successfully",
      data,
      page: pageNumber,
      pageSize: limitNumber,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limitNumber),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
```

### 11.2 Frontend Writing Pattern

#### Required pattern

- Use functional components only.
- Keep state names obvious.
- Split big forms into reusable field components.
- Use controlled inputs.
- Keep handlers separated from render JSX where possible.
- Use `useMemo` and `useCallback` for optimization.
- Use `try/catch` around async service calls.
- Do not leave validation scattered across the render tree.

#### Preferred component shape

- One component for page layout
- One reusable hook for debounce
- One service file for API calls
- One slice per feature area where needed
- One shared component library for UI controls

#### Example style expectation

```jsx
const StartupProfileForm = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;

    setFormData((previousState) => ({
      ...previousState,
      [name]: value,
    }));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const validationErrors = validateStartupProfile(formData);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setIsSubmitting(true);
      await startupProfileService.create(formData);
      toast.success("Profile saved successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* shared field components here */}
    </form>
  );
};
```

### 11.3 What the code must avoid

- No comments inside code files.
- No compressed logic that is hard to read.
- No duplicated request logic across components.
- No direct localStorage use for user profile data.
- No unguarded API calls.
- No mutation without confirmation for delete/update actions.
- No magic numbers without named constants.

---

## 12. Backend Architecture Requirements

### 12.1 Folder Structure

```text
nodeapp/
  controllers/
  models/
  routers/
  middleware/
  validators/
  utils/
  logs/
  index.js
```

### 12.2 Backend Responsibilities

- `index.js`: server setup, middleware registration, DB connection, route mounting, error middleware
- `models/`: Mongoose schemas only
- `controllers/`: request handling, DB interaction, response generation
- `routers/`: endpoint mapping only
- `middleware/`: auth, role checks, validation helpers, rate limiting
- `validators/`: regex and schema validation rules
- `utils/`: helper functions such as token generation and debounce-safe query builders

### 12.3 Standard Backend Flow

1. Request enters router.
2. Middleware checks token.
3. Middleware checks role if required.
4. Validation middleware checks payload.
5. Controller runs inside try/catch.
6. Model query executes.
7. Response is returned in standardized JSON.
8. Errors are logged and surfaced through toast on the frontend.

---

## 13. Frontend Architecture Requirements

### 13.1 Folder Structure

```text
src/
  Components/
    Loader.jsx
    InputField.jsx
    SelectField.jsx
    Modal.jsx
    ConfirmDialog.jsx
    ToastMessage.jsx
    Pagination.jsx
    Table.jsx
  EntrepreneurComponents/
  MentorComponents/
  pages/
  redux/
    store.js
    slices/
  services/
  hooks/
  utils/
```

### 13.2 Frontend Flow

- Shared components live in `Components/`.
- Role-specific components live in `EntrepreneurComponents/` and `MentorComponents/`.
- API calls stay in service files.
- Redux Toolkit slices handle shared state.
- Validation logic stays in helper files or hooks.
- Debounce logic is a reusable custom hook.

---

## 14. API and Response Standards

### 14.1 Common Response Shape

```json
{
  "success": true,
  "message": "Action completed successfully",
  "data": {}
}
```

### 14.2 Error Response Shape

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

### 14.3 Required HTTP Codes

- `200` for successful reads and updates
- `201` for successful creates if used
- `400` for validation failures or bad input
- `401` for authentication failure
- `403` for role-based access denial
- `404` for resource not found
- `500` for unhandled server-side failure

---

## 15. Confirmation and Safety Rules

The following actions must always show confirmation before execution:

- delete
- update
- logout
- destructive status change
- password reset submission

The confirmation UI should use one shared reusable confirmation component.

---

## 16. Error Handling Rules

- Every async function must have try/catch.
- Every API error must show toast feedback.
- Every form error must show field-level validation.
- Every unexpected error must fall back to a safe error page or message.
- No handler should be left without validation.
- No route should be left without role checks when required.

---

## 17. Quality Bar

The implementation is considered acceptable only when all of the following are true:

- Role restriction is enforced on both frontend and backend.
- JWT is stored only in cookie.
- No sensitive data is written to localStorage.
- All list pages use 20-item pagination.
- All searches are debounced and API-driven.
- All validation is regex-based and duplicated on both client and server.
- All destructive actions require confirmation.
- All async code is wrapped in try/catch.
- Reusable components are used instead of copy-paste UI.
- The code remains readable for beginners.
- The UI is modern and responsive.

---

## 18. Final Notes

This PRT intentionally preserves the beginner-friendly structure visible in the reference code style while tightening the system into a more production-grade design. The original materials already establish the two-role StartupNest model, MongoDB schema-based backend, and React frontend component structure; this version expands those into a stricter implementation standard. fileciteturn0file2 fileciteturn0file1 fileciteturn0file0
