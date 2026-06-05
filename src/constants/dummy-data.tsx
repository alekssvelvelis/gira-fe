// ─────────────────────────────────────────────
//  Enums & Types
// ─────────────────────────────────────────────

export type TaskStatus   = "open" | "started" | "review" | "finished" | "blocked";
export type TaskType     = "feat" | "bug" | "refactor";
export type TaskPriority = 1 | 2 | 3 | 4 | 5



export interface Task {
  task_id:          string;
  user_id:          string;
  status:           TaskStatus;
  priority:         TaskPriority;
  task_type:        TaskType;
  task_description: string;
  project_id:       string;
  due_date:         string;                // ISO 8601
}

export interface Organization {
  org_id:         string;
  owner_id:       string;                  // FK → User.user_id
  org_description: string;
  org_name:       string;
  org_identifier: string;                  // unique 5-letter code
}

export interface User {
  user_id:  string;
  email:    string;
  nickname: string | null;
  org_id:   string;                        // FK → Organization.org_id
}

export interface Project {
  project_id:  string;
  name:        string;
  description: string;
  org_id:      string;                     // FK → Organization.org_id
}

// ─────────────────────────────────────────────
//  Organizations
// ─────────────────────────────────────────────

export const STATUS_OPTIONS = [
    { value: "open", label: "Open", dot: "bg-gray-400", color: "text-gray-600" },
    { value: "started", label: "Started", dot: "bg-blue-500", color: "text-blue-700" },
    { value: "review", label: "In Review", dot: "bg-yellow-500", color: "text-yellow-700" },
    { value: "finished", label: "Finished", dot: "bg-green-500", color: "text-green-700" },
    { value: "blocked", label: "Blocked", dot: "bg-red-500", color: "text-red-700" },
];

export const TASK_TYPE_CLASSES: Record<TaskType, string> = {
  feat:     "text-green-700 bg-green-100 ring-green-600/20",
  bug:      "text-red-700   bg-red-100   ring-red-600/20",
  refactor: "text-blue-700  bg-blue-100  ring-blue-600/20",
};

export const PRIORITIES = [
    { value: 1, label: "1 - Lowest" },
    { value: 2, label: "2 - Low" },
    { value: 3, label: "3 - Medium" },
    { value: 4, label: "4 - High" },
    { value: 5, label: "5 - Immediate" },
];

export const ORGANIZATIONS: Record<string, Organization> = {
  "org-001": {
    org_id:          "org-001",
    owner_id:        "usr-001",
    org_description: "A fintech startup building next-generation payment infrastructure.",
    org_name:        "Nexus Pay",
    org_identifier:  "NXPAY",
  },
  "org-002": {
    org_id:          "org-002",
    owner_id:        "usr-004",
    org_description: "An open-source tooling company focused on developer experience.",
    org_name:        "DevForge Labs",
    org_identifier:  "DVFGL",
  },
  "org-003": {
    org_id:          "org-003",
    owner_id:        "usr-007",
    org_description: "A healthcare SaaS platform connecting clinics and patients.",
    org_name:        "MedBridge",
    org_identifier:  "MDBDG",
  },
};

// ─────────────────────────────────────────────
//  Users
// ─────────────────────────────────────────────

