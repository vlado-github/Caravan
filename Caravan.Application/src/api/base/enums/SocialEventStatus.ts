export const SocialEventStatus = {
  Draft: 0,
  Published: 1,
  Archived: 2,
  Cancelled: 3,
} as const;

export type SocialEventStatus = typeof SocialEventStatus[keyof typeof SocialEventStatus];