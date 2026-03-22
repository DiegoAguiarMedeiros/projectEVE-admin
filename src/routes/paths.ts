export const ADMIN_PATHS = {
  signIn: '/entrar',
  dashboard: '/',
  users: '/usuarios',
  userDetail: (id: string) => `/usuarios/${id}`,
  baseEnvelopes: '/base-envelopes',
}
