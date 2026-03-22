# Plano de Implementação — projectEVE-admin

## Visão Geral

Painel administrativo para o projectEVE. Interface separada do projectEVE-Web, usando o mesmo stack (React 19, Vite 6, MUI v6, Zustand 5, React Query 5, React Router 7, i18next, TypeScript 5.7). O backend admin será adicionado como módulo dentro de `projectEVE-backend`, seguindo o padrão DDD já existente.

## Escopo de Funcionalidades

- **Autenticação Admin**: Login exclusivo para usuários com `adminUser: true`
- **Dashboard**: KPIs e estatísticas globais do sistema
- **Gerenciamento de Usuários**: Listar, visualizar, ativar/desativar, promover a admin, deletar
- **Gerenciamento de Base Envelopes**: CRUD dos envelopes-template (`base_envelopes`)
- **Analytics**: Gráficos de crescimento de usuários, volume de transações, receita agregada

---

## Etapa 1 — Setup do Projeto Frontend (`projectEVE-admin`)

> **Estimativa de tokens:** ~80k | **Foco:** Scaffolding do projeto React

### 1.1 Inicialização com Vite

```bash
cd projectEVE-admin
yarn create vite . --template react-ts
```

### 1.2 Dependências (igual ao projectEVE-Web)

```json
{
  "dependencies": {
    "@mui/material": "^6.x",
    "@mui/icons-material": "^6.x",
    "@mui/x-data-grid": "^7.x",
    "@emotion/react": "^11.x",
    "@emotion/styled": "^11.x",
    "@tanstack/react-query": "^5.x",
    "@tanstack/react-query-devtools": "^5.x",
    "axios": "^1.x",
    "i18next": "^23.x",
    "react-i18next": "^14.x",
    "i18next-browser-languagedetector": "^7.x",
    "notistack": "^3.x",
    "react-router-dom": "^7.x",
    "zustand": "^5.x",
    "react": "^19.x",
    "react-dom": "^19.x",
    "recharts": "^2.x"
  },
  "devDependencies": {
    "typescript": "~5.7.x",
    "vite": "^6.x",
    "@vitejs/plugin-react-swc": "^3.x",
    "eslint": "^9.x",
    "prettier": "^3.x"
  }
}
```

### 1.3 Estrutura de Diretórios

```
projectEVE-admin/src/
├── api/
│   ├── client.ts               # Axios instance (aponta para backend admin routes)
│   └── services/
│       ├── adminUsers.service.ts
│       ├── adminStats.service.ts
│       └── adminBaseEnvelopes.service.ts
├── components/
│   ├── ConfirmDialog.tsx
│   ├── DataTable.tsx           # Wrapper MUI DataGrid
│   ├── KpiCard.tsx
│   ├── PageHeader.tsx
│   └── StatusBadge.tsx
├── hooks/
│   ├── queries/
│   │   ├── useAdminUsers.ts
│   │   ├── useAdminUserById.ts
│   │   ├── useAdminStats.ts
│   │   └── useAdminBaseEnvelopes.ts
│   └── mutations/
│       ├── useUpdateAdminUser.ts
│       ├── useDeleteAdminUser.ts
│       ├── useCreateBaseEnvelope.ts
│       ├── useUpdateBaseEnvelope.ts
│       └── useDeleteBaseEnvelope.ts
├── layouts/
│   ├── AdminLayout.tsx         # Sidebar + Topbar
│   └── AuthLayout.tsx          # Tela de login centralizada
├── locales/
│   ├── pt-BR/
│   │   └── translation.json
│   ├── en/
│   │   └── translation.json
│   └── es/
│       └── translation.json
├── pages/
│   ├── sign-in.tsx
│   ├── dashboard.tsx
│   ├── users/
│   │   ├── index.tsx           # Lista de usuários
│   │   └── [id].tsx            # Detalhe do usuário
│   ├── base-envelopes/
│   │   └── index.tsx
│   └── page-not-found.tsx
├── routes/
│   ├── paths.ts
│   └── sections.tsx            # React Router config (lazy loading)
├── sections/
│   ├── auth/
│   │   └── AdminSignInForm.tsx
│   ├── dashboard/
│   │   ├── DashboardKpis.tsx
│   │   └── DashboardCharts.tsx
│   ├── users/
│   │   ├── UsersTable.tsx
│   │   ├── UserDetailCard.tsx
│   │   ├── UserActionsMenu.tsx
│   │   └── UserFilters.tsx
│   └── base-envelopes/
│       ├── BaseEnvelopesTable.tsx
│       └── BaseEnvelopeForm.tsx
├── store/
│   └── useAdminAuthStore.ts    # Zustand: dados do admin logado
├── theme/
│   └── index.ts                # MUI theme (idêntico ao projectEVE-Web)
├── types/
│   ├── user.types.ts
│   ├── stats.types.ts
│   └── baseEnvelope.types.ts
├── utils/
│   └── formatters.ts
├── App.tsx
└── main.tsx
```

