import type { SocialEventType } from "../../base/enums/SocialEventType";

export type CreateSocialEventRequest = {
	title: string;
	description: string;
  type: SocialEventType;
  venue: string;
  socialGroupId: string | undefined;
  startTime: Date;
  endTime: Date | undefined;
  ticketCirculationCount: number | undefined;
}
