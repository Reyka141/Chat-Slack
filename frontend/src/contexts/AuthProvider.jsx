import React, { useState, useEffect, useMemo } from 'react';
import { Provider, ErrorBoundary } from '@rollbar/react';
import { useGetChannelsQuery } from '../services/channelsApi.js';
import AuthContext from '../contexts/index.jsx';

const rollbarConfig = {
  accessToken: process.env.REACT_APP_ROLLBAR_ACCESS_TOKEN,
  environment: 'testenv',
};

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const { error } = useGetChannelsQuery();
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setLoggedIn(false);
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      if (!error) {
        logIn();
      } else {
        logOut();
      }
    }
  }, [error]);

  const contextValue = useMemo(() => ({ loggedIn, logIn, logOut }), [loggedIn]);

  return (
    <AuthContext.Provider value={contextValue}>
      <Provider config={rollbarConfig}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </Provider>
    </AuthContext.Provider>
  );
};

export default AuthProvider;