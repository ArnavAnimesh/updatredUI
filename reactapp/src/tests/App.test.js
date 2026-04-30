import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import store from '../store';
import Login from '../Components/Login';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import Signup from '../Components/Signup';
import ErrorPage from '../Components/ErrorPage';
import HomePage from '../Components/HomePage';
import Navbar from '../Components/Reusable/Navbar';
import SubmitIdea from '../EntrepreneurComponents/SubmitIdea';
import ViewStartupOpportunities from '../EntrepreneurComponents/ViewStartupOpportunities';
import StartupProfileForm from '../MentorComponents/StartupProfileForm';
import StartupSubmissions from '../MentorComponents/StartupSubmissions';
jest.mock('axios');

// Setup QueryClient
const queryClient = new QueryClient();

describe('Login Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderLoginComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Login {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  
  test('frontend_login_component_renders_the_with_login_heading', () => {
    renderLoginComponent();

  
    const loginHeadings = screen.getAllByText(/Login/i);
    expect(loginHeadings.length).toBeGreaterThan(0);

  });


  test('frontend_login_component_displays_validation_messages_when_login_button_is_clicked_with_empty_fields', () => {
    renderLoginComponent();

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

   
});

describe('Signup Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderSignupComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Signup {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };
  test('frontend_signup_component_renders_with_signup_heading', () => {
    renderSignupComponent();

    const signupHeadings = screen.getAllByText(/Signup/i);
   expect(signupHeadings.length).toBeGreaterThan(0);

  });

  test('frontend_signup_component_displays_validation_messages_when_submit_button_is_clicked_with_empty_fields', () => {
    renderSignupComponent();

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    expect(screen.getByText('User Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Mobile Number is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(screen.getByText('Confirm Password is required')).toBeInTheDocument();
  });

  test('frontend_signup_component_displays_error_when_passwords_do_not_match', () => {
    renderSignupComponent();

    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password456' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });
});


describe('ErrorPage Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const renderErrorComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <ErrorPage {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };
  test('frontend_errorpage_component_renders_with_error_heading', () => {
    renderErrorComponent();
    const headingElement = screen.getByText(/Oops! Something Went Wrong/i);
    expect(headingElement).toBeInTheDocument();
  });

  test('frontend_errorpage_component_renders_with_error_content', () => {
    renderErrorComponent();
    const paragraphElement = screen.getByText(/Please try again later./i);
    expect(paragraphElement).toBeInTheDocument();
  });
});

describe('Home Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderHomeComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <HomePage {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  test('frontend_home_component_renders_with_heading_farmconnect', () => {
    renderHomeComponent();
    const headingElement = screen.getAllByText(/StartupNest/i);
    expect(headingElement.length).toBeGreaterThan(0);
  });

  test('frontend_home_component_renders_with_contact_us', () => {
    renderHomeComponent();
    const headingElement = screen.getAllByText(/Contact Us/i);
    expect(headingElement.length).toBeGreaterThan(0);
  });
});

describe('MentorNavbar Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderMentorNavbarComponent = (props = {}) => {
    const MENTOR_LINKS = [
        { label: 'Home', path: '/' },
        { 
            label: 'Startup Profiles', 
            subLinks: [
                { label: 'Add Profile', path: '/mentor/create-profile' },
                { label: 'View Profiles', path: '/view-profiles' }
            ] 
        },
        { label: 'Startup Submissions', path: '/startup-submissions' }
    ];
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Navbar role="Mentor" links={MENTOR_LINKS} {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  test('frontend_mentor_navbar_component_renders_with_home', () => {
    renderMentorNavbarComponent();
    const home = screen.getAllByText('Home');
    expect(home.length).toBeGreaterThan(0);
  });

  test('frontend_mentor_navbar_component_renders_with_startup_profiles', () => {
    renderMentorNavbarComponent();
    const profiles = screen.getAllByText('Startup Profiles');
    expect(profiles.length).toBeGreaterThan(0);
  });

  test('frontend_mentor_navbar_component_renders_with_logout', () => {
    renderMentorNavbarComponent();
    const logout = screen.getAllByText('Logout');
    expect(logout.length).toBeGreaterThan(0);
  });
});

