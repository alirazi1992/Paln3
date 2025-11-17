// src/src/pages/AuditLogs.tsx
import React, { useMemo, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { DataTable, Column } from "../components/ui/DataTable";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import {
  mockAuditEvents,
  mockUsers,
  mockRoles,
  mockAccessTokens,
} from "../mocks/db";
import { AuditEvent } from "../features/projects/types";

import dayjs, { Dayjs } from "dayjs";
import jalaliday from "jalaliday";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(jalaliday);
dayjs.extend(localizedFormat);
dayjs.locale("fa");

const toJ = (d: string | number | Date | Dayjs) => dayjs(d).calendar("jalali");

// لیبل فارسی برای اکشن‌ها
const actionLabels: Record<string, string> = {
  CREATE_PROJECT: "ایجاد پروژه",
  UPLOAD_DOCUMENT: "بارگذاری مدرک",
  REVIEW_DOCUMENT: "بررسی مدرک",
  ASSIGN_PERMISSION: "تخصیص دسترسی",
};

export function AuditLogs() {
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);

  // --- فیلترها ---
  // این مقادیر به صورت تاریخ میلادی YYYY-MM-DD نگه‌داری می‌شوند، ولی UI شمسـی است
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [actionFilter, setActionFilter] = useState<string>("");
  const [userFilter, setUserFilter] = useState<string>("");

  // --- سرچ اختصاصی خودمان ---
  const [searchTerm, setSearchTerm] = useState<string>("");

  // --- ستون‌ها ---
  const columns: Column<AuditEvent>[] = [
    {
      key: "timestamp",
      header: "زمان",
      sortable: true,
      render: (event) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">
            {toJ(event.timestamp).format("YYYY/MM/DD")}
          </div>
          <div className="text-gray-500">
            {toJ(event.timestamp).format("HH:mm")}
          </div>
        </div>
      ),
    },
    {
      key: "userId",
      header: "کاربر",
      render: (event) => {
        const user = mockUsers.find((u) => u.id === event.userId);
        return (
          <div className="flex items-center gap-2">
            {user?.avatar && (
              <img
                src={user.avatar}
                alt=""
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <span className="text-sm font-medium text-gray-900">
              {user?.name || "—"}
            </span>
          </div>
        );
      },
    },
    {
      key: "action",
      header: "عملیات",
      render: (event) => (
        <Badge>{actionLabels[event.action] || event.action}</Badge>
      ),
    },
    {
      key: "entity",
      header: "موجودیت",
      render: (event) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{event.entity}</div>
          <div className="text-gray-500">{event.entityId}</div>
        </div>
      ),
    },
    {
      key: "roleId",
      header: "نقش",
      render: (event) => {
        const role = mockRoles.find((r) => r.id === event.roleId);
        return (
          <span className="text-sm text-gray-600">{role?.name || "—"}</span>
        );
      },
    },
    {
      key: "tokenId",
      header: "توکن",
      render: (event) => {
        if (!event.tokenId)
          return <span className="text-gray-400 text-sm">-</span>;
        const token = mockAccessTokens.find((t) => t.id === event.tokenId);
        return (
          <span className="text-sm text-gray-600">{token?.code || "—"}</span>
        );
      },
    },
    {
      key: "ipAddress",
      header: "IP",
      render: (event) => (
        <span className="text-sm font-mono text-gray-600">
          {event.ipAddress}
        </span>
      ),
    },
  ];

  // --- فیلتر + سرچ روی لاگ‌ها ---
  const filteredEvents = useMemo<AuditEvent[]>(() => {
    const term = searchTerm.trim().toLowerCase();

    return mockAuditEvents.filter((event) => {
      let ok = true;
      const eventDate = new Date(event.timestamp);

      if (fromDate) {
        const from = new Date(fromDate + "T00:00:00");
        if (eventDate < from) ok = false;
      }

      if (toDate) {
        const to = new Date(toDate + "T23:59:59.999");
        if (eventDate > to) ok = false;
      }

      if (actionFilter && event.action !== actionFilter) {
        ok = false;
      }

      if (userFilter && event.userId !== userFilter) {
        ok = false;
      }

      if (term) {
        const user = mockUsers.find((u) => u.id === event.userId);
        const role = mockRoles.find((r) => r.id === event.roleId);
        const token = event.tokenId
          ? mockAccessTokens.find((t) => t.id === event.tokenId)
          : undefined;

        const haystack =
          [
            event.id,
            event.entity,
            event.entityId,
            event.ipAddress,
            actionLabels[event.action] || event.action,
            user?.name,
            role?.name,
            token?.code,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase() || "";

        if (!haystack.includes(term)) ok = false;
      }

      return ok;
    });
  }, [fromDate, toDate, actionFilter, userFilter, searchTerm]);

  // --- خروجی Excel ---
  const handleExportExcel = () => {
    const header = [
      "شناسه رویداد",
      "زمان (شمسی)",
      "کاربر",
      "نقش",
      "عملیات",
      "موجودیت",
      "شناسه موجودیت",
      "IP",
      "توکن",
    ];

    const rows = filteredEvents.map((ev) => {
      const user = mockUsers.find((u) => u.id === ev.userId);
      const role = mockRoles.find((r) => r.id === ev.roleId);
      const token = ev.tokenId
        ? mockAccessTokens.find((t) => t.id === ev.tokenId)
        : undefined;

      const timeStr = toJ(ev.timestamp).format("YYYY/MM/DD HH:mm");

      return [
        ev.id,
        timeStr,
        user?.name || "",
        role?.name || "",
        actionLabels[ev.action] || ev.action,
        ev.entity,
        ev.entityId,
        ev.ipAddress,
        token?.code || "",
      ];
    });

    const csvLines = [header, ...rows].map((cols) =>
      cols
        .map((c) => {
          const s = String(c ?? "");
          return `"${s.replace(/"/g, '""')}"`;
        })
        .join(",")
    );

    const blob = new Blob([csvLines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "audit-logs.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // --- خروجی PDF (صفحه پرینت) ---
  const handleExportPdf = () => {
    const win = window.open("", "_blank");
    if (!win) return;

    const rowsHtml = filteredEvents
      .map((ev) => {
        const user = mockUsers.find((u) => u.id === ev.userId);
        const role = mockRoles.find((r) => r.id === ev.roleId);
        const token = ev.tokenId
          ? mockAccessTokens.find((t) => t.id === ev.tokenId)
          : undefined;

        const timeStr = toJ(ev.timestamp).format("YYYY/MM/DD HH:mm");

        return `
          <tr>
            <td>${ev.id}</td>
            <td>${timeStr}</td>
            <td>${user?.name || ""}</td>
            <td>${role?.name || ""}</td>
            <td>${actionLabels[ev.action] || ev.action}</td>
            <td>${ev.entity}</td>
            <td>${ev.entityId}</td>
            <td>${ev.ipAddress}</td>
            <td>${token?.code || ""}</td>
          </tr>
        `;
      })
      .join("");

    win.document.write(`
      <!doctype html>
      <html lang="fa" dir="rtl">
      <head>
        <meta charset="utf-8" />
        <title>گزارش‌های حسابرسی</title>
        <style>
          body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 24px; direction: rtl; }
          h1 { font-size: 20px; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: right; }
          th { background: #f3f4f6; }
          tr:nth-child(even) { background: #fafafa; }
        </style>
      </head>
      <body>
        <h1>گزارش‌های حسابرسی سیستم</h1>
        <table>
          <thead>
            <tr>
              <th>شناسه رویداد</th>
              <th>زمان (شمسی)</th>
              <th>کاربر</th>
              <th>نقش</th>
              <th>عملیات</th>
              <th>موجودیت</th>
              <th>شناسه موجودیت</th>
              <th>IP</th>
              <th>توکن</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </body>
      </html>
    `);

    win.document.close();
    setTimeout(() => {
      win.print();
    }, 300);
  };

  // نمایش زیباتر جزئیات
  const renderDetails = (details: any) => {
    if (!details) {
      return (
        <p className="text-sm text-gray-500">
          جزئیاتی برای این رویداد ثبت نشده است.
        </p>
      );
    }

    if (typeof details === "string") {
      return (
        <p className="text-sm text-gray-800 whitespace-pre-wrap">{details}</p>
      );
    }

    // حالت رایج شما: { utn: "...", title: "..." }
    if (typeof details === "object" && !Array.isArray(details)) {
      const entries = Object.entries(details as Record<string, any>);

      const labelMap: Record<string, string> = {
        utn: "UTN پروژه",
        title: "عنوان پروژه",
      };

      return (
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {entries.map(([key, value]) => (
            <div
              key={key}
              className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100"
            >
              <div className="text-xs text-gray-500">
                {labelMap[key] || key}
              </div>
              <div className="text-gray-900 mt-0.5 break-words">
                {String(value)}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <pre className="mt-2 p-4 bg-gray-50 rounded-xl text-sm overflow-x-auto">
        {JSON.stringify(details, null, 2)}
      </pre>
    );
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              گزارش‌های حسابرسی
            </h1>
            <p className="text-gray-600 mt-1">
              لاگ‌های غیرقابل تغییر تمامی عملیات سیستم
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={handleExportExcel}>
              <Icon name="clipboard" size={16} className="ml-2" />
              خروجی Excel
            </Button>
            <Button variant="secondary" onClick={handleExportPdf}>
              <Icon name="clipboard" size={16} className="ml-2" />
              خروجی PDF
            </Button>
          </div>
        </div>

        {/* بنر اطلاعات */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Icon
            name="bell"
            size={20}
            className="text-blue-600 flex-shrink-0 mt-0.5"
          />
          <div>
            <h3 className="font-medium text-blue-900">لاگ‌های حسابرسی</h3>
            <p className="text-sm text-blue-700 mt-1">
              این لاگ‌ها غیرقابل تغییر و فقط خواندنی هستند. تمامی عملیات با
              شناسه کاربر، نقش، توکن، و محدوده دسترسی ثبت می‌شوند.
            </p>
          </div>
        </div>

        {/* فیلترها + سرچ + تقویم شمسـی */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <JalaliDatePicker
              label="از تاریخ"
              value={fromDate}
              onChange={setFromDate}
            />
            <JalaliDatePicker
              label="تا تاریخ"
              value={toDate}
              onChange={setToDate}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                نوع عملیات
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
              >
                <option value="">همه</option>
                <option value="CREATE_PROJECT">ایجاد پروژه</option>
                <option value="UPLOAD_DOCUMENT">بارگذاری مدرک</option>
                <option value="REVIEW_DOCUMENT">بررسی مدرک</option>
                <option value="ASSIGN_PERMISSION">تخصیص دسترسی</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                کاربر
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
              >
                <option value="">همه</option>
                {mockUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                جستجو
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="جستجو در کاربر، عملیات، موجودیت، IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* جدول لاگ‌ها */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <DataTable
            data={filteredEvents}
            columns={columns}
            onRowClick={setSelectedEvent}
          />
        </div>

        {/* دیالوگ جزئیات رویداد */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  جزئیات رویداد
                </h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Icon name="check" size={24} className="rotate-45" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      شناسه رویداد
                    </label>
                    <p className="text-gray-900 mt-1 font-mono text-sm">
                      {selectedEvent.id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      زمان
                    </label>
                    <p className="text-gray-900 mt-1">
                      {toJ(selectedEvent.timestamp).format(
                        "dddd، YYYY/MM/DD HH:mm"
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      کاربر
                    </label>
                    <p className="text-gray-900 mt-1">
                      {
                        mockUsers.find((u) => u.id === selectedEvent.userId)
                          ?.name
                      }
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      نقش
                    </label>
                    <p className="text-gray-900 mt-1">
                      {
                        mockRoles.find((r) => r.id === selectedEvent.roleId)
                          ?.name
                      }
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      عملیات
                    </label>
                    <p className="text-gray-900 mt-1">
                      {actionLabels[selectedEvent.action] ||
                        selectedEvent.action}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      موجودیت
                    </label>
                    <p className="text-gray-900 mt-1">
                      {selectedEvent.entity} ({selectedEvent.entityId})
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      آدرس IP
                    </label>
                    <p className="text-gray-900 mt-1 font-mono text-sm">
                      {selectedEvent.ipAddress}
                    </p>
                  </div>
                  {selectedEvent.tokenId && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        توکن دسترسی
                      </label>
                      <p className="text-gray-900 mt-1">
                        {
                          mockAccessTokens.find(
                            (t) => t.id === selectedEvent.tokenId
                          )?.code
                        }
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    جزئیات
                  </label>
                  {renderDetails(selectedEvent.details)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

/* ---------------- JalaliDatePicker Component ---------------- */

interface JalaliDatePickerProps {
  label: string;
  value: string; // YYYY-MM-DD (میلادی) یا خالی
  onChange: (value: string) => void;
}

const WEEKDAYS_FA = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

function JalaliDatePicker({ label, value, onChange }: JalaliDatePickerProps) {
  const [open, setOpen] = useState(false);

  const today = dayjs();
  const initial = value ? dayjs(value) : today;
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(initial);

  // محاسبه روزهای تقویم (بر اساس تقویم شمسـی، ولی دیتای زیرین میلادی است)
  const jStartOfMonth = toJ(currentMonth).startOf("month");
  const jsDay = jStartOfMonth.day(); // 0..6
  const offsetToSaturday = (jsDay + 1) % 7; // تبدیل شروع هفته به شنبه
  const gridStart = jStartOfMonth.subtract(offsetToSaturday, "day");
  const days: Dayjs[] = Array.from({ length: 42 }, (_, i) =>
    gridStart.add(i, "day")
  );

  const selected = value ? dayjs(value) : null;

  const handleSelect = (d: Dayjs) => {
    const isoDate = d.toDate().toISOString().slice(0, 10); // YYYY-MM-DD
    onChange(isoDate);
    setOpen(false);
  };

  const clearValue = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  const monthTitle = toJ(currentMonth).format("MMMM YYYY");

  const displayLabel = value
    ? toJ(dayjs(value)).format("YYYY/MM/DD")
    : "انتخاب تاریخ";

  return (
    <div className="relative" dir="rtl">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <span className={`text-gray-700 ${!value ? "text-gray-400" : ""}`}>
          {displayLabel}
        </span>
        <span className="flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={clearValue}
              className="w-5 h-5 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              aria-label="حذف تاریخ"
            >
              ×
            </button>
          )}
          <Icon name="calendar" size={16} className="text-gray-500" />
        </span>
      </button>

      {open && (
        <div className="absolute z-40 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => setCurrentMonth((m) => m.subtract(1, "month"))}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-600"
            >
              ▶
            </button>
            <div className="text-sm font-semibold text-gray-900">
              {monthTitle}
            </div>
            <button
              type="button"
              onClick={() => setCurrentMonth((m) => m.add(1, "month"))}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-600"
            >
              ◀
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-1">
            {WEEKDAYS_FA.map((w) => (
              <div key={w} className="text-center py-1">
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-sm">
            {days.map((d) => {
              const inThisMonth = toJ(d).month() === toJ(currentMonth).month();
              const isSelected =
                selected && d.startOf("day").isSame(selected.startOf("day"));
              const isToday = d.startOf("day").isSame(today.startOf("day"));

              return (
                <button
                  key={d.valueOf()}
                  type="button"
                  onClick={() => handleSelect(d)}
                  className={[
                    "w-9 h-9 rounded-full flex items-center justify-center",
                    inThisMonth ? "text-gray-800" : "text-gray-400",
                    isSelected
                      ? "bg-blue-600 text-white"
                      : isToday
                      ? "border border-blue-400"
                      : "hover:bg-gray-100",
                  ].join(" ")}
                >
                  {toJ(d).format("D")}
                </button>
              );
            })}
          </div>

          <div className="mt-2 flex justify-between items-center">
            <button
              type="button"
              className="text-xs text-blue-600 hover:underline"
              onClick={() => {
                const t = dayjs();
                setCurrentMonth(t);
                const iso = t.toDate().toISOString().slice(0, 10);
                onChange(iso);
                setOpen(false);
              }}
            >
              امروز
            </button>
            <button
              type="button"
              className="text-xs text-gray-500 hover:underline"
              onClick={() => setOpen(false)}
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
