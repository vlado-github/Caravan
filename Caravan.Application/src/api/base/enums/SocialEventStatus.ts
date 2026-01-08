export const SocialEventStatus = {
  Draft: 0,
  Published: 1,
  Archived: 2,
  Cancelled: 3,
} as const;

export type SocialEventStatus = typeof SocialEventStatus[keyof typeof SocialEventStatus];

export function getAllSocialEventStatus(): {
  value: string;
  label: string;
}[] {
  return Object.entries(SocialEventStatus).map(([key, value]) => ({
    value: value.toString(),
    label: key
  }));
}