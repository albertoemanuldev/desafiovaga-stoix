import React, { useState, useEffect } from 'react';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../types/Task';
import apiService from '../services/api';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import './TaskList.css';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  // Carregar tarefas
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const tasksData = await apiService.getTasks();
      setTasks(tasksData);
    } catch (err) {
      setError('Erro ao carregar tarefas. Verifique se o backend está rodando.');
      console.error('Erro ao carregar tarefas:', err);
    } finally {
      setLoading(false);
    }
  };

  // Inicializar aplicação
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await apiService.initialize();
        await loadTasks();
      } catch (err) {
        setError('Erro ao inicializar aplicação. Verifique se o backend está rodando.');
        console.error('Erro ao inicializar:', err);
      }
    };

    initializeApp();
  }, []);

  // Criar nova tarefa
  const handleCreateTask = async (taskData: CreateTaskRequest) => {
    try {
      setSubmitting(true);
      const newTask = await apiService.createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
    } catch (err) {
      setError('Erro ao criar tarefa');
      console.error('Erro ao criar tarefa:', err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  // Editar tarefa
  const handleEditTask = async (taskData: UpdateTaskRequest) => {
    if (!editingTask) return;
    
    try {
      setSubmitting(true);
      const updatedTask = await apiService.updateTask(editingTask.id, taskData);
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id ? updatedTask : task
      ));
    } catch (err) {
      setError('Erro ao atualizar tarefa');
      console.error('Erro ao atualizar tarefa:', err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  // Deletar tarefa
  const handleDeleteTask = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      return;
    }

    try {
      await apiService.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      setError('Erro ao excluir tarefa');
      console.error('Erro ao excluir tarefa:', err);
    }
  };

  // Alterar status da tarefa
  const handleStatusChange = async (id: number, status: Task['status']) => {
    try {
      const updatedTask = await apiService.updateTask(id, { status });
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ));
    } catch (err) {
      setError('Erro ao atualizar status da tarefa');
      console.error('Erro ao atualizar status:', err);
    }
  };

  // Abrir modal para edição
  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  // Abrir modal para criação
  const handleCreateClick = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  // Fechar modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  // Função wrapper para o modal
  const handleModalSubmit = async (taskData: CreateTaskRequest | UpdateTaskRequest) => {
    if (editingTask) {
      // Para edição, garantimos que title não seja undefined
      const updateData: UpdateTaskRequest = {
        title: taskData.title || editingTask.title,
        description: taskData.description,
        status: taskData.status
      };
      await handleEditTask(updateData);
    } else {
      // Para criação, garantimos que title seja string
      const createData: CreateTaskRequest = {
        title: taskData.title!,
        description: taskData.description,
        status: taskData.status
      };
      await handleCreateTask(createData);
    }
  };

  // Filtrar tarefas
  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filter);

  // Estatísticas
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando tarefas...</p>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h1>Gerenciador de Tarefas</h1>
        <button 
          onClick={handleCreateClick}
          className="btn btn-primary"
        >
          ➕ Nova Tarefa
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={loadTasks} className="retry-btn">
            Tentar novamente
          </button>
        </div>
      )}

      <div className="stats-container">
        <div className="stat-card">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.pending}</span>
          <span className="stat-label">Pendentes</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.inProgress}</span>
          <span className="stat-label">Em Progresso</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.completed}</span>
          <span className="stat-label">Concluídas</span>
        </div>
      </div>

      <div className="filter-container">
        <label htmlFor="filter">Filtrar por status:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="filter-select"
        >
          <option value="all">Todas as tarefas</option>
          <option value="pending">Pendentes</option>
          <option value="in_progress">Em Progresso</option>
          <option value="completed">Concluídas</option>
        </select>
      </div>

      <div className="tasks-container">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>Nenhuma tarefa encontrada</h3>
            <p>
              {filter === 'all' 
                ? 'Comece criando sua primeira tarefa!'
                : `Nenhuma tarefa com status "${filter}" encontrada.`
              }
            </p>
            {filter === 'all' && (
              <button onClick={handleCreateClick} className="btn btn-primary">
                Criar primeira tarefa
              </button>
            )}
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditClick}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>

      <TaskModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        task={editingTask}
        isLoading={submitting}
      />
    </div>
  );
};

export default TaskList;
