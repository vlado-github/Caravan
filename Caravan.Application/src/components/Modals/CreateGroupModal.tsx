import { TextInput, Button, Stack, Group } from "@mantine/core";
import type { ContextModalProps } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import { z } from "zod/v4";
import type { CreateGroupRequest } from "../../api/groups/requests/CreateGroupRequest";
import { useCreateGroup } from "../../api/groups/commands/create-group";

const schema = z.object({
  socialGroupName: z
    .string()
    .min(2, { message: 'Name should have at least 2 letters' }),
});

export const CreateGroupForm = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const form = useForm<CreateGroupRequest>({
    initialValues: {
      socialGroupName: "",
    },
    validate: zod4Resolver(schema),
  });

  const { mutate } = useCreateGroup();

  const handleSubmit = (values: CreateGroupRequest) => {
    mutate(values, {
      onSuccess: () => {
        onClose();
        notifications.show({
          title: t("Success"),
          color: "green",
          autoClose: 3000,
          message: `${t("Group")} '${values.socialGroupName}' ${t("created successfully")}.`,
        });
      },
      onError: (error: Error) => {
        notifications.show({
          title: t("Error"),
          color: "red",
          message: `${t("Failed to create group:")} ${error.message}`,
        });
      },
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label={t("Name")}
          required
          {...form.getInputProps("socialGroupName")}
        />

        <Group justify="space-between">
          <Button variant="outline" onClick={onClose}>
            {t("Cancel")}
          </Button>
          <Button type="submit">{t("Create")}</Button>
        </Group>
      </Stack>
    </form>
  );
};

const CreateGroupModal = ({
  context,
  id,
}: ContextModalProps<{ modalData: CreateGroupRequest }>) => {
  return <CreateGroupForm onClose={() => context.closeModal(id)} />;
};

export default CreateGroupModal;
