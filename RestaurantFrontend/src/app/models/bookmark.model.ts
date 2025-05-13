/**
 * Represents a bookmark relationship between a user and a restaurant.
 * 
 * Establishes a many-to-many relationship that tracks which restaurants
 * a user has saved to their favorites. Used for personalized restaurant 
 * collections and user preference tracking.
 */

export interface Bookmark {
    userId: number;
    restaurantId: number;
    createdAt: Date;
}