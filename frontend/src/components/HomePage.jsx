import React, { useState } from 'react';
import { Button, Container, Row, Col, Nav } from 'react-bootstrap';

import { getChannels, addChannel, removeChannel } from '../services/channelsApi.js';

import { MessageBox } from './MessageBox.jsx'

export const HomePage = () => {
  const [activeChannel, setActiveChannel] = useState({ id: '1', name: 'general' });
  const { data, error, isLoading, refetch } = getChannels();
  const [remove] = removeChannel();
  const [sendTask] = addChannel();

  
  if (isLoading) {
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
            {data.map(renderChannels)}
          </Nav>
        </Col>
        <Col className='p-0 h-100'>
          <MessageBox activeChannel={activeChannel} />
        </Col>
      </Row>
    </Container>
  );
}