export const USERS: Record<string, User> = {
  // ── Nexus Pay ──────────────────────────────
  "usr-001": {
    user_id:  "usr-001",
    email:    "sara.knight@nexuspay.io",
    nickname: "Sara Knight",           // org-001 owner
    org_id:   "org-001",
  },
  "usr-002": {
    user_id:  "usr-002",
    email:    "liam.oduya@nexuspay.io",
    nickname: "Liam Oduya",
    org_id:   "org-001",
  },
  "usr-003": {
    user_id:  "usr-003",
    email:    "priya.s@nexuspay.io",
    nickname: null,
    org_id:   "org-001",
  },

  // ── DevForge Labs ──────────────────────────
  "usr-004": {
    user_id:  "usr-004",
    email:    "marco.bianchi@devforge.dev",
    nickname: "Marco Bianchi",         // org-002 owner
    org_id:   "org-002",
  },
  "usr-005": {
    user_id:  "usr-005",
    email:    "yuki.tanaka@devforge.dev",
    nickname: "Yuki Tanaka",
    org_id:   "org-002",
  },
  "usr-006": {
    user_id:  "usr-006",
    email:    "alex.w@devforge.dev",
    nickname: null,
    org_id:   "org-002",
  },

  // ── MedBridge ──────────────────────────────
  "usr-007": {
    user_id:  "usr-007",
    email:    "fatima.omar@medbridge.health",
    nickname: "Fatima Omar",           // org-003 owner
    org_id:   "org-003",
  },
  "usr-008": {
    user_id:  "usr-008",
    email:    "carlos.reyes@medbridge.health",
    nickname: "Carlos Reyes",
    org_id:   "org-003",
  },
  "usr-009": {
    user_id:  "usr-009",
    email:    "nina.brandt@medbridge.health",
    nickname: "Nina Brandt",
    org_id:   "org-003",
  },
};

// ─────────────────────────────────────────────
//  Projects
// ─────────────────────────────────────────────

export const PROJECTS: Record<string, Project> = {
  // ── Nexus Pay ──────────────────────────────
  "prj-001": {
    project_id:  "prj-001",
    name:        "Payments Core",
    description: "Core transaction processing engine including ledger, reconciliation, and settlement.",
    org_id:      "org-001",
  },
  "prj-002": {
    project_id:  "prj-002",
    name:        "Merchant Portal",
    description: "Self-service dashboard for merchants to manage accounts, payouts, and analytics.",
    org_id:      "org-001",
  },

  // ── DevForge Labs ──────────────────────────
  "prj-003": {
    project_id:  "prj-003",
    name:        "Forge CLI",
    description: "Command-line toolchain for scaffolding, linting, and deploying projects.",
    org_id:      "org-002",
  },
  "prj-004": {
    project_id:  "prj-004",
    name:        "Plugin Registry",
    description: "Public registry and distribution platform for community-built Forge plugins.",
    org_id:      "org-002",
  },

  // ── MedBridge ──────────────────────────────
  "prj-005": {
    project_id:  "prj-005",
    name:        "Patient Portal",
    description: "Secure web application for patients to book appointments and view records.",
    org_id:      "org-003",
  },
  "prj-006": {
    project_id:  "prj-006",
    name:        "Clinic Dashboard",
    description: "Internal tool for clinic staff to manage schedules, billing, and patient data.",
    org_id:      "org-003",
  },
};

// ─────────────────────────────────────────────
//  Tasks
// ─────────────────────────────────────────────

