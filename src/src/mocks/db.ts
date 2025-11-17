import { Project, ProjectType, ProjectStatus, Document, DocumentStatus, Inspection, InspectionType, InspectionResult, Certificate, CertificateType, User, UserRole, Unit, RequirementSet, ReviewComment, CAPA, CAPAStatus, AccessToken, Role, Scope, Permission, AuditEvent, SecurityLog, Report, ReportSchedule, KPI, Waiver, Closure, ClosureType, DigitalSignature, SealRecord, Task, TaskType, TaskStatus } from '../features/projects/types';

// Users
export const mockUsers: User[] = [{
  id: '1',
  name: 'علی رضایی',
  email: 'ali@example.com',
  role: UserRole.Applicant,
  unitId: '1',
  avatar: 'https://i.pravatar.cc/150?img=1',
  isActive: true
}, {
  id: '2',
  name: 'سارا احمدی',
  email: 'sara@example.com',
  role: UserRole.Reviewer,
  unitId: '2',
  avatar: 'https://i.pravatar.cc/150?img=5',
  isActive: true
}, {
  id: '3',
  name: 'محمد کریمی',
  email: 'mohammad@example.com',
  role: UserRole.Inspector,
  unitId: '2',
  avatar: 'https://i.pravatar.cc/150?img=8',
  isActive: true
}, {
  id: '4',
  name: 'فاطمه موسوی',
  email: 'fatemeh@example.com',
  role: UserRole.Clerk,
  unitId: '1',
  avatar: 'https://i.pravatar.cc/150?img=9',
  isActive: true
}, {
  id: '5',
  name: 'حسین نوری',
  email: 'hossein@example.com',
  role: UserRole.Administrator,
  avatar: 'https://i.pravatar.cc/150?img=12',
  isActive: true
}, {
  id: '6',
  name: 'مریم صادقی',
  email: 'maryam@example.com',
  role: UserRole.Executive,
  avatar: 'https://i.pravatar.cc/150?img=10',
  isActive: true
}];

// Avatar aggregates for collaboration widgets
export const mockAvatars = [{
  id: 'avatar-1',
  name: 'Sara Rahimi',
  avatar: 'https://i.pravatar.cc/120?img=16',
  count: 6,
  color: 'bg-emerald-500'
}, {
  id: 'avatar-2',
  name: 'Ali Mohammadi',
  avatar: 'https://i.pravatar.cc/120?img=32',
  count: 2,
  color: 'bg-blue-500'
}, {
  id: 'avatar-3',
  name: 'Fatemeh Karimi',
  avatar: 'https://i.pravatar.cc/120?img=47',
  count: 0,
  color: 'bg-purple-500'
}, {
  id: 'avatar-4',
  name: 'Hossein Jalali',
  avatar: 'https://i.pravatar.cc/120?img=56',
  count: 4,
  color: 'bg-rose-500'
}];

// Units
export const mockUnits: Unit[] = [{
  id: '1',
  name: 'واحد طراحی بدنه',
  code: 'HULL-01'
}, {
  id: '2',
  name: 'واحد ماشین‌آلات',
  code: 'MACH-01'
}, {
  id: '3',
  name: 'واحد برق',
  code: 'ELEC-01'
}, {
  id: '4',
  name: 'واحد عمومی',
  code: 'GEN-01'
}];

// Projects
export const mockProjects: Project[] = [{
  id: '1',
  utn: 'PRJ-2024-001',
  title: 'طراحی کشتی باری 5000 تنی',
  description: 'طراحی و ساخت کشتی باری با ظرفیت 5000 تن',
  type: ProjectType.Hull,
  status: ProjectStatus.UnderReview,
  applicantId: '1',
  unitId: '1',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-20T14:30:00Z',
  submittedAt: '2024-01-16T09:00:00Z'
}, {
  id: '2',
  utn: 'PRJ-2024-002',
  title: 'سیستم پیشرانه دیزلی',
  description: 'طراحی و نصب سیستم پیشرانه دیزلی 2000 اسب بخار',
  type: ProjectType.Machinery,
  status: ProjectStatus.Approved,
  applicantId: '1',
  unitId: '2',
  createdAt: '2024-01-10T08:00:00Z',
  updatedAt: '2024-01-25T16:00:00Z',
  submittedAt: '2024-01-11T10:00:00Z',
  approvedAt: '2024-01-25T16:00:00Z'
}, {
  id: '3',
  utn: 'PRJ-2024-003',
  title: 'سیستم برق اضطراری',
  description: 'طراحی سیستم برق اضطراری و ژنراتور پشتیبان',
  type: ProjectType.Electrical,
  status: ProjectStatus.Certified,
  applicantId: '1',
  unitId: '3',
  createdAt: '2024-01-05T09:00:00Z',
  updatedAt: '2024-01-28T11:00:00Z',
  submittedAt: '2024-01-06T10:00:00Z',
  approvedAt: '2024-01-20T14:00:00Z',
  certifiedAt: '2024-01-28T11:00:00Z'
}, {
  id: '4',
  utn: 'PRJ-2024-004',
  title: 'بازرسی ایمنی کشتی',
  description: 'بازرسی جامع ایمنی و تجهیزات نجات',
  type: ProjectType.General,
  status: ProjectStatus.Pending,
  applicantId: '1',
  unitId: '4',
  createdAt: '2024-01-28T10:00:00Z',
  updatedAt: '2024-01-28T10:00:00Z'
}];

