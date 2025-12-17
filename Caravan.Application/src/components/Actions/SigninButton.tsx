//import { useAuth } from "react-oidc-context";

import { Button } from "@mantine/core";
import { t } from "i18next";
import { useAuth } from "react-oidc-context";
import { DefaultConsts } from "../../consts/DefaultConsts";

interface SigninButtonProps {
  onClose?: () => void;
}

const SigninButton: React.FC<SigninButtonProps> = ({onClose}) => {
  const auth = useAuth();

  const language =
    localStorage.getItem(DefaultConsts.LanguageStorageKey) ??
    DefaultConsts.DefaultLanguage.value;

  const handleSignin = async () => {
    onClose?.();
    await auth.signinRedirect({ ui_locales: language });
  };

  return (
    <Button onClick={handleSignin}>
      {t("Signin")}
    </Button>
  );
};
export default SigninButton;