import CreateGroupModal from "./CreateGroupModal";
import CreateSocialEventModal from "./CreateSocialEventModal";
import RescheduleSocialEventModal from "./RescheduleSocialEventModal";

class AppModals {
  public static modalKeys = {
    createSocialEvent: 'createSocialEvent',
    createGroup: 'createGroup',
    publishSocialEvent: 'publishSocialEvent',
    rescheduleSocialEvent: 'rescheduleSocialEvent',
  };

  public static modals = [
    { title: this.modalKeys.createSocialEvent, modal: CreateSocialEventModal },
    { title: this.modalKeys.createGroup, modal: CreateGroupModal },
    { title: this.modalKeys.rescheduleSocialEvent, modal: RescheduleSocialEventModal },
  ];

  public static getModals() {
    return Object.fromEntries(this.modals.map((item) => [item.title, item.modal]));
  }
}

export default AppModals;