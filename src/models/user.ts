/**
 * User mapping between client's external ID and MatchEngine user.
 */
export interface UserMapping {
  user_id: string;
  external_id: string;
  email: string | null;
  created: boolean;
  mapping_created: boolean;
}

/**
 * Request to register a user.
 */
export interface RegisterUserRequest {
  external_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

/**
 * Options for registering a user.
 */
export interface RegisterUserOptions {
  externalId: string;
  email: string;
  firstName?: string;
  lastName?: string;
}
