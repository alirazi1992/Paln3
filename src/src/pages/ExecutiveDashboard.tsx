import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { KPICard } from "../components/common/KPICard";
import { Donut } from "../components/charts/Donut";
import { AreaSpark } from "../components/charts/AreaSpark";
import { DataTable, Column } from "../components/ui/DataTable";
import { StatusBadge } from "../components/ui/StatusBadge";
import { mockKPIs, mockProjects } from "../mocks/db";
import {
  Project,
  ProjectStatus,
  ProjectType,
} from "../features/projects/types";

const statusChartConfig: Record<
  ProjectStatus,
  { label: string; color: string }
> = {
  Pending: { label: "منتظر ارزیابی", color: "#9ca3af" },
  UnderReview: { label: "در حال بررسی", color: "#3b82f6" },
  Approved: { label: "تایید اولیه", color: "#10b981" },
  Certified: { label: "گواهی صادر شده", color: "#8b5cf6" },
  Rejected: { label: "رد شده", color: "#ef4444" },
  Withdrawn: { label: "لغو شده", color: "#f97316" },
};

const typeLabels: Record<ProjectType, string> = {
  Hull: "بدنه و سازه",
  Machinery: "ماشین‌آلات و رانش",
  Electrical: "الکتریک و کنترل",
  General: "حوزه عمومی",
};

const projectTitleMap: Record<string, { title: string; description: string }> =
  {
    "1": {
      title: "بهینه‌سازی اسکلت کشتی ۵۰۰۰ تنی",
      description: "بازنگری اتصالات و کاهش ارتعاش برای ناوگان صادراتی",
    },
    "2": {
      title: "بازطراحی سامانه رانش واحد A12",
      description: "ارتقای راندمان موتور اصلی و کنترل هوشمند",
    },
    "3": {
      title: "بازآرایی شبکه برق اضطراری",
      description: "تعویض تابلوهای مستهلک و افزودن رصد سلامت",
    },
    "4": {
      title: "تغییر کاربری مخزن دو منظوره",
      description: "ایجاد مدار خنثی‌سازی سریع برای مواد حساس",
    },
  };

const unitNameMap: Record<string, string> = {
  "1": "یگان مهندسی بدنه",
  "2": "یگان ماشین‌آلات و رانش",
  "3": "یگان الکتریک و کنترل",
  "4": "یگان طراحی عمومی",
};

const kpiLocalization: Record<
  string,
  { name: string; unit: string; period: string }
> = {
  K1: {
    name: "پرونده‌های جدید این ماه",
    unit: "پرونده",
    period: "گزارش ۳۰ روزه",
  },
  K2: { name: "میانگین روزهای ارزیابی", unit: "روز", period: "میانگین متحرک" },
  K3: { name: "درصد تایید مرحله اول", unit: "درصد", period: "هفتگی" },
  K4: { name: "گواهی‌های صادر شده", unit: "گواهی", period: "ماه جاری" },
  K5: { name: "موارد باز ممیزی", unit: "پرونده", period: "چرخه جاری" },
};

type TimeRange = "month" | "quarter" | "year";

const baseMonthlyTrend = [12, 15, 14, 18, 16, 20, 19, 22, 24, 23, 26, 28];

