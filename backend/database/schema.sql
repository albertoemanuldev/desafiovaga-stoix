-- Script SQL para criar o banco de dados e tabela de tarefas

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS task_manager;
USE task_manager;

-- Criar tabela de tarefas
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir algumas tarefas de exemplo
INSERT INTO tasks (title, description, status) VALUES
('Configurar ambiente de desenvolvimento', 'Instalar PHP, MySQL e configurar o ambiente local', 'completed'),
('Criar estrutura MVC', 'Implementar padrão MVC no backend PHP', 'in_progress'),
('Implementar autenticação CSRF', 'Adicionar proteção CSRF nas APIs', 'pending'),
('Criar interface React', 'Desenvolver frontend com React e TypeScript', 'pending'),
('Integrar frontend com backend', 'Conectar React com APIs PHP', 'pending');
