# Sistema de Gerenciamento de Tarefas
# Desafio para vaga de Desenvolvedor Full-Stack na Stoix
Um sistema completo de gerenciamento de tarefas desenvolvido com PHP (backend) e React/TypeScript (frontend), seguindo o padrão MVC e implementando autenticação CSRF.

## 🚀 Funcionalidades

### Backend (PHP)
- ✅ API RESTful completa (CRUD)
- ✅ Padrão MVC (Model-View-Controller)
- ✅ Autenticação com CSRF Token
- ✅ Banco de dados MySQL
- ✅ Validação de dados
- ✅ Tratamento de erros

### Frontend (React/TypeScript)
- ✅ Interface moderna e responsiva
- ✅ Gerenciamento de estado
- ✅ Integração com APIs
- ✅ Validação de formulários
- ✅ Filtros e estatísticas
- ✅ Experiência do usuário otimizada

## 📋 Requisitos do Sistema

### Backend
- PHP 7.4 ou superior
- MySQL 5.7 ou superior
- Servidor web (Apache/Nginx)
- Extensões PHP: PDO, PDO_MySQL

### Frontend
- Node.js 16 ou superior
- npm ou yarn

## 🛠️ Instalação e Configuração

### 1. Configuração do Backend

#### 1.1. Configurar Banco de Dados
```bash
# Conectar ao MySQL
mysql -u root -p

# Executar o script SQL
source backend/database/schema.sql
```

#### 1.2. Configurar Conexão com Banco
Edite o arquivo `backend/config/database.php` com suas credenciais:
```php
private $host = 'localhost';
private $db_name = 'task_manager';
private $username = 'seu_usuario';
private $password = 'sua_senha';
```

#### 1.3. Iniciar Servidor PHP
```bash
cd backend
php -S localhost:8000
```

### 2. Configuração do Frontend

#### 2.1. Instalar Dependências
```bash
cd frontend
npm install
```

#### 2.2. Iniciar Aplicação React
```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
desafio-pratico-Stoix/
├── backend/
│   ├── config/
│   │   ├── database.php      # Configuração do banco de dados
│   │   ├── router.php        # Sistema de rotas
│   │   └── csrf.php          # Gerenciamento CSRF
│   ├── controllers/
│   │   ├── TaskController.php # Controlador de tarefas
│   │   └── CSRFController.php # Controlador CSRF
│   ├── models/
│   │   └── Task.php          # Modelo de tarefas
│   ├── database/
│   │   └── schema.sql        # Script de criação do banco
│   └── index.php             # Ponto de entrada
├── frontend/
│   ├── public/
│   │   └── index.html        # HTML principal
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── services/         # Serviços de API
│   │   ├── types/            # Tipos TypeScript
│   │   ├── App.tsx           # Componente principal
│   │   └── index.tsx         # Ponto de entrada
│   ├── package.json          # Dependências
│   └── tsconfig.json         # Configuração TypeScript
└── README.md                 # Este arquivo
```

## 🔌 APIs Disponíveis

### Endpoints de Tarefas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/tasks` | Listar todas as tarefas |
| GET | `/api/tasks/{id}` | Buscar tarefa por ID |
| POST | `/api/tasks` | Criar nova tarefa |
| PUT | `/api/tasks/{id}` | Atualizar tarefa |
| DELETE | `/api/tasks/{id}` | Deletar tarefa |

### Endpoint CSRF
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/csrf-token` | Obter token CSRF |

### Exemplos de Uso

#### Criar Tarefa
```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: SEU_TOKEN_CSRF" \
  -d '{
    "title": "Nova tarefa",
    "description": "Descrição da tarefa",
    "status": "pending"
  }'
```

#### Listar Tarefas
```bash
curl http://localhost:8000/api/tasks
```

## 🔒 Segurança

### CSRF Protection
- Todos os métodos não-GET requerem token CSRF
- Token é gerado automaticamente e validado a cada requisição
- Token é renovado automaticamente quando necessário

### Validação de Dados
- Validação de tipos e tamanhos
- Prevenção de SQL Injection via PDO

## 🎨 Interface do Usuário

### Características
- Design moderno e responsivo
- Gradientes e animações suaves
- Cards interativos para tarefas
- Modal para criação/edição
- Filtros por status
- Estatísticas em tempo real
- Feedback visual para ações

### Responsividade
- Mobile-first design
- Adaptação para tablets e desktops
- Navegação otimizada para touch

## 🧪 Testando o Sistema

### 1. Teste Manual
1. Acesse `http://localhost:3000`
2. Crie uma nova tarefa
3. Edite uma tarefa existente
4. Altere o status de uma tarefa
5. Teste os filtros
6. Exclua uma tarefa

### 2. Teste das APIs
Use o Postman ou curl para testar os endpoints diretamente.

## 🐛 Solução de Problemas

### Backend não conecta
- Verifique se o MySQL está rodando
- Confirme as credenciais no `database.php`
- Execute o script `schema.sql`

### Frontend não carrega dados
- Verifique se o backend está rodando na porta 8000
- Confirme se o CORS está configurado
- Verifique o console do navegador para erros

### Erro de CSRF
- O token é renovado automaticamente
- Verifique se as sessões estão funcionando
- Confirme se o header `X-CSRF-Token` está sendo enviado

## 📝 Considerações Técnicas

### Padrão MVC
- **Model**: `Task.php` - Lógica de negócio e acesso aos dados
- **View**: Frontend React - Interface do usuário
- **Controller**: `TaskController.php` - Lógica de controle e validação

### Boas Práticas Implementadas
- Separação de responsabilidades
- Validação de dados
- Tratamento de erros
- Código limpo e documentado
- Interface responsiva
- Segurança com CSRF

### Tecnologias Utilizadas
- **Backend**: PHP 8+, MySQL, PDO
- **Frontend**: React 18, TypeScript, Axios
- **Estilo**: CSS3, Flexbox, Grid
- **Fontes**: Inter (Google Fonts)

## 👨‍💻 Desenvolvedor

Desenvolvido como desafio prático para demonstrar habilidades em:
- Desenvolvimento full-stack
- Padrão MVC
- APIs RESTful
- Autenticação e segurança
- Interface moderna e responsiva

---

**Status**: ✅ Projeto completo e funcional
**Última atualização**: Dezembro 2024
