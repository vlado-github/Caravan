import type { ZodUUID } from "zod";
import type { SocialEventType } from "../../base/enums/SocialEventType";

export type CreateSocialEventRequest = {
	title: string;
	description: string;
  type: SocialEventType;
  venue: string;
  socialGroupId: ZodUUID | undefined;
  startTime: Date;
  endTime: Date | undefined;
  ticketCirculationCount: number | undefined;
}
