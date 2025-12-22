import type { SocialEventStatus } from "../../api/base/enums/SocialEventStatus";
import type { SocialEventType } from "../../api/base/enums/SocialEventType";

export type PreviewViewModel = {
  id: string;
  title: string;
  description: string;
  type: SocialEventType;
  status: SocialEventStatus;
  isPrivate: boolean;
  venue: string;
  city: string;
  location: {
    longitude: number;
    latitude: number;
  };
  startTime: Date;
  endTime: Date | null;
  ticketCirculationCount: number;
  imageUrl: string;
  createdById: string;
  createdAt: Date;
  publishedAt: Date | null;
  cancelledAt: Date | null;
  archivedAt: Date | null;
  isLoading: boolean;
}