// Documents
export const mockDocuments: Document[] = [{
  id: '1',
  projectId: '1',
  fileName: 'General_Arrangement.pdf',
  fileSize: 2457600,
  fileHash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
  revision: 1,
  status: DocumentStatus.UnderReview,
  uploadedBy: '1',
  uploadedAt: '2024-01-16T09:30:00Z'
}, {
  id: '2',
  projectId: '1',
  fileName: 'Structural_Calculation.pdf',
  fileSize: 1843200,
  fileHash: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1',
  revision: 1,
  status: DocumentStatus.Accepted,
  uploadedBy: '1',
  uploadedAt: '2024-01-16T10:00:00Z',
  reviewedBy: '2',
  reviewedAt: '2024-01-18T14:00:00Z',
  dependsOn: ['1']
}, {
  id: '3',
  projectId: '1',
  fileName: 'Stability_Analysis.pdf',
  fileSize: 3145728,
  fileHash: 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2',
  revision: 2,
  status: DocumentStatus.Commented,
  uploadedBy: '1',
  uploadedAt: '2024-01-17T11:00:00Z',
  reviewedBy: '2',
  reviewedAt: '2024-01-19T10:00:00Z',
  comment: 'لطفاً محاسبات مربوط به شرایط دریای خشن را تکمیل کنید'
}, {
  id: '4',
  projectId: '2',
  fileName: 'Engine_Specification.pdf',
  fileSize: 1572864,
  fileHash: 'd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3',
  revision: 1,
  status: DocumentStatus.Final,
  uploadedBy: '1',
  uploadedAt: '2024-01-11T09:00:00Z',
  reviewedBy: '2',
  reviewedAt: '2024-01-15T16:00:00Z'
}, {
  id: '5',
  projectId: '1',
  fileName: 'General_Arrangement.pdf',
  fileSize: 2500000,
  fileHash: 'e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4',
  revision: 2,
  status: DocumentStatus.Draft,
  uploadedBy: '1',
  uploadedAt: '2024-01-20T10:00:00Z',
  dependsOn: ['1']
}];

// Inspections
export const mockInspections: Inspection[] = [{
  id: '1',
  projectId: '2',
  type: InspectionType.Initial,
  inspectorId: '3',
  inspectionDate: '2024-01-22T09:00:00Z',
  result: InspectionResult.Compliant,
  remarks: 'تمامی موارد مطابق با استانداردها می‌باشد',
  attachments: ['inspection_report_1.pdf'],
  createdAt: '2024-01-22T15:00:00Z'
}, {
  id: '2',
  projectId: '1',
  type: InspectionType.Initial,
  inspectorId: '3',
  inspectionDate: '2024-01-19T10:00:00Z',
  result: InspectionResult.NonCompliant,
  remarks: 'نیاز به بازبینی مجدد جوش‌ها',
  attachments: ['inspection_report_2.pdf'],
  createdAt: '2024-01-19T16:00:00Z'
}, {
  id: '3',
  projectId: '3',
  type: InspectionType.Final,
  inspectorId: '3',
  inspectionDate: '2024-01-27T11:00:00Z',
  result: InspectionResult.Compliant,
  remarks: 'تأیید نهایی',
  attachments: ['inspection_report_3.pdf'],
  createdAt: '2024-01-27T17:00:00Z'
}];

