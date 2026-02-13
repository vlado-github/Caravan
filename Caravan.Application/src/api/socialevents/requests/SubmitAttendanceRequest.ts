import type { AttendanceStatus } from "../../base/enums/AttendanceStatus";

export type SubmitAttendnanceRequest = {
  socialEventId: string;
  title: string;
  startTime: Date;
  attendanceStatus: AttendanceStatus;
}