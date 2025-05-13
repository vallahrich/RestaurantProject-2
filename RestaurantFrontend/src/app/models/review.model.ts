/**
 * Represents a restaurant review in the Copenhagen Restaurant Explorer application.
 * 
 * This interface defines the structure of review data used throughout the application,
 * including properties for identifying the review, the user who created it, the target
 * restaurant, rating value, comment text, and creation timestamp.
 * 
 * The username property is optional and only used for display purposes in the UI - 
 * it is not transmitted to the API when creating or updating reviews.
 */

export interface Review {
    reviewId: number;
    userId: number;
    restaurantId: number;
    rating: number;
    comment: string;
    createdAt: Date | string;
    username?: string; // Only for display, not sent to API
  }