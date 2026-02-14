import { Button, Stack, Group, Radio } from "@mantine/core";
import type { ContextModalProps } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import type { SubmitAttendnanceRequest } from "../../api/socialevents/requests/SubmitAttendanceRequest";
import { useAttendSocialEvent } from "../../api/socialevents/commands/submit-attendance";
import { AttendanceStatus, getAllAttendanceStatus } from "../../api/base/enums/AttendanceStatus";

const SubmitAttendanceModal = ({
  context,
  innerProps,
  id,
}: ContextModalProps<{ modalData: SubmitAttendnanceRequest; onSuccess?: () => void }>) => {
  const { t } = useTranslation();
  const form = useForm<SubmitAttendnanceRequest>({
    initialValues: {
      socialEventId: innerProps.modalData.socialEventId,
      startTime: innerProps.modalData.startTime,
      title: innerProps.modalData.title,
      attendanceStatus: AttendanceStatus.Attending
    },
  });

  const { mutate } = useAttendSocialEvent();

  const handleSubmit = (values: SubmitAttendnanceRequest) => {
    mutate(values, {
      onSuccess: () => {
        context.closeModal(id);
        innerProps.onSuccess?.();
        notifications.show({
          title: t("Success"),
          color: "green",
          autoClose: 3000,
          message: `${t("Social event RSVP successful")}.`,
        });
      },
      onError: (error: Error) => {
        notifications.show({
          title: t("Error"),
          color: "red",
          message: `${t("Failed to RSVP social event:")} ${error.message}`,
        });
      },
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Radio.Group {...form.getInputProps('attendanceStatus')} onChange={(val) => form.setFieldValue("attendanceStatus", Number(val) as AttendanceStatus)} >
          <Group mt="xs">
            {getAllAttendanceStatus().map(x => (
              <Radio key={`${x.value}:${x.label}`} value={Number(x.value)} label={x.label} />
            ))}
          </Group>
        </Radio.Group>


        <Group justify="space-between">
          <Button variant="outline" onClick={() => context.closeModal(id)}>
            {t("Cancel")}
          </Button>
          <Button type="submit">{t("Confirm")}</Button>
        </Group>
      </Stack>
    </form>
  );
};

export default SubmitAttendanceModal;