### 1.4 Configuração do Axios (`api/client.ts`)

```typescript
import axios from 'axios';

const adminApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  withCredentials: true, // cookies JWT (mesma origem do backend)
});

// Interceptor: redireciona para /entrar se 401/403
adminApiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      window.location.href = '/entrar';
    }
    return Promise.reject(error);
  }
);

export default adminApiClient;
```

### 1.5 Rotas (`routes/paths.ts` e `routes/sections.tsx`)

```typescript
// paths.ts
export const ADMIN_PATHS = {
  signIn:         '/entrar',
  dashboard:      '/',
  users:          '/usuarios',
  userDetail:     (id: string) => `/usuarios/${id}`,
  baseEnvelopes:  '/base-envelopes',
};
```

```tsx
// sections.tsx — React Router v7 com lazy loading
import { createBrowserRouter } from 'react-router-dom';
import AdminLayout from 'src/layouts/AdminLayout';
import AuthLayout  from 'src/layouts/AuthLayout';

const SignInPage       = lazy(() => import('src/pages/sign-in'));
const DashboardPage    = lazy(() => import('src/pages/dashboard'));
const UsersPage        = lazy(() => import('src/pages/users/index'));
const UserDetailPage   = lazy(() => import('src/pages/users/[id]'));
const BaseEnvsPage     = lazy(() => import('src/pages/base-envelopes/index'));

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [{ path: '/entrar', element: <SignInPage /> }],
  },
  {
    element: <AdminLayout />,    // protegido: redireciona se não admin
    children: [
      { path: '/',                element: <DashboardPage /> },
      { path: '/usuarios',        element: <UsersPage /> },
      { path: '/usuarios/:id',    element: <UserDetailPage /> },
      { path: '/base-envelopes',  element: <BaseEnvsPage /> },
    ],
  },
]);
```

### 1.6 Auth Store (`store/useAdminAuthStore.ts`)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminAuthState {
  user: { id: string; name: string; email: string } | null;
  setUser: (user: AdminAuthState['user']) => void;
  clear: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clear: () => set({ user: null }),
    }),
    { name: 'admin-auth' }
  )
);
```

### 1.7 Vite Config (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { src: path.resolve(__dirname, './src') },
  },
  server: { port: 5174 },
});
```

### 1.8 i18n Setup

- Mesmo padrão do projectEVE-Web: `i18next` + `react-i18next` + `i18next-browser-languagedetector`
- Chaves de tradução em `locales/pt-BR/translation.json`, `en/translation.json`, `es/translation.json`
- Namespaces: `common`, `users`, `dashboard`, `baseEnvelopes`

---

## Etapa 2 — Backend: Módulo Admin (`projectEVE-backend`)

> **Estimativa de tokens:** ~120k | **Foco:** DDD — módulo admin + middleware

### 2.1 Middleware Admin (`shared/infrastructure/http/utils/Middleware.ts`)

Adicionar método `ensureAdmin()` ao middleware existente:

```typescript
// Adicionar ao Middleware existente
static ensureAdmin(): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const decoded = req.decoded; // preenchido por ensureAuthenticated
    if (!decoded || !decoded.adminUser) {
      return res.status(403).json({ message: 'Forbidden: admin only' });
    }
    next();
  };
}
```

As rotas admin usarão: `[ensureAuthenticated(), ensureAdmin()]`

### 2.2 Estrutura do Módulo Admin

