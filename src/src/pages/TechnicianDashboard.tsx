import { useMemo, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { WorkspaceAppShell } from "../components/layout/WorkspaceAppShell";
import { GlassCard } from "../components/common/GlassCard";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { Donut } from "../components/charts/Donut";
import { AreaSpark } from "../components/charts/AreaSpark";
import { mockAvatars } from "../mocks/db";
import {
  WorkspaceProvider,
  useWorkspace,
} from "../features/workspace/WorkspaceContext";
import {
  createInitialJourneyState,
  workspaceSnapshots,
} from "../features/workspace/data";
import { JourneyState } from "../features/workspace/types";
import { Island } from "../features/projects/types";

// 🔹 تقویم شمسی
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

type TimeRange = "today" | "7d" | "30d";

const todayMetrics = [
  {
    id: "total",
    label: "کل گردش امروز",
    value: "۹۴ پرونده",
    helper: "همه فعالیت‌ها",
  },
  {
    id: "urgent",
    label: "ارجاع اضطراری",
    value: "۱۸",
    helper: "نیازمند اقدام فوری",
  },
  {
    id: "active",
    label: "در حال اقدام",
    value: "۳۲",
    helper: "پرونده‌های باز",
  },
  { id: "closed", label: "بسته شده", value: "۴۴", helper: "تحویل و نهایی شده" },
];

const weekMetrics = [
  {
    id: "total",
    label: "کل گردش ۷ روز اخیر",
    value: "۵۴۰ پرونده",
    helper: "همه فعالیت‌ها",
  },
  {
    id: "urgent",
    label: "ارجاع اضطراری",
    value: "۷۴",
    helper: "نیازمند اقدام فوری",
  },
  {
    id: "active",
    label: "در حال اقدام",
    value: "۱۵۸",
    helper: "میانگین روزانه ۲۲",
  },
  {
    id: "closed",
    label: "بسته شده",
    value: "۳۰۸",
    helper: "بسته شده در ۷ روز",
  },
];

const monthMetrics = [
  {
    id: "total",
    label: "کل گردش ۳۰ روز اخیر",
    value: "۲۲۴۰ پرونده",
    helper: "همه فعالیت‌ها",
  },
  {
    id: "urgent",
    label: "ارجاع اضطراری",
    value: "۲۹۶",
    helper: "میانگین روزانه ۱۰",
  },
  {
    id: "active",
    label: "در حال اقدام",
    value: "۵۹۰",
    helper: "پرونده‌های باز فعلی",
  },
  {
    id: "closed",
    label: "بسته شده",
    value: "۱۳۵۴",
    helper: "بسته شده در ۳۰ روز",
  },
];

const metricsByRange: Record<TimeRange, typeof todayMetrics> = {
  today: todayMetrics,
  "7d": weekMetrics,
  "30d": monthMetrics,
};

const quickStats = [
  {
    id: "sla",
    label: "پوشش SLA امروز",
    value: "۹۲٪",
    change: "+۴٪",
    tone: "positive" as const,
  },
  {
    id: "handover",
    label: "تحویل‌های موفق",
    value: "۱۲",
    change: "+۲",
    tone: "positive" as const,
  },
  {
    id: "alerts",
    label: "هشدارهای فعال",
    value: "۶",
    change: "-۱",
    tone: "positive" as const,
  },
  {
    id: "backlog",
    label: "پرونده‌های معوق",
    value: "۸",
    change: "+۳",
    tone: "negative" as const,
  },
];

const donutToday = [
  { label: "بازرسی میدانی", value: 32, color: "#2563eb" },
  { label: "تحلیل آزمایشگاهی", value: 18, color: "#0ea5e9" },
  { label: "مستندسازی", value: 26, color: "#f97316" },
  { label: "سایر فعالیت‌ها", value: 18, color: "#10b981" },
];

const donutWeek = [
  { label: "بازرسی میدانی", value: 180, color: "#2563eb" },
  { label: "تحلیل آزمایشگاهی", value: 110, color: "#0ea5e9" },
  { label: "مستندسازی", value: 130, color: "#f97316" },
  { label: "سایر فعالیت‌ها", value: 120, color: "#10b981" },
];

const donutMonth = [
  { label: "بازرسی میدانی", value: 720, color: "#2563eb" },
  { label: "تحلیل آزمایشگاهی", value: 430, color: "#0ea5e9" },
  { label: "مستندسازی", value: 520, color: "#f97316" },
  { label: "سایر فعالیت‌ها", value: 570, color: "#10b981" },
];

const donutByRange: Record<TimeRange, typeof donutToday> = {
  today: donutToday,
  "7d": donutWeek,
  "30d": donutMonth,
};

const sparkToday = [42, 50, 64, 58, 71, 69, 82, 88, 93, 90, 97, 103];
const sparkWeek = [380, 410, 430, 460, 480, 500, 540, 560, 590, 610, 640, 670];
const sparkMonth = [
  1200, 1400, 1500, 1600, 1700, 1800, 1900, 2050, 2150, 2200, 2300, 2400,
];

const sparkByRange: Record<TimeRange, number[]> = {
  today: sparkToday,
  "7d": sparkWeek,
  "30d": sparkMonth,
};

const priorityTasks = [
  {
    id: "alert-1",
    title: "پروژه بدنه UTN-2045 منتظر تایید طراحی است",
    owner: "سارا رحیمی",
    due: "امروز · ۱۵:۰۰",
  },
  {
    id: "alert-2",
    title: "ارسال خلاصه بازرسی برای یگان ۳",
    owner: "علی محمدی",
    due: "فردا · ۱۰:۳۰",
  },
  {
    id: "alert-3",
    title: "آماده‌سازی گزارش برای تماس مدیران",
    owner: "فاطمه کریمی",
    due: "جمعه · ۰۹:۰۰",
  },
];

const knowledgeBaseResources = [
  {
    id: "kb-root-cause",
    title: "راهنمای تحلیل ریشه‌ای ارتعاش",
    detail: "چک‌لیست ۱۲ مرحله‌ای برای یافتن سریع منشأ ایراد",
  },
  {
    id: "kb-report-kit",
    title: "الگوی گزارش مدیران",
    detail: "نسخه آماده ارائه با نمودارهای مقایسه‌ای",
  },
  {
    id: "kb-field-validation",
    title: "بسته معتبرسازی میدانی",
    detail: "استانداردهای پذیرش برای تیم QA",
  },
];

const supportShortcuts = [
  {
    id: "ticket",
    title: "ثبت تیکت",
    detail: "برای هماهنگی با واحد پشتیبانی",
  },
  {
    id: "chat",
    title: "چت با مهندس آماده‌باش",
    detail: "میانگین پاسخ‌گویی ۶ دقیقه",
  },
  {
    id: "meeting",
    title: "رزرو جلسه هم‌آهنگی",
    detail: "انتخاب بازه ۳۰ دقیقه‌ای",
  },
  {
    id: "secure-room",
    title: "اتاق داده ایمن",
    detail: "آپلود نقشه‌ها و مدارک حجیم",
  },
];

type WorkflowAssignment = {
  id: string;
  utn: string;
  title: string;
  tech: string;
  stage: string;
  sla: string;
};

const initialWorkflowAssignments: WorkflowAssignment[] = [
  {
    id: "wf-1",
    utn: "UTN-2045",
    title: "بدنه / لرزش غیرعادی",
    tech: "سارا رحیمی",
    stage: "بازرسی میدانی",
    sla: "۲ ساعت",
  },
  {
    id: "wf-2",
    utn: "UTN-1980",
    title: "ماشین‌آلات / نشت روغن",
    tech: "محمد رضوی",
    stage: "در انتظار تحویل",
    sla: "تا پایان امروز",
  },
  {
    id: "wf-3",
    utn: "UTN-2101",
    title: "الکتریک / قطع مقطعی",
    tech: "مهدی سلیمانی",
    stage: "تحلیل آزمایشگاهی",
    sla: "فردا صبح",
  },
  {
    id: "wf-4",
    utn: "UTN-1766",
    title: "سیستم عمومی / به‌روزرسانی مدارک",
    tech: "فاطمه کریمی",
    stage: "مستندسازی",
    sla: "در حال اقدام",
  },
];

type QuickNote = {
  id: string;
  text: string;
  createdAt: string;
};

type CustomAlert = {
  id: string;
  title: string;
  owner: string;
  due: string;
};

type WorkflowFilter = "all" | "pending" | "mine";
type WorkflowStageKey = "receive" | "field" | "handover";

const technicianOptions = [
  "سارا رحیمی",
  "محمد رضوی",
  "مهدی سلیمانی",
  "فاطمه کریمی",
];

// 🔹 چت و اتاق داده ایمن
type ChatMessage = {
  id: string;
  from: "user" | "engineer";
  text: string;
  time: string;
};

type SecureFileItem = {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);
  return `${size.toFixed(1)} ${sizes[i]}`;
}

