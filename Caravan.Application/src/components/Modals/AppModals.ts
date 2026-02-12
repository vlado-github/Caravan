import CreateGroupModal from "./CreateGroupModal";
import CreateSocialEventModal from "./CreateSocialEventModal";
import RescheduleSocialEventModal from "./RescheduleSocialEventModal";
import UpdateGroupModal from "./UpdateGroupModal";

class AppModals {
  public static modalKeys = {
    createSocialEvent: 'createSocialEvent',
    createGroup: 'createGroup',
    publishSocialEvent: 'publishSocialEvent',
    rescheduleSocialEvent: 'rescheduleSocialEvent',
    updateGroup: 'updateGroup',
    joinGroup: 'joinGroup',
    leaveGroup: 'leaveGroup',
  };

  public static modals = [
    { title: this.modalKeys.createSocialEvent, modal: CreateSocialEventModal },
    { title: this.modalKeys.createGroup, modal: CreateGroupModal },
    { title: this.modalKeys.rescheduleSocialEvent, modal: RescheduleSocialEventModal },
    { title: this.modalKeys.updateGroup, modal: UpdateGroupModal },
  ];

  public static getModals() {
    return Object.fromEntries(this.modals.map((item) => [item.title, item.modal]));
  }
}

export default AppModals;