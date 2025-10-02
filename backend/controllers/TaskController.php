<?php
require_once 'models/Task.php';

class TaskController {
    
    // Listar todas as tarefas
    public function index() {
        header('Content-Type: application/json');
        
        try {
            $task = new Task();
            $stmt = $task->read();
            $tasks = $stmt->fetchAll();
            
            echo json_encode([
                'success' => true,
                'data' => $tasks
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Erro interno do servidor'
            ]);
        }
    }
    
    // Criar nova tarefa
    public function create() {
        header('Content-Type: application/json');
        
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            
            if (empty($data['title'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Título é obrigatório'
                ]);
                return;
            }
            
            $task = new Task();
            $task->title = $data['title'];
            $task->description = $data['description'] ?? '';
            $task->status = $data['status'] ?? 'pending';
            
            if ($task->create()) {
                http_response_code(201);
                echo json_encode([
                    'success' => true,
                    'message' => 'Tarefa criada com sucesso',
                    'data' => [
                        'id' => $task->id,
                        'title' => $task->title,
                        'description' => $task->description,
                        'status' => $task->status
                    ]
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'Erro ao criar tarefa'
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Erro interno do servidor'
            ]);
        }
    }
    
    // Buscar tarefa por ID
    public function show($id) {
        header('Content-Type: application/json');
        
        try {
            $task = new Task();
            $task->id = $id;
            
            if ($task->readOne()) {
                echo json_encode([
                    'success' => true,
                    'data' => [
                        'id' => $task->id,
                        'title' => $task->title,
                        'description' => $task->description,
                        'status' => $task->status,
                        'created_at' => $task->created_at,
                        'updated_at' => $task->updated_at
                    ]
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'Tarefa não encontrada'
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Erro interno do servidor'
            ]);
        }
    }
    
    // Atualizar tarefa
    public function update($id) {
        header('Content-Type: application/json');
        
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            
            $task = new Task();
            $task->id = $id;
            
            // Verificar se a tarefa existe
            if (!$task->readOne()) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'Tarefa não encontrada'
                ]);
                return;
            }
            
            // Atualizar apenas campos fornecidos
            if (isset($data['title'])) {
                $task->title = $data['title'];
            }
            if (isset($data['description'])) {
                $task->description = $data['description'];
            }
            if (isset($data['status'])) {
                $task->status = $data['status'];
            }
            
            if ($task->update()) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Tarefa atualizada com sucesso',
                    'data' => [
                        'id' => $task->id,
                        'title' => $task->title,
                        'description' => $task->description,
                        'status' => $task->status
                    ]
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'Erro ao atualizar tarefa'
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Erro interno do servidor'
            ]);
        }
    }
    
    // Deletar tarefa
    public function delete($id) {
        header('Content-Type: application/json');
        
        try {
            $task = new Task();
            $task->id = $id;
            
            // Verificar se a tarefa existe
            if (!$task->readOne()) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'Tarefa não encontrada'
                ]);
                return;
            }
            
            if ($task->delete()) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Tarefa deletada com sucesso'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'Erro ao deletar tarefa'
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Erro interno do servidor'
            ]);
        }
    }
}
?>
