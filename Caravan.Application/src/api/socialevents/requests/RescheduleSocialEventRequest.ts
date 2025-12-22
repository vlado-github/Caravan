export type RescheduleSocialEventRequest = {
  socialEventId: string;
  startTime: Date;
  endTime: Date | null;
}