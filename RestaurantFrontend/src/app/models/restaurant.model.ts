/**
 * Represents a restaurant entity in the Copenhagen Restaurant Explorer application.
 * 
 * Contains comprehensive restaurant information including location, cuisine type, 
 * pricing, and dietary accommodations. Used for displaying restaurant listings,
 * filtering, and detailed views.
 * 
 * The priceRange uses a single character code system:
 * 'L' = Low/Budget, 'M' = Medium/Moderate, 'H' = High/Luxury
 */

export interface Restaurant {
    restaurantId: number;
    name: string;
    address: string;
    neighborhood: string;
    openingHours: string;
    cuisine: string;
    priceRange: string; // 'L', 'M', or 'H'
    dietaryOptions: string;
    createdAt: Date;
}