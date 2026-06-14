// ─────────────────────────────────────────────
//  Enums & Types
// ─────────────────────────────────────────────

export type TaskStatus   = "Open" | "Started" | "Review" | "Finished" | "Blocked";
export type TaskType     = "Feature" | "Bug" | "Refactor";
export type TaskPriority = "1" | "2" | "3" | "4" | "5"



export interface Task {
  id: string;
  assignee_id: string;
  task_status: TaskStatus;
  priority: TaskPriority;
  task_type: TaskType;
  task_description: string;
  project_id: string;
  due_date: string;
  project?: {
    id: number,
    project_name: string,
    organization_id: number,
  };
  assignee?: {
    id: number,
    nickname: string,
    email: string,
    profile_picture: string,
  }
}

export interface Organization {
  id: number;
  owner_id: number;
  organization_description: string;
  organization_name: string;
  organization_identifier: string;
  organization_picture: string;
  created_at: Date;
  owner?: {
    id: number;
    name: string;
    email: string;
  };
  pivot?: {
    user_id: number,
    organization_id: number,
    role: string,
  }
}

export interface User {
  id: string;
  email: string;
  nickname: string;
  created_at: string,
  profile_picture: string,
}

export interface Project {
  id: number;
  organization_id: number;
  project_name: string;
  project_description: string;
  created_at: Date;
}

export const STATUS_OPTIONS = [
    { value: "Open", label: "Open", dot: "bg-gray-400", color: "text-gray-600" },
    { value: "Started", label: "Started", dot: "bg-blue-500", color: "text-blue-700" },
    { value: "Review", label: "In Review", dot: "bg-yellow-500", color: "text-yellow-700" },
    { value: "Finished", label: "Finished", dot: "bg-green-500", color: "text-green-700" },
    { value: "Blocked", label: "Blocked", dot: "bg-red-500", color: "text-red-700" },
];

export const TASK_TYPE_CLASSES: Record<TaskType, string> = {
  Feature: "text-green-700 bg-green-100 ring-green-600/20",
  Bug: "text-red-700   bg-red-100   ring-red-600/20",
  Refactor: "text-blue-700  bg-blue-100  ring-blue-600/20",
};

export const PRIORITIES = [
    { value: "1", label: "1 - Lowest" },
    { value: "2", label: "2 - Low" },
    { value: "3", label: "3 - Medium" },
    { value: "4", label: "4 - High" },
    { value: "5", label: "5 - Immediate" },
];

export const TASK_TYPES = [
  { value: 'Feature', label: 'Feature'},
  { value: 'Refactor', label: 'Refactor'},
  { value: 'Bug', label: 'Bug'},
];

export const TASK_STATUSES = [
  { value: "Open", label: "Open" },
  { value: "Started", label: "Started" },
  { value: "Review", label: "Review" },
  { value: "Finished", label: "Finished" },
  { value: "Blocked", label: "Blocked" },
];
