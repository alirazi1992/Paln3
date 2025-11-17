import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { Tabs } from "../components/ui/Tabs";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { DataTable, Column } from "../components/ui/DataTable";
import { Icon } from "../components/ui/Icon";
import {
  mockProjects,
  mockDocuments,
  mockInspections,
  mockCertificates,
  mockCAPAs,
  mockClosures,
  mockUsers,
  mockUnits,
} from "../mocks/db";
import {
  Document,
  Inspection,
  Certificate,
  CertificateType,
  CAPA,
  Project,
  ProjectStatus,
  DocumentStatus,
  InspectionType,
  InspectionResult,
} from "../features/projects/types";

// ---------------- Stamp types & config ----------------

type StampType =
  | "Approved"
  | "Rejected"
  | "ForReview"
  | "Conditional"
  | "ForInfo";

interface ProjectStamp {
  id: string;
  projectId: string;
  type: StampType;
  date: string; // ISO
  createdBy: string; // user id
  posX: number; // 0-100 (%)
  posY: number; // 0-100 (%)
  scale: number; // 0.7 - 1.6
  stampCode: string; // visible ID on stamp
}

const stampTypeConfig: Record<
  StampType,
  { labelFa: string; color: string; borderColor: string; textColor: string }
> = {
  Approved: {
    labelFa: "تأیید شده",
    color: "#ECFDF3",
    borderColor: "#16A34A",
    textColor: "#15803D",
  },
  Rejected: {
    labelFa: "رد شده",
    color: "#FEF2F2",
    borderColor: "#DC2626",
    textColor: "#B91C1C",
  },
  ForReview: {
    labelFa: "برای بررسی",
    color: "#EEF2FF",
    borderColor: "#4F46E5",
    textColor: "#3730A3",
  },
  Conditional: {
    labelFa: "تأیید مشروط",
    color: "#FFFBEB",
    borderColor: "#D97706",
    textColor: "#92400E",
  },
  ForInfo: {
    labelFa: "برای اطلاع",
    color: "#F0F9FF",
    borderColor: "#0EA5E9",
    textColor: "#0369A1",
  },
};

// شکل مهر شبیه تصویر نمونه، ولی پایین به‌جای By → Date + ID
function StampBox({
  type,
  date,
  code,
}: {
  type: StampType;
  date: string;
  code?: string;
}) {
  const cfg = stampTypeConfig[type];

  const enDate = new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const stampDate = enDate.toUpperCase();

  const englishLabel =
    type === "Approved"
      ? "APPROVED"
      : type === "Rejected"
      ? "REJECTED"
      : type === "ForReview"
      ? "FOR REVIEW"
      : type === "Conditional"
      ? "CONDITIONAL"
      : "FOR INFO";

  return (
    <div
      className="rounded-xl px-4 py-2 border-2 text-center shadow-sm"
      style={{
        backgroundColor: cfg.color,
        borderColor: cfg.borderColor,
        color: cfg.textColor,
        minWidth: 180,
      }}
    >
      <div className="text-xs font-extrabold tracking-[0.35em] mb-1">
        {englishLabel}
      </div>
      <div className="text-sm font-semibold mb-1">{stampDate}</div>
      <div className="flex justify-between text-[11px] mt-1">
        <span>Date: {stampDate}</span>
        <span className="ml-2">ID: {code || "........"}</span>
      </div>
    </div>
  );
}

