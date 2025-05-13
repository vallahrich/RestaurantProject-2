/**
 * Represents a user account in the Copenhagen Restaurant Explorer application.
 * 
 * Contains core user identity and authentication information including profile details
 * and account metadata. Used for user management, authentication, and personalization
 * throughout the application.
 * 
 * Note that the passwordHash field stores the hashed password value, not plain text.
 */

export interface User {
    userId: number;
    username: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
}