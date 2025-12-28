import { TextInput, Button, Stack, Group, Select, NumberInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import type { ContextModalProps } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import type { CreateSocialEventRequest } from "../../api/socialevents/requests/CreateSocialEventRequest";
import { useCreateSocialEvent } from "../../api/socialevents/commands/create-social-event";
import { z } from "zod/v4";
import { getAllSocialEventTypes, SocialEventType } from "../../api/base/enums/SocialEventType";

const schema = z.object({
  title: z
    .string()
    .min(2, { message: 'Name should have at least 2 letters' }),
  description: z.string()
    .min(50, { message: 'Name should have at least 50 letters' }),
  type: z.enum(SocialEventType),
  venue: z.string().optional(),
  socialGroupId: z.uuid().nullable().optional(),
  startTime: z.date(),
  endTime: z.date().nullable().optional(),
  ticketCirculationCount: z.number().gt(0, { message: 'Ticket circulation count must be greater than 0' }).nullable().optional(),
})
.superRefine((data, context) => {
  if (data.type === SocialEventType.OnSite && !data.venue) {
    context.addIssue({
      path: ['venue'],
      message: "Venue is required for OnSite events",
      code: "custom",
    });
  }
  if (data.startTime && data.endTime && data.endTime <= data.startTime) {
    context.addIssue({
      path: ['endTime'],
      message: "End Time must be after Start Time",
      code: "custom",
    });
  }
});

const CreateSocialEventModal = ({
  context,
  id,
}: ContextModalProps<{ modalData: CreateSocialEventRequest }>) => {
  const { t } = useTranslation();
  const form = useForm<CreateSocialEventRequest>({
    initialValues: {
      title: "",
      description: "",
      type: SocialEventType.OnSite,
      venue: "",
      socialGroupId: undefined,
      startTime: new Date(),
      endTime: undefined,
      ticketCirculationCount: undefined,
    },
    validate: zod4Resolver(schema),
  });

  const { mutate } = useCreateSocialEvent();

  const handleSubmit = (values: CreateSocialEventRequest) => {
    mutate(values, {
      onSuccess: () => {
        context.closeModal(id);
        notifications.show({
          title: t("Success"),
          color: "green",
          autoClose: 3000,
          message: `${t("Social event")} '${values.title}' ${t("created successfully")}.`,
        });
      },
      onError: (error: Error) => {
        notifications.show({
          title: t("Error"),
          color: "red",
          message: `${t("Failed to create social event:")} ${error.message}`,
        });
      },
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label={t("Title")}
          required
          {...form.getInputProps("title")}
        />
        <TextInput 
          label={t("Description")} 
          required 
          {...form.getInputProps("description")} />
        <Select
          label={t("Type")} 
          placeholder={t("Pick Event Type")}
          data={getAllSocialEventTypes()}
          value={form.values.type.toString()} 
          onChange={(val) => form.setFieldValue("type", Number(val) as SocialEventType)}
          required />
        <TextInput 
          label={t("Venue")} 
          {...form.getInputProps("venue")} />
        <TextInput 
          label={t("Group")} 
          {...form.getInputProps("socialGroupId")} />
        <DateTimePicker
          label={t("Start Time")}
          required
          {...form.getInputProps("startTime")} />
        <DateTimePicker
          label={t("End Time")}
          {...form.getInputProps("endTime")} />
        <NumberInput
          label={t("Ticket Circulation Count")}
          {...form.getInputProps("ticketCirculationCount")} />
      </Stack>

      <Group>
        <Button variant="outline" onClick={() => context.closeModal(id)}>
          {t("Cancel")}
        </Button>
        <Button type="submit">{t("Create")}</Button>
      </Group>
    </form>
  );
};

export default CreateSocialEventModal;
