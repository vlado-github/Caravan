import { Button } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";

interface AttendButtonProps {
  groupId?: string | null;
  onJoin: (eventId: string) => void;
}

const AttendButton : React.FC<AttendButtonProps> = ({ groupId, onJoin }) => {
  const auth = useAuth();
  const { t, i18n } = useTranslation();

  if (!groupId) {
    return <></>;
  }

  const handleJoinGroup = async () => {
    if (!auth.isAuthenticated) {  
      await auth.signinRedirect({ ui_locales: i18n.language, redirect_uri: window.location.href });
      return;
    }
    onJoin(groupId);
  };

  return (
    
    <Button onClick={handleJoinGroup}>
      {t("Join group")}
    </Button>
  );
}

export default AttendButton;