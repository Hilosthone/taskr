import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

// ==========================================
// Base Axios Instance & Token Management
// ==========================================

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.VITE_API_BASE_URL ||
  "https://taskr-api.up.railway.app";

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper functions for auth token storage
export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("taskr_token", token);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("taskr_token");
  }
  return null;
};

export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("taskr_token");
  }
};

// Request interceptor to attach Bearer token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor for generic error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      removeAuthToken();
      // Optional: redirect to login page
    }
    return Promise.reject(error.response?.data || error);
  }
);

// ==========================================
// TypeScript Interfaces & Types
// ==========================================

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  token?: string;
}

// Auth Types
export interface SignUpPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  newPassword: string;
  confirmNewPassword: string;
}

// User Profile Types
export interface UserProfile {
  firstname: string;
  lastname: string;
  email_address: string;
  profile_picture: string;
}

// Project Types
export type ProjectStatus = "planning" | "active" | "on_hold" | "completed";
export type ProjectTypeFilter = "mine" | "member";

export interface Project {
  _id: string;
  ownerId: string;
  title: string;
  description: string;
  status: ProjectStatus;
  dueDate: string;
}

export interface CreateProjectPayload {
  title: string;
  description: string;
  dueDate: string;
}

export interface UpdateProjectPayload {
  title?: string;
  description?: string;
  dueDate?: string;
}

export interface GetProjectsQueryParams {
  status?: ProjectStatus;
  type?: ProjectTypeFilter;
  title?: string;
}

// Task Types
export type TaskStatus = "todo" | "in-progress" | "on-hold" | "review" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority | string;
  dueDate: string;
  assignedTo?: string;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
}

export interface GetTasksQueryParams {
  status?: TaskStatus;
  title?: string;
  priority?: TaskStatus;
  assigned?: "true" | "false";
  assignedTo?: "me" | string;
}

// Member Types
export type ProjectRole = "Owner" | "Project Manager" | "Member" | "Viewer";

export interface ProjectMember {
  _id: string;
  projectId: string;
  userId: string;
  role: ProjectRole;
  addedBy: string;
}

// Invitation Types
export interface Invitation {
  _id: string;
  projectId: string;
  roleId: string;
  inviteeEmail: string;
  status: string;
  invitedBy: string;
  scheduleSend: string;
}

export interface CreateInvitationPayload {
  inviteeEmail: string;
  role: ProjectRole;
  scheduleSend?: string;
}

export interface UpdateInvitationPayload {
  role?: ProjectRole;
  inviteeEmail?: string;
}

// ==========================================
// API Endpoints Integration
// ==========================================

export const authApi = {
  signup: async (payload: SignUpPayload) => {
    const response = await apiClient.post<ApiResponse>("/auth/signup", payload);
    if (response.data.token) setAuthToken(response.data.token);
    return response.data;
  },

  signin: async (payload: SignInPayload) => {
    const response = await apiClient.post<ApiResponse>("/auth/signin", payload);
    if (response.data.token) setAuthToken(response.data.token);
    return response.data;
  },

  verifyEmail: async (email: string, token: string) => {
    const response = await apiClient.get<ApiResponse>("/auth/verify-email", {
      params: { email, token },
    });
    return response.data;
  },

  resendVerification: async (email: string) => {
    const response = await apiClient.post<ApiResponse>("/auth/resend-verification", {
      email,
    });
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await apiClient.post<ApiResponse>("/auth/forgot-password", {
      email,
    });
    return response.data;
  },

  resetPassword: async (email: string, token: string, payload: ResetPasswordPayload) => {
    const response = await apiClient.post<ApiResponse>("/auth/reset-password", payload, {
      params: { email, token },
    });
    return response.data;
  },

  deleteAccount: async () => {
    const response = await apiClient.patch("/auth/delete-account");
    removeAuthToken();
    return response.data;
  },

  getGoogleAuthUrl: () => `${BASE_URL}/api/v1/auth/google`,
};

