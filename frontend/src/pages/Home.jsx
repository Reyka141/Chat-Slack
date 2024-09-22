import React from 'react';
import { Link } from 'react-router-dom';

export const Home = () => (
  <div className='col-12 col-md-6 mt-3 mt-md-0'>
    <h1>Домашнаяя страница</h1>
    <Link to="/login">Вход</Link>
  </div>
);