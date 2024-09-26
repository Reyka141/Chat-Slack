import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { addChannel } from '../services/channelsApi.js';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const generateOnSubmit = ({ onHide, setActiveChannel }, sendChannel, t) => async (values) => {
  const newChannel  = { name: values.name };
  const notifySuccess = () => toast.success(t('toasts.createChannel'));
  const notifyError = (type) => {
    switch (type) {
      case 'FETCH_ERROR': 
        return toast.error(t('toasts.fetchError'));
      default:
        return toast.error(t('toasts.otherError'));
    }
  };
  try {
    const { id, name } = await sendChannel(newChannel).unwrap();
    setActiveChannel({ id, name });
    notifySuccess();
  } catch (err) {
    notifyError(err.status);
  }
  onHide();
};

const Add = (props) => {
  const { onHide, channels } = props;
  const channelsName = channels.map(({ name }) => name);
  const [sendChannel] = addChannel();
  const { t } = useTranslation();

  const channelSchema = Yup.object().shape({
    name: Yup.string()
      .transform((value) => {
        const trim = value.trim();
        return trim.replace(/ {2,}/g, ' ');
      })
      .min(3, t('modal.errors.validation.minMax'))
      .max(20, t('modal.errors.validation.minMax'))
      .required(t('modal.errors.validation.required'))
      .test('is-unique', t('modal.errors.validation.unique'), function (value) {
        return !channelsName.includes(value);
      }),
  });

  const f = useFormik({ 
    onSubmit: generateOnSubmit(props, sendChannel, t),
    validationSchema: channelSchema,
    initialValues: { name: '' } });

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('modal.add.header')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form noValidate onSubmit={f.handleSubmit}>
          <Form.Group>
            <Form.Control
              autoComplete="off"
              required
              ref={inputRef}
              type='input'
              onChange={f.handleChange}
              onBlur={f.handleBlur}
              value={f.values.name}
              name="name"
              id='name'
              className={`mb-2 ${f.errors.name && 'is-invalid'}`}
            />
            <Form.Label className='visually-hidden'>{t('modal.name')}</Form.Label>
            <Form.Control.Feedback type="invalid">{f.errors.name}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className='d-flex justify-content-end'>
            <Button type='button' variant='secondary' onClick={onHide} className='me-2'>{t('modal.cancelBtn')}</Button>
            <Button type='submit'>{t('modal.submitBtn')}</Button>
          </Form.Group>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;