export const userApi = {
  getProfile: async () => {
    const response = await apiClient.get<ApiResponse<UserProfile>>("/user/profile");
    return response.data;
  },

  getProfilePicture: async () => {
    const response = await apiClient.get<ApiResponse<{ profile_picture: string }>>(
      "/user/profile-picture"
    );
    return response.data;
  },

  uploadProfilePicture: async (file: File) => {
    const formData = new FormData();
    formData.append("profile_picture", file);

    const response = await apiClient.patch<ApiResponse<{ profile_picture: string }>>(
      "/user/profile-picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  removeProfilePicture: async () => {
    const response = await apiClient.patch("/user/profile-picture/remove");
    return response.data;
  },
};

export const projectApi = {
  create: async (payload: CreateProjectPayload) => {
    const response = await apiClient.post<ApiResponse<{ project: Project[] }>>(
      "/project",
      payload
    );
    return response.data;
  },

  getAll: async (params?: GetProjectsQueryParams) => {
    const response = await apiClient.get<ApiResponse<{ project: Project[] }>>(
      "/project",
      { params }
    );
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Project>>(`/project/${id}`);
    return response.data;
  },

  update: async (id: string, payload: UpdateProjectPayload) => {
    const response = await apiClient.patch<ApiResponse<Project>>(`/project/${id}`, payload);
    return response.data;
  },

  updateStatus: async (id: string, status: ProjectStatus) => {
    const response = await apiClient.patch<ApiResponse<Project>>(
      `/project/${id}/status`,
      { status }
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.patch(`/project/${id}/delete`);
    return response.data;
  },
};

export const taskApi = {
  create: async (projectId: string, payload: CreateTaskPayload) => {
    const response = await apiClient.post<ApiResponse<{ task: Task[] }>>(
      `/project/${projectId}/task`,
      payload
    );
    return response.data;
  },

  getProjectTasks: async (projectId: string, params?: GetTasksQueryParams) => {
    const response = await apiClient.get<ApiResponse<{ task: Task[] }>>(
      `/project/${projectId}/task`,
      { params }
    );
    return response.data;
  },

  getByMember: async (projectId: string, memberId: string) => {
    const response = await apiClient.get<ApiResponse<{ task: Task[] }>>(
      `/project/${projectId}/task/member/${memberId}`
    );
    return response.data;
  },

  getById: async (projectId: string, taskId: string) => {
    const response = await apiClient.get<ApiResponse<Task>>(
      `/project/${projectId}/task/${taskId}`
    );
    return response.data;
  },

  update: async (projectId: string, taskId: string, payload: UpdateTaskPayload) => {
    const response = await apiClient.patch<ApiResponse<Task>>(
      `/project/${projectId}/task/${taskId}`,
      payload
    );
    return response.data;
  },

  updateStatus: async (projectId: string, taskId: string, status: TaskStatus) => {
    const response = await apiClient.patch<ApiResponse<Task>>(
      `/project/${projectId}/task/${taskId}/status`,
      { status }
    );
    return response.data;
  },

  delete: async (projectId: string, taskId: string) => {
    const response = await apiClient.patch(`/project/${projectId}/task/${taskId}/delete`);
    return response.data;
  },

  assign: async (projectId: string, taskId: string, memberId: string) => {
    const response = await apiClient.patch<ApiResponse<Task>>(
      `/project/${projectId}/task/${taskId}/assign`,
      { memerId: memberId } // Endpoint uses 'memerId' in schema
    );
    return response.data;
  },

  unassign: async (projectId: string, taskId: string) => {
    const response = await apiClient.patch<ApiResponse<Task>>(
      `/project/${projectId}/task/${taskId}/unassign`
    );
    return response.data;
  },
};

export const memberApi = {
  getAll: async (projectId: string, role?: ProjectRole) => {
    const response = await apiClient.get<ApiResponse<{ member: ProjectMember[] }>>(
      `/project/${projectId}/member`,
      { params: { role } }
    );
    return response.data;
  },

  getById: async (projectId: string, memberId: string) => {
    const response = await apiClient.get<ApiResponse<ProjectMember>>(
      `/project/${projectId}/member/${memberId}`
    );
    return response.data;
  },

  remove: async (projectId: string, memberId: string) => {
    const response = await apiClient.patch(
      `/project/${projectId}/member/${memberId}/remove`
    );
    return response.data;
  },

  leaveProject: async (projectId: string) => {
    const response = await apiClient.patch(`/project/${projectId}/member/leave`);
    return response.data;
  },
};

export const invitationApi = {
  create: async (projectId: string, payload: CreateInvitationPayload) => {
    const response = await apiClient.post<ApiResponse<{ invitation: Invitation[] }>>(
      `/project/${projectId}/invitation`,
      payload
    );
    return response.data;
  },

  getSentByToken: async (projectId: string, token: string) => {
    const response = await apiClient.get<
      ApiResponse<{ projectName: string; role: string; status: string }>
    >(`/project/${projectId}/invitation`, { params: { token } });
    return response.data;
  },

  send: async (projectId: string, invitationId: string) => {
    const response = await apiClient.post<ApiResponse<{ invitation: Invitation[] }>>(
      `/project/${projectId}/invitation/${invitationId}/send`
    );
    return response.data;
  },

  resend: async (projectId: string, invitationId: string) => {
    const response = await apiClient.post<ApiResponse<{ invitation: Invitation[] }>>(
      `/project/${projectId}/invitation/${invitationId}/resend`
    );
    return response.data;
  },

  getAllInProject: async (projectId: string) => {
    const response = await apiClient.get<ApiResponse<{ invitation: Invitation[] }>>(
      `/project/${projectId}/invitation/all`
    );
    return response.data;
  },

  getById: async (projectId: string, invitationId: string) => {
    const response = await apiClient.get<ApiResponse<{ invitation: Invitation[] }>>(
      `/project/${projectId}/invitation/${invitationId}`
    );
    return response.data;
  },

  updateDraft: async (
    projectId: string,
    invitationId: string,
    payload: UpdateInvitationPayload
  ) => {
    const response = await apiClient.patch<ApiResponse<{ invitation: Invitation[] }>>(
      `/project/${projectId}/invitation/${invitationId}`,
      payload
    );
    return response.data;
  },

  accept: async (projectId: string, token: string) => {
    const response = await apiClient.patch(`/project/${projectId}/invitation/accept`, null, {
      params: { token },
    });
    return response.data;
  },

  reject: async (projectId: string, token: string) => {
    const response = await apiClient.patch(`/project/${projectId}/invitation/reject`, null, {
      params: { token },
    });
    return response.data;
  },

  revoke: async (projectId: string, invitationId: string) => {
    const response = await apiClient.patch(
      `/project/${projectId}/invitation/${invitationId}/revoke`
    );
    return response.data;
  },

  reschedule: async (projectId: string, invitationId: string, scheduleSend: string) => {
    const response = await apiClient.patch<ApiResponse<Invitation>>(
      `/project/${projectId}/invitation/${invitationId}/reschedule`,
      { scheduleSend }
    );
    return response.data;
  },

  delete: async (projectId: string, invitationId: string) => {
    const response = await apiClient.patch(
      `/project/${projectId}/invitation/${invitationId}/delete`
    );
    return response.data;
  },
};