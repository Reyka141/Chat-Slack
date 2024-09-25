import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { removeChannel } from '../services/channelsApi.js';

const Remove = (props) => {
  const { onHide, modalInfo: { item } } = props;
  const [deleteChannel] = removeChannel();
  const handleClick = () => {
    deleteChannel(item);
    onHide();
  };
  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className='lead'>Уверены?</p>
        <div className='d-flex justify-content-end'>
          <Button variant='secondary' className='me-2' onClick={onHide}>Отменить</Button>
          <Button variant='danger' onClick={handleClick}>Удалить</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;