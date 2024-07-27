# TripPlanner API
TripPlanner API é uma aplicação back-end para gerenciar viagens, atividades e participantes, permitindo aos usuários planejar viagens entre amigos de forma eficiente.

## Tecnologias Utilizadas
- Node.js
- Fastify
- TypeScript
- Prisma
- Zod
- Nodemailer
- Dayjs
- SQLite

## Instalação
### Pré-requisitos
- Node.js (versão 20 ou superior)
- npm (versão 8 ou superior)

## Passos
- Clone o repositório:

```bash
git clone https://github.com/seuusuario/plannernodeapi.git
cd plannernodeapi
```

- Instale as dependências:
```bash
npm i
```

Crie um arquivo .env na raiz do projeto e configure as variáveis de ambiente:

```bash
DATABASE_URL="file:./dev.db"
API_BASE_URL="http://localhost:3333"
PORT=3333
WEB_BASE_URL="http://localhost:3000"
USER_EMAIL="seu-email@gmail.com"
PASSWORD_MAIL="sua-senha-de-aplicativo"
```

- Rode as migrações do banco de dados:
```bash
npx prisma migrate dev
```
- Inicie o servidor:

```bash
npm run dev
```

- Veja as tabelas do banco:

```bash
npm run prisma
```

- O servidor estará rodando em http://localhost:3333.

## Contribuição
- Fork o repositório
- Crie sua feature branch (git checkout -b feature/nova-feature)
- Commit suas mudanças (git commit -am 'Adiciona nova feature')
- Push para a branch (git push origin feature/nova-feature)
- Abra um Pull Request
 
## Licença
Este projeto está licenciado sob a MIT License - veja o arquivo LICENSE para mais detalhes.
