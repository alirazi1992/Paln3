import React, { useMemo, useState } from "react";
import { WorkspaceAppShell } from "../components/layout/WorkspaceAppShell";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";

type TechnicianEventType = "inspection" | "lab" | "meeting" | "followup";
type TechnicianShift = "morning" | "evening" | "night";

type TechnicianEvent = {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  ship: string;
  technician: string;
  type: TechnicianEventType;
  shift: TechnicianShift;
  sla?: string;
  color: string;
};

const technicians = ["سارا احمدی", "محمد رضوی", "مهدی سلیمانی", "فاطمه کریمی"];

const eventTypes: { id: TechnicianEventType; label: string }[] = [
  { id: "inspection", label: "بازرسی میدانی" },
  { id: "lab", label: "تحلیل آزمایشگاهی" },
  { id: "meeting", label: "جلسه هماهنگی" },
  { id: "followup", label: "پیگیری و گزارش" },
];

const shifts: { id: TechnicianShift; label: string }[] = [
  { id: "morning", label: "شیفت صبح" },
  { id: "evening", label: "شیفت عصر" },
  { id: "night", label: "شیفت شب" },
];

// چند رویداد نمونه برای تست UI
const technicianEvents: TechnicianEvent[] = [
  {
    id: "e1",
    date: "2025-11-24",
    title: "بازرسی بدنه کشتی Azar-1",
    ship: "Azar-1",
    technician: "سارا احمدی",
    type: "inspection",
    shift: "morning",
    sla: "تا ۱۲:۰۰",
    color: "#22c55e",
  },
  {
    id: "e2",
    date: "2025-11-24",
    title: "تحلیل نتایج ارتعاش",
    ship: "Azar-1",
    technician: "محمد رضوی",
    type: "lab",
    shift: "evening",
    sla: "تا ۱۹:۰۰",
    color: "#06b6d4",
  },
  {
    id: "e3",
    date: "2025-11-25",
    title: "جلسه هماهنگی با مالک",
    ship: "Sea Star",
    technician: "فاطمه کریمی",
    type: "meeting",
    shift: "morning",
    sla: "۱۰:۰۰ – ۱۰:۳۰",
    color: "#3b82f6",
  },
  {
    id: "e4",
    date: "2025-11-25",
    title: "بازرسی الکتریک ژنراتور ۲",
    ship: "Sea Star",
    technician: "مهدی سلیمانی",
    type: "inspection",
    shift: "evening",
    color: "#f97316",
  },
  {
    id: "e5",
    date: "2025-11-26",
    title: "پیگیری اقدامات اصلاحی",
    ship: "UTN-2045",
    technician: "سارا احمدی",
    type: "followup",
    shift: "morning",
    color: "#a855f7",
  },
  {
    id: "e6",
    date: "2025-11-27",
    title: "آزمایش روغن موتور اصلی",
    ship: "Blue Gulf",
    technician: "محمد رضوی",
    type: "lab",
    shift: "morning",
    color: "#0ea5e9",
  },
  {
    id: "e7",
    date: "2025-11-27",
    title: "جلسه شبانه با تیم شب",
    ship: "Blue Gulf",
    technician: "مهدی سلیمانی",
    type: "meeting",
    shift: "night",
    color: "#f97316",
  },
  {
    id: "e8",
    date: "2025-11-29",
    title: "بازرسی نهایی و تحویل",
    ship: "UTN-2101",
    technician: "فاطمه کریمی",
    type: "inspection",
    shift: "evening",
    color: "#22c55e",
  },
];

// کمک برای تبدیل عدد به فارسی
function toFaNumber(value: number): string {
  return value.toLocaleString("fa-IR");
}

// ساخت کلید تاریخ (YYYY-MM-DD)
function dateKey(date: Date): string {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const mm = m < 10 ? `0${m}` : `${m}`;
  const dd = d < 10 ? `0${d}` : `${d}`;
  return `${y}-${mm}-${dd}`;
}

// نام ماه به فارسی (با تقویم میلادی ولی نمایش فارسی)
function persianMonthLabel(year: number, month: number): string {
  const d = new Date(year, month, 1);
  return d.toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
  });
}

// تولید سلول‌های ماه (۶ هفته × ۷ روز)
function buildMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // شروع هفته از شنبه (ش)
  // getDay(): 0=Sunday..6=Saturday → ما می‌خواهیم 0=Saturday
  const weekday = firstDay.getDay(); // 0..6
  const startIndex = weekday === 6 ? 0 : weekday + 1; // شنبه → 0, یکشنبه → 1, ...

  const cells: (Date | null)[] = [];

  for (let i = 0; i < 42; i++) {
    const dayNumber = i - startIndex + 1;
    if (dayNumber < 1 || dayNumber > daysInMonth) {
      cells.push(null);
    } else {
      cells.push(new Date(year, month, dayNumber));
    }
  }

  return cells;
}

