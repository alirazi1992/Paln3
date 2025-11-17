
# سامانه تأیید طرح و بررسی مدارک
## Plan Approval & Document Review System

A comprehensive enterprise frontend prototype for managing project approvals, document reviews, inspections, and certifications with full RBAC, audit trails, and digital signing capabilities.

## 🎯 Overview

This is a **complete frontend prototype** built with React + TypeScript that demonstrates all features of the Plan Approval & Document Review System. It uses mock data and simulated workflows to showcase the full user experience.

## ✨ Features

### Core Modules
- ✅ **Project Management** - Create, track, and manage projects through approval workflows
- ✅ **Document Management** - Upload, review, and version control with SHA-256 integrity checks
- ✅ **Review Workspace** - Comprehensive document review with requirement checklists and threaded comments
- ✅ **Inspections** - Schedule and record inspections with compliance tracking
- ✅ **Certificates** - Issue, renew, and revoke certificates
- ✅ **CAPA/NCS** - Corrective and Preventive Action tracking
- ✅ **Digital Signing & Sealing** - Mock PKI-based document signing with QR verification

### Dashboards
- ✅ **Executive Dashboard** - Organization-wide KPIs, charts, and insights
- ✅ **Unit Dashboard** - Unit-level workload and pending items
- ✅ **Project Dashboard** - Project-specific status, dependencies, and timeline

### Administration
- ✅ **RBAC Admin** - Role-based access control with Permission Panel
- ✅ **Audit Logs** - Immutable, append-only audit trail
- ✅ **Security Logs** - Security events and integrity failures
- ✅ **Reports Center** - Generate and schedule reports (PDF/Excel/CSV)

### Workflows & States
- Document lifecycle: Draft → UnderReview → Rejected/Commented/Accepted → Verified → Final
- Project lifecycle: Pending → UnderReview → Approved → Certified
- Dependency gating and conflict resolution
- Offline review mode simulation

### Technical Features
- 🌐 **RTL/LTR Support** - Full Persian (فارسی) and English support
- 🔒 **Mock Authentication** - Simulated login with role-based access
- 📊 **Interactive Charts** - KPI cards, donut charts, area sparklines
- 🎨 **Clean UI** - Professional enterprise design with Tailwind CSS
- ♿ **Accessible** - WCAG-compliant components
- 📱 **Responsive** - Works on desktop, tablet, and mobile

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

### Login Credentials
Use any email and password to log in. The system uses mock authentication.

**Sample Users:**
- `ali@example.com` - Applicant (متقاضی)
- `sara@example.com` - Reviewer (بازبین)
- `mohammad@example.com` - Inspector (بازرس)
- `hossein@example.com` - Administrator (مدیر سیستم)
- `maryam@example.com` - Executive (مدیر اجرایی)

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── DataTable.tsx
│   │   ├── Tabs.tsx
│   │   ├── Dialog.tsx
│   │   ├── Dropdown.tsx
│   │   └── ...
│   ├── layout/          # Layout components
│   │   ├── AppShell.tsx
│   │   ├── Topbar.tsx
│   │   └── Sidebar.tsx
│   ├── common/          # Common components
│   ├── documents/       # Document-specific components
│   ├── review/          # Review workspace components
│   ├── signing/         # Digital signing components
│   ├── rbac/            # RBAC management components
│   └── charts/          # Chart components
├── features/
│   ├── auth/            # Authentication
│   └── projects/        # Project types and models
├── pages/               # Page components
│   ├── ExecutiveDashboard.tsx
│   ├── UnitDashboard.tsx
│   ├── ProjectDashboard.tsx
│   ├── Projects.tsx
│   ├── ProjectDetail.tsx
│   ├── Documents.tsx
│   ├── DocumentReview.tsx
│   ├── Inspections.tsx
│   ├── Certificates.tsx
│   ├── CAPA.tsx
│   ├── RBACAdmin.tsx
│   ├── AuditLogs.tsx
│   ├── SecurityLogs.tsx
│   ├── ReportsCenter.tsx
│   └── Settings.tsx
├── mocks/               # Mock data
│   └── db.ts
├── lib/                 # Utilities
│   └── utils/cn.ts
└── App.tsx              # Main app with routing

## 🔑 Key Concepts

### Access Control (RBAC)
The system implements dynamic RBAC with:
- **AccessID = RoleID + TokenID + ScopeID**
- **Roles**: Applicant, Reviewer, Inspector, Clerk, Administrator, Executive
- **Tokens**: IN-codes (e.g., IN-25, IN-31, IN-66) representing specific permissions
- **Scopes**: Organization, Unit, or Project level

