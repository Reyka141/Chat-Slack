import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { removeChannel } from '../services/channelsApi.js';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const Remove = (props) => {
  const { onHide, modalInfo: { item } } = props;
  const { t } = useTranslation();
  const [deleteChannel] = removeChannel();
  const notify = () => toast.success(t('toasts.removeChannel'));
  const notifyError = (type) => {
    switch (type) {
      case 'FETCH_ERROR': 
        return toast.error(t('toasts.fetchError'));
      default:
        return toast.error(t('toasts.otherError'));
    }
  };
  const handleClick = async () => {
    try {
      await deleteChannel(item).unwrap();
      notify();
    } catch (err) {
      notifyError(err.status);
    }
    
    onHide();
  };
  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('modal.remove.header')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className='lead'>{t('modal.remove.body')}</p>
        <div className='d-flex justify-content-end'>
          <Button variant='secondary' className='me-2' onClick={onHide}>{t('modal.cancelBtn')}</Button>
          <Button variant='danger' onClick={handleClick}>{t('modal.remove.submitBtn')}</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;