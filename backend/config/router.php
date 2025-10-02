<?php
class Router {
    
    private $routes = [];
    
    public function __construct() {
        $this->setupRoutes();
    }
    
    private function setupRoutes() {
        // Rotas para tarefas
        $this->routes = [
            'GET /api/tasks' => 'TaskController@index',
            'POST /api/tasks' => 'TaskController@create',
            'PUT /api/tasks/(\d+)' => 'TaskController@update',
            'DELETE /api/tasks/(\d+)' => 'TaskController@delete',
            'GET /api/tasks/(\d+)' => 'TaskController@show',
            'GET /api/csrf-token' => 'CSRFController@getToken'
        ];
    }
    
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = $_SERVER['REQUEST_URI'];
        
        // Remove query string
        $path = strtok($path, '?');
        
        // Encontrar rota correspondente
        foreach ($this->routes as $route => $handler) {
            $pattern = $this->convertRouteToPattern($route);
            if (preg_match($pattern, $method . ' ' . $path, $matches)) {
                array_shift($matches); // Remove o match completo
                
                // Validar CSRF para métodos não-GET
                if (!CSRF::validateRequest()) {
                    http_response_code(403);
                    echo json_encode(['error' => 'CSRF token inválido']);
                    return;
                }
                
                $this->callHandler($handler, $matches);
                return;
            }
        }
        
        // Rota não encontrada
        http_response_code(404);
        echo json_encode(['error' => 'Rota não encontrada']);
    }
    
    private function convertRouteToPattern($route) {
        $route = str_replace('/', '\/', $route);
        $route = str_replace('(\d+)', '(\d+)', $route);
        return '/^' . $route . '$/';
    }
    
    private function callHandler($handler, $params = []) {
        list($controller, $method) = explode('@', $handler);
        
        require_once "controllers/{$controller}.php";
        $controllerInstance = new $controller();
        
        call_user_func_array([$controllerInstance, $method], $params);
    }
}
?>
