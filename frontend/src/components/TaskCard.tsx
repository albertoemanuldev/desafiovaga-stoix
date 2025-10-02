import React from 'react';
import { Task } from '../types/Task';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: Task['status']) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return '#f59e0b'; // amber-500
      case 'in_progress':
        return '#3b82f6'; // blue-500
      case 'completed':
        return '#10b981'; // emerald-500
      default:
        return '#6b7280'; // gray-500
    }
  };

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'in_progress':
        return 'Em Progresso';
      case 'completed':
        return 'Concluída';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <div className="task-status">
          <span 
            className="status-badge"
            style={{ backgroundColor: getStatusColor(task.status) }}
          >
            {getStatusText(task.status)}
          </span>
        </div>
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      
      <div className="task-meta">
        <small className="task-date">
          Criada em: {formatDate(task.created_at)}
        </small>
        {task.updated_at !== task.created_at && (
          <small className="task-date">
            Atualizada em: {formatDate(task.updated_at)}
          </small>
        )}
      </div>
      
      <div className="task-actions">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
          className="status-select"
        >
          <option value="pending">Pendente</option>
          <option value="in_progress">Em Progresso</option>
          <option value="completed">Concluída</option>
        </select>
        
        <button
          onClick={() => onEdit(task)}
          className="btn btn-secondary"
          title="Editar tarefa"
        >
          ✏️ Editar
        </button>
        
        <button
          onClick={() => onDelete(task.id)}
          className="btn btn-danger"
          title="Excluir tarefa"
        >
          🗑️ Excluir
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
