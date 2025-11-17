// Core Enums
export enum ProjectType {
  Hull = 'Hull',
  Machinery = 'Machinery',
  Electrical = 'Electrical',
  General = 'General',
}
export enum ProjectStatus {
  Pending = 'Pending',
  UnderReview = 'UnderReview',
  Approved = 'Approved',
  Certified = 'Certified',
  Rejected = 'Rejected',
  Withdrawn = 'Withdrawn',
}
export enum DocumentStatus {
  Draft = 'Draft',
  UnderReview = 'UnderReview',
  Rejected = 'Rejected',
  Commented = 'Commented',
  Accepted = 'Accepted',
  Verified = 'Verified',
  Final = 'Final',
  Revoked = 'Revoked',
  Withdrawn = 'Withdrawn',
  Superseded = 'Superseded',
  PendingDependency = 'PendingDependency',
  IntegrityError = 'IntegrityError',
}
export enum InspectionType {
  Initial = 'Initial',
  Re = 'Re',
  Final = 'Final',
}
export enum InspectionResult {
  Compliant = 'Compliant',
  NonCompliant = 'NonCompliant',
  Conditional = 'Conditional',
}
export enum CertificateType {
  Design = 'Design',
  Renewal = 'Renewal',
  Replacement = 'Replacement',
}
export enum CAPAStatus {
  Open = 'Open',
  InProgress = 'InProgress',
  UnderReview = 'UnderReview',
  Approved = 'Approved',
  Closed = 'Closed',
}
export enum ClosureType {
  Technical = 'Technical',
  Financial = 'Financial',
  Contractual = 'Contractual',
}
export enum UserRole {
  Applicant = 'Applicant',
  Reviewer = 'Reviewer',
  Inspector = 'Inspector',
  Clerk = 'Clerk',
  Administrator = 'Administrator',
  Executive = 'Executive',
}

// Core Entities
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  unitId?: string;
  avatar: string;
  isActive: boolean;
}
export interface Unit {
  id: string;
  name: string;
  code: string;
  parentId?: string;
}
export interface Project {
  id: string;
  utn: string; // Unique Tracking Number
  title: string;
  description: string;
  type: ProjectType;
  status: ProjectStatus;
  applicantId: string;
  unitId: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  approvedAt?: string;
  certifiedAt?: string;
}
export interface Document {
  id: string;
  projectId: string;
  fileName: string;
  fileSize: number;
  fileHash: string; // SHA-256
  revision: number;
  status: DocumentStatus;
  uploadedBy: string;
  uploadedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  comment?: string;
  dependsOn?: string[]; // Document IDs
  supersededBy?: string;
}
export interface DocumentChunk {
  id: string;
  documentId: string;
  chunkNumber: number;
  chunkHash: string;
  size: number;
  uploadedAt: string;
}
export interface Inspection {
  id: string;
  projectId: string;
  type: InspectionType;
  inspectorId: string;
  inspectionDate: string;
  result: InspectionResult;
  remarks?: string;
  attachments: string[];
  createdAt: string;
}
export interface Certificate {
  id: string;
  projectId: string;
  type: CertificateType;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  issuedBy: string;
  status: 'Active' | 'Expired' | 'Revoked';
  revokedAt?: string;
  revokedBy?: string;
  revokeReason?: string;
}
export interface RequirementSet {
  id: string;
  name: string;
  projectType: ProjectType;
  version: string;
  items: RequirementItem[];
}
export interface RequirementItem {
  id: string;
  code: string;
  description: string;
  isRequired: boolean;
  acceptanceCriteria: string;
  dependsOn?: string[]; // Requirement IDs
}
export interface ReviewComment {
  id: string;
  documentId: string;
  userId: string;
  content: string;
  requirementId?: string;
  parentId?: string; // For threading
  createdAt: string;
  isResolved: boolean;
}
export interface CAPA {
  id: string;
  projectId: string;
  inspectionId: string;
  title: string;
  description: string;
  status: CAPAStatus;
  assignedTo: string;
  dueDate: string;
  createdAt: string;
  closedAt?: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
}
export interface Waiver {
  id: string;
  projectId: string;
  requirementId: string;
  reason: string;
  requestedBy: string;
  approvedBy?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}
