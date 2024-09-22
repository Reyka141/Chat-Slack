import React from 'react';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import * as Yup from 'yup';

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'Минимум 2 буквы')
    .max(50, 'Максимум 50 букв')
    .required('Обязательное поле'),
  lastName: Yup.string()
    .min(2, 'Минимум 2 буквы')
    .max(50, 'Максимум 50 букв')
    .required('Обязательное поле'),
  email: Yup.string().email('Неверный email').required('Обязательное поле'),
});

export const SignupForm = () => {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
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
        />
        <Form.Label>Ваш ник</Form.Label>
      </Form.Floating>

      <Form.Floating className="mb-3">
        <Form.Control 
            type="password"
            id="password"
            placeholder="Пароль"
            name="password"
            onChange={formik.handleChange}
            value={formik.values.password}
        />
        <Form.Label>Пароль</Form.Label>
      </Form.Floating>
      <Button variant="outline-primary" type="submit" className='w-100 mb-3'>
        Войти
      </Button>
    </Form>
  );
}


const BuildPage = (index) => (
  <>
    <h3>Page {index}</h3>
    <div>
      Page {index} content
    </div>
  </>
);

export const PageOne = () => BuildPage(1);
export const PageTwo = () => BuildPage(2);