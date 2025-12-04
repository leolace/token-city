# Página do Operador - Token City

## Estrutura Criada

### Backend

- ✅ Endpoint `PATCH /denuncia/status` para atualizar status de denúncias
- ✅ Validação de transições de status no use case
- ✅ Validação de denúncia existente
- ✅ Retorno de HTTPException com códigos apropriados

### Frontend

#### Serviços

- `services/request/update-report-status.ts` - Função para chamar API
- `services/response/update-report-status.ts` - Interface de request
- `services/endpoints.ts` - Endpoint adicionado

#### Páginas

```
pages/operator/
├── index.tsx                    # Root do operador
├── routes.ts                    # Rotas do operador
├── components/
│   └── header/
│       └── index.tsx           # Header do painel
└── pages/
    ├── login/
    │   └── index.tsx           # Página de login
    └── reports/
        ├── index.tsx           # Página principal de denúncias
        └── sections/
            └── all-reports/
                ├── index.tsx                    # Listagem de denúncias
                ├── hooks.ts                     # Hook useAllReports
                └── components/
                    └── report-list/
                        ├── index.tsx            # Lista de denúncias
                        └── report-list-item/
                            ├── index.tsx                     # Item da lista
                            └── update-status-dialog/
                                └── index.tsx                 # Dialog de atualização
```

## Fluxo de Status

As transições de status seguem as seguintes regras:

- **Registrada** → Em Validação, Rejeitada
- **Em Validação** → Em Andamento, Rejeitada
- **Em Andamento** → Resolvida, Rejeitada
- **Resolvida** → Status final (sem transições)
- **Rejeitada** → Status final (sem transições)

## Como Acessar

1. **Login**: Acesse `/operador`
2. **Denúncias**: Após login, será redirecionado para `/operador/denuncias`

## Funcionalidades

- ✅ Visualizar todas as denúncias do sistema
- ✅ Ver status atual de cada denúncia
- ✅ Atualizar status com validação de transições
- ✅ Feedback visual com toasts
- ✅ Validação de status final (não permite alteração)
- ✅ Loading states
- ✅ Tratamento de erros

## Tecnologias Utilizadas

- React Router para roteamento
- TanStack Query para gerenciamento de estado
- Shadcn/ui para componentes
- TypeScript para type safety
