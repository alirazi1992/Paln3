import React from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

interface PersianDateTimePickerProps {
  value: string; // stored as ISO string or empty
  onChange: (value: string) => void;
  placeholder?: string;
}

export const PersianDateTimePicker: React.FC<PersianDateTimePickerProps> = ({
  value,
  onChange,
  placeholder = "تاریخ را انتخاب کنید",
}) => {
  // convert stored ISO string → DateObject for the picker
  const dateValue = React.useMemo(() => {
    if (!value) return undefined;
    try {
      return new DateObject({
        date: new Date(value),
        calendar: persian,
        locale: persian_fa,
      });
    } catch {
      return undefined;
    }
  }, [value]);

  const handleChange = (date: DateObject | null | undefined) => {
    if (!date) {
      onChange("");
      return;
    }
    // store as ISO string so backend / other parts can read it
    onChange(date.toDate().toISOString());
  };

  return (
    <div dir="rtl" className="w-full text-right">
      <DatePicker
        value={dateValue}
        onChange={handleChange}
        calendar={persian}
        locale={persian_fa}
        format="YYYY/MM/DD"
        inputClass="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
        containerClassName="w-full"
        placeholder={placeholder}
        calendarPosition="bottom-right"
      />
    </div>
  );
};
