import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import filter from 'leo-profanity';
import { renameChannel } from '../services/channelsApi.js';

filter.clearList();
filter.add(filter.getDictionary('en'));
filter.add(filter.getDictionary('fr'));
filter.add(filter.getDictionary('ru'));

const generateOnSubmit = ({ onHide }, changeChannel, item, t) => async (values) => {
  const newChannel = { name: values.name, id: item };
  const notify = () => toast.success(t('toasts.renameChannel'));
  const notifyError = (type) => {
    switch (type) {
      case 'FETCH_ERROR':
        return toast.error(t('toasts.fetchError'));
      default:
        return toast.error(t('toasts.otherError'));
    }
  };
  try {
    await changeChannel(newChannel).unwrap();
    notify();
  } catch (err) {
    notifyError(err.status);
  }
  onHide();
};

const Rename = (props) => {
  const { onHide, channels, modalInfo: { item } } = props;
  const [changeChannel] = renameChannel();
  const channelsName = channels.map(({ name }) => name);
  const { name } = channels.find(({ id }) => id === item);
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
      .test('is-unique', t('modal.errors.validation.unique'), (value) => !channelsName.includes(value)),
  });

  const f = useFormik({
    onSubmit: generateOnSubmit(props, changeChannel, item, t),
    validationSchema: channelSchema,
    initialValues: { name: filter.clean(name) },
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
              type="input"
              onChange={f.handleChange}
              onBlur={f.handleBlur}
              value={f.values.name}
              name="name"
              id="name"
              className={`mb-2 ${f.errors.name && 'is-invalid'}`}
            />
            <Form.Label className="visually-hidden" htmlFor="name">{t('modal.name')}</Form.Label>
            <Form.Control.Feedback type="invalid">{f.errors.name}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="d-flex justify-content-end">
            <Button type="button" variant="secondary" onClick={onHide} className="me-2">{t('modal.cancelBtn')}</Button>
            <Button type="submit">{t('modal.submitBtn')}</Button>
          </Form.Group>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Rename;
