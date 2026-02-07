import { TextInput, Button, Stack, Group } from "@mantine/core";
import type { ContextModalProps } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import { z } from "zod/v4";
import type { UpdateGroupRequest } from "../../api/groups/requests/UpdateGroupRequest";
import { useUpdateGroup } from "../../api/groups/commands/update-group";

const schema = z.object({
  socialGroupName: z
    .string()
    .min(2, { message: 'Name should have at least 2 letters' }),
});

const UpdateGroupModal = ({
  context,
  innerProps,
  id,
}: ContextModalProps<{ modalData: UpdateGroupRequest}>) => {
  const { t } = useTranslation();
  const form = useForm<UpdateGroupRequest>({
    initialValues: {
      socialGroupId: innerProps.modalData.socialGroupId,
      socialGroupName: innerProps.modalData.socialGroupName,
    },
    validate: zod4Resolver(schema),
  });

  const { mutate } = useUpdateGroup();

  const handleSubmit = (values: UpdateGroupRequest) => {
    mutate(values, {
      onSuccess: () => {
        context.closeModal(id);
        notifications.show({
          title: t("Success"),
          color: "green",
          autoClose: 3000,
          message: `${t("Group")} '${values.socialGroupName}' ${t("updated successfully")}.`,
        });
      },
      onError: (error: Error) => {
        notifications.show({
          title: t("Error"),
          color: "red",
          message: `${t("Failed to update group:")} ${error.message}`,
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
          <Button variant="outline" onClick={() => context.closeModal(id)}>
            {t("Cancel")}
          </Button>
          <Button type="submit">{t("Update")}</Button>
        </Group>
      </Stack>
    </form>
  );
};

export default UpdateGroupModal;
