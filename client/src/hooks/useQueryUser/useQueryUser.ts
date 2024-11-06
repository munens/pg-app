import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { apiService, storageService } from '../../services';
import { TOKEN_KEY } from '../../constants.ts';
import { IAuthenticatedUser } from '../../models/authenticated-user.ts';
import { JwtPayload } from './types.ts';

const useQueryUser = () => {
  const payload =
    storageService.getParsedValueFromStorage<JwtPayload>(TOKEN_KEY);

  const { data, isLoading, isSuccess, error, refetch } = useQuery({
    enabled: !!payload,
    queryKey: ['user'],
    queryFn: () =>
      apiService.client
        .get<
          IAuthenticatedUser,
          AxiosResponse<IAuthenticatedUser>
        >(`/users/${payload.username}`)
        .then((res) => res.data)
  });

  return {
    authenticatedUser: data as IAuthenticatedUser,
    isLoading,
    error,
    isSuccess,
    refetch
  };
};

export default useQueryUser;
