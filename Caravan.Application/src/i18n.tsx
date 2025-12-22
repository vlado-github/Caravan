import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import englishTranslation from './locales/en/translation.json';
import bosnianTranslation from './locales/bs/translation.json';
import serbianTranslation from './locales/sr/translation.json';
import croatianTranslation from './locales/hr/translation.json';
import { DefaultConsts } from "./consts/DefaultConsts";
import 'dayjs/locale/en';
import 'dayjs/locale/bs';
import 'dayjs/locale/sr';
import 'dayjs/locale/hr';
import dayjs from "dayjs";

const resources = {
  en: { translation: englishTranslation },
  bs: { translation: bosnianTranslation },
  sr: { translation: serbianTranslation },
  hr: { translation: croatianTranslation },
};

const savedLanguage =
  localStorage.getItem(DefaultConsts.LanguageStorageKey) ?? DefaultConsts.DefaultLanguage.value;

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: savedLanguage, 
    fallbackLng: savedLanguage,
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

dayjs.locale(savedLanguage);

export default i18n;