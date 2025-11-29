import { render, act, renderHook } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.localStorage = localStorageMock as any;

describe('AuthContext', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Reset localStorage mock
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  it('initializes with no user', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.tokens).toBeNull();
  });

  it('logs in a user', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    const testTokens = { access: 'test-access-token', refresh: 'test-refresh-token' };
    
    act(() => {
      result.current.login(testTokens);
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.tokens).toEqual(testTokens);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('authTokens', JSON.stringify(testTokens));
  });

  it('logs out a user', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    const testTokens = { access: 'test-access-token', refresh: 'test-refresh-token' };
    
    // First log in
    act(() => {
      result.current.login(testTokens);
    });
    
    // Then log out
    act(() => {
      result.current.logout();
    });
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.tokens).toBeNull();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('authTokens');
  });

  it('gets access token', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    const testTokens = { access: 'test-access-token', refresh: 'test-refresh-token' };
    
    // Before login
    expect(result.current.getAccessToken()).toBeNull();
    
    // After login
    act(() => {
      result.current.login(testTokens);
    });
    
    expect(result.current.getAccessToken()).toBe('test-access-token');
  });

  it('initializes with tokens from localStorage', () => {
    const testTokens = { access: 'saved-access-token', refresh: 'saved-refresh-token' };
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'authTokens') return JSON.stringify(testTokens);
      return null;
    });
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.tokens).toEqual(testTokens);
  });
});
