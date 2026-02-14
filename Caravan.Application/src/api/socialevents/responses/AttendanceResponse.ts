import type { AttendanceStatus } from "../../base/enums/AttendanceStatus";

export type AttendanceResponse = {
  id: string;
	eventId: string;
  title: string;
  startTime: Date;
  attendanceStatus: AttendanceStatus;
}
