import type { SocialEventStatus } from "../../base/enums/SocialEventStatus";
import type { SocialEventType } from "../../base/enums/SocialEventType";

export type SocialEventResponse = {
  id: string;
	title: string;
  description: string;
  type: SocialEventType;
  status: SocialEventStatus;
  venue: string;
  startTime: Date;
  endTime: Date | null;
  ticketCirculationCount: number;
  imageUrl: string;
}
