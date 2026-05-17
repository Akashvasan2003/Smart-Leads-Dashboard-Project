export const LEAD_STATUS = ['New', 'Contacted', 'Qualified', 'Lost'] as const;
export const LEAD_SOURCE = ['Website', 'Instagram', 'Referral'] as const;
export const USER_ROLES = ['admin', 'sales'] as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
} as const;

export const SORT_OPTIONS = {
  LATEST: 'latest',
  OLDEST: 'oldest',
} as const;
