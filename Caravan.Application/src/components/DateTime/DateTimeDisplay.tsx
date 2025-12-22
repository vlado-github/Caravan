import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const DateTimeDisplay: React.FC<{ dateTime: Date | null | undefined, label: string }> = ({ dateTime, label }) => {
  const { t } = useTranslation();

  if (!dateTime) {
    return <></>;
  }

  return(
    <>
      <label>{label}: </label>
      {dayjs(dateTime).format(t("date-format"))} {t("At the time")} {dayjs(dateTime).format(t("time-format"))}
    </>
  );
}

export default DateTimeDisplay;