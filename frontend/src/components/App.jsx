import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Button, Navbar, Container } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import filter from 'leo-profanity';
import i18next from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';

import socket from '../socket';
import { actions as channelsActions } from '../services/channelsSlice.js';
import { actions as messagesActions } from '../services/messagesSlice.js';

import useAuth from '../hooks/index.jsx';
import AuthProvider from '../contexts/AuthProvider.jsx';

import resources from '../locales/index.js';

import LoginPage from './LoginPage';
import HomePage from './HomePage';
import NotFoundPage from './NotFoundPage';
import SignUpPage from './SignUpPage';

filter.clearList();
filter.add(filter.getDictionary('en'));
filter.add(filter.getDictionary('fr'));
filter.add(filter.getDictionary('ru'));

const AuthButton = () => {
  const { t } = useTranslation();
  const auth = useAuth();

  return auth.loggedIn ? (
    <Button onClick={auth.logOut}>{t('navbar.logOutBtn')}</Button>
  ) : null;
};

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return auth.loggedIn ? children : <Navigate to="/login" state={{ from: location }} />;
};

const LoginRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return auth.loggedIn ? <Navigate to="/" state={{ from: location }} /> : children;
};

const App = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  i18next
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'ru',
      interpolation: {
        escapeValue: false,
      },
    });

  useEffect(() => {
    socket.on('newMessage', (message) => {
      dispatch(messagesActions.addMessage(message));
    });
    socket.on('newChannel', (message) => {
      dispatch(channelsActions.addChannel(message));
    });
    socket.on('removeChannel', (message) => {
      dispatch(channelsActions.removeChannel(message));
    });
    socket.on('renameChannel', (message) => {
      const { id } = message;
      dispatch(channelsActions.updateChannel({
        id,
        changes: message,
      }));
    });

    return () => {
      socket.off('newMessage');
      socket.off('newChannel');
      socket.off('removeChannel');
      socket.off('renameChannel');
    };
  }, [dispatch]);

  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column h-100">
          <Navbar bg="white" expand="lg" className="shadow-sm">
            <Container>
              <Navbar.Brand as={Link} to="/">{t('navbar.homeLink')}</Navbar.Brand>
              <AuthButton />
            </Container>
          </Navbar>
          <Routes>
            <Route
              path="/"
              element={(
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              )}
            />
            <Route
              path="/login"
              element={(
                <LoginRoute>
                  <LoginPage />
                </LoginRoute>
              )}
            />
            <Route
              path="/signup"
              element={(
                <LoginRoute>
                  <SignUpPage />
                </LoginRoute>
              )}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
