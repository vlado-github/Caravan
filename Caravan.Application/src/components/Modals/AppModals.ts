import CreateGroupModal from "./CreateGroupModal";
import CreateSocialEventModal from "./CreateSocialEventModal";

class AppModals {
  public static modalKeys = {
    createSocialEvent: 'createSocialEvent',
    createGroup: 'createGroup',
    publishSocialEvent: 'publishSocialEvent',
  };

  public static modals = [
    { title: this.modalKeys.createSocialEvent, modal: CreateSocialEventModal },
    { title: this.modalKeys.createGroup, modal: CreateGroupModal },
  ];

  public static getModals() {
    return Object.fromEntries(this.modals.map((item) => [item.title, item.modal]));
  }
}

export default AppModals;