import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
  <div className='col-12 col-md-6 mt-3 mt-md-0'>
    <h1>404 - Страница не найдена</h1>
    <p>Извините, страница, которую вы ищете, не существует.</p>
    <Link to="/">Вернуться на главную</Link>
  </div>
);