// فقط برای نمایش فارسی وضعیت‌ها در مدال ویرایش
const statusLabels: Record<ProjectStatus, string> = {
  Pending: "در انتظار بررسی",
  UnderReview: "در حال ارزیابی",
  Approved: "تایید شده",
  Certified: "گواهی صادر شده",
  Rejected: "رد شده",
  Withdrawn: "لغو شده",
};

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // --------- داده‌های اولیه پروژه از mock‌ها ----------
  const initialProject = mockProjects.find((p) => p.id === id) || null;

  const [project, setProject] = useState<Project | null>(initialProject);
  const [documents, setDocuments] = useState<Document[]>(
    mockDocuments.filter((d) => d.projectId === id)
  );
  const [inspections, setInspections] = useState<Inspection[]>(
    mockInspections.filter((i) => i.projectId === id)
  );
  const [certificates, setCertificates] = useState<Certificate[]>(
    mockCertificates.filter((c) => c.projectId === id)
  );
  const [capas] = useState<CAPA[]>(mockCAPAs.filter((c) => c.projectId === id));
  const [closures] = useState(mockClosures.filter((c) => c.projectId === id));

  const applicant = project
    ? mockUsers.find((u) => u.id === project.applicantId)
    : undefined;
  const unit = project
    ? mockUnits.find((u) => u.id === project.unitId)
    : undefined;

  // --------- وضعیت مدال‌ها و درفت‌ها ----------
  const [editOpen, setEditOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [inspectionOpen, setInspectionOpen] = useState(false);
  const [certificateOpen, setCertificateOpen] = useState(false);

  const [editDescription, setEditDescription] = useState(
    project?.description ?? ""
  );
  const [editStatus, setEditStatus] = useState<ProjectStatus>(
    project?.status ?? ProjectStatus.Pending
  );

  const [newDocName, setNewDocName] = useState("");
  const [newDocSizeMb, setNewDocSizeMb] = useState("1");

  const [newInspectionDate, setNewInspectionDate] = useState("");
  const [newInspectionRemarks, setNewInspectionRemarks] = useState("");

  const [newCertNumber, setNewCertNumber] = useState("");
  const [newCertExpiry, setNewCertExpiry] = useState("");

  // --------- مهرها ----------
  const [stamps, setStamps] = useState<ProjectStamp[]>([]);
  const [draftStampType, setDraftStampType] = useState<StampType>("Approved");
  const [draftStampDate, setDraftStampDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  ); // yyyy-mm-dd
  const [draftStampCode, setDraftStampCode] = useState<string>("");
  const [draftPosX, setDraftPosX] = useState<number>(60);
  const [draftPosY, setDraftPosY] = useState<number>(40);
  const [draftScale, setDraftScale] = useState<number>(1);

  if (!project) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">پروژه یافت نشد</h2>
          <Button onClick={() => navigate("/projects")} className="mt-4">
            بازگشت به لیست پروژه‌ها
          </Button>
        </div>
      </AppShell>
    );
  }

  // --------- ستون‌های جدول‌ها ----------
  const documentColumns: Column<Document>[] = [
    {
      key: "fileName",
      header: "نام فایل",
      render: (doc) => (
        <div className="flex items-center gap-2">
          <Icon name="clipboard" size={16} className="text-gray-400" />
          <span className="font-medium">{doc.fileName}</span>
        </div>
      ),
    },
    {
      key: "revision",
      header: "نسخه",
      render: (doc) => <Badge>v{doc.revision}</Badge>,
    },
    {
      key: "status",
      header: "وضعیت",
      render: (doc) => <StatusBadge status={doc.status} />,
    },
    {
      key: "uploadedAt",
      header: "تاریخ بارگذاری",
      render: (doc) => (
        <span className="text-sm text-gray-600">
          {new Date(doc.uploadedAt).toLocaleDateString("fa-IR")}
        </span>
      ),
    },
    {
      key: "fileSize",
      header: "حجم",
      render: (doc) => (
        <span className="text-sm text-gray-600">
          {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
        </span>
      ),
    },
  ];

  const inspectionColumns: Column<Inspection>[] = [
    {
      key: "type",
      header: "نوع بازرسی",
      render: (inspection) => {
        const typeLabels: Record<InspectionType, string> = {
          Initial: "اولیه",
          Re: "مجدد",
          Final: "نهایی",
        };
        return <span>{typeLabels[inspection.type]}</span>;
      },
    },
    {
      key: "inspectionDate",
      header: "تاریخ بازرسی",
      render: (inspection) => (
        <span className="text-sm text-gray-600">
          {new Date(inspection.inspectionDate).toLocaleDateString("fa-IR")}
        </span>
      ),
    },
    {
      key: "result",
      header: "نتیجه",
      render: (inspection) => <StatusBadge status={inspection.result} />,
    },
    {
      key: "inspectorId",
      header: "بازرس",
      render: (inspection) => {
        const inspector = mockUsers.find(
          (u) => u.id === inspection.inspectorId
        );
        return <span className="text-sm text-gray-600">{inspector?.name}</span>;
      },
    },
    {
      key: "remarks",
      header: "توضیحات",
      render: (inspection) => (
        <span className="text-sm text-gray-600">
          {inspection.remarks || "-"}
        </span>
      ),
    },
  ];

  const certificateColumns: Column<Certificate>[] = [
    {
      key: "certificateNumber",
      header: "شماره گواهی",
      render: (cert) => (
        <span className="font-medium">{cert.certificateNumber}</span>
      ),
    },
    {
      key: "type",
      header: "نوع",
      render: (cert) => {
        const typeLabels = {
          Design: "طراحی",
          Renewal: "تمدید",
          Replacement: "جایگزین",
        };
        return <span>{typeLabels[cert.type]}</span>;
      },
    },
    {
      key: "issueDate",
      header: "تاریخ صدور",
      render: (cert) => (
        <span className="text-sm text-gray-600">
          {new Date(cert.issueDate).toLocaleDateString("fa-IR")}
        </span>
      ),
    },
    {
      key: "expiryDate",
      header: "تاریخ انقضا",
      render: (cert) => (
        <span className="text-sm text-gray-600">
          {new Date(cert.expiryDate).toLocaleDateString("fa-IR")}
        </span>
      ),
    },
    {
      key: "status",
      header: "وضعیت",
      render: (cert) => <StatusBadge status={cert.status} />,
    },
  ];

  const capaColumns: Column<CAPA>[] = [
    {
      key: "title",
      header: "عنوان",
      render: (capa) => <span className="font-medium">{capa.title}</span>,
    },
    {
      key: "status",
      header: "وضعیت",
      render: (capa) => <StatusBadge status={capa.status} />,
    },
    {
      key: "assignedTo",
      header: "مسئول",
      render: (capa) => {
        const assignee = mockUsers.find((u) => u.id === capa.assignedTo);
        return <span className="text-sm text-gray-600">{assignee?.name}</span>;
      },
    },
    {
      key: "dueDate",
      header: "مهلت",
      render: (capa) => (
        <span className="text-sm text-gray-600">
          {new Date(capa.dueDate).toLocaleDateString("fa-IR")}
        </span>
      ),
    },
  ];

  // --------- هندلر مهرها ----------
  function handleStampAreaClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.max(5, Math.min(95, x));
    const clampedY = Math.max(5, Math.min(95, y));

    setDraftPosX(Number(clampedX.toFixed(1)));
    setDraftPosY(Number(clampedY.toFixed(1)));
  }

  function handleSaveStamp() {
    if (!project) return;

    const isoDate = draftStampDate
      ? new Date(draftStampDate).toISOString()
      : new Date().toISOString();

    const stampCode =
      draftStampCode.trim() !== ""
        ? draftStampCode.trim()
        : project.utn || `STAMP-${Date.now()}`;

    const newStamp: ProjectStamp = {
      id: `STAMP-${Date.now()}`,
      projectId: project.id,
      type: draftStampType,
      date: isoDate,
      createdBy: applicant?.id || mockUsers[0].id,
      posX: draftPosX,
      posY: draftPosY,
      scale: draftScale,
      stampCode,
    };

    setStamps((prev) => [...prev, newStamp]);
  }

  function handleRemoveStamp(stampId: string) {
    setStamps((prev) => prev.filter((s) => s.id !== stampId));
  }

  // --------- تب‌ها ----------
  const tabs = [
    {
      id: "overview",
      label: "نمای کلی",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  شماره پیگیری
                </label>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {project.utn}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  نوع پروژه
                </label>
                <p className="text-gray-900 mt-1">{project.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  متقاضی
                </label>
                <p className="text-gray-900 mt-1">{applicant?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  واحد
                </label>
                <p className="text-gray-900 mt-1">{unit?.name}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  تاریخ ایجاد
                </label>
                <p className="text-gray-900 mt-1">
                  {new Date(project.createdAt).toLocaleDateString("fa-IR")}
                </p>
              </div>
              {project.submittedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    تاریخ ارسال
                  </label>
                  <p className="text-gray-900 mt-1">
                    {new Date(project.submittedAt).toLocaleDateString("fa-IR")}
                  </p>
                </div>
              )}
              {project.approvedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    تاریخ تأیید
                  </label>
                  <p className="text-gray-900 mt-1">
                    {new Date(project.approvedAt).toLocaleDateString("fa-IR")}
                  </p>
                </div>
              )}
              {project.certifiedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    تاریخ گواهی
                  </label>
                  <p className="text-gray-900 mt-1">
                    {new Date(project.certifiedAt).toLocaleDateString("fa-IR")}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">توضیحات</label>
            <p className="text-gray-900 mt-2 leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "documents",
      label: `مدارک (${documents.length})`,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">{documents.length} مدرک</p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setUploadOpen(true)}
            >
              + بارگذاری مدرک
            </Button>
          </div>
          <DataTable
            data={documents}
            columns={documentColumns}
            searchable
            searchPlaceholder="جستجو در نام فایل، وضعیت..."
          />
        </div>
      ),
    },
    {
      id: "inspections",
      label: `بازرسی‌ها (${inspections.length})`,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">{inspections.length} بازرسی</p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setInspectionOpen(true)}
            >
              + بازرسی جدید
            </Button>
          </div>
          <DataTable
            data={inspections}
            columns={inspectionColumns}
            searchable
            searchPlaceholder="جستجو در نوع، بازرس، نتیجه..."
          />
        </div>
      ),
    },
    {
      id: "certificates",
      label: `گواهینامه‌ها (${certificates.length})`,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {certificates.length} گواهینامه
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setCertificateOpen(true)}
            >
              + صدور گواهینامه
            </Button>
          </div>
          <DataTable
            data={certificates}
            columns={certificateColumns}
            searchable
            searchPlaceholder="جستجوی شماره گواهی..."
          />
        </div>
      ),
    },
    {
      id: "stamps",
      label: `مهرها (${stamps.length})`,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              مهرهای ثبت‌شده روی نقشه / طراحی پروژه
            </p>
            <span className="text-xs text-gray-500">
              برای جابجایی محل مهر، داخل پلان کلیک کنید
            </span>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* ناحیه پیش‌نمایش پلان */}
            <div className="flex-1">
              <div
                className="relative bg-slate-50 rounded-xl border border-dashed border-slate-300 h-72 cursor-crosshair overflow-hidden"
                onClick={handleStampAreaClick}
              >
                {/* شِمای ساده از پلان / نقشه */}
                <div className="absolute inset-4 border border-slate-300/70 rounded-lg pointer-events-none" />
                <div className="absolute inset-6 grid grid-cols-6 grid-rows-4 opacity-40 pointer-events-none">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="border border-slate-200/70" />
                  ))}
                </div>

                {/* مهرهای ذخیره‌شده */}
                {stamps.map((stamp) => (
                  <div
                    key={stamp.id}
                    className="absolute"
                    style={{
                      left: `${stamp.posX}%`,
                      top: `${stamp.posY}%`,
                      transform: `translate(-50%, -50%) scale(${stamp.scale})`,
                    }}
                  >
                    <StampBox
                      type={stamp.type}
                      date={stamp.date}
                      code={stamp.stampCode}
                    />
                  </div>
                ))}

                {/* پیش‌نمایش مهر در حال طراحی */}
                <div
                  className="absolute opacity-70 pointer-events-none"
                  style={{
                    left: `${draftPosX}%`,
                    top: `${draftPosY}%`,
                    transform: `translate(-50%, -50%) scale(${draftScale})`,
                  }}
                >
                  <StampBox
                    type={draftStampType}
                    date={
                      draftStampDate
                        ? new Date(draftStampDate).toISOString()
                        : new Date().toISOString()
                    }
                    code={draftStampCode || project.utn}
                  />
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                برای تعیین محل مهر، داخل کادر بالا کلیک کنید. تا زمانی که روی
                «ذخیره مهر روی پلان» بزنید، فقط به‌صورت پیش‌نمایش نمایش داده
                می‌شود.
              </p>
            </div>

            {/* تنظیمات مهر و لیست مهرها */}
            <div className="w-full lg:w-72 space-y-4">
              <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    تنظیمات مهر
                  </span>
                  <Badge className="bg-white border border-slate-200 text-xs">
                    {stampTypeConfig[draftStampType].labelFa}
                  </Badge>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    نوع مهر
                  </label>
                  <select
                    value={draftStampType}
                    onChange={(e) =>
                      setDraftStampType(e.target.value as StampType)
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Approved">تأیید شده (سبز)</option>
                    <option value="Rejected">رد شده (قرمز)</option>
                    <option value="ForReview">برای بررسی (آبی / بنفش)</option>
                    <option value="Conditional">تأیید مشروط (نارنجی)</option>
                    <option value="ForInfo">برای اطلاع (آبی روشن)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    تاریخ مهر
                  </label>
                  <input
                    type="date"
                    value={draftStampDate}
                    onChange={(e) => setDraftStampDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    شناسه / ID مهر
                  </label>
                  <input
                    type="text"
                    value={draftStampCode}
                    onChange={(e) => setDraftStampCode(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="مثلاً ASC-APP-001 یا UTN"
                  />
                  <p className="mt-1 text-[11px] text-gray-500">
                    اگر خالی بگذارید، به‌صورت خودکار از UTN پروژه استفاده
                    می‌شود.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    اندازه مهر
                  </label>
                  <input
                    type="range"
                    min={0.7}
                    max={1.6}
                    step={0.1}
                    value={draftScale}
                    onChange={(e) => setDraftScale(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="mt-1 text-[11px] text-gray-500">
                    بزرگ‌نمایی فعلی: {(draftScale * 100).toFixed(0)}%
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  className="w-full mt-2"
                  onClick={handleSaveStamp}
                >
                  ذخیره مهر روی پلان
                </Button>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-3 max-h-60 overflow-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-900">
                    لیست مهرهای ثبت‌شده
                  </span>
                  <span className="text-[11px] text-gray-500">
                    {stamps.length === 0
                      ? "مهر فعالی ثبت نشده است"
                      : `${stamps.length} مهر`}
                  </span>
                </div>
                {stamps.length === 0 ? (
                  <p className="text-xs text-gray-500">
                    بعد از ثبت هر مهر، در این لیست نمایش داده می‌شود.
                  </p>
                ) : (
                  <ul className="space-y-2 text-xs">
                    {stamps.map((s) => (
                      <li
                        key={s.id}
                        className="flex items-center justify-between rounded-lg border border-slate-100 px-2 py-1.5"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">
                            {stampTypeConfig[s.type].labelFa}
                          </span>
                          <span className="text-[11px] text-gray-500">
                            ID: {s.stampCode} –{" "}
                            {new Date(s.date).toLocaleDateString("fa-IR")} – x:
                            {s.posX.toFixed(1)}%, y:
                            {s.posY.toFixed(1)}%
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveStamp(s.id)}
                          className="text-[11px] text-red-500 hover:text-red-700"
                        >
                          حذف
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "capa",
      label: `CAPA (${capas.length})`,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {capas.length} اقدام اصلاحی/پیشگیرانه
            </p>
          </div>
          <DataTable
            data={capas}
            columns={capaColumns}
            searchable
            searchPlaceholder="جستجو در عنوان یا مسئول..."
          />
        </div>
      ),
    },
    {
      id: "closure",
      label: "بسته‌شدن",
      content: (
        <div className="space-y-4">
          {closures.map((closure) => (
            <div key={closure.id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">
                  {closure.type === "Technical"
                    ? "بسته‌شدن فنی"
                    : closure.type === "Financial"
                    ? "بسته‌شدن مالی"
                    : "بسته‌شدن قراردادی"}
                </h4>
                <StatusBadge status={closure.status} />
              </div>
              {closure.notes && (
                <p className="text-sm text-gray-600 mt-2">{closure.notes}</p>
              )}
              {closure.closedAt && (
                <p className="text-xs text-gray-500 mt-2">
                  بسته شده در:{" "}
                  {new Date(closure.closedAt).toLocaleDateString("fa-IR")}
                </p>
              )}
            </div>
          ))}
          {closures.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              هنوز بسته‌شدنی ثبت نشده است
            </p>
          )}
        </div>
      ),
    },
  ];

  // --------- هندلرهای عملیات اصلی پروژه ----------
  const handleSaveProjectEdit = () => {
    setProject((prev) =>
      prev
        ? {
            ...prev,
            status: editStatus,
            description: editDescription,
            updatedAt: new Date().toISOString(),
          }
        : prev
    );
    setEditOpen(false);
  };

  const handleQuickActionApprove = () => {
    setProject((prev) =>
      prev
        ? {
            ...prev,
            status: "Approved" as ProjectStatus,
            approvedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : prev
    );
    setActionsOpen(false);
  };

  const handleQuickActionCertify = () => {
    setProject((prev) =>
      prev
        ? {
            ...prev,
            status: "Certified" as ProjectStatus,
            certifiedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : prev
    );
    setActionsOpen(false);
  };

  const handleAddDocument = () => {
    if (!newDocName.trim()) return;
    const sizeMb = parseFloat(newDocSizeMb || "1");
    const now = new Date().toISOString();

    const newDoc: Document = {
      id: `NEW-DOC-${Date.now()}`,
      projectId: project.id,
      fileName: newDocName,
      fileSize: isNaN(sizeMb) ? 1024 * 1024 : sizeMb * 1024 * 1024,
      fileHash: `TEMP-${Date.now()}`,
      revision: 1,
      status: "UnderReview" as DocumentStatus,
      uploadedBy: project.applicantId,
      uploadedAt: now,
    };

    setDocuments((prev) => [newDoc, ...prev]);
    setNewDocName("");
    setNewDocSizeMb("1");
    setUploadOpen(false);
  };

  const handleAddInspection = () => {
    if (!newInspectionDate) return;
    const nowIso = new Date().toISOString();

    const newInspection: Inspection = {
      id: `NEW-INSP-${Date.now()}`,
      projectId: project.id,
      type: "Initial" as InspectionType,
      inspectorId: applicant?.id || mockUsers[0].id,
      inspectionDate: new Date(newInspectionDate).toISOString(),
      result: "Compliant" as InspectionResult,
      remarks: newInspectionRemarks || "ثبت از طریق داشبورد",
      attachments: [],
      createdAt: nowIso,
    };

    setInspections((prev) => [newInspection, ...prev]);
    setNewInspectionDate("");
    setNewInspectionRemarks("");
    setInspectionOpen(false);
  };

  const handleAddCertificate = () => {
    if (!newCertNumber.trim() || !newCertExpiry) return;

    const newCert: Certificate = {
      id: `NEW-CERT-${Date.now()}`,
      projectId: project.id,
      certificateNumber: newCertNumber,
      type: CertificateType.Design,
      issueDate: new Date().toISOString(),
      expiryDate: new Date(newCertExpiry).toISOString(),
      issuedBy: project.applicantId || "system",
      status: "Active",
    };

    setCertificates((prev) => [newCert, ...prev]);
    setNewCertNumber("");
    setNewCertExpiry("");
    setCertificateOpen(false);
  };

  // --------- UI اصلی ----------
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => navigate("/projects")}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon name="chevronDown" size={20} className="rotate-90" />
              </button>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {project.title}
              </h1>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-gray-600 mr-1">{project.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setEditDescription(project.description);
                setEditStatus(project.status);
                setEditOpen(true);
              }}
            >
              ویرایش
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setActionsOpen(true)}
            >
              اقدامات
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <Tabs tabs={tabs} variant="default" />
        </div>
      </div>

      {/* --------- مدال ویرایش پروژه --------- */}
      {editOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                ویرایش اطلاعات پروژه
              </h2>
              <button
                onClick={() => setEditOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon name="check" size={24} className="rotate-45" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  وضعیت
                </label>
                <select
                  value={editStatus}
                  onChange={(e) =>
                    setEditStatus(e.target.value as ProjectStatus)
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  توضیحات
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditOpen(false)}
                >
                  انصراف
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveProjectEdit}
                >
                  ذخیره
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------- مدال اقدامات سریع --------- */}
      {actionsOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                اقدامات سریع
              </h2>
              <button
                onClick={() => setActionsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon name="check" size={24} className="rotate-45" />
              </button>
            </div>
            <div className="space-y-3">
              <Button
                variant="secondary"
                className="w-full justify-between"
                onClick={handleQuickActionApprove}
              >
                <span>تغییر وضعیت به «تایید شده»</span>
                <Icon name="check" size={16} />
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-between"
                onClick={handleQuickActionCertify}
              >
                <span>تغییر وضعیت به «گواهی صادر شده»</span>
                <Icon name="clipboard" size={16} />
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                این تغییرات فقط در سطح رابط کاربری و داده‌های تستی mock ذخیره
                می‌شود.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --------- مدال بارگذاری مدرک --------- */}
      {uploadOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                بارگذاری مدرک جدید
              </h2>
              <button
                onClick={() => setUploadOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon name="check" size={24} className="rotate-45" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نام فایل
                </label>
                <input
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="مثلاً Hull_Calc_v2.pdf"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  حجم (MB)
                </label>
                <input
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={newDocSizeMb}
                  onChange={(e) => setNewDocSizeMb(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setUploadOpen(false)}
                >
                  انصراف
                </Button>
                <Button variant="primary" size="sm" onClick={handleAddDocument}>
                  افزودن
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------- مدال بازرسی جدید --------- */}
      {inspectionOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                ثبت بازرسی جدید
              </h2>
              <button
                onClick={() => setInspectionOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon name="check" size={24} className="rotate-45" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تاریخ بازرسی
                </label>
                <input
                  type="date"
                  value={newInspectionDate}
                  onChange={(e) => setNewInspectionDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  توضیحات
                </label>
                <textarea
                  value={newInspectionRemarks}
                  onChange={(e) => setNewInspectionRemarks(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="خلاصه نتایج بازرسی..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setInspectionOpen(false)}
                >
                  انصراف
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddInspection}
                >
                  ثبت
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------- مدال صدور گواهینامه --------- */}
      {certificateOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                صدور گواهینامه جدید
              </h2>
              <button
                onClick={() => setCertificateOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon name="check" size={24} className="rotate-45" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  شماره گواهی
                </label>
                <input
                  value={newCertNumber}
                  onChange={(e) => setNewCertNumber(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="مثلاً ASC-2024-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تاریخ انقضا
                </label>
                <input
                  type="date"
                  value={newCertExpiry}
                  onChange={(e) => setNewCertExpiry(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCertificateOpen(false)}
                >
                  انصراف
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddCertificate}
                >
                  ثبت
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
