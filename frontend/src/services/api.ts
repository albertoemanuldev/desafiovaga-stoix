import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Task, CreateTaskRequest, UpdateTaskRequest, ApiResponse, CSRFResponse } from '../types/Task';

class ApiService {
  private api: AxiosInstance;
  private csrfToken: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:8000',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar CSRF token automaticamente
    this.api.interceptors.request.use(
      (config) => {
        if (this.csrfToken && config.method !== 'get') {
          config.headers['X-CSRF-Token'] = this.csrfToken;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para lidar com respostas
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 403) {
          // Token CSRF inválido, tentar obter novo token
          this.getCSRFToken();
        }
        return Promise.reject(error);
      }
    );
  }

  // Obter token CSRF
  async getCSRFToken(): Promise<void> {
    try {
      const response = await this.api.get<CSRFResponse>('/api/csrf-token');
      if (response.data.success && response.data.csrf_token) {
        this.csrfToken = response.data.csrf_token;
      }
    } catch (error) {
      console.error('Erro ao obter token CSRF:', error);
    }
  }

  // Inicializar serviço (obter token CSRF)
  async initialize(): Promise<void> {
    await this.getCSRFToken();
  }

  // Operações CRUD para tarefas
  async getTasks(): Promise<Task[]> {
    const response = await this.api.get<ApiResponse<Task[]>>('/api/tasks');
    return response.data.data || [];
  }

  async getTask(id: number): Promise<Task> {
    const response = await this.api.get<ApiResponse<Task>>(`/api/tasks/${id}`);
    if (!response.data.data) {
      throw new Error('Tarefa não encontrada');
    }
    return response.data.data;
  }

  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    const response = await this.api.post<ApiResponse<Task>>('/api/tasks', taskData);
    if (!response.data.data) {
      throw new Error(response.data.error || 'Erro ao criar tarefa');
    }
    return response.data.data;
  }

  async updateTask(id: number, taskData: UpdateTaskRequest): Promise<Task> {
    const response = await this.api.put<ApiResponse<Task>>(`/api/tasks/${id}`, taskData);
    if (!response.data.data) {
      throw new Error(response.data.error || 'Erro ao atualizar tarefa');
    }
    return response.data.data;
  }

  async deleteTask(id: number): Promise<void> {
    await this.api.delete<ApiResponse<void>>(`/api/tasks/${id}`);
  }
}

export default new ApiService();
