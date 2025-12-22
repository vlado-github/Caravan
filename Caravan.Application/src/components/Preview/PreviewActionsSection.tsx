import AttendButton from "../Actions/AttendButton";
import JoinGroupButton from "../Actions/JoinGroupButton";

interface PreviewActionsSectionProps {
  eventId: string;
  groupId?: string | null;
}

const PreviewActionsSection: React.FC<PreviewActionsSectionProps> = ({ eventId, groupId }) => {
  return (
    <div>
      <JoinGroupButton groupId={groupId} onJoin={() => {}} />
      <AttendButton eventId={eventId} onAttend={() => {}} />
    </div>
  );
};

export default PreviewActionsSection;