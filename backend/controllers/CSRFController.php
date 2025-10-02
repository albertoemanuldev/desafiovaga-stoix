<?php
require_once 'config/csrf.php';

class CSRFController {
    
    public function getToken() {
        header('Content-Type: application/json');
        
        try {
            $token = CSRF::generateToken();
            
            echo json_encode([
                'success' => true,
                'csrf_token' => $token
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Erro ao gerar token CSRF'
            ]);
        }
    }
}
?>
