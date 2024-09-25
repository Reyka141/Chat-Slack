import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { renameChannel } from '../services/channelsApi.js';



const generateOnSubmit = ({ onHide }, sendChannel, item) => (values) => {
  const newChannel  = { name: values.name, id: item };
  sendChannel(newChannel);
  onHide();
};

const Rename = (props) => {
  const { onHide, channels,  modalInfo: { item } } = props;
  const [changeChannel] = renameChannel();
  const channelsName = channels.map(({ name }) => name);
  const { name } = channels.find(({ id }) => id === item);
  const { t } = useTranslation();
  
  const channelSchema = Yup.object().shape({
    name: Yup.string()
      .transform((value) => value.replace(/ {1,}/g, ''))
      .min(3, t('modal.errors.validation.minMax'))
      .max(20, t('modal.errors.validation.minMax'))
      .required(t('modal.errors.validation.required'))
      .test('is-unique', t('modal.errors.validation.unique'), function (value) {
        return !channelsName.includes(value);
      }),
  });

  const f = useFormik({ 
    onSubmit: generateOnSubmit(props, changeChannel, item),
    validationSchema: channelSchema,
    initialValues: { name } 
  });

  const inputRename = useRef();
  
  useEffect(() => {
    // Используем setTimeout, чтобы гарантировать, что элемент полностью смонтирован
    setTimeout(() => {
      if (inputRename.current) {
        inputRename.current.select();
      }
    }, 0);
  }, []);

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('modal.rename.header')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form noValidate onSubmit={f.handleSubmit}>
          <Form.Group>
            <Form.Control
              autoComplete="off"
              required
              ref={inputRename}
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

export default Rename;