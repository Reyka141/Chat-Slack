import React from 'react';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import * as Yup from 'yup';

const signupSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Минимум 2 буквы')
    .max(50, 'Максимум 50 букв')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(2, 'Минимум 2 буквы')
    .max(50, 'Максимум 50 букв')
    .required('Обязательное поле'),
});

export const Login = () => {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: signupSchema,
    onSubmit: (values) => {
      console.log(JSON.stringify(values, null, 2));
    },
  });

  return (
    <Form className="col-12 col-md-6 mt-3 mt-md-0" onSubmit={formik.handleSubmit}>
      <h1 className="text-center mb-4">Войти</h1>
      <Form.Floating  className="mb-3">
        <Form.Control 
          type="username"
          placeholder="Ваш ник" 
          id="username"
          name="username"
          onChange={formik.handleChange}
          value={formik.values.username}
          className={formik.errors.username && 'is-invalid'}
        />
        <Form.Label>Ваш ник</Form.Label>        
        <Form.Control.Feedback type="invalid">{formik.errors.username}</Form.Control.Feedback>
      </Form.Floating>

      <Form.Floating className="mb-3">
        <Form.Control 
            type="password"
            id="password"
            placeholder="Пароль"
            name="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            className={formik.errors.password && 'is-invalid'}
        />
        <Form.Label>Пароль</Form.Label>
        <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
      </Form.Floating>
      <Button variant="outline-primary" type="submit" className='w-100 mb-3'>
        Войти
      </Button>
    </Form>
  );
}