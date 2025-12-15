/**
 * Configuration for the MatchEngine API client.
 */
interface MatchEngineConfig {
    /** Base URL of the MatchEngine API. */
    baseUrl: string;
    /** Client API token for authentication. */
    apiToken: string;
    /** Stripe publishable key for payment processing. */
    stripePublishableKey: string;
    /** Request timeout in milliseconds. */
    timeoutMs?: number;
}
/**
 * Create config with defaults applied.
 */
declare function createConfig(config: MatchEngineConfig): Required<MatchEngineConfig>;

/**
 * A window of availability with pricing.
 */
interface AvailabilityWindow {
    date: string;
    start_time: string;
    end_time: string;
    price_per_hour: number;
    currency: string;
    label: string;
}
/**
 * A booked time slot.
 */
interface BookedSlot {
    start_datetime: string;
    end_datetime: string;
    booking_id: string;
}
/**
 * A period when the resource is unavailable.
 */
interface UnavailablePeriod {
    start_datetime: string;
    end_datetime: string;
    reason: string;
}
/**
 * Complete availability response for a resource.
 */
interface AvailabilityResponse {
    resource_id: number;
    resource_name: string;
    start_date: string;
    end_date: string;
    timezone: string;
    booking_interval_minutes: number;
    min_duration_minutes: number;
    max_duration_minutes: number | null;
    prevent_unbookable_gaps: boolean;
    min_advance_booking_minutes: number;
    max_advance_booking_days: number;
    windows: AvailabilityWindow[];
    booked_slots: BookedSlot[];
    unavailable_periods: UnavailablePeriod[];
}

/**
 * Booking status values.
 */
type BookingStatus = 'pending' | 'confirmed' | 'paid' | 'cancelled' | 'refunded' | 'no_show';
/**
 * A booking record.
 */
interface Booking {
    id: number;
    reference_code: string;
    resource: number;
    resource_name: string;
    venue_name: string;
    venue_address: string | null;
    start_datetime: string;
    end_datetime: string;
    duration_minutes: number;
    participant_count: number;
    price_per_unit: number | null;
    pricing_unit: string | null;
    total_price: number;
    currency: string;
    status: BookingStatus;
    can_cancel: boolean;
    is_upcoming: boolean;
    notes: string;
    created_at: string | null;
    paid_at: string | null;
    cancelled_at: string | null;
}
/**
 * Request to create a booking.
 */
interface CreateBookingRequest {
    resource_external_id: string;
    start_datetime: string;
    end_datetime: string;
    participant_count?: number;
    notes?: string;
}
/**
 * Options for creating a booking.
 */
interface CreateBookingOptions {
    resourceExternalId: string;
    userExternalId: string;
    startDatetime: Date;
    endDatetime: Date;
    timezone: string;
    participantCount?: number;
    notes?: string;
}
/**
 * Request to cancel a booking.
 */
interface CancelBookingRequest {
    reason?: string;
    notes?: string;
}
/**
 * Helper functions for Booking
 */
declare const BookingHelpers: {
    /** Whether this booking is in a paid state. */
    isPaid: (booking: Booking) => boolean;
    /** Whether this booking is pending payment. */
    isPending: (booking: Booking) => boolean;
    /** Whether this booking has been cancelled. */
    isCancelled: (booking: Booking) => boolean;
    /** Parse start datetime to Date. */
    getStartDateTime: (booking: Booking) => Date;
    /** Parse end datetime to Date. */
    getEndDateTime: (booking: Booking) => Date;
};

/**
 * User mapping between client's external ID and MatchEngine user.
 */
interface UserMapping {
    user_id: string;
    external_id: string;
    email: string | null;
    created: boolean;
    mapping_created: boolean;
}
/**
 * Request to register a user.
 */
interface RegisterUserRequest {
    external_id: string;
    email: string;
    first_name?: string;
    last_name?: string;
}
/**
 * Options for registering a user.
 */
interface RegisterUserOptions {
    externalId: string;
    email: string;
    firstName?: string;
    lastName?: string;
}

/**
 * Resource mapping between client's external ID and MatchEngine resource.
 */
interface ResourceMapping {
    external_id: string;
    resource_id: number;
    resource_name: string;
    venue_name: string;
    created: boolean;
}
/**
 * Request to register a resource mapping.
 */
interface RegisterResourceRequest {
    external_id: string;
    resource_id: number;
    external_data?: Record<string, unknown>;
}
/**
 * Options for registering a resource.
 */
interface RegisterResourceOptions {
    externalId: string;
    matchengineResourceId: number;
    externalData?: Record<string, unknown>;
}

/**
 * A resource within a venue.
 */
