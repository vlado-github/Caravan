//import { useAuth } from "react-oidc-context";

import { Button } from "@mantine/core";
import { t } from "i18next";
import { useAuth } from "react-oidc-context";

interface SignoutButtonProps {
  onClose?: () => void;
}

const SignoutButton: React.FC<SignoutButtonProps> = ({onClose}) => {
  const auth = useAuth();

  const handleSignout = async () => {
    onClose?.();
    await auth.signoutRedirect();
  };

  return (
    <Button onClick={handleSignout}>
      {t("Logout")}
    </Button>
  );
};
export default SignoutButton;