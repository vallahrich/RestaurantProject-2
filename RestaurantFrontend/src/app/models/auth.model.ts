/**
 * Defines the payload structure for user authentication requests.
 * 
 * Contains the minimum required fields to authenticate a user during 
 * the login process. Sent to the authentication API endpoint.
 */
export interface LoginRequest {
    username: string;
    passwordHash: string;
}

/**
 * Defines the payload structure for new user registration.
 * 
 * Contains the required fields to create a new user account in the system.
 * Sent to the registration API endpoint during account creation.
 */
export interface RegisterRequest {
    username: string;
    email: string;
    passwordHash: string;
}

/**
 * Defines the payload structure for user password updates.
 * 
 * Contains both old and new password values (hashed) to verify
 * the user's identity and update their credentials securely.
 * Sent to the password update API endpoint.
 */
export interface PasswordUpdateRequest {
    userId: number;
    oldPasswordHash: string;
    newPasswordHash: string;
}