// Certificates
export const mockCertificates: Certificate[] = [{
  id: '1',
  projectId: '3',
  type: CertificateType.Design,
  certificateNumber: 'CERT-2024-001',
  issueDate: '2024-01-28T11:00:00Z',
  expiryDate: '2029-01-28T11:00:00Z',
  issuedBy: '5',
  status: 'Active'
}, {
  id: '2',
  projectId: '2',
  type: CertificateType.Design,
  certificateNumber: 'CERT-2024-002',
  issueDate: '2024-01-25T16:00:00Z',
  expiryDate: '2029-01-25T16:00:00Z',
  issuedBy: '5',
  status: 'Active'
}];

// Requirement Sets
export const mockRequirementSets: RequirementSet[] = [{
  id: '1',
  name: 'الزامات طراحی بدنه',
  projectType: ProjectType.Hull,
  version: '1.0',
  items: [{
    id: 'REQ-H-001',
    code: 'H-001',
    description: 'ارائه نقشه چیدمان کلی (General Arrangement)',
    isRequired: true,
    acceptanceCriteria: 'نقشه باید شامل تمامی ابعاد اصلی و مقاطع باشد'
  }, {
    id: 'REQ-H-002',
    code: 'H-002',
    description: 'محاسبات استحکام سازه',
    isRequired: true,
    acceptanceCriteria: 'محاسبات باید مطابق با استاندارد کلاس بندی باشد',
    dependsOn: ['REQ-H-001']
  }, {
    id: 'REQ-H-003',
    code: 'H-003',
    description: 'تحلیل پایداری',
    isRequired: true,
    acceptanceCriteria: 'تحلیل در شرایط مختلف بارگذاری انجام شود',
    dependsOn: ['REQ-H-001']
  }, {
    id: 'REQ-H-004',
    code: 'H-004',
    description: 'نقشه جزئیات جوش',
    isRequired: false,
    acceptanceCriteria: 'نقشه باید شامل نوع و اندازه جوش‌ها باشد'
  }]
}, {
  id: '2',
  name: 'الزامات سیستم ماشین‌آلات',
  projectType: ProjectType.Machinery,
  version: '1.0',
  items: [{
    id: 'REQ-M-001',
    code: 'M-001',
    description: 'مشخصات فنی موتور اصلی',
    isRequired: true,
    acceptanceCriteria: 'شامل توان، دور، و مصرف سوخت'
  }, {
    id: 'REQ-M-002',
    code: 'M-002',
    description: 'نقشه P&ID سیستم سوخت',
    isRequired: true,
    acceptanceCriteria: 'نقشه باید کامل و قابل خواندن باشد'
  }, {
    id: 'REQ-M-003',
    code: 'M-003',
    description: 'محاسبات سیستم خنک‌کاری',
    isRequired: true,
    acceptanceCriteria: 'محاسبات حرارتی کامل',
    dependsOn: ['REQ-M-001']
  }]
}];

// Review Comments
export const mockComments: ReviewComment[] = [{
  id: '1',
  documentId: '3',
  userId: '2',
  content: 'لطفاً محاسبات مربوط به شرایط دریای خشن را تکمیل کنید',
  requirementId: 'REQ-H-003',
  createdAt: '2024-01-19T10:00:00Z',
  isResolved: false
}, {
  id: '2',
  documentId: '3',
  userId: '1',
  content: 'محاسبات تکمیل و در نسخه بعدی ارسال خواهد شد',
  parentId: '1',
  createdAt: '2024-01-19T14:00:00Z',
  isResolved: false
}, {
  id: '3',
  documentId: '2',
  userId: '2',
  content: 'محاسبات صحیح و مطابق با استاندارد است',
  requirementId: 'REQ-H-002',
  createdAt: '2024-01-18T14:00:00Z',
  isResolved: true
}];

// CAPA
export const mockCAPAs: CAPA[] = [{
  id: '1',
  projectId: '1',
  inspectionId: '2',
  title: 'بازبینی مجدد جوش‌های سازه اصلی',
  description: 'در بازرسی اولیه، برخی جوش‌ها نیاز به بازبینی دارند',
  status: CAPAStatus.InProgress,
  assignedTo: '1',
  dueDate: '2024-02-05T00:00:00Z',
  createdAt: '2024-01-19T16:00:00Z',
  rootCause: 'عدم رعایت کامل استاندارد جوشکاری',
  correctiveAction: 'بازبینی و تعمیر جوش‌های معیوب'
}];

