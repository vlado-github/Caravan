//import { useAuth } from "react-oidc-context";

import { Button } from "@mantine/core";
import { t } from "i18next";
import { useAuth } from "react-oidc-context";
import { useTranslation } from "react-i18next";

interface SigninButtonProps {
  onClose?: () => void;
}

const SigninButton: React.FC<SigninButtonProps> = ({onClose}) => {
  const auth = useAuth();

  const { i18n } = useTranslation();

  const handleSignin = async () => {
    onClose?.();
    await auth.signinRedirect({ ui_locales: i18n.language });
  };

  return (
    <Button onClick={handleSignin}>
      {t("Signin")}
    </Button>
  );
};
export default SigninButton;