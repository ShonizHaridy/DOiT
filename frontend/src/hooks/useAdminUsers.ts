import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as adminUsersService from '@/services/admin-users'
import type { CreateAdminUserRequest, UpdateAdminUserRequest } from '@/types/admin-user'

export const useAdminUsers = (enabled = true) => {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => adminUsersService.getAdminUsers(),
    enabled,
  })
}

export const useCreateAdminUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateAdminUserRequest) => adminUsersService.createAdminUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAdminUserRequest }) =>
      adminUsersService.updateAdminUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => adminUsersService.deleteAdminUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}
