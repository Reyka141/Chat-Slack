import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { addChannel } from '../services/channelsApi.js';

const generateOnSubmit = ({ onHide, setActiveChannel }, sendChannel,) => async (values) => {
  const newChannel  = { name: values.name };
  const { id, name } = await sendChannel(newChannel).unwrap();
  setActiveChannel({ id, name });
  onHide();
};

const Add = (props) => {
  const { onHide, channels } = props;
  const channelsName = channels.map(({ name }) => name);
  const [sendChannel] = addChannel();

  const channelSchema = Yup.object().shape({
    name: Yup.string()
      .transform((value) => value.replace(/ {1,}/g, ''))
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле')
      .test('is-unique', 'Должно быть уникальным', function (value) {
        return !channelsName.includes(value); // Проверка на дублирование
      }),
  });

  const f = useFormik({ 
    onSubmit: generateOnSubmit(props, sendChannel),
    validationSchema: channelSchema,
    initialValues: { name: '' } });

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Добовить канал</Modal.Title>
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
            <Form.Label className='visually-hidden'>Имя канала</Form.Label>
            <Form.Control.Feedback type="invalid">{f.errors.name}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className='d-flex justify-content-end'>
            <Button type='button' variant='secondary' onClick={onHide} className='me-2'>Отменить</Button>
            <Button type='submit'>Отправить</Button>
          </Form.Group>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;