export function TechnicianCalendar() {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(() => ({
    year: today.getFullYear(),
    month: today.getMonth(), // 0-11
  }));

  const [selectedDate, setSelectedDate] = useState<Date | null>(today);

  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<TechnicianEventType[]>([]);
  const [selectedShifts, setSelectedShifts] = useState<TechnicianShift[]>([]);

  const { year, month } = currentMonth;

  const gridCells = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const filteredEvents = useMemo(() => {
    return technicianEvents.filter((ev) => {
      const techOk =
        selectedTechnicians.length === 0 ||
        selectedTechnicians.includes(ev.technician);
      const typeOk =
        selectedTypes.length === 0 || selectedTypes.includes(ev.type);
      const shiftOk =
        selectedShifts.length === 0 || selectedShifts.includes(ev.shift);
      return techOk && typeOk && shiftOk;
    });
  }, [selectedTechnicians, selectedTypes, selectedShifts]);

  const eventsByDateKey = useMemo(() => {
    const map: Record<string, TechnicianEvent[]> = {};
    filteredEvents.forEach((ev) => {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    return map;
  }, [filteredEvents]);

  const selectedDateKey = selectedDate ? dateKey(selectedDate) : "";
  const eventsForSelectedDate = selectedDateKey
    ? eventsByDateKey[selectedDateKey] || []
    : [];

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      let m = prev.month - 1;
      let y = prev.year;
      if (m < 0) {
        m = 11;
        y -= 1;
      }
      return { year: y, month: m };
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      let m = prev.month + 1;
      let y = prev.year;
      if (m > 11) {
        m = 0;
        y += 1;
      }
      return { year: y, month: m };
    });
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentMonth({
      year: now.getFullYear(),
      month: now.getMonth(),
    });
    setSelectedDate(now);
  };

  const toggleTechnician = (name: string) => {
    setSelectedTechnicians((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    );
  };

  const toggleType = (type: TechnicianEventType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleShift = (shift: TechnicianShift) => {
    setSelectedShifts((prev) =>
      prev.includes(shift) ? prev.filter((s) => s !== shift) : [...prev, shift]
    );
  };

  return (
    <WorkspaceAppShell>
      <div dir="rtl" lang="fa" className="space-y-6">
        {/* هدر صفحه */}
        <section className="flex flex-row-reverse items-center justify-between">
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">
              مرکز عملیات · تقویم تکنسین‌ها
            </p>
            <h1 className="text-2xl font-semibold text-gray-900">
              تقویم برنامه‌ریزی تکنسین‌ها
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              مشاهده برنامه روزانه، شیفت‌ها و جلسات هماهنگی تیم فنی
            </p>
          </div>
          <div className="flex flex-row-reverse gap-2">
            <Button variant="secondary" size="sm" onClick={handleToday}>
              امروز
            </Button>
            <Button variant="secondary" size="sm" onClick={handlePrevMonth}>
              ماه قبل
            </Button>
            <Button variant="secondary" size="sm" onClick={handleNextMonth}>
              ماه بعد
            </Button>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[2.1fr,1.1fr]">
          {/* تقویم اصلی */}
          <Card className="p-5 space-y-5">
            <div className="flex flex-row-reverse items-center justify-between mb-2">
              <h2 className="text-base font-semibold text-gray-900">
                {persianMonthLabel(year, month)}
              </h2>
              <span className="text-xs text-gray-500">
                برای مشاهده جزئیات روی هر روز کلیک کنید
              </span>
            </div>

            {/* نام روزهای هفته */}
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-gray-500 mb-1">
              <div>ش</div>
              <div>ی</div>
              <div>د</div>
              <div>س</div>
              <div>چ</div>
              <div>پ</div>
              <div>ج</div>
            </div>

            {/* سلول‌های ماه */}
            <div className="grid grid-cols-7 gap-1">
              {gridCells.map((cellDate, index) => {
                if (!cellDate) {
                  return (
                    <div
                      key={index}
                      className="h-24 rounded-2xl border border-transparent"
                    />
                  );
                }

                const key = dateKey(cellDate);
                const dayEvents = eventsByDateKey[key] || [];
                const isToday = dateKey(cellDate) === dateKey(today);
                const isSelected =
                  selectedDate && dateKey(selectedDate) === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedDate(cellDate)}
                    className={`h-24 rounded-2xl border flex flex-col justify-between px-2 py-1 text-right transition ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : isToday
                        ? "border-emerald-400 bg-emerald-50"
                        : "border-gray-100 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex flex-row-reverse items-center justify-between">
                      <span className="text-xs font-semibold text-gray-800">
                        {toFaNumber(cellDate.getDate())}
                      </span>
                      {isToday && (
                        <span className="text-[10px] text-emerald-600">
                          امروز
                        </span>
                      )}
                    </div>

                    <div className="flex-1 mt-1 space-y-0.5 overflow-hidden">
                      {dayEvents.slice(0, 3).map((ev) => (
                        <div
                          key={ev.id}
                          className="text-[10px] truncate rounded-md px-1 py-0.5 text-white"
                          style={{ backgroundColor: ev.color }}
                        >
                          {ev.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-[10px] text-gray-500">
                          +{toFaNumber(dayEvents.length - 3)} مورد دیگر
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* فیلترها + جزئیات روز انتخاب‌شده */}
          <div className="space-y-4">
            {/* فیلترها */}
            <Card className="p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 text-right">
                فیلترها
              </h3>

              {/* تکنسین‌ها */}
              <div className="space-y-1">
                <p className="text-[11px] text-gray-500 text-right">
                  تکنسین‌ها
                </p>
                <div className="flex flex-wrap gap-1 justify-end">
                  {technicians.map((tech) => {
                    const active = selectedTechnicians.includes(tech);
                    return (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => toggleTechnician(tech)}
                        className={`px-2 py-1 rounded-full text-[11px] border ${
                          active
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {tech}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* نوع فعالیت */}
              <div className="space-y-1">
                <p className="text-[11px] text-gray-500 text-right">
                  نوع فعالیت
                </p>
                <div className="flex flex-wrap gap-1 justify-end">
                  {eventTypes.map((t) => {
                    const active = selectedTypes.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleType(t.id)}
                        className={`px-2 py-1 rounded-full text-[11px] border ${
                          active
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* شیفت‌ها */}
              <div className="space-y-1">
                <p className="text-[11px] text-gray-500 text-right">شیفت‌ها</p>
                <div className="flex flex-wrap gap-1 justify-end">
                  {shifts.map((s) => {
                    const active = selectedShifts.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleShift(s.id)}
                        className={`px-2 py-1 rounded-full text-[11px] border ${
                          active
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* دکمه ریست */}
              <div className="flex flex-row-reverse justify-between items-center pt-1">
                <span className="text-[10px] text-gray-400">
                  اگر چیزی انتخاب نشود، همه موارد نمایش داده می‌شود.
                </span>
                <button
                  type="button"
                  className="text-[11px] text-blue-600 hover:text-blue-700 flex items-center gap-1 flex-row-reverse"
                  onClick={() => {
                    setSelectedTechnicians([]);
                    setSelectedTypes([]);
                    setSelectedShifts([]);
                  }}
                >
                  <Icon name="refresh" size={14} />
                  ریست
                </button>
              </div>
            </Card>

            {/* جزئیات روز انتخاب‌شده */}
            <Card className="p-4 space-y-3">
              <div className="flex flex-row-reverse items-center justify-between">
                <div className="text-right">
                  <p className="text-[11px] text-gray-500 mb-0.5">
                    برنامه روز انتخاب‌شده
                  </p>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {selectedDate
                      ? selectedDate.toLocaleDateString("fa-IR", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })
                      : "هیچ روزی انتخاب نشده"}
                  </h3>
                </div>
              </div>

              {eventsForSelectedDate.length === 0 ? (
                <p className="text-xs text-gray-400 text-right mt-2">
                  برای این روز رویدادی ثبت نشده است.
                </p>
              ) : (
                <div className="space-y-2">
                  {eventsForSelectedDate.map((ev) => (
                    <div
                      key={ev.id}
                      className="rounded-2xl border border-gray-100 bg-white px-3 py-2 text-right space-y-0.5"
                    >
                      <div className="flex flex-row-reverse items-center justify-between">
                        <p className="text-xs font-semibold text-gray-900">
                          {ev.title}
                        </p>
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: ev.color }}
                        />
                      </div>
                      <p className="text-[11px] text-gray-500">
                        کشتی: {ev.ship}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        تکنسین مسئول: {ev.technician}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        شیفت: {shifts.find((s) => s.id === ev.shift)?.label}
                        {ev.sla && ` · SLA: ${ev.sla}`}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </section>
      </div>
    </WorkspaceAppShell>
  );
}

export default TechnicianCalendar;