// Access Tokens (IN-codes from spec)
export const mockAccessTokens: AccessToken[] = [{
  id: 'T1',
  code: 'IN-25',
  name: 'ثبت نتیجه بازرسی',
  description: 'امکان ثبت نتایج بازرسی',
  category: 'Inspection'
}, {
  id: 'T2',
  code: 'IN-31',
  name: 'پشتیبان‌گیری و بازیابی',
  description: 'دسترسی به عملیات پشتیبان‌گیری',
  category: 'System'
}, {
  id: 'T3',
  code: 'IN-66',
  name: 'پیکربندی داشبورد',
  description: 'تنظیم و سفارشی‌سازی داشبورد',
  category: 'Dashboard'
}, {
  id: 'T4',
  code: 'IN-69',
  name: 'تولید گزارش',
  description: 'ایجاد گزارش‌های مختلف',
  category: 'Reports'
}, {
  id: 'T5',
  code: 'IN-70',
  name: 'زمان‌بندی گزارش',
  description: 'تنظیم زمان‌بندی خودکار گزارش‌ها',
  category: 'Reports'
}, {
  id: 'T6',
  code: 'IN-71',
  name: 'امضای دیجیتال گزارش',
  description: 'امضای دیجیتال گزارش‌ها',
  category: 'Reports'
}, {
  id: 'T7',
  code: 'IN-01',
  name: 'ایجاد پروژه',
  description: 'ثبت پروژه جدید',
  category: 'Project'
}, {
  id: 'T8',
  code: 'IN-02',
  name: 'ویرایش پروژه',
  description: 'ویرایش اطلاعات پروژه',
  category: 'Project'
}, {
  id: 'T9',
  code: 'IN-03',
  name: 'حذف پروژه',
  description: 'حذف پروژه',
  category: 'Project'
}, {
  id: 'T10',
  code: 'IN-10',
  name: 'بارگذاری مدرک',
  description: 'آپلود مدارک',
  category: 'Document'
}, {
  id: 'T11',
  code: 'IN-11',
  name: 'بررسی مدرک',
  description: 'بررسی و تأیید مدارک',
  category: 'Document'
}, {
  id: 'T12',
  code: 'IN-12',
  name: 'رد مدرک',
  description: 'رد مدرک',
  category: 'Document'
}, {
  id: 'T13',
  code: 'IN-20',
  name: 'صدور گواهی',
  description: 'صدور گواهینامه',
  category: 'Certificate'
}, {
  id: 'T14',
  code: 'IN-21',
  name: 'ابطال گواهی',
  description: 'ابطال گواهینامه',
  category: 'Certificate'
}, {
  id: 'T15',
  code: 'IN-50',
  name: 'مدیریت نقش‌ها',
  description: 'ایجاد و ویرایش نقش‌ها',
  category: 'RBAC'
}, {
  id: 'T16',
  code: 'IN-51',
  name: 'تخصیص دسترسی',
  description: 'تخصیص دسترسی به نقش‌ها',
  category: 'RBAC'
}, {
  id: 'T17',
  code: 'IN-60',
  name: 'مشاهده گزارش حسابرسی',
  description: 'دسترسی به لاگ‌های حسابرسی',
  category: 'Audit'
}, {
  id: 'T18',
  code: 'IN-61',
  name: 'مشاهده گزارش امنیتی',
  description: 'دسترسی به لاگ‌های امنیتی',
  category: 'Security'
}];

// Roles
export const mockRoles: Role[] = [{
  id: 'R1',
  name: 'متقاضی',
  description: 'متقاضی پروژه',
  isSystem: true
}, {
  id: 'R2',
  name: 'بازبین',
  description: 'بازبین مدارک',
  isSystem: true
}, {
  id: 'R3',
  name: 'بازرس',
  description: 'بازرس فنی',
  isSystem: true
}, {
  id: 'R4',
  name: 'کارشناس',
  description: 'کارشناس اداری',
  isSystem: true
}, {
  id: 'R5',
  name: 'مدیر سیستم',
  description: 'مدیر سیستم',
  isSystem: true
}, {
  id: 'R6',
  name: 'مدیر اجرایی',
  description: 'مدیر اجرایی',
  isSystem: true
}];

// Scopes
export const mockScopes: Scope[] = [{
  id: 'S1',
  type: 'Organization',
  name: 'سازمان'
}, {
  id: 'S2',
  type: 'Unit',
  entityId: '1',
  name: 'واحد طراحی بدنه'
}, {
  id: 'S3',
  type: 'Unit',
  entityId: '2',
  name: 'واحد ماشین‌آلات'
}, {
  id: 'S4',
  type: 'Project',
  entityId: '1',
  name: 'پروژه PRJ-2024-001'
}];

