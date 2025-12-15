/**
 * Resource mapping between client's external ID and MatchEngine resource.
 */
export interface ResourceMapping {
  external_id: string;
  resource_id: number;
  resource_name: string;
  venue_name: string;
  created: boolean;
}

/**
 * Request to register a resource mapping.
 */
export interface RegisterResourceRequest {
  external_id: string;
  resource_id: number;
  external_data?: Record<string, unknown>;
}

/**
 * Options for registering a resource.
 */
export interface RegisterResourceOptions {
  externalId: string;
  matchengineResourceId: number;
  externalData?: Record<string, unknown>;
}
