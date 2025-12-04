# Documentação

## Como rodar o banco de dados e a API (FastAPI + PostgreSQL)

1. Certifique-se de ter Docker e Docker Compose instalados

2. Dentro da pasta `/backend`, inicie o projeto:

```bash
sudo make start
```

3. Popule o banco com dados de exemplo:

```bash
sudo make seed
```

4. Acesse a API:

   - API: http://localhost:8000
   - Documentação Swagger: http://localhost:8000/docs

5. Para parar o projeto:

```bash
sudo make stop
```

## Como rodar o frontend (React + Typescript)

1. Certifique-se de ter o Node.js e `pnpm` instalados

- https://pnpm.io/pt/
- https://nodejs.org/en/download

2. Dentro da pasta `/client`, inicie o projeto:

```bash
pnpm install
pnpm build
pnpm preview
```

3. Acesse o frontend:

   - Frontend: http://localhost:4173

OBS.: O frontend e o backend precisam estar rodando ao mesmo tempo (em terminais separados)

## Rotas

- http://localhost:4173 = Totem de São Carlos;

- http://localhost:4173/operador = Página do Operador (Matrícula MAT0000003, Senha senha123 para um operador de São Carlos);

- http://localhost:4173/admin = Página do Admin (Matrícula MAT0000001, Senha senha123).