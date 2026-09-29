# DevBoard Web

Frontend do **DevBoard**, uma aplicação para gerenciamento de projetos, tarefas e membros de equipe.

A aplicação foi desenvolvida com React e TanStack Start, consumindo a API REST do DevBoard.

## Tecnologias

- React
- TypeScript
- TanStack Start
- TanStack Router
- Tailwind CSS
- Vite

## Funcionalidades

- Cadastro e login de usuários
- Verificação de e-mail
- Autenticação utilizando JWT
- Dashboard com projetos
- Criação, edição e exclusão de projetos
- Visualização dos detalhes de um projeto
- Gerenciamento de tarefas
- Organização das tarefas por status
- Drag and drop de tarefas
- Controle de prioridade das tarefas
- Gerenciamento de membros dos projetos
- Alteração de roles dos membros
- Histórico de atividades do projeto
- Consulta de dados do perfil do usuário
- Alteração de avatar
- Escolha de imagem para o avatar
- Captura de foto através da câmera
- Preview da imagem antes do upload
- Modais para criação e edição de dados
- Interface responsiva

## Estrutura do projeto

```text
src/

├── components/
│   ├── avatar-modal/
│   ├── project-activities/
│   ├── project-members/
│   ├── projects/
│   ├── tasks/
│   └── ui/
├── hooks/
├── routes/
├── services/
├── app.tsx
└── ...
```

### Organização

- `components/` — componentes reutilizáveis da interface
- `components/ui/` — componentes básicos reutilizáveis da interface
- `components/avatar-modal/` — componente responsável pela alteração do avatar
- `hooks/` — lógica e estado utilizados pelas páginas
- `routes/` — páginas e rotas da aplicação
- `services/` — comunicação com a API

## Requisitos

Antes de executar o projeto, é necessário ter instalado:

- Node.js 22+
- Git

## Instalação

Clone o repositório:

```bash
git clone https://github.com/MarceloKade/devboard-web.git
```

Entre na pasta:

```bash
cd devboard-web
```

Instale as dependências:

```bash
npm install
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL="http://localhost:3001"
```

Essa variável define a URL da API utilizada pelo frontend.

## Executando a aplicação

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em:

```text
http://localhost:3000
```

A API precisa estar sendo executada separadamente para que as funcionalidades que dependem do backend funcionem corretamente.

## Avatar

O frontend permite que o usuário altere seu avatar através de duas opções:

- Escolher uma imagem do computador;
- Tirar uma foto utilizando a câmera.

Antes de enviar a imagem, o usuário pode visualizar uma prévia e decidir se deseja confirmar ou cancelar a alteração.

As imagens são enviadas para a API, que realiza o armazenamento através do Supabase Storage.

São aceitos os formatos:

- JPEG
- PNG
- WEBP

O limite de tamanho da imagem é de 5 MB.

## Verificação de e-mail

Após o cadastro, o usuário recebe um e-mail de confirmação.

Ao acessar o link recebido, o frontend realiza a confirmação através da API e apresenta o resultado da verificação.

Após a confirmação, o usuário pode realizar o login normalmente.

## API

O frontend consome a API REST do DevBoard.

Repositório:

https://github.com/MarceloKade/devboard-api

A API é responsável por:

- autenticação;
- verificação de e-mail;
- usuários;
- upload de avatar;
- projetos;
- tarefas;
- membros;
- histórico de atividades.

## Autor

**Marcelo Kade**

- GitHub: https://github.com/MarceloKade
- LinkedIn: https://www.linkedin.com/in/marcelokade/