```
projectEVE-backend/src/modules/admin/
├── dtos/
│   ├── AdminUserDTO.ts
│   ├── AdminStatsDTO.ts
│   └── AdminBaseEnvelopeDTO.ts
├── use-cases/
│   ├── get-all-users/
│   │   ├── GetAllAdminUsersUseCase.ts
│   │   ├── GetAllAdminUsersController.ts
│   │   ├── GetAllAdminUsersDTO.ts
│   │   └── index.ts
│   ├── get-user-by-id/
│   │   ├── GetAdminUserByIdUseCase.ts
│   │   ├── GetAdminUserByIdController.ts
│   │   ├── GetAdminUserByIdErrors.ts
│   │   └── index.ts
│   ├── update-user/
│   │   ├── UpdateAdminUserUseCase.ts
│   │   ├── UpdateAdminUserController.ts
│   │   ├── UpdateAdminUserDTO.ts
│   │   ├── UpdateAdminUserErrors.ts
│   │   └── index.ts
│   ├── delete-user/
│   │   ├── DeleteAdminUserUseCase.ts
│   │   ├── DeleteAdminUserController.ts
│   │   ├── DeleteAdminUserErrors.ts
│   │   └── index.ts
│   ├── get-stats/
│   │   ├── GetAdminStatsUseCase.ts
│   │   ├── GetAdminStatsController.ts
│   │   └── index.ts
│   ├── get-all-base-envelopes/
│   │   ├── GetAllBaseEnvelopesUseCase.ts
│   │   ├── GetAllBaseEnvelopesController.ts
│   │   └── index.ts
│   ├── create-base-envelope/
│   │   ├── CreateBaseEnvelopeUseCase.ts
│   │   ├── CreateBaseEnvelopeController.ts
│   │   ├── CreateBaseEnvelopeDTO.ts
│   │   ├── CreateBaseEnvelopeErrors.ts
│   │   └── index.ts
│   ├── update-base-envelope/
│   │   ├── UpdateBaseEnvelopeUseCase.ts
│   │   ├── UpdateBaseEnvelopeController.ts
│   │   ├── UpdateBaseEnvelopeDTO.ts
│   │   ├── UpdateBaseEnvelopeErrors.ts
│   │   └── index.ts
│   └── delete-base-envelope/
│       ├── DeleteBaseEnvelopeUseCase.ts
│       ├── DeleteBaseEnvelopeController.ts
│       ├── DeleteBaseEnvelopeErrors.ts
│       └── index.ts
└── infra/http/
    └── routes/
        └── adminRouter.ts
```

### 2.3 DTOs

```typescript
// AdminUserDTO.ts
export interface AdminUserDTO {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  isAdminUser: boolean;
  isDeleted: boolean;
  isRegistrationComplete: boolean;
  createdAt: string;
  updatedAt: string;
  // Agregados opcionais (no get-by-id)
  totalEnvelopes?: number;
  totalIncomes?: number;
  totalTransactions?: number;
}

// AdminStatsDTO.ts
export interface AdminStatsDTO {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  deletedUsers: number;
  usersRegisteredThisMonth: number;
  totalEnvelopes: number;
  totalTransactions: number;
  totalProcessedIncomes: number;
}

// AdminBaseEnvelopeDTO.ts — reusar o DTO existente de base-envelope (ou criar novo)
export interface AdminBaseEnvelopeDTO {
  id: string;
  name: string;
  color: string;
  order: number;
}
```

### 2.4 Use-Cases — Detalhes de Implementação

#### `GetAllAdminUsersUseCase`

```typescript
// GetAllAdminUsersDTO.ts
export interface GetAllAdminUsersRequest {
  page?: number;       // paginação
  limit?: number;
  search?: string;     // busca por name/email
  isDeleted?: boolean; // filtro
  isAdmin?: boolean;
}

// GetAllAdminUsersUseCase.ts
export class GetAllAdminUsersUseCase implements UseCase<IRequest, IResponse> {
  constructor(private readonly userRepo: IUserRepo) {}

  async execute(req: IRequest): Promise<IResponse> {
    const users = await this.userRepo.findAll({
      page: req.page || 1,
      limit: req.limit || 20,
      search: req.search,
      isDeleted: req.isDeleted,
      isAdmin: req.isAdmin,
    });
    return right(Result.ok(users.map(AdminUserMap.toDTO)));
  }
}
```

