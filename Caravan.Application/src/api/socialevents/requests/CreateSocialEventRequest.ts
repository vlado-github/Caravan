import type { SocialEventType } from "../../base/enums/SocialEventType";

export type CreateSocialEventRequest = {
	title: string;
	description: string;
  type: SocialEventType;
  venue: string;
  socialGroupId: string;
  startTime: Date;
  endTime: Date | null;
  ticketCirculationCount: number;
}
