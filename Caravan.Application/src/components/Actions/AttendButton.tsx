import { Button } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";

interface AttendButtonProps {
  eventId: string;
  onAttend: (eventId: string) => void;
}

const AttendButton : React.FC<AttendButtonProps> = ({ eventId, onAttend }) => {
  const auth = useAuth();
  const { t, i18n } = useTranslation();

  const handleAttend = async () => {
    if (!auth.isAuthenticated) {  
      await auth.signinRedirect({ ui_locales: i18n.language, redirect_uri: window.location.href });
      return;
    }

    onAttend(eventId);
  };

  return (
    
    <Button onClick={handleAttend}>
      {t("Attend")}
    </Button>
  );
}

export default AttendButton;