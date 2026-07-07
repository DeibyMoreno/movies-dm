export const ROLES = {
  USER: 'USER' as const,
  ADMIN: 'ADMIN' as const,
} as const;

export const SERIE_STATUS = {
  ONGOING: 'ONGOING' as const,
  FINISHED: 'FINISHED' as const,
  CANCELED: 'CANCELED' as const,
  UPCOMING: 'UPCOMING' as const,
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