function TechnicianDashboardView() {
  const { activeTab } = useWorkspace();
  const navigate = useNavigate();

  const [journeys, setJourneys] = useState<JourneyState>(() =>
    createInitialJourneyState()
  );
  const [quickNotes, setQuickNotes] = useState<QuickNote[]>([]);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");

  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionTitle, setActionTitle] = useState("");
  const [actionOwner, setActionOwner] = useState("سارا رحیمی");
  const [actionDate, setActionDate] = useState("");
  const [actionHour, setActionHour] = useState("");
  const [actionMinute, setActionMinute] = useState("");

  const [customAlerts, setCustomAlerts] = useState<CustomAlert[]>([]);
  const [pinnedResources, setPinnedResources] = useState<string[]>([]);
  const [activeSupportId, setActiveSupportId] = useState<string | null>(null);
  const [activeTechnician, setActiveTechnician] = useState<any | null>(null);

  const [timeRange, setTimeRange] = useState<TimeRange>("today");

  const [workflowAssignments, setWorkflowAssignments] = useState<
    WorkflowAssignment[]
  >(initialWorkflowAssignments);
  const [workflowFilter, setWorkflowFilter] = useState<WorkflowFilter>("all");

  const [workflowModalOpen, setWorkflowModalOpen] = useState(false);
  const [workflowModalStage, setWorkflowModalStage] =
    useState<WorkflowStageKey>("receive");
  const [workflowFormTitle, setWorkflowFormTitle] = useState("");
  const [workflowFormTech, setWorkflowFormTech] = useState<string>(
    technicianOptions[0]
  );
  const [workflowFormDate, setWorkflowFormDate] = useState<DateObject | null>(
    null
  );
  const [workflowFormTime, setWorkflowFormTime] = useState<string>("");

  const [selectedWorkflowIds, setSelectedWorkflowIds] = useState<string[]>([]);

  // 🔹 state مخصوص بخش پشتیبانی
  // ثبت تیکت
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketUTN, setTicketUTN] = useState("");
  const [ticketCategory, setTicketCategory] = useState("بدنه");
  const [ticketPriority, setTicketPriority] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketFiles, setTicketFiles] = useState<File[]>([]);
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState(false);

  // چت
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      from: "engineer",
      text: "سلام، من مهندس آماده‌باش هستم. لطفاً خیلی کوتاه بفرمایید روی کدام کشتی و چه سیستمی مشکل دارید.",
      time: "الان",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  // رزرو جلسه
  const [meetingDate, setMeetingDate] = useState<DateObject | null>(null);
  const [meetingTime, setMeetingTime] = useState<string>("");
  const [meetingDuration, setMeetingDuration] = useState<string>("30");
  const [meetingMode, setMeetingMode] = useState<"online" | "onsite">("online");
  const [meetingTopic, setMeetingTopic] = useState<string>("");
  const [meetingSuccess, setMeetingSuccess] = useState(false);

  // اتاق داده ایمن
  const [secureSelectedFiles, setSecureSelectedFiles] = useState<File[]>([]);
  const [secureUploadedFiles, setSecureUploadedFiles] = useState<
    SecureFileItem[]
  >([]);
  const [secureUploading, setSecureUploading] = useState(false);

  const snapshot = workspaceSnapshots[activeTab];
  const islands = journeys[activeTab] ?? [];

  const alerts = useMemo(
    () => [...priorityTasks, ...customAlerts],
    [customAlerts]
  );

  const workflowStageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    islands.forEach((island) => {
      counts[island.title] =
        (island.tasks?.length || 0) + (counts[island.title] || 0);
    });
    return counts;
  }, [islands]);

  const handleTaskReorder = (
    islandId: string,
    taskId: string,
    newOrder: number
  ) => {
    setJourneys((prev) => {
      const sourceIslands = prev[activeTab] ?? [];
      const updatedIslands = sourceIslands.map((island) => {
        if (island.id !== islandId) return island;
        const tasks = [...island.tasks];
        const currentIndex = tasks.findIndex((task) => task.id === taskId);
        if (currentIndex === -1) return island;
        const [moved] = tasks.splice(currentIndex, 1);
        const targetIndex = Math.min(Math.max(newOrder, 0), tasks.length);
        tasks.splice(targetIndex, 0, moved);
        return { ...island, tasks };
      }) as Island[];

      return {
        ...prev,
        [activeTab]: updatedIslands,
      };
    });
  };

  const handleAddNote = () => {
    if (!noteDraft.trim()) return;
    setQuickNotes((prev) => [
      {
        id: `note-${Date.now()}`,
        text: noteDraft.trim(),
        createdAt: new Date().toLocaleString("fa-IR"),
      },
      ...prev,
    ]);
    setNoteDraft("");
    setNoteModalOpen(false);
  };

  const handleSaveAction = () => {
    if (!actionTitle.trim()) return;

    let dueLabel = "بدون موعد";
    if (actionDate) {
      const hh = actionHour || "00";
      const mm = actionMinute || "00";
      dueLabel = `${actionDate} · ${hh}:${mm}`;
    } else if (actionHour || actionMinute) {
      dueLabel = `ساعت ${actionHour || "00"}:${actionMinute || "00"}`;
    }

    setCustomAlerts((prev) => [
      {
        id: `alert-${Date.now()}`,
        title: actionTitle.trim(),
        owner: actionOwner.trim() || "نامشخص",
        due: dueLabel,
      },
      ...prev,
    ]);

    setActionTitle("");
    setActionOwner("سارا رحیمی");
    setActionDate("");
    setActionHour("");
    setActionMinute("");
    setActionModalOpen(false);
  };

  const togglePin = (id: string) => {
    setPinnedResources((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleWorkflowSelection = (id: string) => {
    setSelectedWorkflowIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const currentMetrics = metricsByRange[timeRange];
  const currentDonut = donutByRange[timeRange];
  const currentSpark = sparkByRange[timeRange];

  const totalActivities = currentDonut.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const topActivity =
    currentDonut.length > 0
      ? (currentDonut as any).reduce(
          (top: any, item: any) => (item.value > top.value ? item : top),
          currentDonut[0]
        )
      : { label: "", value: 0, color: "" };
  const topPercent =
    totalActivities > 0
      ? Math.round((topActivity.value * 100) / totalActivities)
      : 0;

  const filteredAssignments = useMemo(() => {
    if (workflowFilter === "all") return workflowAssignments;

    if (workflowFilter === "mine") {
      const currentTech = "سارا رحیمی"; // تکنسین فعلی
      return workflowAssignments.filter((item) => item.tech === currentTech);
    }

    // pending
    return workflowAssignments.filter(
      (item) =>
        item.stage.includes("در انتظار") ||
        item.stage.includes("آماده") ||
        item.stage.includes("معوق")
    );
  }, [workflowAssignments, workflowFilter]);

  const receiveCases = filteredAssignments.filter((item) =>
    item.stage.includes("در انتظار")
  );
  const fieldCases = filteredAssignments.filter(
    (item) => item.stage.includes("بازرسی") || item.stage.includes("تحلیل")
  );
  const handoverCases = filteredAssignments.filter((item) =>
    item.stage.includes("مستندسازی")
  );

  const handleOpenWorkflowModal = (stage: WorkflowStageKey) => {
    setWorkflowModalStage(stage);
    setWorkflowFormTitle("");
    setWorkflowFormTech(technicianOptions[0]);
    setWorkflowFormDate(null);
    setWorkflowFormTime("");
    setWorkflowModalOpen(true);
  };

  const handleAddWorkflow = () => {
    if (!workflowFormTitle.trim()) return;

    const newStageLabel =
      workflowModalStage === "receive"
        ? "در انتظار بررسی"
        : workflowModalStage === "field"
        ? "بازرسی میدانی"
        : "مستندسازی";

    const randomUTN =
      "UTN-" + (1500 + Math.floor(Math.random() * 800)).toString();

    let slaLabel = "بدون موعد";
    if (workflowFormDate && workflowFormTime) {
      const dateStr = workflowFormDate.format("YYYY/MM/DD");
      slaLabel = `${dateStr} · ${workflowFormTime}`;
    } else if (workflowFormDate) {
      slaLabel = workflowFormDate.format("YYYY/MM/DD");
    } else if (workflowFormTime) {
      slaLabel = `ساعت ${workflowFormTime}`;
    }

    const newItem: WorkflowAssignment = {
      id: `wf-${Date.now()}`,
      utn: randomUTN,
      title: workflowFormTitle.trim(),
      tech: workflowFormTech.trim() || "نامشخص",
      stage: newStageLabel,
      sla: slaLabel,
    };

    setWorkflowAssignments((prev) => [...prev, newItem]);
    setWorkflowModalOpen(false);
  };

  // 🔹 هندلرهای بخش پشتیبانی

  const handleTicketFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setTicketFiles(Array.from(e.target.files));
  };

  const handleSubmitTicket = async (e: FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim() || !ticketDescription.trim()) return;

    setTicketSubmitting(true);
    setTicketSuccess(false);

    // اینجا بعداً به API واقعی وصل می‌شود
    await new Promise((res) => setTimeout(res, 900));

    console.log("Support ticket payload", {
      ticketTitle,
      ticketUTN,
      ticketCategory,
      ticketPriority,
      ticketDescription,
      ticketFiles,
    });

    setTicketSubmitting(false);
    setTicketSuccess(true);

    // ریست نرم
    setTicketTitle("");
    setTicketUTN("");
    setTicketDescription("");
    setTicketFiles([]);
    setTicketCategory("بدنه");
    setTicketPriority("medium");
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const now = new Date().toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setChatMessages((prev) => [
      ...prev,
      {
        id: `u-${Date.now()}`,
        from: "user",
        text: chatInput.trim(),
        time: now,
      },
    ]);
    setChatInput("");

    // شبیه‌سازی پاسخ مهندس
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          from: "engineer",
          text: "دریافت شد، لطفاً اگر لاگ یا عکس از خطا دارید در اتاق داده ایمن آپلود کنید.",
          time: new Date().toLocaleTimeString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 1200);
  };

  const handleSubmitMeeting = async (e: FormEvent) => {
    e.preventDefault();
    if (!meetingDate || !meetingTime.trim()) return;

    const dateStr = meetingDate.format("YYYY/MM/DD");
    console.log("Meeting request", {
      date: dateStr,
      time: meetingTime,
      duration: meetingDuration,
      mode: meetingMode,
      topic: meetingTopic,
    });

    setMeetingSuccess(true);
    setTimeout(() => {
      setMeetingSuccess(false);
      setMeetingDate(null);
      setMeetingTime("");
      setMeetingDuration("30");
      setMeetingMode("online");
      setMeetingTopic("");
    }, 1200);
  };

  const handleSecureFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setSecureSelectedFiles(Array.from(e.target.files));
  };

  const handleUploadSecureFiles = async () => {
    if (secureSelectedFiles.length === 0) return;
    setSecureUploading(true);

    await new Promise((res) => setTimeout(res, 1000));

    const now = new Date().toLocaleString("fa-IR");
    const newItems: SecureFileItem[] = secureSelectedFiles.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}`,
      name: file.name,
      size: file.size,
      uploadedAt: now,
    }));

    setSecureUploadedFiles((prev) => [...newItems, ...prev]);
    setSecureSelectedFiles([]);
    setSecureUploading(false);
  };

  const handleCloseSupportModal = () => {
    setActiveSupportId(null);
  };

  return (
    <WorkspaceAppShell>
      <div className="space-y-8" dir="rtl" lang="fa">
        {/* ردیف بالایی */}
        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr_1fr]">
          {/* مرکز عملیات */}
          <GlassCard className="p-6 space-y-5 bg-white/90 border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between gap-4 flex-row-reverse">
              <div className="flex flex-col items-end gap-2">
                <div className="inline-flex rounded-full bg-gray-100 border border-gray-200 px-3 py-1 text-[11px] text-gray-600">
                  به‌روزرسانی خودکار هر ۱۵ دقیقه
                </div>

                {/* 🔹 بازه زمانی + دکمه تقویم پرونده‌ها */}
                <div className="flex flex-row-reverse gap-2 items-center">
                  <div className="flex gap-1 flex-row-reverse">
                    <button
                      onClick={() => setTimeRange("today")}
                      className={`px-2 py-1 text-[11px] rounded-full ${
                        timeRange === "today"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      امروز
                    </button>
                    <button
                      onClick={() => setTimeRange("7d")}
                      className={`px-2 py-1 text-[11px] rounded-full ${
                        timeRange === "7d"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      ۷ روز اخیر
                    </button>
                    <button
                      onClick={() => setTimeRange("30d")}
                      className={`px-2 py-1 text-[11px] rounded-full ${
                        timeRange === "30d"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      ۳۰ روز اخیر
                    </button>
                  </div>

                  <button
                    onClick={() => navigate("/technician-calendar")}
                    className="px-3 py-1 rounded-full text-[11px] bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  >
                    تقویم پرونده‌ها
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-right">
                <p className="text-xs text-gray-500">
                  مرکز هماهنگی پرونده‌ها و تیم‌های میدانی
                </p>
                <h2 className="text-[22px] font-semibold text-gray-900">
                  دید لحظه‌ای روی وضعیت پرونده‌های حیاتی
                </h2>
                <p className="text-sm text-gray-500">{snapshot.subline}</p>
              </div>
            </div>

            {/* متریک‌ها */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {currentMetrics.map((metric) => (
                <div
                  key={metric.id}
                  className="rounded-2xl border border-gray-100 bg.white px-4 py-3 text-right text-gray-900 bg-white"
                >
                  <p className="text-xs text-gray-500">{metric.label}</p>
                  <p className="text-xl font-semibold mt-1">{metric.value}</p>
                  <p className="text-[11px] text-gray-500">{metric.helper}</p>
                </div>
              ))}
            </div>

            {/* پایین کارت */}
            <div className="flex items-center justify-between gap-4 flex-row-reverse">
              <div className="text.right text-right">
                <p className="text-[11px] text-gray-500 mb-1">
                  شیفت فعال / اعضای حاضر
                </p>
                <div className="flex flex-row-reverse">
                  {mockAvatars.slice(0, 5).map((avatar: any, index: number) => (
                    <button
                      key={avatar.id || index}
                      type="button"
                      onClick={() => setActiveTechnician(avatar)}
                      className="relative -mr-2 w-8 h-8 rounded-full border-2 border-white shadow-sm bg-gray-200 flex items-center justify-center text-[11px] text-gray-700 overflow-hidden hover:ring-2 hover:ring-blue-400 hover:border-blue-400"
                    >
                      {avatar.imageUrl ? (
                        <img
                          src={avatar.imageUrl}
                          alt={avatar.name || "technician"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        avatar.initials ||
                        (avatar.name && avatar.name[0]) ||
                        "ت"
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  برای مشاهده خلاصه عملکرد، روی تصویر هر تکنسین کلیک کنید
                </p>
              </div>

              <div className="flex flex-row-reverse gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setNoteModalOpen(true)}
                >
                  ثبت یادداشت میدانی
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActionModalOpen(true)}
                >
                  ثبت اقدام اصلاحی
                </Button>
              </div>
            </div>
          </GlassCard>

          {/* خلاصه KPI */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">
                خلاصه KPI واحد فنی
              </h3>
            </div>
            <div className="space-y-3">
              {quickStats.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-gray-100 bg-white px-4 py-3 flex items-center justify-between"
                >
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {item.value}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      item.tone === "positive"
                        ? "text-emerald-600"
                        : "text-rose-500"
                    }`}
                  >
                    {item.change}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* ترکیب فعالیت تیم */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between flex-row-reverse">
              <span className="text-[11px] text-gray-400">
                {timeRange === "today"
                  ? "امروز"
                  : timeRange === "7d"
                  ? "۷ روز اخیر"
                  : "۳۰ روز اخیر"}
              </span>
              <h3 className="text-base font-semibold text-gray-900 text-right">
                ترکیب فعالیت تیم
              </h3>
            </div>

            <div className="grid md:grid-cols-[1.1fr,1.4fr] gap-4 items-center">
              <div className="flex flex-col items-center gap-2">
                <Donut data={currentDonut} size={150} centerLabel="۹۴" />
                <p className="text-[11px] text-gray-500 text-center">
                  توزیع انواع فعالیت‌های ثبت‌شده در بازه انتخاب‌شده
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <AreaSpark
                  data={currentSpark}
                  width={220}
                  height={80}
                  color="#0ea5e9"
                />
                <div className="flex items-center justify-between text-[11px] text-gray-500 flex-row-reverse">
                  <span>ابتدای دوره</span>
                  <span>اکنون</span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs text-gray-700 flex-row-reverse">
                    <span>بیشترین سهم فعالیت:</span>
                    <span className="font-semibold">
                      {topActivity.label} · {topActivity.value} ({topPercent}%)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-gray-500">
                    {currentDonut.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between flex-row-reverse"
                      >
                        <span className="inline-flex items-center gap-1">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          {item.label}
                        </span>
                        <span>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* مسیر پرونده‌ها */}
        <section>
          <Card className="p-5 space-y-5">
            <div className="flex items-start justify-between flex-row-reverse gap-4">
              <div className="text-right">
                <h3 className="text-lg font-semibold text-gray-900">
                  مسیر پرونده‌ها (Workflow Engine)
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  مشاهده مرحله فعلی هر پرونده و ارتباط آن با تکنسین‌ها
                </p>
              </div>
              {/* فیلترها */}
              <div className="flex flex-row-reverse gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-[11px] ${
                    workflowFilter === "mine"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setWorkflowFilter("mine")}
                >
                  پرونده‌های من
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-[11px] ${
                    workflowFilter === "pending"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setWorkflowFilter("pending")}
                >
                  در انتظار تحویل
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-[11px] ${
                    workflowFilter === "all"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setWorkflowFilter("all")}
                >
                  همه پرونده‌ها
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-start flex-row-reverse">
              {Object.entries(workflowStageCounts).map(([title, count]) => (
                <div
                  key={title}
                  className="inline-flex items-center gap-1 rounded-full bg-gray-50 border border-gray-100 px-3 py-1 text-[11px]"
                >
                  <span className="font-medium text-gray-800">{title}</span>
                  <span className="rounded-full bg-gray-200 text-gray-700 w-5 h-5 flex items-center justify-center text-[10px]">
                    {count}
                  </span>
                </div>
              ))}
            </div>

            {/* سه ستون – تحویل / میدانی / دریافت */}
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {/* تحویل و بستن پرونده */}
              <div className="rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col min-h-[260px]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                  <h4 className="text-sm font-semibold text-gray-900">
                    تحویل و بستن پرونده
                  </h4>
                  <button
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                    onClick={() => handleOpenWorkflowModal("handover")}
                  >
                    <Icon name="plus" size={16} />
                  </button>
                </div>
                <div className="flex-1 px-3 py-2 space-y-2">
                  {handoverCases.length === 0 && (
                    <p className="text-[11px] text-gray-400 text-center mt-6">
                      پرونده‌ای برای تحویل نیست
                    </p>
                  )}
                  {handoverCases.map((item) => {
                    const isSelected = selectedWorkflowIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`rounded-2xl border px-3 py-2 space-y-1 text-right cursor-pointer bg-white ${
                          isSelected
                            ? "border-emerald-400 bg-emerald-50/40"
                            : "border-gray-100"
                        }`}
                        onClick={() => toggleWorkflowSelection(item.id)}
                      >
                        <div className="flex items-center justify-between flex-row-reverse">
                          <div className="flex items-center gap-2 flex-row-reverse">
                            <button
                              type="button"
                              className={`w-4 h-4 rounded border flex items-center justify-center ${
                                isSelected
                                  ? "bg-emerald-500 border-emerald-500 text-white"
                                  : "bg-emerald-50 border-emerald-200 text-transparent"
                              }`}
                            >
                              <Icon name="check" size={10} />
                            </button>
                            <p className="text-xs font-medium text-gray-900">
                              {item.title}
                            </p>
                          </div>
                          <span className="text-[10px] font-mono bg-gray-50 border border-gray-100 rounded-full px-2 py-0.5 text-gray-600">
                            {item.utn}
                          </span>
                        </div>
                        <div className="flex items-center justify-between flex-row-reverse text-[10px] text-gray-500">
                          <span>تکنسین: {item.tech}</span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            آماده بستن
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* اجرای میدانی */}
              <div className="rounded-3xl bg-slate-900 text-white shadow-lg border border-slate-800 flex flex-col min-h-[280px] relative overflow-hidden">
                <div className="absolute inset-y-10 left-0 w-10 bg-gradient-to-l from-transparent to-slate-900/70 pointer-events-none" />
                <div className="absolute inset-y-10 right-0 w-10 bg-gradient-to-r from-transparent to-slate-900/70 pointer-events-none" />

                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/70">
                  <h4 className="text-sm font-semibold">اجرای میدانی</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-400/40">
                      هسته فعال امروز
                    </span>
                    <button
                      className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
                      onClick={() => handleOpenWorkflowModal("field")}
                    >
                      <Icon name="plus" size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 px-3 py-3 space-y-2">
                  {fieldCases.map((item) => {
                    const isSelected = selectedWorkflowIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`rounded-2xl px-3 py-2 space-y-1 cursor-pointer border ${
                          isSelected
                            ? "bg-emerald-500/15 border-emerald-400"
                            : "bg-slate-800/80 border-slate-700"
                        }`}
                        onClick={() => toggleWorkflowSelection(item.id)}
                      >
                        <div className="flex items-center justify-between flex-row-reverse">
                          <div className="flex items-center gap-2 flex-row-reverse">
                            <button
                              type="button"
                              className={`w-4 h-4 rounded border flex items-center justify-center ${
                                isSelected
                                  ? "bg-emerald-400 border-emerald-400 text-slate-900"
                                  : "bg-slate-900 border-slate-600 text-transparent"
                              }`}
                            >
                              <Icon name="check" size={10} />
                            </button>
                            <p className="text-xs font-semibold">
                              {item.title}
                            </p>
                          </div>
                          <span className="text-[10px] font-mono bg-slate-900/70 rounded-full px-2 py-0.5 border border-slate-700">
                            {item.utn}
                          </span>
                        </div>
                        <div className="flex items-center justify-between flex-row-reverse text-[10px] text-slate-200/80">
                          <span>تکنسین: {item.tech}</span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-0.5 border border-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            {item.stage}
                          </span>
                        </div>
                        <div className="flex items-center justify-between flex-row-reverse text-[10px] text-slate-300/80">
                          <span className="opacity-80">SLA: {item.sla}</span>
                          <span className="opacity-60">
                            آخرین بروزرسانی · ۱۳ دقیقه قبل
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* دریافت و ارجاع */}
              <div className="rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col min-h-[260px]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                  <h4 className="text-sm font-semibold text-gray-900">
                    دریافت و ارجاع
                  </h4>
                  <button
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                    onClick={() => handleOpenWorkflowModal("receive")}
                  >
                    <Icon name="plus" size={16} />
                  </button>
                </div>
                <div className="flex-1 px-3 py-2 space-y-2">
                  {receiveCases.length === 0 && (
                    <p className="text-[11px] text-gray-400 text-center mt-6">
                      موردی در این مرحله نیست
                    </p>
                  )}
                  {receiveCases.map((item) => {
                    const isSelected = selectedWorkflowIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`rounded-2xl border px-3 py-2 space-y-1 text-right cursor-pointer bg-white ${
                          isSelected
                            ? "border-emerald-400 bg-emerald-50/40"
                            : "border-gray-100"
                        }`}
                        onClick={() => toggleWorkflowSelection(item.id)}
                      >
                        <div className="flex items-center justify-between flex-row-reverse">
                          <div className="flex items-center gap-2 flex-row-reverse">
                            <button
                              type="button"
                              className={`w-4 h-4 rounded border flex items-center justify-center ${
                                isSelected
                                  ? "bg-emerald-500 border-emerald-500 text-white"
                                  : "bg-white border-gray-300 text-transparent"
                              }`}
                            >
                              <Icon name="check" size={10} />
                            </button>
                            <p className="text-xs font-medium text-gray-900">
                              {item.title}
                            </p>
                          </div>
                          <span className="text-[10px] font-mono bg-gray-50 border border-gray-100 rounded-full px-2 py-0.5 text-gray-600">
                            {item.utn}
                          </span>
                        </div>
                        <div className="flex items-center justify-between flex-row-reverse text-[10px] text-gray-500">
                          <span>تکنسین: {item.tech}</span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 px-2 py-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            {item.sla}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* منابع و پشتیبانی */}
        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="p-6 space-y-4 lg:col-span-2">
            <div className="flex flex-row-reverse items-center justify-between">
              <div className="text-right">
                <h4 className="text-base font-semibold text-gray-900">
                  منابع پیشنهادی تیم
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  به‌روزرسانی شده توسط دفتر فنی
                </p>
              </div>
              <Button variant="secondary" size="sm">
                مشاهده آرشیو
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {knowledgeBaseResources.map((resource) => {
                const isPinned = pinnedResources.includes(resource.id);
                return (
                  <div
                    key={resource.id}
                    className="rounded-2xl border border-gray-100 bg-white/95 px-4 py-3 flex flex-row-reverse items-center justify-between gap-3"
                  >
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <p className="text-sm font-medium text-gray-900">
                          {resource.title}
                        </p>
                        {isPinned && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                            سنجاق شده
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {resource.detail}
                      </p>
                    </div>
                    <div className="flex flex-row-reverse gap-1 text-gray-500">
                      <button
                        type="button"
                        onClick={() => togglePin(resource.id)}
                        className="w-8 h-8 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Icon name={isPinned ? "check" : "plus"} size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setNoteDraft(
                            `${resource.title} - ${resource.detail}`
                          );
                          setNoteModalOpen(true);
                        }}
                        className="w-8 h-8 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Icon name="clipboard" size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* 🔹 پشتیبانی و سرویس – نسخه کامل و عملیاتی */}
          <Card className="p-6 space-y-4">
            <div className="flex flex-row-reverse items-center justify-between">
              <div className="text-right">
                <h4 className="text-base font-semibold text-gray-900">
                  پشتیبانی و سرویس
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  تیم موفقیت مشتری همیشه آماده است
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {supportShortcuts.map((shortcut) => {
                const isActive = activeSupportId === shortcut.id;
                return (
                  <button
                    key={shortcut.id}
                    type="button"
                    onClick={() => setActiveSupportId(shortcut.id)}
                    className={`w-full text-right rounded-2xl border px-4 py-3 flex items-center justify-between flex-row-reverse transition ${
                      isActive
                        ? "border-blue-200 bg-blue-50"
                        : "border-gray-100 bg-white/95 hover:bg-gray-50"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {shortcut.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {shortcut.detail}
                      </p>
                    </div>
                    <Icon
                      name="chevronDown"
                      size={16}
                      className={`transition-transform ${
                        isActive ? "-rotate-90" : "rotate-90"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </Card>
        </section>
      </div>

      {/* مدال‌ها */}
      {noteModalOpen && (
        <Modal
          title="ثبت یادداشت میدانی"
          onClose={() => setNoteModalOpen(false)}
        >
          <div className="space-y-3">
            <textarea
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              rows={4}
              placeholder="مثلاً: در بازدید امروز لرزش غیرعادی در محور سمت چپ مشاهده شد..."
              value={noteDraft}
              onChange={(event) => setNoteDraft(event.target.value)}
            />
            <div className="flex justify-end gap-2 flex-row-reverse">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setNoteModalOpen(false)}
              >
                انصراف
              </Button>
              <Button variant="primary" size="sm" onClick={handleAddNote}>
                ذخیره
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {actionModalOpen && (
        <Modal
          title="ثبت اقدام اصلاحی / پیشگیرانه"
          onClose={() => setActionModalOpen(false)}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                توضیح اقدام
              </label>
              <input
                value={actionTitle}
                onChange={(event) => setActionTitle(event.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                placeholder="مثلاً: هماهنگی با QA برای بازبینی مجدد"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                  مسئول
                </label>
                <input
                  value={actionOwner}
                  onChange={(event) => setActionOwner(event.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                  موعد
                </label>
                <div className="flex items-center gap-2 flex-row-reverse">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={0}
                      max={23}
                      value={actionHour}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === "" || (+v >= 0 && +v <= 23)) {
                          setActionHour(v);
                        }
                      }}
                      className="w-14 border border-gray-200 rounded-xl px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ساعت"
                    />
                    <span className="text-gray-500 text-xs">:</span>
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={actionMinute}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === "" || (+v >= 0 && +v <= 59)) {
                          setActionMinute(v);
                        }
                      }}
                      className="w-14 border border-gray-200 rounded-xl px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="دقیقه"
                    />
                  </div>

                  <input
                    type="date"
                    value={actionDate}
                    onChange={(e) => setActionDate(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 flex-row-reverse">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setActionModalOpen(false)}
              >
                انصراف
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveAction}>
                ذخیره و افزودن
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* مدال افزودن پرونده به مسیر با تقویم شمسی */}
      {workflowModalOpen && (
        <Modal
          title="افزودن پرونده به مسیر"
          onClose={() => setWorkflowModalOpen(false)}
        >
          <div className="space-y-4 text-right">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                عنوان پرونده
              </label>
              <input
                value={workflowFormTitle}
                onChange={(e) => setWorkflowFormTitle(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="مثلاً: بدنه / لرزش غیرعادی"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تکنسین مسئول
              </label>
              <select
                value={workflowFormTech}
                onChange={(e) => setWorkflowFormTech(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {technicianOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SLA / موعد
              </label>
              <div className="flex items-center gap-2 flex-row-reverse">
                <DatePicker
                  value={workflowFormDate}
                  onChange={(value) =>
                    setWorkflowFormDate(
                      value instanceof DateObject ? value : null
                    )
                  }
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-right"
                  inputClass="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-right bg-white"
                  placeholder="انتخاب تاریخ"
                />
                <input
                  type="time"
                  value={workflowFormTime}
                  onChange={(e) => setWorkflowFormTime(e.target.value)}
                  className="w-32 border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 flex-row-reverse">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setWorkflowModalOpen(false)}
              >
                انصراف
              </Button>
              <Button variant="primary" size="sm" onClick={handleAddWorkflow}>
                ذخیره و افزودن
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* 🔹 مدال‌های اختصاصی پشتیبانی و سرویس */}

      {/* ثبت تیکت */}
      {activeSupportId === "ticket" && (
        <Modal title="ثبت تیکت جدید" onClose={handleCloseSupportModal}>
          <form className="space-y-4 text-right" onSubmit={handleSubmitTicket}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  UTN / شماره پرونده
                </label>
                <input
                  value={ticketUTN}
                  onChange={(e) => setTicketUTN(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="مثلاً UTN-2045"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  دسته‌بندی
                </label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>بدنه</option>
                  <option>ماشین‌آلات</option>
                  <option>الکتریک</option>
                  <option>سیستم عمومی</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                عنوان تیکت
              </label>
              <input
                value={ticketTitle}
                onChange={(e) => setTicketTitle(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="مثلاً: خطای مکرر در استارت ژنراتور شماره ۲"
              />
            </div>

            <div className="grid grid-cols-[1.5fr,1fr] gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  توضیحات
                </label>
                <textarea
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="شرح مختصر مشکل، شرایط وقوع، و اقداماتی که تاکنون انجام شده..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  اولویت
                </label>
                <div className="flex flex-row-reverse gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setTicketPriority("high")}
                    className={`flex-1 px-2 py-1.5 rounded-xl text-xs border ${
                      ticketPriority === "high"
                        ? "bg-red-50 border-red-400 text-red-700"
                        : "bg-white border-gray-200 text-gray-700"
                    }`}
                  >
                    بحرانی
                  </button>
                  <button
                    type="button"
                    onClick={() => setTicketPriority("medium")}
                    className={`flex-1 px-2 py-1.5 rounded-xl text-xs border ${
                      ticketPriority === "medium"
                        ? "bg-amber-50 border-amber-400 text-amber-700"
                        : "bg-white border-gray-200 text-gray-700"
                    }`}
                  >
                    عادی
                  </button>
                  <button
                    type="button"
                    onClick={() => setTicketPriority("low")}
                    className={`flex-1 px-2 py-1.5 rounded-xl text-xs border ${
                      ticketPriority === "low"
                        ? "bg-emerald-50 border-emerald-400 text-emerald-700"
                        : "bg-white border-gray-200 text-gray-700"
                    }`}
                  >
                    کم‌اهمیت
                  </button>
                </div>

                <label className="block text-xs font-medium text-gray-700 mb-1">
                  فایل‌های ضمیمه
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleTicketFilesChange}
                  className="w-full text-xs"
                />
                {ticketFiles.length > 0 && (
                  <ul className="mt-2 space-y-1 max-h-20 overflow-auto text-xs text-gray-600 border border-dashed border-gray-200 rounded-lg p-2">
                    {ticketFiles.map((file) => (
                      <li key={file.name}>{file.name}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {ticketSuccess && (
              <p className="text-xs text-emerald-600 text-right">
                تیکت با موفقیت ثبت شد و برای واحد پشتیبانی ارسال گردید.
              </p>
            )}

            <div className="flex justify-end gap-2 flex-row-reverse mt-1">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleCloseSupportModal}
              >
                بستن
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={ticketSubmitting}
              >
                {ticketSubmitting ? "در حال ارسال..." : "ثبت تیکت"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* چت با مهندس آماده‌باش */}
      {activeSupportId === "chat" && (
        <Modal title="چت با مهندس آماده‌باش" onClose={handleCloseSupportModal}>
          <div className="flex flex-col h-[360px]" dir="rtl">
            <div className="flex-1 overflow-y-auto border border-gray-100 rounded-xl p-3 space-y-2 bg-gray-50">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs ${
                      msg.from === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <p
                      className={`mt-1 text-[10px] ${
                        msg.from === "user" ? "text-blue-100" : "text-gray-400"
                      }`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="خیلی کوتاه مشکل را توضیح دهید و اگر لازم است کد UTN را هم بنویسید..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendChat();
                  }
                }}
              />
              <div className="flex justify-between items-center mt-2 flex-row-reverse">
                <div className="text-[10px] text-gray-400">
                  پاسخ‌های مهندس آماده‌باش در ساعات اداری حداکثر ۱۰ دقیقه طول
                  می‌کشد.
                </div>
                <div className="flex flex-row-reverse gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    type="button"
                    onClick={handleCloseSupportModal}
                  >
                    بستن
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    type="button"
                    onClick={handleSendChat}
                  >
                    ارسال پیام
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* رزرو جلسه هم‌آهنگی */}
      {activeSupportId === "meeting" && (
        <Modal title="رزرو جلسه هم‌آهنگی" onClose={handleCloseSupportModal}>
          <form className="space-y-4 text-right" onSubmit={handleSubmitMeeting}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  تاریخ جلسه (شمسی)
                </label>
                <DatePicker
                  value={meetingDate}
                  onChange={(value) =>
                    setMeetingDate(value instanceof DateObject ? value : null)
                  }
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-right"
                  inputClass="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-right bg-white"
                  placeholder="انتخاب تاریخ"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  ساعت شروع
                </label>
                <input
                  type="time"
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  مدت جلسه
                </label>
                <select
                  value={meetingDuration}
                  onChange={(e) => setMeetingDuration(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="30">۳۰ دقیقه</option>
                  <option value="45">۴۵ دقیقه</option>
                  <option value="60">۶۰ دقیقه</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  نوع جلسه
                </label>
                <div className="flex flex-row-reverse gap-2">
                  <button
                    type="button"
                    onClick={() => setMeetingMode("online")}
                    className={`flex-1 px-2 py-1.5 rounded-xl text-xs border ${
                      meetingMode === "online"
                        ? "bg-blue-50 border-blue-400 text-blue-700"
                        : "bg-white border-gray-200 text-gray-700"
                    }`}
                  >
                    آنلاین (لینک)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMeetingMode("onsite")}
                    className={`flex-1 px-2 py-1.5 rounded-xl text-xs border ${
                      meetingMode === "onsite"
                        ? "bg-emerald-50 border-emerald-400 text-emerald-700"
                        : "bg-white border-gray-200 text-gray-700"
                    }`}
                  >
                    حضوری / سایت
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                موضوع جلسه
              </label>
              <input
                value={meetingTopic}
                onChange={(e) => setMeetingTopic(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="مثلاً: هماهنگی تیم بدنه و الکتریک روی پروژه UTN-2045"
              />
            </div>

            {meetingSuccess && (
              <p className="text-xs text-emerald-600">
                درخواست جلسه ثبت شد. زمان‌بندی نهایی از طریق ایمیل و داشبورد به
                شما اطلاع داده می‌شود.
              </p>
            )}

            <div className="flex justify-end gap-2 flex-row-reverse">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleCloseSupportModal}
              >
                بستن
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!meetingDate || !meetingTime}
              >
                ثبت درخواست
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* اتاق داده ایمن */}
      {activeSupportId === "secure-room" && (
        <Modal title="اتاق داده ایمن" onClose={handleCloseSupportModal}>
          <div className="space-y-4 text-right">
            <p className="text-xs text-gray-600">
              فایل‌های فنی، نقشه‌ها و لاگ‌های حسّاس را از این بخش آپلود کنید.
              انتقال داده‌ها رمزنگاری شده است و فقط برای تیم کارشناسی قابل
              مشاهده خواهد بود.
            </p>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                انتخاب فایل‌ها
              </label>
              <input
                type="file"
                multiple
                onChange={handleSecureFilesChange}
                className="w-full text-xs"
              />
              {secureSelectedFiles.length > 0 && (
                <div className="mt-2 border border-dashed border-gray-200 rounded-lg p-2 max-h-24 overflow-auto">
                  <p className="text-[11px] text-gray-500 mb-1">
                    فایل‌های آماده آپلود:
                  </p>
                  <ul className="space-y-1 text-xs text-gray-700">
                    {secureSelectedFiles.map((file) => (
                      <li key={file.name}>
                        {file.name} · {formatFileSize(file.size)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 flex-row-reverse">
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={handleCloseSupportModal}
              >
                بستن
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="button"
                disabled={secureSelectedFiles.length === 0 || secureUploading}
                onClick={handleUploadSecureFiles}
              >
                {secureUploading ? "در حال آپلود..." : "آپلود در اتاق ایمن"}
              </Button>
            </div>

            {secureUploadedFiles.length > 0 && (
              <div className="border border-gray-100 rounded-xl p-2 max-h-40 overflow-auto bg-gray-50">
                <p className="text-[11px] text-gray-500 mb-1">
                  فایل‌های آپلود شده اخیر:
                </p>
                <ul className="space-y-1 text-xs text-gray-700">
                  {secureUploadedFiles.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between flex-row-reverse"
                    >
                      <span className="truncate max-w-[60%]">{item.name}</span>
                      <span className="text-gray-400 text-[10px]">
                        {formatFileSize(item.size)} · {item.uploadedAt}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Modal>
      )}

      {activeTechnician && (
        <Modal
          title={`خلاصه عملکرد تکنسین: ${
            activeTechnician.name || activeTechnician.fullName || "نامشخص"
          }`}
          onClose={() => setActiveTechnician(null)}
        >
          <div className="space-y-4 text-right text-sm text-gray-700">
            <div className="flex items-center justify-between flex-row-reverse">
              <div className="flex items-center gap-3 flex-row-reverse">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {activeTechnician.imageUrl ? (
                    <img
                      src={activeTechnician.imageUrl}
                      alt={activeTechnician.name || "technician"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-700">
                      {activeTechnician.initials ||
                        (activeTechnician.name && activeTechnician.name[0]) ||
                        "ت"}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-semibold">
                    {activeTechnician.name ||
                      activeTechnician.fullName ||
                      "تکنسین"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activeTechnician.role || "کارشناس فنی میدانی"}
                  </p>
                </div>
              </div>
              <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
                شیفت فعال
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-500">
                پرونده‌های در حال اقدام
              </p>
              <ul className="space-y-1.5 text-sm">
                <li>
                  • UTN-2045 – بازرسی بدنه – مرحله: بازرسی میدانی – زمان
                  صرف‌شده: ۳ ساعت
                </li>
                <li>
                  • UTN-1980 – ماشین‌آلات – مرحله: تحلیل نتایج – زمان صرف‌شده: ۲
                  ساعت
                </li>
                <li>
                  • UTN-1766 – مدارک عمومی – مرحله: مستندسازی – زمان صرف‌شده: ۱
                  ساعت
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500">
                تایم‌لاین کاری امروز
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex flex-row-reverse items-center justify-between">
                  <span>شروع شیفت</span>
                  <span className="text-gray-500">۰۸:۰۰</span>
                </div>
                <div className="flex flex-row-reverse items-center justify-between">
                  <span>بازرسی میدانی کشتی A</span>
                  <span className="text-gray-500">۰۹:۰۰ – ۱۱:۰۰</span>
                </div>
                <div className="flex flex-row-reverse items-center justify-between">
                  <span>ثبت گزارش و مستندسازی</span>
                  <span className="text-gray-500">۱۱:۳۰ – ۱۳:۰۰</span>
                </div>
                <div className="flex flex-row-reverse items-center justify-between">
                  <span>هماهنگی با QA و پاسخ به تیکت‌ها</span>
                  <span className="text-gray-500">۱۳:۳۰ – ۱۵:۰۰</span>
                </div>
              </div>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-blue-500 rounded-full" />
              </div>
              <p className="text-[11px] text-gray-500">
                حدود ۶۰٪ از برنامه امروز تکمیل شده است. اتصال به تایم‌شیت واقعی
                می‌تواند در این بخش انجام شود.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </WorkspaceAppShell>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b flex-row-reverse">
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <button
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-600"
            onClick={onClose}
            aria-label="بستن"
          >
            ×
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export function TechnicianDashboard() {
  return (
    <WorkspaceProvider>
      <TechnicianDashboardView />
    </WorkspaceProvider>
  );
}