// Permissions
export const mockPermissions: Permission[] = [{
  id: 'P1',
  roleId: 'R1',
  tokenId: 'T7',
  scopeId: 'S1',
  accessId: 'R1-T7-S1'
}, {
  id: 'P2',
  roleId: 'R1',
  tokenId: 'T10',
  scopeId: 'S4',
  accessId: 'R1-T10-S4'
}, {
  id: 'P3',
  roleId: 'R2',
  tokenId: 'T11',
  scopeId: 'S2',
  accessId: 'R2-T11-S2'
}, {
  id: 'P4',
  roleId: 'R2',
  tokenId: 'T12',
  scopeId: 'S2',
  accessId: 'R2-T12-S2'
}, {
  id: 'P5',
  roleId: 'R3',
  tokenId: 'T1',
  scopeId: 'S1',
  accessId: 'R3-T1-S1'
}, {
  id: 'P6',
  roleId: 'R5',
  tokenId: 'T15',
  scopeId: 'S1',
  accessId: 'R5-T15-S1'
}, {
  id: 'P7',
  roleId: 'R5',
  tokenId: 'T16',
  scopeId: 'S1',
  accessId: 'R5-T16-S1'
}, {
  id: 'P8',
  roleId: 'R6',
  tokenId: 'T3',
  scopeId: 'S1',
  accessId: 'R6-T3-S1'
}, {
  id: 'P9',
  roleId: 'R6',
  tokenId: 'T4',
  scopeId: 'S1',
  accessId: 'R6-T4-S1'
}];

// Audit Events
export const mockAuditEvents: AuditEvent[] = [{
  id: 'A1',
  userId: '1',
  roleId: 'R1',
  tokenId: 'T7',
  scopeId: 'S1',
  action: 'CREATE_PROJECT',
  entity: 'Project',
  entityId: '1',
  details: {
    utn: 'PRJ-2024-001',
    title: 'طراحی کشتی باری 5000 تنی'
  },
  ipAddress: '192.168.1.100',
  timestamp: '2024-01-15T10:00:00Z'
}, {
  id: 'A2',
  userId: '1',
  roleId: 'R1',
  tokenId: 'T10',
  scopeId: 'S4',
  action: 'UPLOAD_DOCUMENT',
  entity: 'Document',
  entityId: '1',
  details: {
    fileName: 'General_Arrangement.pdf',
    fileHash: 'a1b2c3...'
  },
  ipAddress: '192.168.1.100',
  timestamp: '2024-01-16T09:30:00Z'
}, {
  id: 'A3',
  userId: '2',
  roleId: 'R2',
  tokenId: 'T11',
  scopeId: 'S2',
  action: 'REVIEW_DOCUMENT',
  entity: 'Document',
  entityId: '2',
  details: {
    status: 'Accepted',
    comment: 'تأیید شد'
  },
  ipAddress: '192.168.1.105',
  timestamp: '2024-01-18T14:00:00Z'
}, {
  id: 'A4',
  userId: '5',
  roleId: 'R5',
  tokenId: 'T16',
  scopeId: 'S1',
  action: 'ASSIGN_PERMISSION',
  entity: 'Permission',
  entityId: 'P3',
  details: {
    roleId: 'R2',
    tokenId: 'T11',
    scopeId: 'S2'
  },
  ipAddress: '192.168.1.110',
  timestamp: '2024-01-10T08:00:00Z'
}];

// Security Logs
export const mockSecurityLogs: SecurityLog[] = [{
  id: 'SL1',
  type: 'IntegrityFailure',
  severity: 'High',
  description: 'عدم تطابق هش فایل با هش محاسبه شده',
  userId: '1',
  entityType: 'Document',
  entityId: '5',
  details: {
    expectedHash: 'a1b2c3d4e5f6...',
    actualHash: 'x1y2z3w4v5u6...',
    fileName: 'General_Arrangement.pdf'
  },
  timestamp: '2024-01-20T10:05:00Z'
}, {
  id: 'SL2',
  type: 'LoginAnomaly',
  severity: 'Medium',
  description: 'تلاش ورود از IP غیرمعمول',
  userId: '2',
  details: {
    ipAddress: '203.0.113.45',
    location: 'Unknown',
    previousIPs: ['192.168.1.105', '192.168.1.106']
  },
  timestamp: '2024-01-21T03:15:00Z'
}];

