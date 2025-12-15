/**
 * A resource within a venue.
 */
export interface VenueResource {
  id: number;
  name: string;
  external_id: string | null;
  capacity: number;
  is_active: boolean;
  is_bookable: boolean;
  base_price: string | null;
  currency: string;
  booking_interval_minutes: number;
  min_booking_duration_minutes: number;
  max_booking_duration_minutes: number | null;
  description: string | null;
}

/**
 * Public venue listing item.
 */
export interface Venue {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  venue_type: string;
  timezone: string;
  // Address
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  // Contact
  email: string;
  phone: string;
  website: string;
  // Status
  is_active: boolean;
  is_featured: boolean;
  is_verified: boolean;
  // Pricing
  price_range: string;
  // Features
  parking_available: boolean;
  wheelchair_accessible: boolean;
  instant_booking: boolean;
  // Stats
  average_rating: number | null;
  total_reviews: number;
  // Images
  primary_image?: string | null;
}

/**
 * Venue detail response with full information.
 */
export interface VenueDetail extends Venue {
  opening_hours: Record<string, {
    closed: boolean;
    ranges: Array<{ open: string; close: string }>;
  }>;
  cancellation_policy: string;
  house_rules: string;
  min_advance_booking_hours: number;
  max_advance_booking_days: number;
  accepts_online_payment: boolean;
  accepts_cash: boolean;
  facebook_url: string;
  instagram_url: string;
  // Related data
  resources?: VenueResource[];
  images?: VenueImage[];
  amenities?: VenueAmenity[];
}

/**
 * Venue image.
 */
export interface VenueImage {
  id: number;
  image: string;
  alt_text: string;
  caption: string;
  is_primary: boolean;
  is_cover: boolean;
  image_type: string;
}

/**
 * Venue amenity.
 */
export interface VenueAmenity {
  id: number;
  name: string;
  slug: string;
  icon: string;
  category: string;
}

/**
 * Venue mapping between client's external ID and MatchEngine venue.
 */
export interface VenueMapping {
  external_id: string;
  venue_id: number;
  venue_name: string;
  created: boolean;
}

/**
 * Request to register a venue mapping.
 */
export interface RegisterVenueRequest {
  external_id: string;
  venue_id: number;
  external_data?: Record<string, unknown>;
}

/**
 * Options for registering a venue.
 */
export interface RegisterVenueOptions {
  externalId: string;
  matchengineVenueId: number;
  externalData?: Record<string, unknown>;
}

/**
 * Response containing venue details with its resources.
 */
export interface VenueWithResources {
  venue_id: number;
  venue_name: string;
  external_id: string;
  timezone: string | null;
  resources: VenueResource[];
}

/**
 * Options for listing venues.
 */
export interface ListVenuesOptions {
  city?: string;
  venueType?: string;
  search?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  page?: number;
  pageSize?: number;
}

/**
 * Options for listing resources.
 */
export interface ListResourcesOptions {
  venueId?: number;
  venueSlug?: string;
  isActive?: boolean;
  isBookable?: boolean;
}

/**
 * Helper functions for VenueWithResources
 */
export const VenueHelpers = {
  /** Get only bookable resources. */
  getBookableResources: (venue: VenueWithResources): VenueResource[] =>
    venue.resources.filter((r) => r.is_bookable && r.is_active),
};
