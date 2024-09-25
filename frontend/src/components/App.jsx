import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Button, Navbar, Container } from 'react-bootstrap';
import AuthContext from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';

import { LoginPage } from './LoginPage';
import { HomePage } from './HomePage';
import { NotFoundPage } from './NotFoundPage';
import { SignUpPage } from './SignUpPage';


const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setLoggedIn(false);
  };
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setLoggedIn(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return (
    auth.loggedIn ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

const LoginRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return (
    auth.loggedIn ? <Navigate to="/" state={{ from: location }} /> : children
  );
};

const AuthButton = () => {
  const auth = useAuth();

  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut}>Выйти</Button>
      : null
  );
};


const App = () => {
  return (
    <AuthProvider>
      <Router>
      <div className='d-flex flex-column h-100'>
        <Navbar bg="white" expand="lg" className='shadow-sm'>
          <Container>
            <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
            <AuthButton />
          </Container>
        </Navbar>
          <Routes>
            <Route path="/" element={(
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              )} 
            />
            <Route path="/login" element={(
                <LoginRoute>
                  <LoginPage />
                </LoginRoute>
              )}  />
              <Route path="/signup" element={(
                <LoginRoute>
                  <SignUpPage />
                </LoginRoute>
              )}  />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
