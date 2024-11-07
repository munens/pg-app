import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { apiService } from '../../../services';
import { ReservationDto } from './types.ts';

const useGetReservations = () => {
  const { data, isLoading, isSuccess, error, refetch } = useQuery({
    enabled: true,
    queryKey: ['reservations'],
    queryFn: () =>
      apiService.client
        .get<
          ReadonlyArray<ReservationDto>,
          AxiosResponse<ReadonlyArray<ReservationDto>>
        >(`/reservations`)
        .then((res) => res.data)
  });

  return {
    reservations: isSuccess ? (data as ReadonlyArray<ReservationDto>) : [],
    isLoading,
    error,
    isSuccess,
    refetch
  };
};

export default useGetReservations;
