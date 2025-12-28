export const SocialEventType = {
  OnSite: 0,
  Online: 1,
} as const;

export type SocialEventType = typeof SocialEventType[keyof typeof SocialEventType];

export function getAllSocialEventTypes(): {
  value: string;
  label: string;
}[] {
  return Object.entries(SocialEventType).map(([key, value]) => ({
    value: value.toString(),
    label: key
  }));
}