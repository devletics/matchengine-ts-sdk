"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AuthenticationError: () => AuthenticationError,
  BookingError: () => BookingError,
  BookingHelpers: () => BookingHelpers,
  MatchEngineClient: () => MatchEngineClient,
  MatchEngineError: () => MatchEngineError,
  NotFoundError: () => NotFoundError,
  PaymentError: () => PaymentError,
  SlotNotAvailableError: () => SlotNotAvailableError,
  UserNotFoundError: () => UserNotFoundError,
  ValidationError: () => ValidationError,
  VenueHelpers: () => VenueHelpers,
  createConfig: () => createConfig
});
module.exports = __toCommonJS(index_exports);

// src/config.ts
function createConfig(config) {
  const baseUrl = config.baseUrl.endsWith("/") ? config.baseUrl.slice(0, -1) : config.baseUrl;
  return {
    baseUrl,
    apiToken: config.apiToken,
    stripePublishableKey: config.stripePublishableKey,
    timeoutMs: config.timeoutMs ?? 3e4
  };
}

// src/errors/index.ts
var MatchEngineError = class extends Error {
  constructor(message, options) {
    super(message);
    this.name = "MatchEngineError";
    this.statusCode = options?.statusCode;
    this.responseData = options?.responseData;
  }
};
var AuthenticationError = class extends MatchEngineError {
  constructor(message = "Invalid or expired API token") {
    super(message, { statusCode: 401 });
    this.name = "AuthenticationError";
  }
};
var NotFoundError = class extends MatchEngineError {
  constructor(message = "Resource not found") {
    super(message, { statusCode: 404 });
    this.name = "NotFoundError";
  }
};
var ValidationError = class extends MatchEngineError {
  constructor(message, options) {
    super(message, { statusCode: 400, responseData: options?.responseData });
    this.name = "ValidationError";
    this.fieldErrors = options?.fieldErrors;
  }
};
var SlotNotAvailableError = class extends MatchEngineError {
  constructor(message = "Time slot is not available") {
    super(message, { statusCode: 400 });
    this.name = "SlotNotAvailableError";
  }
};
var UserNotFoundError = class extends MatchEngineError {
  constructor(message = "User not found") {
    super(message, { statusCode: 404 });
    this.name = "UserNotFoundError";
  }
};
var BookingError = class extends MatchEngineError {
  constructor(message, options) {
    super(message, options);
    this.name = "BookingError";
  }
};
var PaymentError = class extends MatchEngineError {
  constructor(message, options) {
    super(message, options);
    this.name = "PaymentError";
  }
};

