import React from 'react';
import { useFormik } from 'formik';
import { Button, Form, Container, Card, Row, Col, Image } from 'react-bootstrap';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { signUpUser } from '../services/userApi.js';
import useAuth from '../hooks/index.jsx';

const signupSchema = Yup.object().shape({
  username: Yup.string()
    .transform((value) => value.replace(/ {1,}/g, ''))
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(6, 'Не менее 6 символов')
    .required('Обязательное поле'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
});

export const SignUpPage = () => {
  const navigate = useNavigate();
  const [
    signUp,
    { error: signUpError, isLoading: isSignUp },
  ] = signUpUser();
  const auth = useAuth();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: signupSchema,
    onSubmit: async (values) => {
      const data = { username: values.username, password: values.password };

      try {
        const { token, username } = await signUp(data).unwrap();
        localStorage.setItem('userId', token);
        localStorage.setItem('username', username);
        auth.logIn();
        navigate('/');
      } catch (err) {
        if (err.status === 409) {
          formik.errors.username = 'Такой пользователь уже существует';
        }
      }
    },
  });
  return (
    <Container fluid className='h-100'>
      <Row className='justify-content-center align-content-center h-100'>
        <Col xs={12} md={8} xxl={6}>
          <Card className='shadow-sm'>
            <Card.Body className='d-flex flex-column flex-md-row justify-content-around align-items-center p-5'>
              <div>
                <Image src='/images/avatar_1.6084447160acc893a24d.jpg' roundedCircle alt='Регистрация' />
              </div>
              <Form className="w-50" onSubmit={formik.handleSubmit}>
                <h1 className="text-center mb-4">Регистрация</h1>
                <Form.Floating  className="mb-3">
                  <Form.Control 
                    type="username"
                    required
                    placeholder="Имя пользователя" 
                    id="username"
                    name="username"
                    autoComplete="new-username"
                    disabled={formik.isSubmitting}
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    className={formik.errors.username && 'is-invalid'}
                  />
                  <Form.Label htmlFor='username'>Имя пользователя</Form.Label>
                  <Form.Control.Feedback type="invalid">{formik.errors.username}</Form.Control.Feedback>
                </Form.Floating>

                <Form.Floating className="mb-3">
                  <Form.Control 
                      type="password"
                      id="password"
                      placeholder="Пароль"
                      name="password"
                      autoComplete="new-password"
                      disabled={formik.isSubmitting}
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      className={formik.errors.password && 'is-invalid'}
                  />
                  <Form.Label htmlFor='password'>Пароль</Form.Label>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.password}
                  </Form.Control.Feedback>
                </Form.Floating>

                <Form.Floating className="mb-3">
                  <Form.Control 
                      type="password"
                      id="confirmPassword"
                      placeholder="Подтердите пароль"
                      name="confirmPassword"
                      disabled={formik.isSubmitting}
                      onChange={formik.handleChange}
                      value={formik.values.confirmPassword}
                      className={formik.errors.confirmPassword && 'is-invalid'}
                  />
                  <Form.Label htmlFor='confirmPassword'>Подтердите пароль</Form.Label>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Floating>
                <Button variant="outline-primary" type="submit" className='w-100 mb-3'>
                  Войти
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>    
  );
}