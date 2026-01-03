import CreateSocialEventModal from "./CreateSocialEventModal";

class AppModals {
  public static modalKeys = {
    createSocialEvent: 'createSocialEvent',
  };

  public static modals = [
    { title: this.modalKeys.createSocialEvent, modal: CreateSocialEventModal },
  ];

  public static getModals() {
    return Object.fromEntries(this.modals.map((item) => [item.title, item.modal]));
  }
}

export default AppModals;