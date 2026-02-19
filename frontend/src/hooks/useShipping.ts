import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as shippingService from '@/services/shipping'
import { getShippingRates } from '@/services/orders'
import type {
  BulkUpsertShippingRatesRequest,
  CreateShippingRateRequest,
  UpdateShippingRateRequest,
} from '@/services/shipping'

export const useShippingRates = () => {
  return useQuery({
    queryKey: ['shipping', 'rates', 'public'],
    queryFn: () => getShippingRates(),
  })
}

export const useAdminShippingRates = () => {
  return useQuery({
    queryKey: ['shipping', 'rates', 'admin'],
    queryFn: () => shippingService.getAdminShippingRates(),
  })
}

export const useCreateShippingRate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateShippingRateRequest) => shippingService.createShippingRate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping', 'rates', 'admin'] })
      queryClient.invalidateQueries({ queryKey: ['shipping', 'rates', 'public'] })
    },
  })
}

export const useUpdateShippingRate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateShippingRateRequest }) =>
      shippingService.updateShippingRate(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping', 'rates', 'admin'] })
      queryClient.invalidateQueries({ queryKey: ['shipping', 'rates', 'public'] })
    },
  })
}

export const useDeleteShippingRate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => shippingService.deleteShippingRate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping', 'rates', 'admin'] })
      queryClient.invalidateQueries({ queryKey: ['shipping', 'rates', 'public'] })
    },
  })
}

export const useBulkUpsertShippingRates = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: BulkUpsertShippingRatesRequest) =>
      shippingService.upsertShippingRates(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping', 'rates', 'admin'] })
      queryClient.invalidateQueries({ queryKey: ['shipping', 'rates', 'public'] })
    },
  })
}
