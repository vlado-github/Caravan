export const SocialEventType = {
  OnSite: 0,
  Online: 1
} as const;

export type SocialEventType = typeof SocialEventType[keyof typeof SocialEventType];