### Document Workflow
1. **Draft** - Initial upload
2. **UnderReview** - Submitted for review
3. **Rejected/Commented/Accepted** - Review outcomes
4. **Verified** - Secondary verification
5. **Final** - Approved and locked
6. **Superseded** - Replaced by newer revision

### Dependency Gating
Documents can depend on other documents. The system:
- Tracks dependencies
- Shows "PendingDependency" status
- Blocks advancement until dependencies are verified
- Visualizes dependency chains

### Digital Signing (DS-01/DS-02)
1. **DS-01**: Document marked "Ready for Signing"
   - Pre-Sign Hash computed
   - Signed via Secure Sign Interface (mock RSA-4096)
2. **DS-02**: Sealing step
   - SealID + PageHash IDs created
   - QR code embedded pointing to CRH endpoint
   - Post-Seal Hash computed

### Audit & Security
- **Audit Events**: Append-only log of all actions with user, role, token, scope
- **Security Logs**: Immutable log of integrity failures, anomalies, escalations
- **Lockdown Mode**: Triggered on critical security events

## 📊 Data Models

### Core Entities
- **Project**: UTN, type (Hull/Machinery/Electrical/General), status, applicant, unit
- **Document**: File, hash (SHA-256), revision, status, reviewer, comments
- **Inspection**: Type (Initial/Re/Final), inspector, date, result, remarks
- **Certificate**: Type (Design/Renewal/Replacement), issue/expiry dates, status
- **CAPA**: Corrective/Preventive actions for non-compliant inspections
- **RequirementSet**: Library of requirements per project type
- **ReviewComment**: Threaded comments on documents
- **Waiver**: Exemption requests for specific requirements

### RBAC Models
- **Role**: Named role with description
- **AccessToken**: IN-code with name and category
- **Scope**: Organization/Unit/Project level
- **Permission**: Role + Token + Scope assignment

### Audit Models
- **AuditEvent**: userId, roleId, tokenId, scopeId, action, entity, timestamp
- **SecurityLog**: type, severity, description, details, timestamp

## 🎨 UI Components

### Dashboards
- KPI cards with trend indicators
- Interactive donut and area charts
- Filterable data tables
- Status badges and dependency indicators

### Document Management
- Chunked upload simulation with progress
- SHA-256 integrity check visualization
- Version chain timeline
- Document viewer mockup

### Review Workspace
- Document preview pane
- Requirement checklist with pass/fail
- Threaded comment system
- Accept/Reject/Comment actions

### RBAC Admin
- Permission Panel (matrix view)
- Role management
- Token assignment
- Scope configuration

## 🌐 Internationalization

The app supports RTL (Right-to-Left) and LTR (Left-to-Right) layouts:
- Toggle in Settings → Profile
- Persian (فارسی) with Vazirmatn font
- English with system fonts
- All UI adapts to direction

## 🔒 Security Features (Simulated)

- Mock authentication with role-based access
- Simulated SHA-256 file hashing
- Mock RSA-4096 digital signatures
- Integrity check failures logged to SecurityLog
- Permission enforcement in UI (hide/disable)

## 📈 Reports

Available report types:
- **Project Trail**: Complete project history
- **Requirement Compliance**: Checklist status
- **Inspection Summary**: Inspection results
- **Certificate Register**: Active certificates
- **Audit Extract**: Audit log export
- **Security Extract**: Security log export

Export formats: PDF, Excel, CSV

## 🧪 Testing

The app includes comprehensive mock data for testing:
- 4 sample projects in different states
- 5+ documents with various statuses
- 3 inspections with different results
- 2 certificates (active)
- 1 CAPA in progress
- 18+ access tokens (IN-codes)
- 6 roles with permissions
- Audit and security log entries

## 🚧 Limitations

This is a **frontend prototype only**:
- ❌ No real backend API
- ❌ No actual database
- ❌ No real file uploads to server
- ❌ No actual cryptographic operations
- ❌ No email notifications
- ❌ No cron jobs for scheduled reports

All data is mocked in-memory and resets on page refresh.

## 🔄 Backend Integration

To connect this frontend to a real backend:

1. **Replace mock data** with API calls
2. **Implement authentication** with NextAuth or similar
3. **Add Prisma + PostgreSQL** for data persistence
4. **Implement file upload** with chunking and hashing
5. **Add real PKI** for digital signatures
6. **Set up email service** for notifications
7. **Configure cron jobs** for report scheduling

The component architecture is designed to make this integration straightforward.

## 📝 License

MIT

## 👥 Credits

Built with React, TypeScript, Tailwind CSS, and React Router.
