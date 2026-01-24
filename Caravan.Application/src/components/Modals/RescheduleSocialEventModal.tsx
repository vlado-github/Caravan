import { Button, Stack, Group } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import type { ContextModalProps } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import { z } from "zod/v4";
import dayjs from "dayjs";
import type { RescheduleSocialEventRequest } from "../../api/socialevents/requests/RescheduleSocialEventRequest";
import { useRescheduleSocialEvent } from "../../api/socialevents/commands/reschedule-social-event";

const schema = z.object({
  startTime: z.date(),
  endTime: z.date().nullable().optional(),
})
.superRefine((data, context) => {
  if (data.startTime && data.endTime && data.endTime <= data.startTime) {
    context.addIssue({
      path: ['endTime'],
      message: "End Time must be after Start Time",
      code: "custom",
    });
  }
});

const RescheduleSocialEventModal = ({
  context,
  innerProps,
  id,
}: ContextModalProps<{ modalData: RescheduleSocialEventRequest }>) => {
  const { t } = useTranslation();
  const form = useForm<RescheduleSocialEventRequest>({
    initialValues: {
      socialEventId: innerProps.modalData.socialEventId,
      startTime: innerProps.modalData.startTime,
      endTime: innerProps.modalData.endTime,
    },
    validate: zod4Resolver(schema),
  });

  const { mutate } = useRescheduleSocialEvent();

  const handleSubmit = (values: RescheduleSocialEventRequest) => {
    mutate(values, {
      onSuccess: () => {
        context.closeModal(id);
        notifications.show({
          title: t("Success"),
          color: "green",
          autoClose: 3000,
          message: `${t("Social event rescheduled successfully")}.`,
        });
      },
      onError: (error: Error) => {
        notifications.show({
          title: t("Error"),
          color: "red",
          message: `${t("Failed to reschedule social event:")} ${error.message}`,
        });
      },
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <DateTimePicker
          label={t("Start Time")}
          required
          value={form.values.startTime} 
          onChange={(val) => form.setFieldValue("startTime", dayjs(val).toDate())} />
        <DateTimePicker
          label={t("End Time")}
          value={form.values.endTime} 
          onChange={(val) => form.setFieldValue("endTime", dayjs(val).toDate())} />

        <Group justify="space-between">
          <Button variant="outline" onClick={() => context.closeModal(id)}>
            {t("Cancel")}
          </Button>
          <Button type="submit">{t("Save")}</Button>
        </Group>
      </Stack>
    </form>
  );
};

export default RescheduleSocialEventModal;