#### `UpdateAdminUserUseCase`

```typescript
// UpdateAdminUserDTO.ts
export interface UpdateAdminUserRequest {
  userId: string;
  isDeleted?: boolean;
  isAdminUser?: boolean;
  isEmailVerified?: boolean;
}
// Permite: reativar conta, promover/rebaixar admin, forçar verificação de email
```

#### `GetAdminStatsUseCase`

```typescript
// Consultas diretas nos models Sequelize (sem passar por repos de outros módulos)
// Usar Sequelize.fn('COUNT', ...) para agregar
async execute(): Promise<IResponse> {
  const [
    totalUsers,
    activeUsers,
    adminUsers,
    deletedUsers,
    usersThisMonth,
    totalEnvelopes,
    totalTransactions,
    totalProcessedIncomes,
  ] = await Promise.all([
    Users.count(),
    Users.count({ where: { is_deleted: false } }),
    Users.count({ where: { is_admin_user: true } }),
    Users.count({ where: { is_deleted: true } }),
    Users.count({ where: { created_at: { [Op.gte]: startOfMonth } } }),
    Envelopes.count(),
    Transactions.count(),
    ProcessedIncome.count(),
  ]);
  // ...
}
```

### 2.5 Rotas Admin (`infra/http/routes/adminRouter.ts`)

```typescript
import { Router } from 'express';
import { Middleware } from 'src/shared/infrastructure/http/utils/Middleware';
import {
  getAllAdminUsersController,
  getAdminUserByIdController,
  updateAdminUserController,
  deleteAdminUserController,
  getAdminStatsController,
  getAllBaseEnvelopesController,
  createBaseEnvelopeController,
  updateBaseEnvelopeController,
  deleteBaseEnvelopeController,
} from '../controller';

const adminRouter = Router();
const auth = [Middleware.ensureAuthenticated(), Middleware.ensureAdmin()];

// Users
adminRouter.get('/users',        auth, (req, res) => getAllAdminUsersController.execute(req, res));
adminRouter.get('/users/:id',    auth, (req, res) => getAdminUserByIdController.execute(req, res));
adminRouter.patch('/users/:id',  auth, (req, res) => updateAdminUserController.execute(req, res));
adminRouter.delete('/users/:id', auth, (req, res) => deleteAdminUserController.execute(req, res));

// Stats
adminRouter.get('/stats', auth, (req, res) => getAdminStatsController.execute(req, res));

// Base Envelopes
adminRouter.get('/base-envelopes',        auth, (req, res) => getAllBaseEnvelopesController.execute(req, res));
adminRouter.post('/base-envelopes',       auth, (req, res) => createBaseEnvelopeController.execute(req, res));
adminRouter.patch('/base-envelopes/:id',  auth, (req, res) => updateBaseEnvelopeController.execute(req, res));
adminRouter.delete('/base-envelopes/:id', auth, (req, res) => deleteBaseEnvelopeController.execute(req, res));

export { adminRouter };
```

### 2.6 Registro no Router Principal

Em `shared/infrastructure/http/routes/index.ts`:

```typescript
import { adminRouter } from 'src/modules/admin/infra/http/routes/adminRouter';
// ...
router.use('/admin', adminRouter);
```

Todas as rotas admin ficam em `/api/admin/*`.

### 2.7 IUserRepo — Extensão Necessária

O repo existente de users (`IUserRepo`) precisará de:

```typescript
// Adicionar à interface IUserRepo
findAll(filters: {
  page: number;
  limit: number;
  search?: string;
  isDeleted?: boolean;
  isAdmin?: boolean;
}): Promise<{ users: User[]; total: number }>;
```

Implementar no `SequelizeUserRepo` usando `Op.or` para busca por name/email e `Op.and` para filtros.

---

## Etapa 3 — Frontend: Auth & Layout Admin

> **Estimativa de tokens:** ~60k | **Foco:** Login, AdminLayout, sidebar

### 3.1 Página de Login (`pages/sign-in.tsx`)

- Formulário email + senha
- Chama `POST /api/auth/login`
- Verifica na resposta se `adminUser: true` (via `/api/users/me`)
- Se não admin → mostra erro "Acesso restrito"
- Se admin → redireciona para `/`
- Usa `useAdminAuthStore` para persistir dados do usuário