export function ExecutiveDashboard() {
  const navigate = useNavigate();

  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const [searchQuery, setSearchQuery] = useState("");

  const localizedKPIs = mockKPIs.map((kpi) => ({
    ...kpi,
    ...kpiLocalization[kpi.id],
  }));

  const localizedProjects: (Project & { description?: string })[] =
    mockProjects.map((project) => ({
      ...project,
      ...projectTitleMap[project.id],
    }));

  // --- SEARCH FILTER ---
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return localizedProjects;
    const q = searchQuery.toLowerCase();

    return localizedProjects.filter((p) => {
      const unit = unitNameMap[p.unitId] ?? "نامشخص";
      const typeLabel = typeLabels[p.type];
      const statusLabel = statusChartConfig[p.status].label;

      return (
        p.utn.toLowerCase().includes(q) ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        unit.toLowerCase().includes(q) ||
        typeLabel.toLowerCase().includes(q) ||
        statusLabel.toLowerCase().includes(q)
      );
    });
  }, [localizedProjects, searchQuery]);

  // --- STATUS COUNTS & CHART DATA (BASED ON FILTERED PROJECTS) ---
  const statusCounts = filteredProjects.reduce<Record<ProjectStatus, number>>(
    (acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    },
    {
      Pending: 0,
      UnderReview: 0,
      Approved: 0,
      Certified: 0,
      Rejected: 0,
      Withdrawn: 0,
    }
  );

  const projectStatusData = (
    Object.keys(statusChartConfig) as ProjectStatus[]
  ).map((status) => ({
    label: statusChartConfig[status].label,
    color: statusChartConfig[status].color,
    value: statusCounts[status] ?? 0,
  }));

  // --- TREND BY TIME RANGE ---
  const monthlyTrendForRange = useMemo(() => {
    if (timeRange === "month") return baseMonthlyTrend.slice(-3);
    if (timeRange === "quarter") return baseMonthlyTrend.slice(-6);
    return baseMonthlyTrend;
  }, [timeRange]);

  const columns: Column<Project & { description?: string }>[] = [
    {
      key: "utn",
      header: "کد پیگیری",
      sortable: true,
      render: (project) => (
        <button
          onClick={() => navigate(`/projects/${project.id}`)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {project.utn}
        </button>
      ),
    },
    {
      key: "title",
      header: "عنوان پروژه",
      sortable: true,
      render: (project) => (
        <div className="text-right">
          <p className="font-medium text-gray-900">{project.title}</p>
          <p className="text-sm text-gray-500 mt-0.5">{project.description}</p>
        </div>
      ),
    },
    {
      key: "type",
      header: "حوزه فنی",
      sortable: true,
      render: (project) => (
        <span className="text-sm text-gray-600">
          {typeLabels[project.type]}
        </span>
      ),
    },
    {
      key: "status",
      header: "وضعیت",
      sortable: true,
      render: (project) => <StatusBadge status={project.status} />,
    },
    {
      key: "unitId",
      header: "یگان مسئول",
      render: (project) => (
        <span className="text-sm text-gray-600">
          {unitNameMap[project.unitId] ?? "نامشخص"}
        </span>
      ),
    },
    {
      key: "updatedAt",
      header: "آخرین بروزرسانی",
      sortable: true,
      render: (project) => (
        <span className="text-sm text-gray-500">
          {new Date(project.updatedAt).toLocaleDateString("fa-IR")}
        </span>
      ),
    },
  ];

  // --- DOWNLOAD REPORT BUTTON HANDLER ---
  const handleDownloadReport = () => {
    if (filteredProjects.length === 0) return;

    const headers = [
      "UTN",
      "Title",
      "Type",
      "Status",
      "Unit",
      "CreatedAt",
      "UpdatedAt",
    ];

    const rows = filteredProjects.map((p) => [
      p.utn,
      p.title,
      typeLabels[p.type],
      statusChartConfig[p.status].label,
      unitNameMap[p.unitId] ?? "نامشخص",
      new Date(p.createdAt).toLocaleDateString("fa-IR"),
      new Date(p.updatedAt).toLocaleDateString("fa-IR"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) =>
        r
          .map((cell) =>
            typeof cell === "string" ? `"${cell.replace(/"/g, '""')}"` : cell
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "executive-dashboard-report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell>
      <div className="space-y-8">
        {/* HEADER */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-right space-y-2">
            <p className="text-sm text-gray-500">
              سامانه کنترل پروژه‌های حیاتی
            </p>
            <h1 className="text-[22px] font-semibold text-gray-900">
              دید ۳۶۰ درجه بر پروژه‌های حیاتی
            </h1>
            <p className="text-sm text-gray-600">
              وضعیت صدور گواهی، ممیزی‌ها و بار کاری تیم‌های فنی را در یک نگاه
              رصد کنید. داده‌ها هر ۱۵ دقیقه بروزرسانی می‌شوند.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            >
              <option value="month">نمای کلی ماه جاری</option>
              <option value="quarter">سه‌ماهه جاری</option>
              <option value="year">سال مالی ۱۴۰۳</option>
            </select>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownloadReport}
            >
              دانلود گزارش
            </Button>
          </div>
        </header>

        {/* KPI CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localizedKPIs.map((kpi) => (
            <KPICard key={kpi.id} kpi={kpi} />
          ))}
        </section>

        {/* CHARTS */}
        <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          {/* DONUT CARD */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  توزیع وضعیت صدور مجوز
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  نمایش تفکیک پرونده‌ها از منظر صدور گواهی
                </p>
              </div>
              <span className="text-xs text-gray-400">
                به‌روزشده ۵ دقیقه قبل
              </span>
            </div>
            <div className="flex justify-center">
              <Donut data={projectStatusData} size={220} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              {projectStatusData.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-600">{item.label}</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* TREND CARD */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  روند تکمیل پرونده‌ها
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  قیاس تعداد پرونده‌های نهایی‌شده در بازه سالیانه
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/audit-logs")}
              >
                مشاهده جزئیات
              </Button>
            </div>
            <div className="flex justify-center items-center h-48">
              <AreaSpark
                data={monthlyTrendForRange}
                width={360}
                height={140}
                color="#2563eb"
              />
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <span>ابتدای سال</span>
              <span>اکنون</span>
            </div>
          </Card>
        </section>

        {/* PROJECTS TABLE + SEARCH */}
        <section className="bg-white border border-gray-200 rounded-[12px] shadow-sm p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                آخرین پروژه‌های ثبت شده
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                پیگیری سریع وضعیت و واحد مسئول هر پرونده
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="جستجوی UTN، عنوان، توضیحات یا یگان..."
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate("/projects")}
              >
                مشاهده همه
              </Button>
            </div>
          </div>

          <DataTable
            data={filteredProjects}
            columns={columns}
            // DataTable دیگر search داخلی ندارد؛ خودمان فیلتر کردیم
            onRowClick={(project) => navigate(`/projects/${project.id}`)}
          />
        </section>
      </div>
    </AppShell>
  );
}
