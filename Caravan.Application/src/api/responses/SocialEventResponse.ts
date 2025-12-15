export const SocialEventType = {
  OnSite: 0,
  Online: 1
} as const;

export type SocialEventType = typeof SocialEventType[keyof typeof SocialEventType];

export const SocialEventStatus = {
  Draft: 0,
  Published: 1,
  Archived: 2,
  Cancelled: 3,
} as const;

export type SocialEventStatus = typeof SocialEventStatus[keyof typeof SocialEventStatus];

export type SocialEventResponse = {
  id: number;
	title: string;
  description: string;
  type: SocialEventType;
  status: SocialEventStatus;
  venue: string;
  startTime: Date;
  endTime: Date | null;
  ticketCirculationCount: number;
}
