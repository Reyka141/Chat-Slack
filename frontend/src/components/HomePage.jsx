import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { Button, Form, Container, Card, Row, Col, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import routes from '../routes.js';
// import { fetchChannels, selectors } from '../slices/channelsSlice.js';

import { getChannels, addChannel, removeChannel } from '../slices/channelsSlice.js';
import { getMessages, addMassage, removeMassage } from '../slices/messagesApi.js';

export const HomePage = () => {
  const [activeChannel, setActiveChannel] = useState({ id: '1', name: 'general' });
  const channels = getChannels();
  const messages = getMessages();
  const [remove] = removeChannel();
  const [sendTask] = addChannel();

  
  if (channels.isLoading || messages.isLoading) {
    return <div>Загрузка</div>;
  }
  const renderChannels = ({ id, name, removable }) => (
    <Nav.Item as="li" key={id} className='w-100'>
      <Button variant={id === activeChannel.id ? 'secondary' : ''} className='w-100 rounded-0 text-start' onClick={() => setActiveChannel({ id, name })}>
        <span className='me-1'>#</span>
        {name}
      </Button>
    </Nav.Item>
  );

  const renderMassager = () => {
    const messagesFromChannel =  messages.data.filter(({ channelId }) => channelId === activeChannel.id);
    const countMessage = messagesFromChannel.length;
    return (
      <div className='d-flex flex-column h-100'>
        <div className='bg-light mb-4 p-3 shadow-sm small'>
          <p className='m-0'>
            <b>{`# ${activeChannel.name}`}</b>
          </p>
          <span className='text-muted'>
            {`${countMessage} сообений`}
          </span>
        </div>
        <div id="messages-box" className='chat-messages overflow-auto px-5'>
          {messagesFromChannel.map(({ id, body, username }) => (
            <div key={id} className='text-break mb-2'>
              <b>{username}</b>: {body}
            </div>
          ))}
        </div>
        <div className='mt-auto px-5 py-3'>
          <Form noValidate className='py-1 border rounded-2'>
            <Form.Group className='input-group has-validation'>
              <Form.Control 
                type="input"
                placeholder="Введите сообщение..." 
                id="message"
                name="message"
                className='border-0 p-0 ps-2'
              />
              <Button variant='group-vertical' disabled type='submit' >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor"><path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"></path></svg>
                <span className='visually-hidden'>Отправить</span>
              </Button>
            </Form.Group>
          </Form>
        </div>
      </div>
    );
  };

  return (
    <Container className='h-100 my-4 shadow rounded overflow-hidden'>
      <Row className='h-100 bg-white flex-md-row'>
        <Col bsPrefix='col-4' className='col-md-2 border-end px-0 bg-light flex-column h-100 d-flex'>
          <div className='d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4'>
            <b>Каналы</b>
            <Button variant="group-vertical" className='p-0 text-primary'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
              </svg>
              <span className='visually-hidden'>+</span>
            </Button>
          </div>
          <Nav as='ul' id='channels-box' className='flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block'>
            {channels.data.map(renderChannels)}
          </Nav>
        </Col>
        <Col className='p-0 h-100'>
          {renderMassager()}
        </Col>
      </Row>
    </Container>
  );
}