```tsx
// sections/auth/AdminSignInForm.tsx
const { mutate: login, isPending } = useMutation({
  mutationFn: (data: { email: string; password: string }) =>
    adminApiClient.post('/auth/login', data),
  onSuccess: async () => {
    const { data } = await adminApiClient.get('/users/me');
    if (!data.adminUser) {
      enqueueSnackbar(t('auth.notAdmin'), { variant: 'error' });
      await adminApiClient.post('/auth/logout');
      return;
    }
    useAdminAuthStore.getState().setUser(data);
    navigate(ADMIN_PATHS.dashboard);
  },
});
```

### 3.2 AdminLayout (`layouts/AdminLayout.tsx`)

- Verifica autenticação ao montar (chama `/api/users/me`)
- Se não autenticado ou não admin → redireciona para `/entrar`
- Sidebar fixa com links de navegação
- Topbar com nome do admin e botão de logout

```
┌─────────────────────────────────────────────┐
│  TOPBAR: projectEVE Admin     [Diego ▼] [pt]│
├──────────┬──────────────────────────────────┤
│ SIDEBAR  │                                  │
│          │      <Outlet />                  │
│ Dashboard│      (conteúdo da página)        │
│ Usuários │                                  │
│ Base Env.│                                  │
│          │                                  │
│ [Sair]   │                                  │
└──────────┴──────────────────────────────────┘
```

**Itens do Sidebar:**
| Ícone | Label (i18n) | Rota |
|-------|-------------|------|
| DashboardIcon | `nav.dashboard` | `/` |
| PeopleIcon | `nav.users` | `/usuarios` |
| FolderIcon | `nav.baseEnvelopes` | `/base-envelopes` |

---

## Etapa 4 — Frontend: Dashboard & Stats

> **Estimativa de tokens:** ~50k | **Foco:** KPIs e gráficos

### 4.1 Hook de Stats

```typescript
// hooks/queries/useAdminStats.ts
export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () =>
      adminApiClient.get<AdminStatsDTO>('/admin/stats').then((r) => r.data),
    staleTime: 1000 * 60 * 5, // 5 min
  });
}
```

### 4.2 KPI Cards (`sections/dashboard/DashboardKpis.tsx`)

Grid com 4 colunas (responsivo):

| KPI | Dado |
|-----|------|
| Total de Usuários | `stats.totalUsers` |
| Usuários Ativos | `stats.activeUsers` |
| Usuários Novos (mês) | `stats.usersRegisteredThisMonth` |
| Total de Transações | `stats.totalTransactions` |

```tsx
// KpiCard.tsx
<Card sx={{ p: 3 }}>
  <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
  <Typography variant="h3">{value}</Typography>
  {trend && <Chip label={trend} color="success" size="small" />}
</Card>
```

### 4.3 Gráficos (`sections/dashboard/DashboardCharts.tsx`)

Usando **Recharts**:

1. **LineChart**: Usuários registrados por mês (últimos 12 meses)
   - Backend: endpoint adicional `GET /api/admin/stats/users-by-month`
   - Retorna `[{ month: number, year: number, count: number }]`

2. **BarChart**: Transações por mês (últimos 6 meses)
   - Backend: endpoint adicional `GET /api/admin/stats/transactions-by-month`

---

## Etapa 5 — Frontend: Gerenciamento de Usuários

> **Estimativa de tokens:** ~80k | **Foco:** Lista, detalhe, ações

### 5.1 Hook de Listagem

```typescript
// hooks/queries/useAdminUsers.ts
export function useAdminUsers(filters: AdminUsersFilters) {
  return useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: () =>
      adminApiClient
        .get<{ users: AdminUserDTO[]; total: number }>('/admin/users', {
          params: filters,
        })
        .then((r) => r.data),
  });
}
```

### 5.2 Tabela de Usuários (`sections/users/UsersTable.tsx`)

Usando **MUI DataGrid**:

