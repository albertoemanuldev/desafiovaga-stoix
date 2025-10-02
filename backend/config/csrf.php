<?php
class CSRF {
    
    public static function generateToken() {
        if (!isset($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }
    
    public static function validateToken($token) {
        if (!isset($_SESSION['csrf_token'])) {
            return false;
        }
        return hash_equals($_SESSION['csrf_token'], $token);
    }
    
    public static function getTokenHeader() {
        return $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
    }
    
    public static function validateRequest() {
        // Skip validation for GET requests
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            return true;
        }
        
        $token = self::getTokenHeader();
        return self::validateToken($token);
    }
}
?>