// Reports
export const mockReports: Report[] = [{
  id: 'R1',
  type: 'ProjectTrail',
  title: 'گزارش مسیر پروژه PRJ-2024-001',
  parameters: {
    projectId: '1'
  },
  generatedBy: '6',
  generatedAt: '2024-01-25T10:00:00Z',
  format: 'PDF',
  fileUrl: '/reports/project_trail_1.pdf'
}, {
  id: 'R2',
  type: 'InspectionSummary',
  title: 'خلاصه بازرسی‌های ماه دی',
  parameters: {
    month: '2024-01'
  },
  generatedBy: '6',
  generatedAt: '2024-01-28T15:00:00Z',
  format: 'Excel',
  fileUrl: '/reports/inspection_summary_jan.xlsx'
}];

// Report Schedules
export const mockReportSchedules: ReportSchedule[] = [{
  id: 'RS1',
  reportType: 'InspectionSummary',
  title: 'گزارش ماهانه بازرسی‌ها',
  parameters: {},
  schedule: '0 0 1 * *',
  // First day of month
  recipients: ['maryam@example.com', 'hossein@example.com'],
  isActive: true,
  lastRun: '2024-01-01T00:00:00Z',
  nextRun: '2024-02-01T00:00:00Z'
}, {
  id: 'RS2',
  reportType: 'CertificateRegister',
  title: 'گزارش هفتگی گواهینامه‌ها',
  parameters: {},
  schedule: '0 0 * * 1',
  // Every Monday
  recipients: ['maryam@example.com'],
  isActive: true,
  lastRun: '2024-01-22T00:00:00Z',
  nextRun: '2024-01-29T00:00:00Z'
}];

// KPIs
export const mockKPIs: KPI[] = [{
  id: 'K1',
  name: 'پروژه‌های فعال',
  value: 12,
  unit: 'پروژه',
  change: 15,
  trend: 'up',
  period: 'ماه جاری'
}, {
  id: 'K2',
  name: 'مدارک در انتظار بررسی',
  value: 28,
  unit: 'مدرک',
  change: -10,
  trend: 'down',
  period: 'ماه جاری'
}, {
  id: 'K3',
  name: 'بازرسی‌های انجام شده',
  value: 45,
  unit: 'بازرسی',
  change: 8,
  trend: 'up',
  period: 'ماه جاری'
}, {
  id: 'K4',
  name: 'گواهینامه‌های صادر شده',
  value: 8,
  unit: 'گواهی',
  change: 0,
  trend: 'stable',
  period: 'ماه جاری'
}, {
  id: 'K5',
  name: 'میانگین زمان بررسی',
  value: 5.2,
  unit: 'روز',
  change: -15,
  trend: 'down',
  period: 'ماه جاری'
}, {
  id: 'K6',
  name: 'نرخ تأیید اولیه',
  value: 78,
  unit: 'درصد',
  change: 5,
  trend: 'up',
  period: 'ماه جاری'
}];

// Waivers
export const mockWaivers: Waiver[] = [{
  id: 'W1',
  projectId: '1',
  requirementId: 'REQ-H-004',
  reason: 'نقشه جزئیات جوش در مرحله ساخت ارائه خواهد شد',
  requestedBy: '1',
  approvedBy: '2',
  status: 'Approved',
  createdAt: '2024-01-17T10:00:00Z'
}];

// Closures
export const mockClosures: Closure[] = [{
  id: 'C1',
  projectId: '3',
  type: ClosureType.Technical,
  status: 'Closed',
  closedBy: '2',
  closedAt: '2024-01-28T10:00:00Z',
  notes: 'تمامی الزامات فنی برآورده شده است'
}, {
  id: 'C2',
  projectId: '3',
  type: ClosureType.Financial,
  status: 'Closed',
  closedBy: '4',
  closedAt: '2024-01-28T10:30:00Z',
  notes: 'پرداخت‌ها تکمیل شده است'
}, {
  id: 'C3',
  projectId: '2',
  type: ClosureType.Technical,
  status: 'Open',
  notes: 'در انتظار بازرسی نهایی'
}];

// Digital Signatures
export const mockDigitalSignatures: DigitalSignature[] = [{
  id: 'DS1',
  documentId: '4',
  signerId: '2',
  preSignHash: 'd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3',
  postSealHash: 'f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5',
  sealId: 'SEAL-2024-001',
  signedAt: '2024-01-15T17:00:00Z',
  algorithm: 'RSA-4096',
  certificateId: 'PKI-CERT-001'
}];