export const TASKS: Record<string, Task> = {
  // ── Payments Core ──────────────────────────
  "tsk-001": {
    task_id:          "tsk-001",
    user_id:          "usr-001",
    status:           "started",
    priority:         5,
    task_type:        "feat",
    task_description: "Implement idempotency keys for the POST /transactions endpoint to prevent duplicate charges.",
    project_id:       "prj-001",
    due_date:         "2026-06-20T00:00:00Z",
  },
  "tsk-002": {
    task_id:          "tsk-002",
    user_id:          "usr-002",
    status:           "review",
    priority:         4,
    task_type:        "bug",
    task_description: "Fix race condition in the settlement batch job that causes occasional double-posting entries.",
    project_id:       "prj-001",
    due_date:         "2026-06-12T00:00:00Z",
  },
  "tsk-003": {
    task_id:          "tsk-003",
    user_id:          "usr-003",
    status:           "open",
    priority:         2,

    task_type:        "refactor",
    task_description: "Extract ledger write logic into a dedicated LedgerService class to improve testability.",
    project_id:       "prj-001",
    due_date:         "2026-07-01T00:00:00Z",
  },

  // ── Merchant Portal ────────────────────────
  "tsk-004": {
    task_id:          "tsk-004",
    user_id:          "usr-001",
    status:           "open",
    priority:         3,
    task_type:        "feat",
    task_description: "Add CSV export functionality to the payouts history table.",
    project_id:       "prj-002",
    due_date:         "2026-06-28T00:00:00Z",
  },
  "tsk-005": {
    task_id:          "tsk-005",
    user_id:          "usr-002",
    status:           "finished",
    priority:         1,
    task_type:        "bug",
    task_description: "Correct timezone offset bug causing analytics charts to display off-by-one-day data.",
    project_id:       "prj-002",
    due_date:         "2026-06-05T00:00:00Z",
  },

  // ── Forge CLI ──────────────────────────────
  "tsk-006": {
    task_id:          "tsk-006",
    user_id:          "usr-006",
    status:           "started",
    priority:         4,
    task_type:        "feat",
    task_description: "Add `forge init --template <name>` flag to support community project templates on init.",
    project_id:       "prj-003",
    due_date:         "2026-06-25T00:00:00Z",
  },
  "tsk-007": {
    task_id:          "tsk-007",
    user_id:          "usr-006",
    status:           "review",
    priority:         3,
    task_type:        "refactor",
    task_description: "Migrate CLI argument parsing from a custom solution to the `commander` library.",
    project_id:       "prj-003",
    due_date:         "2026-07-18T00:00:00Z",
  },
  "tsk-008": {
    task_id:          "tsk-008",
    user_id:          "usr-006",
    status:           "open",
    priority:         5,
    task_type:        "bug",
    task_description: "Resolve broken symlinks when running `forge build` on Windows paths with spaces.",
    project_id:       "prj-003",
    due_date:         "2026-06-10T00:00:00Z",
  },

  // ── Plugin Registry ────────────────────────
  "tsk-009": {
    task_id:          "tsk-009",
    user_id:          "usr-005",
    status:           "open",
    priority:         2,
    task_type:        "feat",
    task_description: "Design and implement a plugin versioning API supporting semver ranges.",
    project_id:       "prj-004",
    due_date:         "2026-07-15T00:00:00Z",
  },
  "tsk-010": {
    task_id:          "tsk-010",
    user_id:          "usr-004",
    status:           "started",
    priority:         3,
    task_type:        "feat",
    task_description: "Build search and filter UI for the public registry index page.",
    project_id:       "prj-004",
    due_date:         "2026-07-05T00:00:00Z",
  },

  // ── Patient Portal ─────────────────────────
  "tsk-011": {
    task_id:          "tsk-011",
    user_id:          "usr-007",
    status:           "review",
    priority:         5,
    task_type:        "bug",
    task_description: "Fix broken appointment confirmation emails not sending after slot booking.",
    project_id:       "prj-005",
    due_date:         "2026-06-09T00:00:00Z",
  },
  "tsk-012": {
    task_id:          "tsk-012",
    user_id:          "usr-008",
    status:           "open",
    priority:         3,
    task_type:        "feat",
    task_description: "Implement two-factor authentication (TOTP) for patient login.",
    project_id:       "prj-005",
    due_date:         "2026-07-01T00:00:00Z",
  },
  "tsk-013": {
    task_id:          "tsk-013",
    user_id:          "usr-009",
    status:           "started",
    priority:         2,
    task_type:        "refactor",
    task_description: "Replace custom date-picker component with an accessible library alternative.",
    project_id:       "prj-005",
    due_date:         "2026-06-22T00:00:00Z",
  },

  // ── Clinic Dashboard ───────────────────────
  "tsk-014": {
    task_id:          "tsk-014",
    user_id:          "usr-008",
    status:           "open",
    priority:         4,
    task_type:        "feat",
    task_description: "Add bulk invoice generation for end-of-month billing cycle.",
    project_id:       "prj-006",
    due_date:         "2026-06-30T00:00:00Z",
  },
  "tsk-015": {
    task_id:          "tsk-015",
    user_id:          "usr-007",
    status:           "finished",
    priority:         1,
    task_type:        "bug",
    task_description: "Patch SQL injection vulnerability discovered in the patient search query builder.",
    project_id:       "prj-006",
    due_date:         "2026-06-03T00:00:00Z",
  },
};