// src/src/pages/Projects.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { DataTable, Column } from "../components/ui/DataTable";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { mockProjects, mockUnits } from "../mocks/db";
import {
  Project,
  ProjectType,
  ProjectStatus,
} from "../features/projects/types";

type ProjectWithText = Project & {
  title: string;
  description: string;
};

const typeLabels: Record<ProjectType, string> = {
  Hull: "بدنه و سازه",
  Machinery: "ماشین‌آلات و رانش",
  Electrical: "الکتریک و کنترل",
  General: "سایر حوزه‌ها",
};

const statusLabels: Record<ProjectStatus, string> = {
  Pending: "در انتظار بررسی",
  UnderReview: "در حال ارزیابی",
  Approved: "تایید شده",
  Certified: "گواهی صادر شده",
  Rejected: "رد شده",
  Withdrawn: "لغو شده",
};

const projectContent: Record<string, { title: string; description: string }> = {
  "1": {
    title: "بهینه‌سازی اسکلت کشتی ۵۰۰۰ تنی",
    description:
      "بازطراحی اتصال تیرک‌ها و کاهش ارتعاش بدنه برای ناوگان صادراتی.",
  },
  "2": {
    title: "بازطراحی سامانه رانش واحد A12",
    description: "ارتقای راندمان موتور اصلی و یکپارچه‌سازی کنترل هوشمند.",
  },
  "3": {
    title: "بازآرایی شبکه برق اضطراری",
    description: "جایگزینی تابلوهای کهنه و افزودن رصد سلامت تجهیزات.",
  },
  "4": {
    title: "تغییر کاربری مخزن دو منظوره",
    description: "افزودن مدار خنثی‌سازی سریع برای مواد حساس.",
  },
};

const unitNameMap: Record<string, string> = {
  "1": "یگان مهندسی بدنه",
  "2": "یگان ماشین‌آلات و رانش",
  "3": "یگان الکتریک و کنترل",
  "4": "یگان طراحی عمومی",
};

interface NewProjectDraft {
  utn: string;
  title: string;
  description: string;
  type: ProjectType;
  status: ProjectStatus;
  unitId: string;
}

