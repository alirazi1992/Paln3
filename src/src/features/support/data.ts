import { SupportActionConfig } from "./types";

export const supportActions: SupportActionConfig[] = [
  {
    id: "ticket",
    title: "ثبت تیکت",
    detail: "برای هماهنگی با واحد پشتیبانی",
    helper: "در کمتر از ۴ ساعت یک پاسخ مستند دریافت می‌کنید.",
    actionLabel: "ارسال تیکت",
    sla: "SLA: ۴ ساعت",
    fields: [
      {
        id: "subject",
        label: "موضوع",
        placeholder: "مثلاً: افت فشار در پمپ اصلی",
        type: "text",
        required: true,
      },
      {
        id: "priority",
        label: "اولویت",
        type: "select",
        required: true,
        options: [
          { label: "عادی", value: "normal" },
          { label: "بالا", value: "high" },
          { label: "بحرانی", value: "critical" },
        ],
      },
      {
        id: "description",
        label: "شرح مشکل",
        placeholder: "جزئیات مورد، اقدامات انجام شده، درخواست دقیق",
        type: "textarea",
        rows: 4,
        required: true,
      },
    ],
  },
  {
    id: "chat",
    title: "چت با مهندس آماده‌باش",
    detail: "میانگین پاسخ‌گویی ۶ دقیقه",
    helper: "مهندس ارشد شیفت ۲۴/۷ آماده گفتگو است.",
    actionLabel: "درخواست گفتگو",
    sla: "اولویت پاسخ: فوری",
    fields: [
      {
        id: "topic",
        label: "موضوع گفتگو",
        placeholder: "شرح کوتاه از مسئله",
        type: "text",
        required: true,
      },
      {
        id: "preferredChannel",
        label: "کانال ارتباطی",
        type: "select",
        required: true,
        options: [
          { label: "Microsoft Teams", value: "teams" },
          { label: "واتساپ امن", value: "whatsapp" },
          { label: "تماس تلفنی", value: "phone" },
        ],
      },
      {
        id: "callback",
        label: "شماره تماس یا شناسه",
        placeholder: "۰۹۱۲...",
        type: "tel",
      },
    ],
  },
  {
    id: "meeting",
    title: "رزرو جلسه هم‌آهنگی",
    detail: "انتخاب بازه ۳۰ دقیقه‌ای",
    helper: "لینک جلسه به ایمیل تیم شما ارسال می‌شود.",
    actionLabel: "رزرو بازه",
    sla: "تایید خودکار در کمتر از ۵ دقیقه",
    fields: [
      {
        id: "agenda",
        label: "دستور جلسه",
        placeholder: "موارد و اهداف مورد بررسی",
        type: "textarea",
        rows: 3,
        required: true,
      },
      {
        id: "date",
        label: "تاریخ پیشنهادی",
        type: "date",
        required: true,
      },
      {
        id: "time",
        label: "ساعت",
        type: "time",
        required: true,
      },
      {
        id: "duration",
        label: "مدت زمان",
        type: "select",
        required: true,
        options: [
          { label: "۳۰ دقیقه", value: "30" },
          { label: "۴۵ دقیقه", value: "45" },
          { label: "۶۰ دقیقه", value: "60" },
        ],
      },
    ],
  },
  {
    id: "secure-room",
    title: "اتاق داده ایمن",
    detail: "آپلود نقشه‌ها و مدارک حجیم",
    helper: "تمامی فایل‌ها روی فضای رمزنگاری‌شده منتقل می‌شوند.",
    actionLabel: "ایجاد دسترسی",
    sla: "لینک ایمن تا ۲ ساعت فعال می‌شود",
    fields: [
      {
        id: "documentName",
        label: "نام فایل یا بسته",
        placeholder: "مثلاً: نقشه برق سایت A",
        type: "text",
        required: true,
      },
      {
        id: "classification",
        label: "سطح محرمانگی",
        type: "select",
        required: true,
        options: [
          { label: "داخلی", value: "internal" },
          { label: "محرمانه", value: "confidential" },
          { label: "خیلی محرمانه", value: "restricted" },
        ],
      },
      {
        id: "file",
        label: "انتخاب فایل",
        type: "file",
      },
      {
        id: "notes",
        label: "توضیحات تکمیلی",
        type: "textarea",
        rows: 3,
      },
    ],
  },
];
