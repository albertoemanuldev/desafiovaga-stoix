<?php
// Ponto de entrada principal da aplicação
require_once 'config/database.php';
require_once 'config/router.php';
require_once 'config/csrf.php';

// Inicializar sessão
session_start();

// Configurar headers para CORS
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');
header('Access-Control-Allow-Credentials: true');

// Tratar requisições OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configurar timezone
date_default_timezone_set('America/Sao_Paulo');

// Inicializar router
$router = new Router();
$router->handleRequest();
?>