export interface Closure {
  id: string;
  projectId: string;
  type: ClosureType;
  status: 'Open' | 'Closed' | 'Locked';
  closedBy?: string;
  closedAt?: string;
  reopenedBy?: string;
  reopenedAt?: string;
  notes?: string;
}

// RBAC
export interface AccessToken {
  id: string;
  code: string; // e.g., IN-25, IN-31
  name: string;
  description: string;
  category: string;
}
export interface Role {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
}
export interface Scope {
  id: string;
  type: 'Organization' | 'Unit' | 'Project';
  entityId?: string;
  name: string;
}
export interface Permission {
  id: string;
  roleId: string;
  tokenId: string;
  scopeId: string;
  accessId: string; // Computed: RoleID + TokenID + ScopeID
}

// Audit & Security
export interface AuditEvent {
  id: string;
  userId: string;
  roleId: string;
  tokenId?: string;
  scopeId?: string;
  action: string;
  entity: string;
  entityId: string;
  details: Record<string, any>;
  ipAddress: string;
  timestamp: string;
}
export interface SecurityLog {
  id: string;
  type: 'IntegrityFailure' | 'PermissionEscalation' | 'LoginAnomaly' | 'UnauthorizedAccess';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  userId?: string;
  entityType?: string;
  entityId?: string;
  details: Record<string, any>;
  timestamp: string;
}

// Digital Signing
export interface DigitalSignature {
  id: string;
  documentId: string;
  signerId: string;
  preSignHash: string;
  postSealHash: string;
  sealId: string;
  signedAt: string;
  algorithm: string; // e.g., RSA-4096
  certificateId: string;
}
export interface SealRecord {
  id: string;
  documentId: string;
  pageHashes: string[];
  qrCode: string;
  crhEndpoint: string;
  createdAt: string;
}

// Reports
export interface Report {
  id: string;
  type: 'ProjectTrail' | 'RequirementCompliance' | 'InspectionSummary' | 'CertificateRegister' | 'AuditExtract' | 'SecurityExtract';
  title: string;
  parameters: Record<string, any>;
  generatedBy: string;
  generatedAt: string;
  format: 'PDF' | 'Excel' | 'CSV';
  fileUrl: string;
}
export interface ReportSchedule {
  id: string;
  reportType: string;
  title: string;
  parameters: Record<string, any>;
  schedule: string; // Cron expression
  recipients: string[];
  isActive: boolean;
  lastRun?: string;
  nextRun: string;
}

// Dashboard KPIs
export interface KPI {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number; // Percentage change
  trend: 'up' | 'down' | 'stable';
  period: string;
}

// Offline Mode
export interface OfflineReview {
  id: string;
  documentId: string;
  reviewerId: string;
  cachedAt: string;
  syncedAt?: string;
  hasConflict: boolean;
  conflictDetails?: string;
}

// Version Chain
export interface VersionChain {
  documentId: string;
  revisions: {
    revision: number;
    documentId: string;
    status: DocumentStatus;
    createdAt: string;
    supersededBy?: string;
  }[];
}

// Task Management for Calendar
export enum TaskType {
  DocumentReview = 'DocumentReview',
  Inspection = 'Inspection',
  CAPA = 'CAPA',
  Approval = 'Approval',
  Certificate = 'Certificate',
}
export enum TaskStatus {
  Pending = 'Pending',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Overdue = 'Overdue',
}
export interface Task {
  id: string;
  type: TaskType;
  title: string;
  description: string;
  projectId: string;
  projectTitle: string;
  assignedTo: string;
  assignedRole: UserRole;
  status: TaskStatus;
  dueDate: string;
  completedDate?: string;
  createdAt: string;
  relatedEntityId: string; // Document, Inspection, or CAPA ID
}

// Journey/Island types for existing journey components
export interface Island {
  id: string;
  title: string;
  variant: 'light' | 'dark';
  tasks: JourneyTask[];
}
export interface JourneyTask {
  id: string;
  title: string;
  subtitle?: string;
  avatar: string;
  hasCheck?: boolean;
  hasCalendar?: boolean;
  hasMenu?: boolean;
  order?: number;
}