describe('EntrepreneurNavbar Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderEntrepreneurNavbarComponent = (props = {}) => {
    const ENTREPRENEUR_LINKS = [
        { label: 'Home', path: '/' },
        { 
            label: 'Startup Ideas', 
            subLinks: [
                { label: 'Browse Mentors', path: '/mentor-opportunities' },
                { label: 'My Submissions', path: '/entrepreneur/my-submissions' }
            ] 
        }
    ];
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Navbar role="Entrepreneur" links={ENTREPRENEUR_LINKS} {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  test('frontend_entrepreneur_navbar_component_renders_with_home', () => {
    renderEntrepreneurNavbarComponent();
    const home = screen.getAllByText('Home');
    expect(home.length).toBeGreaterThan(0);
  });

  test('frontend_entrepreneur_navbar_component_renders_with_startup_ideas', () => {
    renderEntrepreneurNavbarComponent();
    const ideas = screen.getAllByText('Startup Ideas');
    expect(ideas.length).toBeGreaterThan(0);
  });

  test('frontend_entrepreneur_navbar_component_renders_with_logout', () => {
    renderEntrepreneurNavbarComponent();
    const logout = screen.getAllByText('Logout');
    expect(logout.length).toBeGreaterThan(0);
  });
});


describe('SubmitIdea Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderSubmitIdeaComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <SubmitIdea {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  test('frontend_submit_idea_component_displays_error_when_submitting_with_empty_fields', () => {
    renderSubmitIdeaComponent();

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    expect(screen.getByText('Market Potential is required')).toBeInTheDocument();
    expect(screen.getByText('Launch Year is required')).toBeInTheDocument();
    expect(screen.getByText('Funding Required is required')).toBeInTheDocument();
    expect(screen.getByText('Address is required')).toBeInTheDocument();
    expect(screen.getByText('Pitch Deck File is required')).toBeInTheDocument();
  });

  test('frontend_submit_idea_component_renders_with_submit_your_startup_idea_heading', () => {
    renderSubmitIdeaComponent();

    const heading = screen.getByText('Submit Your Startup Idea');
    expect(heading).toBeInTheDocument();
  });

  test('frontend_submit_idea_component_renders_with_logout', () => {
    renderSubmitIdeaComponent();

    const logout = screen.getAllByText('Logout');
    expect(logout.length).toBeGreaterThan(0);
  });
});

describe('ViewStartupOpportunities Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderViewStartupOpportunitiesComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <ViewStartupOpportunities {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  test('frontend_view_startup_opportunities_component_renders_with_table', () => {
    renderViewStartupOpportunitiesComponent();

    const tableElement = screen.getByRole('table');
    expect(tableElement).toBeInTheDocument();
  });

  test('frontend_view_startup_opportunities_component_renders_with_logout', () => {
    renderViewStartupOpportunitiesComponent();

    const logout = screen.getAllByText('Logout');
    expect(logout.length).toBeGreaterThan(0);
  });

  test('frontend_view_startup_opportunities_component_renders_with_heading', () => {
    renderViewStartupOpportunitiesComponent();

    const heading = screen.getAllByText('Available Startup Opportunities');
    expect(heading.length).toBeGreaterThan(0);
  });
});

describe('StartupSubmissions Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderStartupSubmissionsComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <StartupSubmissions {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  test('frontend_mentor_startup_submissions_component_renders_with_table', () => {
    renderStartupSubmissionsComponent();

    const tableElement = screen.getByRole('table');
    expect(tableElement).toBeInTheDocument();
  });

  test('frontend_mentor_startup_submissions_component_renders_with_logout', () => {
    renderStartupSubmissionsComponent();

    const logout = screen.getAllByText('Logout');
    expect(logout.length).toBeGreaterThan(0);
  });

  test('frontend_mentor_startup_submissions_component_renders_with_heading', () => {
    renderStartupSubmissionsComponent();

    const heading = screen.getAllByText('Startup Submissions for Review');
    expect(heading.length).toBeGreaterThan(0);
  });
});

describe('StartupProfileForm Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderStartupProfileFormComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <StartupProfileForm {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  test('frontend_startup_profile_form_displays_error_when_submitting_with_empty_fields', () => {
    renderStartupProfileFormComponent();

    fireEvent.click(screen.getByRole('button', { name: /Add Profile/i }));

    expect(screen.getByText('Category is required')).toBeInTheDocument();
    expect(screen.getByText('Description is required')).toBeInTheDocument();
    expect(screen.getByText('Funding limit is required')).toBeInTheDocument();
    expect(screen.getByText('Equity % is required')).toBeInTheDocument();
    expect(screen.getByText('Industry is required')).toBeInTheDocument();
    expect(screen.getByText('Stage is required')).toBeInTheDocument();
  });

  test('frontend_startup_profile_form_renders_with_heading', () => {
    renderStartupProfileFormComponent();

    const heading = screen.getByText('Create New Startup Profile');
    expect(heading).toBeInTheDocument();
  });

  test('frontend_startup_profile_form_component_renders_with_logout', () => {
    renderStartupProfileFormComponent();

    const logout = screen.getAllByText('Logout');
    expect(logout.length).toBeGreaterThan(0);
  });
});

