
/**
 * Maps Firebase Auth error codes to user-friendly messages.
 */
export const getFriendlyErrorMessage = (error: any): string => {
  const errorCode = error?.code || error?.message || '';

  if (errorCode.includes('auth/invalid-email')) {
    return 'The email address is not valid. Please check and try again.';
  }
  if (errorCode.includes('auth/user-disabled')) {
    return 'This account has been disabled. Please contact support.';
  }
  if (errorCode.includes('auth/user-not-found') || errorCode.includes('auth/wrong-password') || errorCode.includes('auth/invalid-credential')) {
    return 'Invalid email or password. Please try again.';
  }
  if (errorCode.includes('auth/email-already-in-use')) {
    return 'An account with this email already exists. Try logging in instead.';
  }
  if (errorCode.includes('auth/weak-password')) {
    return 'Your password is too weak. Please use at least 6 characters.';
  }
  if (errorCode.includes('auth/network-request-failed')) {
    return 'Network error. Please check your internet connection.';
  }
  if (errorCode.includes('auth/too-many-requests')) {
    return 'Too many failed attempts. Please try again later or reset your password.';
  }
  if (errorCode.includes('auth/unauthorized-continue-uri')) {
    return 'Configuration error: Domain not allowlisted. Please contact the administrator.';
  }
  if (errorCode.includes('auth/requires-recent-login')) {
    return 'This action requires you to log in again for security.';
  }
  if (errorCode.includes('auth/operation-not-allowed')) {
    return 'This sign-in method is currently disabled. Please contact support.';
  }

  // If it's a custom error message (doesn't contain auth/), return it directly
  if (typeof errorCode === 'string' && !errorCode.includes('auth/')) {
    return errorCode;
  }

  // Default fallback for unknown errors
  return 'An unexpected error occurred. Please try again later.';
};
