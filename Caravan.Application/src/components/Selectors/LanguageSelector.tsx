import { Select } from "@mantine/core";
import { DefaultConsts } from "../../consts/DefaultConsts";
import { t } from "i18next";
import i18n from "../../i18n";
import { useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";

interface LanguageSelectorProps {
  onClose?: () => void;
}

const LanguageSelector : React.FC<LanguageSelectorProps> = ({onClose}) => {
    const navigate = useNavigate();
    const savedLanguage = localStorage.getItem(DefaultConsts.LanguageStorageKey) ?? DefaultConsts.DefaultLanguage.value;

    return(
        <Select
            defaultValue={savedLanguage}
            placeholder={t("Pick language")}
            data={DefaultConsts.SupportedLanguages}
            onChange={(val, _) => {
                const language = DefaultConsts.SupportedLanguages.filter(lang => lang.value === val)[0] ?? savedLanguage;
                localStorage.setItem(DefaultConsts.LanguageStorageKey, language.value);
                i18n.changeLanguage(language.value);
                dayjs.locale(language.value);
                onClose?.();
                navigate({to: '.'});
            }}/>
    );
};

export default LanguageSelector;