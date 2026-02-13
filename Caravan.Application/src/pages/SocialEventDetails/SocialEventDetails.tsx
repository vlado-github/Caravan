import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../AppRouter";
import { useQueryResult } from "./useQueryResult";
import Preview from "../../components/Preview/Preview";
import { Button, Loader } from "@mantine/core";
import { modals } from "@mantine/modals";
import AppModals from "../../components/Modals/AppModals";
import { useTranslation } from "react-i18next";
import type { SubmitAttendnanceRequest } from "../../api/socialevents/requests/SubmitAttendanceRequest";

const SocialEventDetails : React.FC = () => {
  const result = useQueryResult();
  const {t} = useTranslation();

  if (result.isLoading) {
    return <Loader size="md" />; 
  }

  const actions = (
    <Button onClick={() => {
        modals.openContextModal({
            modal: AppModals.modalKeys.submitAttendance,
            title: t('RSVP'),
            innerProps: {
                modalData:  {
                  socialEventId: result.id,
                  title: result.title,
                  startTime: result.startTime,
                } as SubmitAttendnanceRequest
            }
        });
    }}>
        {t('Attend')}
    </Button>
  );
  
  return(<Preview actions={actions} event={result}/>);
} 

// eslint-disable-next-line react-refresh/only-export-components
export const socialEventDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/event/$eventId",
  component: SocialEventDetails
});

export default SocialEventDetails;