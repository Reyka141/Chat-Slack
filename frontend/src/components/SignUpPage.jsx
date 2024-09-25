import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Button, Form, Container, Card, Row, Col, Image } from 'react-bootstrap';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { signUpUser } from '../services/userApi.js';
import useAuth from '../hooks/index.jsx';
import { useTranslation } from 'react-i18next';



export const SignUpPage = () => {
  const navigate = useNavigate();
  const [
    signUp,
    { error: signUpError, isLoading: isSignUp },
  ] = signUpUser();
  const auth = useAuth();
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
  }, [])
  const { t } = useTranslation();

  const signupSchema = Yup.object().shape({
    username: Yup.string()
      .transform((value) => value.replace(/ {1,}/g, ''))
      .min(3, t('loginAndSignUp.errors.validation.nameSymbols'))
      .max(20, t('loginAndSignUp.errors.validation.nameSymbols'))
      .required(t('loginAndSignUp.errors.validation.required')), 
    password: Yup.string()
      .min(6, t('loginAndSignUp.errors.validation.pasMinSumbols'))
      .required(t('loginAndSignUp.errors.validation.required')), 
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('loginAndSignUp.errors.validation.confirmPassword'))
      .required(t('loginAndSignUp.errors.validation.required')),
  });

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
          formik.errors.username = t('loginAndSignUp.errors.validation.status409');
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
              <Form noValidate className="w-50" onSubmit={formik.handleSubmit}>
                <h1 className="text-center mb-4">{t('loginAndSignUp.headingSignUp')}</h1>
                <Form.Floating  className="mb-3">
                  <Form.Control 
                    type="username"
                    required
                    placeholder="Имя пользователя" 
                    id="username"
                    name="username"
                    autoComplete="new-username"
                    ref={inputRef}
                    disabled={formik.isSubmitting}
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    className={formik.errors.username && 'is-invalid'}
                  />
                  <Form.Label htmlFor='username'>{t('loginAndSignUp.usernameSignUp')}</Form.Label>
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
                  <Form.Label htmlFor='password'>{t('loginAndSignUp.password')}</Form.Label>
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
                  <Form.Label htmlFor='confirmPassword'>{t('loginAndSignUp.confirmPassword')}</Form.Label>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Floating>
                <Button variant="outline-primary" type="submit" className='w-100 mb-3'>
                  {t('loginAndSignUp.signupBtn')}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>    
  );
}