import { useEffect, useState } from 'react';
import UserContext from '../contexts/user.ts';
import { IUser } from '../models/user.ts';
import { storageService } from '../services';
import { TOKEN_KEY } from '../constants.ts';
import { Outlet, useNavigate } from 'react-router-dom';
import { useQueryUser } from '../hooks';

const UserProvider = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const navigate = useNavigate();

  const token = storageService.getValueFromStorage(TOKEN_KEY);
  const { authenticatedUser, isLoading, error, isSuccess } = useQueryUser();

  const navigateToLogin = () => navigate('/login');

  // useEffect(() => {
  //   if (!token) {
  //     navigateToLogin();
  //   }
  // }, [token]);

  // useEffect(() => {
  //   if (isSuccess) {
  //     const { user } = authenticatedUser;
  //     if (user) {
  //       setUser(user);
  //     }
  //   }
  // }, [isSuccess, authenticatedUser]);

  // useEffect(() => {
  //   if (error?.status === 403) {
  //     storageService.removeValueFromStorage(TOKEN_KEY);
  //     navigateToLogin();
  //   }
  // }, [error]);

  return (
    <UserContext.Provider value={{ user }}>
      {isLoading ? <span>loading...</span> : <Outlet />}
    </UserContext.Provider>
  );
};

export default UserProvider;
