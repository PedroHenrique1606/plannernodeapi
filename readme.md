# TripPlanner API
TripPlanner API is a back-end application for managing trips, activities and participants, allowing users to plan trips between friends efficiently.

## Technologies Used
- ![Node.js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
- ![Fastify](https://img.shields.io/badge/fastify-202020?style=for-the-badge&logo=fastify&logoColor=white)
- ![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
- ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
- ![Zod](https://img.shields.io/badge/Zod-000000?style=for-the-badge&logo=zod&logoColor=3068B7)
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## Installation
### Prerequisites
- Node.js (version 20 or higher)
- npm (version 8 or higher)

## Steps
- Clone the repository:

```bash
git clone https://github.com/seuusuario/plannernodeapi.git
cd plannernodeapi
```

- Install the dependencies:
```bash
npm i
```

Create an .env file in the root of the project and set the environment variables:

```bash
DATABASE_URL="file:./dev.db”
API_BASE_URL="http://localhost:3333”
PORT=3333
WEB_BASE_URL="http://localhost:5173”
USER_EMAIL="seu-email@gmail.com”
PASSWORD_MAIL="your-application-password”
```

- Run the database migrations:
```bash
npx prisma migrate dev
```
- Start the server:

```bash
npm run dev
```

- Check the database tables:

```bash
npm run prisma
```

- The server will be running at http://localhost:3333.

## Contribution
- Fork the repository
- Create your feature branch (git checkout -b feature/new-feature)
- Commit your changes (git commit -am 'Add new feature')
- Push to the branch (git push origin feature/new-feature)
- Open a Pull Request
 
## License
This project is licensed under the MIT License - see the LICENSE file for more details.