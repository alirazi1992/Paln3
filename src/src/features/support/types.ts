export type SupportActionId = "ticket" | "chat" | "meeting" | "secure-room";

export type SupportFieldType =
  | "text"
  | "textarea"
  | "select"
  | "date"
  | "time"
  | "tel"
  | "file";

export type SupportActionField = {
  id: string;
  label: string;
  placeholder?: string;
  type: SupportFieldType;
  options?: { label: string; value: string }[];
  rows?: number;
  required?: boolean;
};

export type SupportActionConfig = {
  id: SupportActionId;
  title: string;
  detail: string;
  helper?: string;
  actionLabel: string;
  sla?: string;
  fields: SupportActionField[];
};

export type SupportRequestLog = {
  requestId: string;
  actionId: SupportActionId;
  title: string;
  summary: string;
  submittedAt: string;
};