interface VenueResource {
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
interface Venue {
    id: number;
    name: string;
    slug: string;
    description: string;
    short_description: string;
    venue_type: string;
    timezone: string;
    street_address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
    email: string;
    phone: string;
    website: string;
    is_active: boolean;
    is_featured: boolean;
    is_verified: boolean;
    price_range: string;
    parking_available: boolean;
    wheelchair_accessible: boolean;
    instant_booking: boolean;
    average_rating: number | null;
    total_reviews: number;
    primary_image?: string | null;
}
/**
 * Venue detail response with full information.
 */
interface VenueDetail extends Venue {
    opening_hours: Record<string, {
        closed: boolean;
        ranges: Array<{
            open: string;
            close: string;
        }>;
    }>;
    cancellation_policy: string;
    house_rules: string;
    min_advance_booking_hours: number;
    max_advance_booking_days: number;
    accepts_online_payment: boolean;
    accepts_cash: boolean;
    facebook_url: string;
    instagram_url: string;
    resources?: VenueResource[];
    images?: VenueImage[];
    amenities?: VenueAmenity[];
}
/**
 * Venue image.
 */
interface VenueImage {
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
interface VenueAmenity {
    id: number;
    name: string;
    slug: string;
    icon: string;
    category: string;
}
/**
 * Venue mapping between client's external ID and MatchEngine venue.
 */
interface VenueMapping {
    external_id: string;
    venue_id: number;
    venue_name: string;
    created: boolean;
}
/**
 * Request to register a venue mapping.
 */
interface RegisterVenueRequest {
    external_id: string;
    venue_id: number;
    external_data?: Record<string, unknown>;
}
/**
 * Options for registering a venue.
 */
interface RegisterVenueOptions {
    externalId: string;
    matchengineVenueId: number;
    externalData?: Record<string, unknown>;
}
/**
 * Response containing venue details with its resources.
 */
interface VenueWithResources {
    venue_id: number;
    venue_name: string;
    external_id: string;
    timezone: string | null;
    resources: VenueResource[];
}
/**
 * Options for listing venues.
 */
interface ListVenuesOptions {
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
interface ListResourcesOptions {
    venueId?: number;
    venueSlug?: string;
    isActive?: boolean;
    isBookable?: boolean;
}
/**
 * Helper functions for VenueWithResources
 */
declare const VenueHelpers: {
    /** Get only bookable resources. */
    getBookableResources: (venue: VenueWithResources) => VenueResource[];
};

/**
 * Stripe PaymentIntent response for completing payment.
 */
interface PaymentIntent {
    client_secret: string;
    payment_intent_id: string;
    amount: number;
    currency: string;
}

/**
 * MatchEngine API client for TypeScript/JavaScript applications.
 *
 * @example
 * ```typescript
 * const client = new MatchEngineClient({
 *   baseUrl: 'https://api.matchengine.de',
 *   apiToken: 'your-api-token',
 *   stripePublishableKey: 'pk_test_xxx',
 * });
 *
 * // Register user
 * const user = await client.registerUser({
 *   externalId: 'user-123',
 *   email: 'user@example.com',
 * });
 *
 * // Get availability
 * const availability = await client.getAvailability({
 *   resourceExternalId: 'pitch-123',
 *   startDate: new Date(),
 *   endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
 * });
 *
 * // Create booking
 * const booking = await client.createBooking({
 *   resourceExternalId: 'pitch-123',
 *   userExternalId: 'user-123',
 *   startDatetime: new Date('2025-01-15T10:00:00'),
 *   endDatetime: new Date('2025-01-15T11:30:00'),
 *   timezone: 'Europe/Berlin',
 * });
 * ```
 */
declare class MatchEngineClient {
    private readonly config;
    private readonly baseApiUrl;
    constructor(config: MatchEngineConfig);
    /**
     * Register or get existing user mapping.
     */
    registerUser(options: RegisterUserOptions): Promise<UserMapping>;
    /**
     * Look up user by external ID.
     */
    lookupUser(externalId: string): Promise<UserMapping | null>;
    /**
     * Register or get existing resource mapping.
     */
    registerResource(options: RegisterResourceOptions): Promise<ResourceMapping>;
    /**
     * Look up resource by external ID.
     */
    lookupResource(externalId: string): Promise<ResourceMapping | null>;
    /**
     * List resources with optional filters.
     */
    listResources(options?: ListResourcesOptions): Promise<{
        results: VenueResource[];
        count: number;
        next: string | null;
        previous: string | null;
    }>;
    /**
     * Register or get existing venue mapping.
     */
    registerVenue(options: RegisterVenueOptions): Promise<VenueMapping>;
    /**
     * Look up venue by external ID.
     */
    lookupVenue(externalId: string): Promise<VenueMapping | null>;
    /**
     * Get venue with its resources by external ID.
     */
    getVenueWithResources(venueExternalId: string): Promise<VenueWithResources>;
    /**
     * List all public venues.
     */
    listVenues(options?: ListVenuesOptions): Promise<{
        results: Venue[];
        count: number;
        next: string | null;
        previous: string | null;
    }>;
    /**
     * Get venue details by ID.
     */
    getVenue(venueId: number): Promise<VenueDetail>;
    /**
     * Get venue details by slug.
     */
    getVenueBySlug(slug: string): Promise<VenueDetail>;
    /**
     * Get availability for a resource by MatchEngine resource ID.
     * Use this when you have the resource ID from getVenueWithResources.
     */
    getAvailabilityById(options: {
        resourceId: number;
        startDate: Date;
        endDate: Date;
    }): Promise<AvailabilityResponse>;
    /**
     * Get availability for a resource by external ID.
     */
    getAvailability(options: {
        resourceExternalId: string;
        startDate: Date;
        endDate: Date;
    }): Promise<AvailabilityResponse>;
    /**
     * Create a new booking (pending status).
     *
     * The timezone parameter should be the IANA timezone identifier
     * (e.g., "Europe/Berlin") from the venue's AvailabilityResponse.
     * The startDatetime and endDatetime are interpreted as local times
     * in that timezone and sent to the API with the appropriate offset.
     */
    createBooking(options: CreateBookingOptions): Promise<Booking>;
    /**
     * Get booking details.
     */
    getBooking(bookingId: number | string, userExternalId?: string): Promise<Booking>;
    /**
     * List bookings.
     */
    listBookings(options?: {
        status?: string;
        upcomingOnly?: boolean;
    }): Promise<Booking[]>;
    /**
     * Create Stripe PaymentIntent for booking.
     */
    createPaymentIntent(options: {
        bookingId: number;
        userExternalId: string;
    }): Promise<PaymentIntent>;
    /**
     * Cancel a booking.
     */
    cancelBooking(options: {
        bookingId: number;
        userExternalId: string;
        reason?: string;
        notes?: string;
    }): Promise<Booking>;
    private request;
    private handleError;
    private formatDate;
    /**
     * Formats a DateTime with timezone offset in ISO 8601 format.
     * Example: "2025-01-15T10:00:00+01:00"
     *
     * This implementation uses the Intl API to get the timezone offset.
     * For more accurate timezone handling, install the optional `luxon` peer dependency.
     */
    private formatDateTimeWithTimezone;
    private fallbackFormatDateTime;
}

/**
 * Base exception for MatchEngine SDK errors.
 */
declare class MatchEngineError extends Error {
    readonly statusCode?: number;
    readonly responseData?: Record<string, unknown>;
    constructor(message: string, options?: {
        statusCode?: number;
        responseData?: Record<string, unknown>;
    });
}
/**
 * Authentication failed (invalid or expired token).
 */
declare class AuthenticationError extends MatchEngineError {
    constructor(message?: string);
}
/**
 * Resource not found.
 */
declare class NotFoundError extends MatchEngineError {
    constructor(message?: string);
}
/**
 * Validation error.
 */
declare class ValidationError extends MatchEngineError {
    readonly fieldErrors?: Record<string, string[]>;
    constructor(message: string, options?: {
        fieldErrors?: Record<string, string[]>;
        responseData?: Record<string, unknown>;
    });
}
/**
 * Requested time slot is not available.
 */
declare class SlotNotAvailableError extends MatchEngineError {
    constructor(message?: string);
}
/**
 * User not found for the given external ID.
 */
declare class UserNotFoundError extends MatchEngineError {
    constructor(message?: string);
}
/**
 * Booking operation failed.
 */
declare class BookingError extends MatchEngineError {
    constructor(message: string, options?: {
        statusCode?: number;
        responseData?: Record<string, unknown>;
    });
}
/**
 * Payment operation failed.
 */
declare class PaymentError extends MatchEngineError {
    constructor(message: string, options?: {
        statusCode?: number;
        responseData?: Record<string, unknown>;
    });
}

export { AuthenticationError, type AvailabilityResponse, type AvailabilityWindow, type BookedSlot, type Booking, BookingError, BookingHelpers, type BookingStatus, type CancelBookingRequest, type CreateBookingOptions, type CreateBookingRequest, type ListResourcesOptions, type ListVenuesOptions, MatchEngineClient, type MatchEngineConfig, MatchEngineError, NotFoundError, PaymentError, type PaymentIntent, type RegisterResourceOptions, type RegisterResourceRequest, type RegisterUserOptions, type RegisterUserRequest, type RegisterVenueOptions, type RegisterVenueRequest, type ResourceMapping, SlotNotAvailableError, type UnavailablePeriod, type UserMapping, UserNotFoundError, ValidationError, type Venue, type VenueAmenity, type VenueDetail, VenueHelpers, type VenueImage, type VenueMapping, type VenueResource, type VenueWithResources, createConfig };
