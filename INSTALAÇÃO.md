# Guia de Instalação - Sistema de Gerenciamento de Tarefas

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **PHP 7.4+** (recomendado: PHP 8.0+)
- **MySQL 5.7+** ou **MariaDB 10.3+**
- **Node.js 16+** e **npm**
- **Git** (para clonar o repositório)

## 🚀 Instalação Passo a Passo

### 1. Preparar o Ambiente

#### 1.1. Clonar/Baixar o Projeto
```bash
# Se usando Git
git clone <url-do-repositorio>
cd desafio-pratico-Stoix

# Ou extrair o arquivo ZIP no diretório desejado
```

#### 1.2. Verificar Instalações
```bash
# Verificar PHP
php --version

# Verificar MySQL
mysql --version

# Verificar Node.js
node --version
npm --version
```

### 2. Configuração do Backend (PHP)

#### 2.1. Configurar Banco de Dados

**Opção A: Via MySQL Command Line**
```bash
# Conectar ao MySQL como root
mysql -u root -p

# Criar banco e usuário
CREATE DATABASE task_manager;
CREATE USER 'task_user'@'localhost' IDENTIFIED BY 'task_password';
GRANT ALL PRIVILEGES ON task_manager.* TO 'task_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Executar script de criação
mysql -u task_user -p task_manager < backend/database/schema.sql
```

**Opção B: Via phpMyAdmin**
1. Acesse phpMyAdmin
2. Crie um banco chamado `task_manager`
3. Importe o arquivo `backend/database/schema.sql`

#### 2.2. Configurar Conexão com Banco

Edite o arquivo `backend/config/database.php`:

```php
<?php
class Database {
    private $host = 'localhost';           // Seu host MySQL
    private $db_name = 'task_manager';     // Nome do banco
    private $username = 'task_user';       // Seu usuário MySQL
    private $password = 'task_password';   // Sua senha MySQL
    // ... resto do código permanece igual
}
```

#### 2.3. Testar Conexão com Banco

Crie um arquivo de teste `backend/test_db.php`:

```php
<?php
require_once 'config/database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    if ($conn) {
        echo "✅ Conexão com banco de dados OK!\n";
        
        // Testar consulta
        $stmt = $conn->query("SELECT COUNT(*) as total FROM tasks");
        $result = $stmt->fetch();
        echo "📊 Total de tarefas: " . $result['total'] . "\n";
    }
} catch (Exception $e) {
    echo "❌ Erro na conexão: " . $e->getMessage() . "\n";
}
?>
```

Execute o teste:
```bash
cd backend
php test_db.php
```

#### 2.4. Iniciar Servidor PHP

```bash
cd backend
php -S localhost:8000
```

**Verificar se está funcionando:**
- Acesse: `http://localhost:8000/api/csrf-token`
- Deve retornar um JSON com o token CSRF

### 3. Configuração do Frontend (React)

#### 3.1. Instalar Dependências

```bash
cd frontend
npm install
```

#### 3.2. Configurar URL da API (se necessário)

Se o backend estiver em uma porta diferente, edite `frontend/src/services/api.ts`:

```typescript
constructor() {
  this.api = axios.create({
    baseURL: 'http://localhost:8000', // Altere se necessário
    // ... resto da configuração
  });
}
```

#### 3.3. Iniciar Aplicação React

```bash
npm start
```

A aplicação abrirá automaticamente em `http://localhost:3000`

### 4. Verificar Instalação

#### 4.1. Teste Completo do Sistema

1. **Backend funcionando:**
   - ✅ `http://localhost:8000/api/csrf-token`
   - ✅ `http://localhost:8000/api/tasks`

2. **Frontend funcionando:**
   - ✅ `http://localhost:3000` carrega sem erros
   - ✅ Lista de tarefas aparece
   - ✅ Botão "Nova Tarefa" funciona

3. **Integração funcionando:**
   - ✅ Criar nova tarefa
   - ✅ Editar tarefa existente
   - ✅ Alterar status
   - ✅ Excluir tarefa
   - ✅ Filtros funcionando

## 🔧 Solução de Problemas Comuns

### Problema: "Conexão recusada" no backend

**Soluções:**
```bash
# Verificar se a porta 8000 está livre
netstat -tulpn | grep 8000

# Tentar porta diferente
php -S localhost:8080

# Verificar se o PHP está funcionando
php -v
```

### Problema: "Database connection failed"

**Soluções:**
1. Verificar se o MySQL está rodando:
```bash
sudo systemctl status mysql
# ou
brew services list | grep mysql
```

2. Testar conexão manual:
```bash
mysql -u task_user -p task_manager
```

3. Verificar credenciais no `database.php`

### Problema: Frontend não carrega dados

**Soluções:**
1. Verificar console do navegador (F12)
2. Verificar se backend está rodando
3. Verificar CORS no `.htaccess`
4. Testar API diretamente no navegador

### Problema: "CSRF token inválido"

**Soluções:**
1. Limpar cache do navegador
2. Verificar se as sessões estão funcionando
3. Reiniciar servidor PHP
4. Verificar se o header `X-CSRF-Token` está sendo enviado

## 🐳 Instalação com Docker (Opcional)

Se preferir usar Docker:

```bash
# Criar docker-compose.yml
cat > docker-compose.yml << EOF
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: task_manager
      MYSQL_USER: task_user
      MYSQL_PASSWORD: task_password
    ports:
      - "3306:3306"
    volumes:
      - ./backend/database/schema.sql:/docker-entrypoint-initdb.d/schema.sql

  php:
    image: php:8.0-apache
    ports:
      - "8000:80"
    volumes:
      - ./backend:/var/www/html
    depends_on:
      - mysql
EOF

# Executar
docker-compose up -d
```

## 📝 Notas Importantes

### Para Produção:
1. Altere as senhas padrão
2. Configure HTTPS
3. Use variáveis de ambiente para credenciais
4. Configure cache e otimizações
5. Implemente logs de erro

### Para Desenvolvimento:
1. Mantenha o backend rodando na porta 8000
2. Mantenha o frontend rodando na porta 3000
3. Use ferramentas de debug (Xdebug, React DevTools)
4. Monitore logs de erro

## ✅ Checklist de Instalação

- [ ] PHP instalado e funcionando
- [ ] MySQL instalado e funcionando
- [ ] Node.js e npm instalados
- [ ] Banco de dados criado
- [ ] Tabelas criadas (schema.sql executado)
- [ ] Configuração de banco atualizada
- [ ] Backend rodando na porta 8000
- [ ] Frontend instalado (npm install)
- [ ] Frontend rodando na porta 3000
- [ ] Teste de criação de tarefa funcionando
- [ ] Teste de edição funcionando
- [ ] Teste de exclusão funcionando
- [ ] Filtros funcionando

**🎉 Parabéns! Se todos os itens estão marcados, seu sistema está funcionando perfeitamente!**
