import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from '@/pages/Register';
import '@testing-library/jest-dom';

// Mock the useToast hook
const mockToast = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

// Mock the fetch API
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Register Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Reset mocks
    mockFetch.mockClear();
    mockToast.mockClear();
    mockNavigate.mockClear();
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderRegister = () => {
    return render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
  };

  const fillForm = (formData: {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    password2: string;
  }) => {
    // Use getByLabelText with exact match and selector option
    const getByLabel = (text: string) => 
      screen.getByLabelText(text, { selector: 'input' });

    fireEvent.change(getByLabel('First Name'), {
      target: { value: formData.first_name },
    });
    fireEvent.change(getByLabel('Last Name'), {
      target: { value: formData.last_name },
    });
    fireEvent.change(getByLabel('Username'), {
      target: { value: formData.username },
    });
    fireEvent.change(getByLabel('Email'), {
      target: { value: formData.email },
    });
    fireEvent.change(getByLabel('Password'), {
      target: { value: formData.password },
    });
    fireEvent.change(getByLabel('Confirm Password'), {
      target: { value: formData.password2 },
    });
  };

  it('renders registration form', () => {
    renderRegister();
    
    // Helper function to get input by label text
    const getByLabel = (text: string) => 
      screen.getByLabelText(text, { selector: 'input' });
    
    expect(getByLabel('First Name')).toBeInTheDocument();
    expect(getByLabel('Last Name')).toBeInTheDocument();
    expect(getByLabel('Username')).toBeInTheDocument();
    expect(getByLabel('Email')).toBeInTheDocument();
    expect(getByLabel('Password')).toBeInTheDocument();
    expect(getByLabel('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderRegister();
    
    // Submit empty form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    // Check for validation errors
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Validation Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
    });
  });

  it('validates password match', async () => {
    renderRegister();
    
    // Fill form with mismatched passwords
    fillForm({
      first_name: 'John',
      last_name: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password123',
      password2: 'differentpassword',
    });
    
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Validation Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
    });
  });

  it('validates password length', async () => {
    renderRegister();
    
    // Fill form with short password
    fillForm({
      first_name: 'John',
      last_name: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'short',
      password2: 'short',
    });
    
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Validation Error',
        description: 'Password must be at least 8 characters',
        variant: 'destructive',
      });
    });
  });

  it('handles successful registration', async () => {
    // Mock successful API response
    mockFetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    renderRegister();
    
    // Fill form with valid data
    fillForm({
      first_name: 'John',
      last_name: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password123',
      password2: 'password123',
    });
    
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    // Check if fetch was called with correct data
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
      
      // Get the actual arguments passed to fetch
      const [url, options] = mockFetch.mock.calls[0];
      
      expect(url).toContain('/auth/register/');
      expect(options.method).toBe('POST');
      expect(options.headers).toEqual({
        'Content-Type': 'application/json',
      });
      
      const body = JSON.parse(options.body);
      expect(body).toEqual({
        first_name: 'John',
        last_name: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
        password2: 'password123',
      });
    }, { timeout: 1000 });
    
    // Check if success toast was shown
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Account created successfully! Please login.',
      });
    });
    
    // Check if navigation occurred
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    }, { timeout: 1000 });
  });

  it('handles registration error', async () => {
    const errorMessage = 'Username already exists';
    
    // Mock error response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ username: [errorMessage] }),
    });

    renderRegister();
    
    // Fill form with valid data
    fillForm({
      first_name: 'John',
      last_name: 'Doe',
      username: 'existinguser',
      email: 'john@example.com',
      password: 'password123',
      password2: 'password123',
    });
    
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    // Check for error toast
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Registration Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    });
  });
});