// Seal Records
export const mockSealRecords: SealRecord[] = [{
  id: 'SEAL-2024-001',
  documentId: '4',
  pageHashes: ['p1-a1b2c3d4e5f6g7h8', 'p2-b2c3d4e5f6g7h8i9', 'p3-c3d4e5f6g7h8i9j0'],
  qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  crhEndpoint: 'https://verify.example.com/crh/SEAL-2024-001',
  createdAt: '2024-01-15T17:00:00Z'
}];

// Tasks - Generated from Documents, Inspections, and CAPAs
export const mockTasks: Task[] = [
// Document Review Tasks
{
  id: 'T1',
  type: TaskType.DocumentReview,
  title: 'بررسی نقشه چیدمان کلی',
  description: 'بررسی و تأیید فایل General_Arrangement.pdf',
  projectId: '1',
  projectTitle: 'طراحی کشتی باری 5000 تنی',
  assignedTo: '2',
  assignedRole: UserRole.Reviewer,
  status: TaskStatus.InProgress,
  dueDate: '2024-02-01T00:00:00Z',
  createdAt: '2024-01-16T09:30:00Z',
  relatedEntityId: '1'
}, {
  id: 'T2',
  type: TaskType.DocumentReview,
  title: 'بررسی محاسبات سازه',
  description: 'بررسی فایل Structural_Calculation.pdf',
  projectId: '1',
  projectTitle: 'طراحی کشتی باری 5000 تنی',
  assignedTo: '2',
  assignedRole: UserRole.Reviewer,
  status: TaskStatus.Completed,
  dueDate: '2024-01-20T00:00:00Z',
  completedDate: '2024-01-18T14:00:00Z',
  createdAt: '2024-01-16T10:00:00Z',
  relatedEntityId: '2'
}, {
  id: 'T3',
  type: TaskType.DocumentReview,
  title: 'بررسی تحلیل پایداری',
  description: 'بررسی و نظردهی به فایل Stability_Analysis.pdf',
  projectId: '1',
  projectTitle: 'طراحی کشتی باری 5000 تنی',
  assignedTo: '2',
  assignedRole: UserRole.Reviewer,
  status: TaskStatus.InProgress,
  dueDate: '2024-02-03T00:00:00Z',
  createdAt: '2024-01-17T11:00:00Z',
  relatedEntityId: '3'
}, {
  id: 'T4',
  type: TaskType.DocumentReview,
  title: 'بررسی مشخصات موتور',
  description: 'بررسی فایل Engine_Specification.pdf',
  projectId: '2',
  projectTitle: 'سیستم پیشرانه دیزلی',
  assignedTo: '2',
  assignedRole: UserRole.Reviewer,
  status: TaskStatus.Completed,
  dueDate: '2024-01-15T00:00:00Z',
  completedDate: '2024-01-15T16:00:00Z',
  createdAt: '2024-01-11T09:00:00Z',
  relatedEntityId: '4'
},
// Inspection Tasks
{
  id: 'T5',
  type: TaskType.Inspection,
  title: 'بازرسی اولیه سیستم پیشرانه',
  description: 'انجام بازرسی اولیه و ثبت نتایج',
  projectId: '2',
  projectTitle: 'سیستم پیشرانه دیزلی',
  assignedTo: '3',
  assignedRole: UserRole.Inspector,
  status: TaskStatus.Completed,
  dueDate: '2024-01-22T00:00:00Z',
  completedDate: '2024-01-22T15:00:00Z',
  createdAt: '2024-01-20T08:00:00Z',
  relatedEntityId: '1'
}, {
  id: 'T6',
  type: TaskType.Inspection,
  title: 'بازرسی جوش‌های سازه',
  description: 'بازرسی کیفیت جوش‌های سازه اصلی',
  projectId: '1',
  projectTitle: 'طراحی کشتی باری 5000 تنی',
  assignedTo: '3',
  assignedRole: UserRole.Inspector,
  status: TaskStatus.Completed,
  dueDate: '2024-01-19T00:00:00Z',
  completedDate: '2024-01-19T16:00:00Z',
  createdAt: '2024-01-17T10:00:00Z',
  relatedEntityId: '2'
}, {
  id: 'T7',
  type: TaskType.Inspection,
  title: 'بازرسی نهایی سیستم برق',
  description: 'بازرسی نهایی و تأیید سیستم برق اضطراری',
  projectId: '3',
  projectTitle: 'سیستم برق اضطراری',
  assignedTo: '3',
  assignedRole: UserRole.Inspector,
  status: TaskStatus.Completed,
  dueDate: '2024-01-27T00:00:00Z',
  completedDate: '2024-01-27T17:00:00Z',
  createdAt: '2024-01-25T09:00:00Z',
  relatedEntityId: '3'
},
// CAPA Tasks
{
  id: 'T8',
  type: TaskType.CAPA,
  title: 'بازبینی مجدد جوش‌ها',
  description: 'بازبینی و تعمیر جوش‌های معیوب سازه اصلی',
  projectId: '1',
  projectTitle: 'طراحی کشتی باری 5000 تنی',
  assignedTo: '1',
  assignedRole: UserRole.Applicant,
  status: TaskStatus.InProgress,
  dueDate: '2024-02-05T00:00:00Z',
  createdAt: '2024-01-19T16:00:00Z',
  relatedEntityId: '1'
},
// Approval Tasks
{
  id: 'T9',
  type: TaskType.Approval,
  title: 'تأیید نهایی پروژه',
  description: 'تأیید نهایی و صدور مجوز برای پروژه سیستم پیشرانه',
  projectId: '2',
  projectTitle: 'سیستم پیشرانه دیزلی',
  assignedTo: '5',
  assignedRole: UserRole.Administrator,
  status: TaskStatus.Completed,
  dueDate: '2024-01-25T00:00:00Z',
  completedDate: '2024-01-25T16:00:00Z',
  createdAt: '2024-01-23T10:00:00Z',
  relatedEntityId: '2'
}, {
  id: 'T10',
  type: TaskType.Approval,
  title: 'تأیید پروژه بازرسی ایمنی',
  description: 'بررسی و تأیید پروژه بازرسی ایمنی کشتی',
  projectId: '4',
  projectTitle: 'بازرسی ایمنی کشتی',
  assignedTo: '5',
  assignedRole: UserRole.Administrator,
  status: TaskStatus.Pending,
  dueDate: '2024-02-10T00:00:00Z',
  createdAt: '2024-01-28T10:00:00Z',
  relatedEntityId: '4'
},
// Certificate Tasks
{
  id: 'T11',
  type: TaskType.Certificate,
  title: 'صدور گواهینامه سیستم برق',
  description: 'صدور گواهینامه طراحی برای سیستم برق اضطراری',
  projectId: '3',
  projectTitle: 'سیستم برق اضطراری',
  assignedTo: '5',
  assignedRole: UserRole.Administrator,
  status: TaskStatus.Completed,
  dueDate: '2024-01-28T00:00:00Z',
  completedDate: '2024-01-28T11:00:00Z',
  createdAt: '2024-01-27T17:00:00Z',
  relatedEntityId: '1'
}, {
  id: 'T12',
  type: TaskType.Certificate,
  title: 'صدور گواهینامه سیستم پیشرانه',
  description: 'صدور گواهینامه طراحی برای سیستم پیشرانه دیزلی',
  projectId: '2',
  projectTitle: 'سیستم پیشرانه دیزلی',
  assignedTo: '5',
  assignedRole: UserRole.Administrator,
  status: TaskStatus.Completed,
  dueDate: '2024-01-25T00:00:00Z',
  completedDate: '2024-01-25T16:00:00Z',
  createdAt: '2024-01-23T10:00:00Z',
  relatedEntityId: '2'
},
// Additional upcoming tasks
{
  id: 'T13',
  type: TaskType.Inspection,
  title: 'بازرسی مجدد جوش‌ها',
  description: 'بازرسی مجدد پس از اصلاحات',
  projectId: '1',
  projectTitle: 'طراحی کشتی باری 5000 تنی',
  assignedTo: '3',
  assignedRole: UserRole.Inspector,
  status: TaskStatus.Pending,
  dueDate: '2024-02-08T00:00:00Z',
  createdAt: '2024-01-29T10:00:00Z',
  relatedEntityId: '1'
}, {
  id: 'T14',
  type: TaskType.DocumentReview,
  title: 'بررسی اسناد ایمنی',
  description: 'بررسی مدارک ایمنی و تجهیزات نجات',
  projectId: '4',
  projectTitle: 'بازرسی ایمنی کشتی',
  assignedTo: '2',
  assignedRole: UserRole.Reviewer,
  status: TaskStatus.Pending,
  dueDate: '2024-02-15T00:00:00Z',
  createdAt: '2024-01-28T10:00:00Z',
  relatedEntityId: '4'
}];
