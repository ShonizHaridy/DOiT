import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as adminProfileService from '@/services/admin-profile'
import type { UpdateAdminProfileRequest } from '@/types/admin-profile'

export const useAdminProfile = () => {
  return useQuery({
    queryKey: ['admin', 'profile'],
    queryFn: () => adminProfileService.getAdminProfile(),
  })
}

export const useUpdateAdminProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateAdminProfileRequest) =>
      adminProfileService.updateAdminProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'profile'] })
    },
  })
}
