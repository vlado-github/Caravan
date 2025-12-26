import { TextInput, Button, Stack, Group } from "@mantine/core";
import type { ContextModalProps } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import type { CreateSocialEventRequest } from "../../api/socialevents/requests/CreateSocialEventRequest";
import { useCreateSocialEvent } from "../../api/socialevents/commands/create-social-event";

const CreateSocialEventModal = ({
  context,
  id,
  innerProps,
}: ContextModalProps<{ modalData: CreateSocialEventRequest }>) => {
  const { t } = useTranslation();
  const form = useForm<CreateSocialEventRequest>({
    initialValues: {
      ...innerProps.modalData,
    },

    validate: {
      title: (value) =>
        value.trim().length === 0
          ? `${t("Title")} ${t("is required")}`
          : null,
      description: (value) =>
        value.trim().length === 0 ? `${t("Description")} ${t("is required")}` : null,
    },
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
