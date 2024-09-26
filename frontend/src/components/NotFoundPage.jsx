import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <h1>{t('notFoundPage.header')}</h1>
      <p>{t('notFoundPage.body')}</p>
      <Link to="/">{t('notFoundPage.btn')}</Link>
    </div>
  );
};
