export interface AdminStatsDTO {
  totalUsers: number
  activeUsers: number
  adminUsers: number
  deletedUsers: number
  usersRegisteredThisMonth: number
  totalEnvelopes: number
  totalTransactions: number
  totalProcessedIncomes: number
}

export interface MonthlyStatDTO {
  month: number
  year: number
  count: number
}