// src/client.ts
var MatchEngineClient = class {
  constructor(config) {
    this.config = createConfig(config);
    this.baseApiUrl = `${this.config.baseUrl}/api/v1`;
  }
  // ============ User API ============
  /**
   * Register or get existing user mapping.
   */
  async registerUser(options) {
    return this.request({
      method: "POST",
      path: "/client/users/register/",
      data: {
        external_id: options.externalId,
        email: options.email,
        first_name: options.firstName ?? "",
        last_name: options.lastName ?? ""
      }
    });
  }
  /**
   * Look up user by external ID.
   */
  async lookupUser(externalId) {
    try {
      return await this.request({
        method: "GET",
        path: "/client/users/lookup/",
        queryParams: { external_id: externalId }
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null;
      }
      throw error;
    }
  }
  // ============ Resource API ============
  /**
   * Register or get existing resource mapping.
   */
  async registerResource(options) {
    return this.request({
      method: "POST",
      path: "/client/resources/register/",
      data: {
        external_id: options.externalId,
        resource_id: options.matchengineResourceId,
        external_data: options.externalData ?? {}
      }
    });
  }
  /**
   * Look up resource by external ID.
   */
  async lookupResource(externalId) {
    try {
      return await this.request({
        method: "GET",
        path: "/client/resources/lookup/",
        queryParams: { external_id: externalId }
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null;
      }
      throw error;
    }
  }
  /**
   * List resources with optional filters.
   */
  async listResources(options) {
    const queryParams = {};
    if (options?.venueId) queryParams.venue = String(options.venueId);
    if (options?.venueSlug) queryParams.venue_slug = options.venueSlug;
    if (options?.isActive !== void 0) queryParams.is_active = String(options.isActive);
    if (options?.isBookable !== void 0) queryParams.is_bookable = String(options.isBookable);
    return this.request({
      method: "GET",
      path: "/resources/",
      queryParams
    });
  }
  // ============ Venue API ============
  /**
   * Register or get existing venue mapping.
   */
  async registerVenue(options) {
    return this.request({
      method: "POST",
      path: "/client/venues/register/",
      data: {
        external_id: options.externalId,
        venue_id: options.matchengineVenueId,
        external_data: options.externalData ?? {}
      }
    });
  }
  /**
   * Look up venue by external ID.
   */
  async lookupVenue(externalId) {
    try {
      return await this.request({
        method: "GET",
        path: "/client/venues/lookup/",
        queryParams: { external_id: externalId }
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null;
      }
      throw error;
    }
  }
  /**
   * Get venue with its resources by external ID.
   */
  async getVenueWithResources(venueExternalId) {
    return this.request({
      method: "GET",
      path: "/venues/resources/",
      queryParams: { venue_external_id: venueExternalId }
    });
  }
  // ============ Public Venue API ============
  /**
   * List all public venues.
   */
  async listVenues(options) {
    const queryParams = {};
    if (options?.city) queryParams.city = options.city;
    if (options?.venueType) queryParams.venue_type = options.venueType;
    if (options?.search) queryParams.search = options.search;
    if (options?.isActive !== void 0) queryParams.is_active = String(options.isActive);
    if (options?.isFeatured !== void 0) queryParams.is_featured = String(options.isFeatured);
    if (options?.page) queryParams.page = String(options.page);
    if (options?.pageSize) queryParams.page_size = String(options.pageSize);
    return this.request({
      method: "GET",
      path: "/venues/",
      queryParams
    });
  }
  /**
   * Get venue details by ID.
   */
  async getVenue(venueId) {
    return this.request({
      method: "GET",
      path: `/venues/${venueId}/`
    });
  }
  /**
   * Get venue details by slug.
   */
  async getVenueBySlug(slug) {
    const response = await this.request({
      method: "GET",
      path: "/venues/",
      queryParams: { search: slug }
    });
    const venue = response.results.find((v) => v.slug === slug);
    if (!venue) {
      throw new NotFoundError(`Venue with slug '${slug}' not found`);
    }
    return this.getVenue(venue.id);
  }
  // ============ Availability API ============
  /**
   * Get availability for a resource by MatchEngine resource ID.
   * Use this when you have the resource ID from getVenueWithResources.
   */
  async getAvailabilityById(options) {
    return this.request({
      method: "GET",
      path: `/resources/${options.resourceId}/availability/`,
      queryParams: {
        start_date: this.formatDate(options.startDate),
        end_date: this.formatDate(options.endDate)
      }
    });
  }
  /**
   * Get availability for a resource by external ID.
   */
  async getAvailability(options) {
    return this.request({
      method: "GET",
      path: "/resources/availability/",
      queryParams: {
        resource_external_id: options.resourceExternalId,
        start_date: this.formatDate(options.startDate),
        end_date: this.formatDate(options.endDate)
      }
    });
  }
  // ============ Booking API ============
  /**
   * Create a new booking (pending status).
   *
   * The timezone parameter should be the IANA timezone identifier
   * (e.g., "Europe/Berlin") from the venue's AvailabilityResponse.
   * The startDatetime and endDatetime are interpreted as local times
   * in that timezone and sent to the API with the appropriate offset.
   */
  async createBooking(options) {
    return this.request({
      method: "POST",
      path: "/bookings/",
      headers: { "X-User-External-ID": options.userExternalId },
      data: {
        resource_external_id: options.resourceExternalId,
        start_datetime: this.formatDateTimeWithTimezone(options.startDatetime, options.timezone),
        end_datetime: this.formatDateTimeWithTimezone(options.endDatetime, options.timezone),
        participant_count: options.participantCount ?? 1,
        notes: options.notes ?? ""
      }
    });
  }
  /**
   * Get booking details.
   */
  async getBooking(bookingId, userExternalId) {
    return this.request({
      method: "GET",
      path: `/bookings/${bookingId}/`,
      headers: userExternalId ? { "X-User-External-ID": userExternalId } : void 0
    });
  }
  /**
   * List bookings.
   */
  async listBookings(options) {
    const queryParams = {};
    if (options?.status) queryParams.status = options.status;
    if (options?.upcomingOnly) queryParams.upcoming = "true";
    const response = await this.request({
      method: "GET",
      path: "/bookings/",
      queryParams
    });
    if (Array.isArray(response)) {
      return response;
    }
    return response.results ?? [];
  }
  /**
   * Create Stripe PaymentIntent for booking.
   */
  async createPaymentIntent(options) {
    return this.request({
      method: "POST",
      path: `/bookings/${options.bookingId}/create-payment-intent/`,
      headers: { "X-User-External-ID": options.userExternalId }
    });
  }
  /**
   * Cancel a booking.
   */
  async cancelBooking(options) {
    return this.request({
      method: "POST",
      path: `/bookings/${options.bookingId}/cancel/`,
      headers: { "X-User-External-ID": options.userExternalId },
      data: {
        reason: options.reason ?? "user_request",
        notes: options.notes ?? ""
      }
    });
  }
  // ============ Private Methods ============
  async request(options) {
    const url = new URL(`${this.baseApiUrl}${options.path}`);
    if (options.queryParams) {
      Object.entries(options.queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    const headers = {
      Authorization: `Token ${this.config.apiToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers
    };
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      const response = await fetch(url.toString(), {
        method: options.method,
        headers,
        body: options.data ? JSON.stringify(options.data) : void 0,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw this.handleError(response.status, data);
      }
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof MatchEngineError) {
        throw error;
      }
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new MatchEngineError("Request timeout", { statusCode: 408 });
        }
        throw new MatchEngineError(error.message);
      }
      throw new MatchEngineError("Unknown error");
    }
  }
  handleError(statusCode, data) {
    let message = "Unknown error";
    if (typeof data.error === "string") {
      message = data.error;
    } else if (typeof data.detail === "string") {
      message = data.detail;
    } else if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
      message = String(data.non_field_errors[0]);
    } else if (typeof data === "object") {
      message = JSON.stringify(data);
    }
    switch (statusCode) {
      case 401:
        return new AuthenticationError(message);
      case 404:
        return new NotFoundError(message);
      case 400:
        if (message.toLowerCase().includes("not available")) {
          return new SlotNotAvailableError(message);
        }
        if (message.toLowerCase().includes("user") && message.toLowerCase().includes("not found")) {
          return new UserNotFoundError(message);
        }
        return new ValidationError(message, { responseData: data });
      default:
        return new MatchEngineError(message, { statusCode, responseData: data });
    }
  }
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  /**
   * Formats a DateTime with timezone offset in ISO 8601 format.
   * Example: "2025-01-15T10:00:00+01:00"
   *
   * This implementation uses the Intl API to get the timezone offset.
   * For more accurate timezone handling, install the optional `luxon` peer dependency.
   */
  formatDateTimeWithTimezone(date, timezone) {
    try {
      const { DateTime } = require("luxon");
      const dt = DateTime.fromJSDate(date, { zone: timezone });
      return dt.toISO({ suppressMilliseconds: true }) ?? this.fallbackFormatDateTime(date, timezone);
    } catch {
      return this.fallbackFormatDateTime(date, timezone);
    }
  }
  fallbackFormatDateTime(date, timezone) {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
    const parts = formatter.formatToParts(date);
    const getPart = (type) => parts.find((p) => p.type === type)?.value ?? "00";
    const year = getPart("year");
    const month = getPart("month");
    const day = getPart("day");
    const hour = getPart("hour");
    const minute = getPart("minute");
    const second = getPart("second");
    const offsetFormatter = new Intl.DateTimeFormat("en", {
      timeZone: timezone,
      timeZoneName: "shortOffset"
    });
    const offsetParts = offsetFormatter.formatToParts(date);
    const offsetStr = offsetParts.find((p) => p.type === "timeZoneName")?.value ?? "+00:00";
    const offsetMatch = offsetStr.match(/GMT([+-]?)(\d+)?(?::(\d+))?/);
    let formattedOffset = "+00:00";
    if (offsetMatch) {
      const sign = offsetMatch[1] || "+";
      const hours = (offsetMatch[2] || "0").padStart(2, "0");
      const minutes = (offsetMatch[3] || "0").padStart(2, "0");
      formattedOffset = `${sign}${hours}:${minutes}`;
    }
    return `${year}-${month}-${day}T${hour}:${minute}:${second}${formattedOffset}`;
  }
};

// src/models/booking.ts
var BookingHelpers = {
  /** Whether this booking is in a paid state. */
  isPaid: (booking) => booking.status === "paid",
  /** Whether this booking is pending payment. */
  isPending: (booking) => booking.status === "pending",
  /** Whether this booking has been cancelled. */
  isCancelled: (booking) => booking.status === "cancelled" || booking.status === "refunded",
  /** Parse start datetime to Date. */
  getStartDateTime: (booking) => new Date(booking.start_datetime),
  /** Parse end datetime to Date. */
  getEndDateTime: (booking) => new Date(booking.end_datetime)
};

// src/models/venue.ts
var VenueHelpers = {
  /** Get only bookable resources. */
  getBookableResources: (venue) => venue.resources.filter((r) => r.is_bookable && r.is_active)
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthenticationError,
  BookingError,
  BookingHelpers,
  MatchEngineClient,
  MatchEngineError,
  NotFoundError,
  PaymentError,
  SlotNotAvailableError,
  UserNotFoundError,
  ValidationError,
  VenueHelpers,
  createConfig
});
