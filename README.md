<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Execute in Development Mode

1. clone the repository
2. run

```bash
 yarn install
```

3. have the nestjs cli installed globally

```bash
npm i -g @nestjs/cli
```

4. run the database

```bash
docker-compose up -d
```

5. clone the file __.env.example__ and rename it to __.env__

6. fill the __.env__ file with the correct values
7. run the application

```bash
yarn start:dev
```

8. populate the database

```http request
http://localhost:3000/api/v2/seed
```

## Stack used

- NestJS
- MongoDB
- Docker