| Coluna | Campo | Tipo |
|--------|-------|------|
| Nome | `name` | string |
| Email | `email` | string |
| Admin | `isAdminUser` | chip (Sim/Não) |
| Status | `isDeleted` | chip (Ativo/Deletado) |
| Email Verificado | `isEmailVerified` | ícone |
| Cadastro Completo | `isRegistrationComplete` | ícone |
| Criado em | `createdAt` | data formatada |
| Ações | — | menu (ver, editar, deletar) |

Filtros acima da tabela:
- Input de busca (nome/email)
- Select: Status (todos / ativos / deletados)
- Select: Admin (todos / admins / não-admins)

### 5.3 Detalhe do Usuário (`pages/users/[id].tsx`)

Layout em abas (MUI Tabs):

**Aba "Perfil"**
- Card com dados pessoais
- Chips de status
- Botões de ação: Desativar/Reativar, Promover/Rebaixar Admin, Deletar

**Aba "Envelopes"**
- Lista de envelopes do usuário (read-only)
- Chamar `GET /api/envelopes` com um parâmetro de admin (ou query direta)

> Nota: Os endpoints de envelopes atuais são por usuário autenticado. Para o admin visualizar envelopes de outro usuário, o backend precisará de um endpoint adicional:
> `GET /api/admin/users/:userId/envelopes` — retorna envelopes do usuário especificado.

**Aba "Resumo Financeiro"**
- Total de incomes, transações, processed-incomes do usuário

### 5.4 Mutations de Ações

```typescript
// hooks/mutations/useUpdateAdminUser.ts
export function useUpdateAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Partial<UpdateAdminUserRequest> }) =>
      adminApiClient.patch(`/admin/users/${userId}`, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      enqueueSnackbar(t('users.updateSuccess'), { variant: 'success' });
    },
  });
}
```

Ações disponíveis (com `ConfirmDialog` para confirmar):
- **Desativar conta**: `PATCH /admin/users/:id { isDeleted: true }`
- **Reativar conta**: `PATCH /admin/users/:id { isDeleted: false }`
- **Tornar Admin**: `PATCH /admin/users/:id { isAdminUser: true }`
- **Remover Admin**: `PATCH /admin/users/:id { isAdminUser: false }`
- **Deletar permanentemente**: `DELETE /admin/users/:id`

---

## Etapa 6 — Frontend: Gerenciamento de Base Envelopes

> **Estimativa de tokens:** ~40k | **Foco:** CRUD de envelopes-template

### 6.1 Base Envelopes Table (`sections/base-envelopes/BaseEnvelopesTable.tsx`)

Tabela simples (MUI Table ou DataGrid):

| Coluna | Campo |
|--------|-------|
| Ordem | `order` |
| Nome | `name` |
| Cor | `color` (swatch colorido) |
| Ações | Editar / Deletar |

Botão "Novo Base Envelope" abre form em dialog.

### 6.2 Form (`sections/base-envelopes/BaseEnvelopeForm.tsx`)

Campos:
- **Nome**: TextField
- **Cor**: Input de cor (`<input type="color">` com preview)
- **Ordem**: NumberField

```typescript
// hooks/mutations/useCreateBaseEnvelope.ts
export function useCreateBaseEnvelope() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBaseEnvelopeDTO) =>
      adminApiClient.post('/admin/base-envelopes', data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'base-envelopes'] });
      enqueueSnackbar(t('baseEnvelopes.createSuccess'), { variant: 'success' });
    },
  });
}
```

---

## Etapa 7 — Backend: Endpoints Adicionais de Analytics

> **Estimativa de tokens:** ~50k | **Foco:** Dados históricos para gráficos

### 7.1 Novos Endpoints no adminRouter

```
GET /api/admin/stats                         → KPIs gerais (Etapa 2)
GET /api/admin/stats/users-by-month          → Usuários por mês (últimos 12m)
GET /api/admin/stats/transactions-by-month   → Transações por mês (últimos 6m)
GET /api/admin/users/:userId/envelopes       → Envelopes de um usuário específico
GET /api/admin/users/:userId/summary         → Resumo financeiro do usuário
```

### 7.2 Use-Cases Correspondentes

