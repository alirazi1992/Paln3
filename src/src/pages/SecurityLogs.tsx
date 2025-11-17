// src/src/pages/SecurityLogs.tsx
import { useMemo, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { DataTable, Column } from "../components/ui/DataTable";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { mockSecurityLogs, mockUsers } from "../mocks/db";
import { SecurityLog } from "../features/projects/types";

import dayjs, { Dayjs } from "dayjs";
import jalaliday from "jalaliday";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(jalaliday);
dayjs.extend(localizedFormat);
dayjs.locale("fa");

const toJ = (d: string | number | Date | Dayjs) => dayjs(d).calendar("jalali");

// رنگ شدت
const severityColors: Record<string, string> = {
  Low: "bg-blue-100 text-blue-800",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-orange-100 text-orange-800",
  Critical: "bg-red-100 text-red-800",
};

// لیبل نوع رویداد
const typeLabels: Record<string, string> = {
  IntegrityFailure: "خطای یکپارچگی",
  PermissionEscalation: "افزایش دسترسی",
  LoginAnomaly: "ورود غیرعادی",
  UnauthorizedAccess: "دسترسی غیرمجاز",
};

export function SecurityLogs() {
  const [selectedLog, setSelectedLog] = useState<SecurityLog | null>(null);
  const [lockdownMode, setLockdownMode] = useState(false);

  // فیلترها
  const [severityFilter, setSeverityFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "all">(
    "24h"
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  // برای بازه زمانی: به‌جای "الان"، از آخرین لاگ استفاده می‌کنیم تا دیتا خالی نشود
  const latestTimestamp = useMemo(() => {
    if (!mockSecurityLogs.length) return null;
    const max = mockSecurityLogs.reduce((acc, log) => {
      const t = new Date(log.timestamp).getTime();
      return t > acc ? t : acc;
    }, new Date(mockSecurityLogs[0].timestamp).getTime());
    return new Date(max);
  }, []);

  // ستون‌های جدول
  const columns: Column<SecurityLog>[] = [
    {
      key: "timestamp",
      header: "زمان",
      sortable: true,
      render: (log) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">
            {toJ(log.timestamp).format("YYYY/MM/DD")}
          </div>
          <div className="text-gray-500">
            {toJ(log.timestamp).format("HH:mm")}
          </div>
        </div>
      ),
    },
    {
      key: "severity",
      header: "شدت",
      sortable: true,
      render: (log) => (
        <Badge className={severityColors[log.severity] || ""}>
          {log.severity}
        </Badge>
      ),
    },
    {
      key: "type",
      header: "نوع",
      render: (log) => (
        <span className="text-sm font-medium text-gray-900">
          {typeLabels[log.type] || log.type}
        </span>
      ),
    },
    {
      key: "description",
      header: "توضیحات",
      render: (log) => (
        <span className="text-sm text-gray-700">{log.description}</span>
      ),
    },
    {
      key: "userId",
      header: "کاربر",
      render: (log) => {
        if (!log.userId) return <span className="text-gray-400">-</span>;
        const user = mockUsers.find((u) => u.id === log.userId);
        return (
          <div className="flex items-center gap-2">
            {user?.avatar && (
              <img
                src={user.avatar}
                alt=""
                className="w-6 h-6 rounded-full object-cover"
              />
            )}
            <span className="text-sm text-gray-900">{user?.name || "—"}</span>
          </div>
        );
      },
    },
    {
      key: "entityType",
      header: "موجودیت",
      render: (log) => (
        <span className="text-sm text-gray-600">{log.entityType || "—"}</span>
      ),
    },
  ];

  // فیلتر و سرچ
  const filteredLogs = useMemo<SecurityLog[]>(() => {
    const term = searchTerm.trim().toLowerCase();

    return mockSecurityLogs.filter((log) => {
      let ok = true;

      // فیلتر شدت
      if (severityFilter && log.severity !== severityFilter) ok = false;

      // فیلتر نوع
      if (typeFilter && log.type !== typeFilter) ok = false;

      // فیلتر بازه زمانی
      if (latestTimestamp && timeRange !== "all") {
        const base = dayjs(latestTimestamp);
        let threshold: Dayjs;

        if (timeRange === "24h") {
          threshold = base.subtract(24, "hour");
        } else if (timeRange === "7d") {
          threshold = base.subtract(7, "day");
        } else {
          // "30d"
          threshold = base.subtract(30, "day");
        }

        const logTime = dayjs(log.timestamp);
        if (logTime.isBefore(threshold)) ok = false;
      }

      // سرچ
      if (ok && term) {
        const user = log.userId
          ? mockUsers.find((u) => u.id === log.userId)
          : undefined;

        const haystack =
          [
            log.id,
            log.severity,
            typeLabels[log.type] || log.type,
            log.description,
            log.entityType,
            log.entityId,
            user?.name,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase() || "";

        if (!haystack.includes(term)) ok = false;
      }

      return ok;
    });
  }, [severityFilter, typeFilter, timeRange, searchTerm, latestTimestamp]);

  // خروجی CSV از لاگ‌های فیلتر شده
  const handleExportCsv = () => {
    const header = [
      "ID",
      "زمان (شمسی)",
      "شدت",
      "نوع",
      "توضیحات",
      "کاربر",
      "موجودیت",
      "شناسه موجودیت",
    ];

    const rows = filteredLogs.map((log) => {
      const user = log.userId
        ? mockUsers.find((u) => u.id === log.userId)
        : undefined;

      const timeStr = toJ(log.timestamp).format("YYYY/MM/DD HH:mm");

      return [
        log.id,
        timeStr,
        log.severity,
        typeLabels[log.type] || log.type,
        log.description,
        user?.name || "",
        log.entityType || "",
        log.entityId || "",
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
    link.download = "security-logs.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // نمایش جزئیات فنی به شکل خوانا
  const renderDetails = (details: any) => {
    if (!details) {
      return (
        <p className="text-sm text-gray-500">
          جزئیات فنی برای این رویداد ثبت نشده است.
        </p>
      );
    }

    if (typeof details === "string") {
      return (
        <p className="text-sm text-gray-800 whitespace-pre-wrap">{details}</p>
      );
    }

    if (typeof details === "object" && !Array.isArray(details)) {
      const entries = Object.entries(details as Record<string, any>);
      return (
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {entries.map(([key, value]) => (
            <div
              key={key}
              className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100"
            >
              <div className="text-xs text-gray-500">{key}</div>
              <div className="text-gray-900 mt-0.5 break-words">
                {Array.isArray(value) ? value.join("، ") : String(value)}
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

  // در حالت قفل، اجازه باز کردن دیالوگ را نمی‌دهیم
  const handleRowClick = (log: SecurityLog) => {
    if (lockdownMode) return;
    setSelectedLog(log);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              گزارش‌های امنیتی
            </h1>
            <p className="text-gray-600 mt-1">
              رویدادهای امنیتی و خطاهای یکپارچگی
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={lockdownMode ? "primary" : "secondary"}
              onClick={() => setLockdownMode((v) => !v)}
            >
              <Icon name="settings" size={16} className="ml-2" />
              {lockdownMode ? "حالت قفل فعال" : "فعال‌سازی قفل"}
            </Button>
            <Button variant="secondary" onClick={handleExportCsv}>
              <Icon name="clipboard" size={16} className="ml-2" />
              خروجی CSV
            </Button>
          </div>
        </div>

        {/* Lockdown Banner */}
        {lockdownMode && (
          <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 flex items-start gap-3">
            <Icon
              name="bell"
              size={24}
              className="text-red-600 flex-shrink-0 mt-0.5"
            />
            <div className="flex-1">
              <h3 className="font-bold text-red-900 text-lg">
                حالت قفل امنیتی فعال
              </h3>
              <p className="text-sm text-red-700 mt-1">
                سیستم در حالت قفل امنیتی قرار دارد. مشاهده لاگ‌ها مجاز است اما
                امکان باز کردن جزئیات و عملیات حساس غیرفعال شده است.
              </p>
            </div>
            <button
              onClick={() => setLockdownMode(false)}
              className="text-red-600 hover:text-red-800 font-medium text-sm"
            >
              غیرفعال
            </button>
          </div>
        )}

        {/* Critical Events Alert */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
          <Icon
            name="bell"
            size={20}
            className="text-orange-600 flex-shrink-0 mt-0.5"
          />
          <div>
            <h3 className="font-medium text-orange-900">
              لاگ‌های امنیتی غیرقابل تغییر
            </h3>
            <p className="text-sm text-orange-700 mt-1">
              این لاگ‌ها به صورت خودکار ثبت و غیرقابل ویرایش هستند. رویدادهای
              بحرانی به صورت خودکار به مدیران اطلاع داده می‌شوند.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            label="رویدادهای بحرانی"
            value={
              mockSecurityLogs.filter((l) => l.severity === "Critical").length
            }
            color="text-red-600"
            bgIcon="bg-red-100"
            iconColor="text-red-600"
          />
          <StatCard
            label="شدت بالا"
            value={mockSecurityLogs.filter((l) => l.severity === "High").length}
            color="text-orange-600"
            bgIcon="bg-orange-100"
            iconColor="text-orange-600"
          />
          <StatCard
            label="شدت متوسط"
            value={
              mockSecurityLogs.filter((l) => l.severity === "Medium").length
            }
            color="text-yellow-600"
            bgIcon="bg-yellow-100"
            iconColor="text-yellow-600"
          />
          <StatCard
            label="کل رویدادها"
            value={mockSecurityLogs.length}
            color="text-gray-900"
            bgIcon="bg-gray-100"
            iconColor="text-gray-600"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                شدت
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
              >
                <option value="">همه</option>
                <option value="Critical">بحرانی</option>
                <option value="High">بالا</option>
                <option value="Medium">متوسط</option>
                <option value="Low">پایین</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                نوع رویداد
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">همه</option>
                <option value="IntegrityFailure">خطای یکپارچگی</option>
                <option value="PermissionEscalation">افزایش دسترسی</option>
                <option value="LoginAnomaly">ورود غیرعادی</option>
                <option value="UnauthorizedAccess">دسترسی غیرمجاز</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                بازه زمانی
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={timeRange}
                onChange={(e) =>
                  setTimeRange(e.target.value as "24h" | "7d" | "30d" | "all")
                }
              >
                <option value="24h">24 ساعت اخیر (نسبت به آخرین لاگ)</option>
                <option value="7d">7 روز اخیر</option>
                <option value="30d">30 روز اخیر</option>
                <option value="all">همه</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                جستجو
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="جستجو بر اساس توضیحات، کاربر، نوع رویداد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Security Logs Table */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {lockdownMode && (
            <div className="mb-3 text-xs text-red-600">
              حالت قفل فعال است؛ امکان باز کردن جزئیات غیر‌فعال شده است.
            </div>
          )}
          <DataTable
            data={filteredLogs}
            columns={columns}
            onRowClick={handleRowClick}
            // این‌جا searchable را false گذاشتیم چون سرچ خودمان را بالا داریم
          />
        </div>

        {/* Log Detail Dialog */}
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  جزئیات رویداد امنیتی
                </h2>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Icon name="check" size={24} className="rotate-45" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
                  <Badge className={severityColors[selectedLog.severity] || ""}>
                    {selectedLog.severity}
                  </Badge>
                  <span className="font-medium text-gray-900">
                    {typeLabels[selectedLog.type] || selectedLog.type}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      شناسه رویداد
                    </label>
                    <p className="text-gray-900 mt-1 font-mono text-sm">
                      {selectedLog.id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      زمان
                    </label>
                    <p className="text-gray-900 mt-1">
                      {toJ(selectedLog.timestamp).format(
                        "dddd، YYYY/MM/DD HH:mm"
                      )}
                    </p>
                  </div>
                  {selectedLog.userId && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        کاربر
                      </label>
                      <p className="text-gray-900 mt-1">
                        {
                          mockUsers.find((u) => u.id === selectedLog.userId)
                            ?.name
                        }
                      </p>
                    </div>
                  )}
                  {selectedLog.entityType && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        موجودیت
                      </label>
                      <p className="text-gray-900 mt-1">
                        {selectedLog.entityType} ({selectedLog.entityId})
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    توضیحات
                  </label>
                  <p className="text-gray-900 mt-2 leading-relaxed">
                    {selectedLog.description}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    جزئیات فنی
                  </label>
                  {renderDetails(selectedLog.details)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

/* ------------ کوچیک‌کننده‌ی کارت آمار ------------ */

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  bgIcon: string;
  iconColor: string;
}

function StatCard({ label, value, color, bgIcon, iconColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
        </div>
        <div
          className={`w-12 h-12 ${bgIcon} rounded-xl flex items-center justify-center`}
        >
          <Icon name="bell" size={24} className={iconColor} />
        </div>
      </div>
    </div>
  );
}