export function Projects() {
  const navigate = useNavigate();

  // ---- دیتا با عنوان/توضیح فارسی ----
  const initialProjects: ProjectWithText[] = useMemo(
    () =>
      mockProjects.map((project) => ({
        ...project,
        title:
          projectContent[project.id]?.title ?? `پروژه ${project.utn ?? ""}`,
        description:
          projectContent[project.id]?.description ??
          "شرح این پروژه هنوز ثبت نشده است.",
      })),
    []
  );

  const [projects, setProjects] = useState<ProjectWithText[]>(initialProjects);

  // ---- فیلترها + سرچ ----
  const [filterType, setFilterType] = useState<ProjectType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | "all">(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  // ---- مودال ثبت پروژه جدید ----
  const [newModalOpen, setNewModalOpen] = useState(false);
const [draft, setDraft] = useState<NewProjectDraft>({
    utn: "",
    title: "",
    description: "",
    type: ProjectType.Hull,
    status: ProjectStatus.Pending,
    unitId: mockUnits[0]?.id ?? "1",
  });
  const [formError, setFormError] = useState<string | null>(null);

  const resetFilters = () => {
    setFilterType("all");
    setFilterStatus("all");
    setSearchTerm("");
  };

  // ---- فیلتر و سرچ روی پروژه‌ها ----
  const filteredProjects = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return projects.filter((project) => {
      if (filterType !== "all" && project.type !== filterType) return false;
      if (filterStatus !== "all" && project.status !== filterStatus)
        return false;

      if (term) {
        const unitLabel =
          unitNameMap[project.unitId] ??
          mockUnits.find((u) => u.id === project.unitId)?.name ??
          "";
        const haystack =
          [
            project.utn,
            project.title,
            project.description,
            unitLabel,
            typeLabels[project.type],
            statusLabels[project.status],
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase() || "";

        if (!haystack.includes(term)) return false;
      }

      return true;
    });
  }, [projects, filterType, filterStatus, searchTerm]);

  // ---- ستون‌های جدول ----
  const columns: Column<ProjectWithText>[] = [
    {
      key: "utn",
      header: "کد پیگیری",
      sortable: true,
      render: (project) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/projects/${project.id}`);
          }}
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
        <div>
          <div className="font-medium text-gray-900">{project.title}</div>
          <div className="text-sm text-gray-500 mt-0.5">
            {project.description}
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "حوزه فنی",
      render: (project) => <Badge>{typeLabels[project.type]}</Badge>,
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
      render: (project) => {
        const unitLabel =
          unitNameMap[project.unitId] ??
          mockUnits.find((u) => u.id === project.unitId)?.name ??
          "نامشخص";
        return <span className="text-sm text-gray-600">{unitLabel}</span>;
      },
    },
    {
      key: "createdAt",
      header: "تاریخ ثبت",
      sortable: true,
      render: (project) => (
        <span className="text-sm text-gray-600">
          {new Date(project.createdAt).toLocaleDateString("fa-IR")}
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

  // ---- خروجی CSV ----
  const handleExportCsv = () => {
    const header = [
      "UTN",
      "عنوان پروژه",
      "توضیحات",
      "حوزه فنی",
      "وضعیت",
      "یگان مسئول",
      "تاریخ ثبت",
      "آخرین بروزرسانی",
    ];

    const rows = filteredProjects.map((p) => {
      const unitLabel =
        unitNameMap[p.unitId] ??
        mockUnits.find((u) => u.id === p.unitId)?.name ??
        "";
      return [
        p.utn,
        p.title,
        p.description,
        typeLabels[p.type],
        statusLabels[p.status],
        unitLabel,
        new Date(p.createdAt).toLocaleDateString("fa-IR"),
        new Date(p.updatedAt).toLocaleDateString("fa-IR"),
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
    link.download = "projects.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ---- ثبت پروژه جدید ----
  const openNewProjectModal = () => {
    setDraft({
      utn: "",
      title: "",
      description: "",
      type: ProjectType.Hull,
      status: ProjectStatus.Pending,
      unitId: mockUnits[0]?.id ?? "1",
    });
    setFormError(null);
    setNewModalOpen(true);
  };

  const handleCreateProject = () => {
    if (!draft.utn.trim() || !draft.title.trim()) {
      setFormError("کد پیگیری (UTN) و عنوان پروژه الزامی هستند.");
      return;
    }

    const nowIso = new Date().toISOString();
    const newProject: ProjectWithText = {
      id: Date.now().toString(),
      utn: draft.utn.trim(),
      type: draft.type,
      status: draft.status,
      unitId: draft.unitId,
      applicantId: mockProjects[0]?.applicantId ?? "1",
      createdAt: nowIso,
      updatedAt: nowIso,
      title: draft.title.trim(),
      description:
        draft.description.trim() || "شرح این پروژه بعداً تکمیل می‌شود.",
    };

    setProjects((prev) => [newProject, ...prev]);
    setNewModalOpen(false);
  };

  return (
    <AppShell>
      <div className="space-y-6 text-right">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-۲xl font-bold text-gray-900">
              پرونده‌های فعال
            </h1>
            <p className="text-gray-600 mt-1">
              مرور سریع وضعیت پروژه‌ها، واحدهای پاسخ‌گو و زمان‌بندی صدور گواهی.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={handleExportCsv}>
              خروجی CSV
            </Button>
            <Button variant="primary" onClick={openNewProjectModal}>
              + ثبت پروژه جدید
            </Button>
          </div>
        </div>

        {/* Filters + Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                حوزه فنی
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              >
                <option value="all">همه حوزه‌ها</option>
                {Object.entries(typeLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                وضعیت بررسی
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              >
                <option value="all">همه وضعیت‌ها</option>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                جستجو
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                placeholder="جستجوی UTN، عنوان، توضیح یا واحد مسئول..."
              />
            </div>
            <div className="mr-auto flex items-end">
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                پاک‌کردن فیلترها
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <DataTable
            data={filteredProjects}
            columns={columns}
            onRowClick={(project) => navigate(`/projects/${project.id}`)}
          />
        </div>

        {/* New Project Modal */}
        {newModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  ثبت پروژه جدید
                </h2>
                <button
                  onClick={() => setNewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-3 py-2">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      کد پیگیری (UTN)
                    </label>
                    <input
                      type="text"
                      value={draft.utn}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, utn: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="مثلاً PRJ-2024-015"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      حوزه فنی
                    </label>
                    <select
                      value={draft.type}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          type: e.target.value as ProjectType,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {(Object.keys(typeLabels) as ProjectType[]).map((t) => (
                        <option key={t} value={t}>
                          {typeLabels[t]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      وضعیت
                    </label>
                    <select
                      value={draft.status}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          status: e.target.value as ProjectStatus,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {(Object.keys(statusLabels) as ProjectStatus[]).map(
                        (s) => (
                          <option key={s} value={s}>
                            {statusLabels[s]}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      یگان مسئول
                    </label>
                    <select
                      value={draft.unitId}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, unitId: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {mockUnits.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    عنوان پروژه
                  </label>
                  <input
                    type="text"
                    value={draft.title}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, title: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="مثلاً طراحی سیستم خنک‌کاری موتور اصلی"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    توضیحات
                  </label>
                  <textarea
                    value={draft.description}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        description: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="شرح کوتاه پروژه، اهداف و محدوده..."
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    variant="secondary"
                    onClick={() => setNewModalOpen(false)}
                  >
                    انصراف
                  </Button>
                  <Button variant="primary" onClick={handleCreateProject}>
                    ثبت پروژه
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