**`GetUsersByMonthUseCase`**:
```typescript
// Query SQL via Sequelize
await Users.findAll({
  attributes: [
    [fn('DATE_TRUNC', 'month', col('created_at')), 'month'],
    [fn('COUNT', col('id')), 'count'],
  ],
  where: { created_at: { [Op.gte]: twelveMonthsAgo } },
  group: [fn('DATE_TRUNC', 'month', col('created_at'))],
  order: [[fn('DATE_TRUNC', 'month', col('created_at')), 'ASC']],
  raw: true,
});
```

**`GetTransactionsByMonthUseCase`**: Similar, usando modelo `Transactions`.

**`GetUserEnvelopesAdminUseCase`**: Reutiliza `IEnvelopeRepo.getAll(userId)` passando o userId do path param.

**`GetUserSummaryAdminUseCase`**:
```typescript
const [incomeCount, transactionCount, processedIncomeCount] = await Promise.all([
  Incomes.count({ where: { user_id: userId } }),
  Transactions.count({ where: { '$envelope.user_id$': userId }, include: [Envelopes] }),
  ProcessedIncome.count({ where: { user_id: userId } }),
]);
```

---

## Resumo das Etapas

| Etapa | Descrição | Tokens Est. | Arquivos Criados |
|-------|-----------|-------------|-----------------|
| **1** | Setup projectEVE-admin (Vite, deps, estrutura, Axios, Router, Auth Store) | ~80k | ~25 arquivos base |
| **2** | Backend: módulo admin, middleware, use-cases CRUD users + base-envelopes + stats | ~120k | ~35 arquivos |
| **3** | Frontend: Login, AdminLayout, Sidebar, proteção de rotas | ~60k | ~8 arquivos |
| **4** | Frontend: Dashboard, KPI cards, gráficos Recharts | ~50k | ~6 arquivos |
| **5** | Frontend: Users table, detalhe, ações, mutations | ~80k | ~12 arquivos |
| **6** | Frontend: Base Envelopes CRUD, form, tabela | ~40k | ~6 arquivos |
| **7** | Backend: endpoints analytics (by-month, user envelopes, user summary) | ~50k | ~10 arquivos |

**Total estimado:** ~480k tokens (divididos em 7 etapas ≤ 200k tokens cada)

---

## Dependências Entre Etapas

```
Etapa 1 (Setup)
    │
    ├── Etapa 2 (Backend admin)
    │       │
    │       ├── Etapa 3 (Layout + Login) → depende de: Etapa 1 + Etapa 2 (auth endpoint)
    │       │       │
    │       │       ├── Etapa 4 (Dashboard) → depende de: Etapa 3 + Etapa 2 (/stats)
    │       │       ├── Etapa 5 (Users)     → depende de: Etapa 3 + Etapa 2 (/users)
    │       │       └── Etapa 6 (BaseEnvs)  → depende de: Etapa 3 + Etapa 2 (/base-envelopes)
    │       │
    │       └── Etapa 7 (Analytics endpoints) → depende de: Etapa 2 | alimenta Etapa 4
```

## Ordem de Execução Recomendada

1. **Etapa 2** (backend) — base de tudo
2. **Etapa 1** (frontend setup) — paralelo com Etapa 2
3. **Etapa 7** (analytics backend) — ainda no backend, antes do frontend precisar
4. **Etapa 3** (layout/auth)
5. **Etapas 4, 5, 6** — podem ser feitas em paralelo após Etapa 3

---

## Variáveis de Ambiente

### `projectEVE-admin/.env`
```
VITE_API_URL=http://localhost:3333
```

### `projectEVE-backend/.env` (sem mudanças — usa mesmas vars)

---

## Notas de Implementação

- **Não criar novo servidor backend**: o módulo admin é adicionado ao Express existente em `/api/admin/*`
- **Cookie compartilhado**: admin usa os mesmos cookies JWT do app principal — o `adminUser: true` no token diferencia o acesso
- **Soft delete**: `deleteAdminUser` deve fazer soft delete (`is_deleted: true`) por padrão; deletar permanentemente apenas com flag explícita
- **Paginação**: `GetAllAdminUsers` usa `LIMIT`/`OFFSET` do Sequelize
- **i18n**: seguir o padrão do projectEVE-Web — todas as strings via `useTranslation()`; chaves de meses via `months.*` já existentes
- **Sem estilos inline**: apenas MUI `sx` prop
- **Port do admin**: `5174` (Web usa `5173`)
