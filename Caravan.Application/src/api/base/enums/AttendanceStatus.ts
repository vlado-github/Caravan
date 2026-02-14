export const AttendanceStatus = {
  Attending: 0,
  Maybe: 1
} as const;

export type AttendanceStatus = typeof AttendanceStatus[keyof typeof AttendanceStatus];

export function getAllAttendanceStatus(): {
  value: string;
  label: string;
}[] {
  return Object.entries(AttendanceStatus).map(([key, value]) => ({
    value: value.toString(),
    label: key
  }));
}