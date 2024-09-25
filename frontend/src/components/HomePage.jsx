import React, { useState, useEffect, useRef} from 'react';
import { Button, Container, Row, Col, Nav, Dropdown, ButtonGroup  } from 'react-bootstrap';
import update from 'immutability-helper';
import { useTranslation } from 'react-i18next';

import { getChannels } from '../services/channelsApi.js';
import { MessageBox } from './MessageBox.jsx'
import getModal from '../modals/index.js';
import socket from '../socket';

const renderModal = ({ modalInfo, hideModal, channels, setActiveChannel }) => {
  if (!modalInfo.type) {
    return null;
  }
  const Component = getModal(modalInfo.type);
  return <Component modalInfo={modalInfo} onHide={hideModal} channels={channels} setActiveChannel={setActiveChannel} />;
};

const defaultChannel = { id: '1', name: 'general' };

export const HomePage = () => {
  const [activeChannel, setActiveChannel] = useState(defaultChannel);
  const [channels, setChannels] = useState([]);
  const { data, isLoading } = getChannels();
  const [modalInfo, setModalInfo] = useState({ type: null, item: null });
  const hideModal = () => setModalInfo({ type: null, item: null });
  const showModal = (type, item = null) => setModalInfo({ type, item });
  const lastCreatChannel = useRef();
  const { t } = useTranslation();

  const scrollToBottom = () => {
    lastCreatChannel.current?.scrollIntoView();
  };

  useEffect(() => {
    if (data) {
      setChannels(data);
    }
  }, [data]);

  useEffect(() => {
    const itemIndex = channels.findIndex(({ id }) => id === activeChannel.id);
    if (itemIndex === -1) {
      setActiveChannel(defaultChannel);
    }
    if (channels[channels.length - 1]?.id === activeChannel.id) {
      scrollToBottom();
    }
    
  }, [channels, activeChannel]);

  useEffect(() => {
    // Обработчик получения сообщений от сервера
    socket.on('newChannel', (message) => {
      setChannels((prevMessages) => [...prevMessages, message]);
    });

    socket.on('removeChannel', (message) => {
      setChannels((prevMessages) => prevMessages.filter(({ id }) => id !== message.id )); 
    });

    socket.on('renameChannel', (message) => {
      const { id } = message;
      setChannels((prevChannels) => {
        const index = prevChannels.findIndex((channel) => id.toString() === channel.id);
        if (index !== -1) {
          return update(prevChannels, { [index]: { $set: message } });
        }
        return prevChannels;
      });
    });

    return () => {
      socket.off('newChannel');
      socket.off('removeChannel');
      socket.off('renameChannel');
    };
  }, []);
  
  if (isLoading) {
    return <div>{t('homePage.loading')}</div>;
  }
  const renderChannels = ({ id, name, removable }, index, array) => {
    if (removable) {
      return (
        <Nav.Item as="li" key={id} className='w-100'>
          <Dropdown as={ButtonGroup} className='d-flex'>
            <Button variant={id === activeChannel.id ? 'secondary' : ''} className='w-100 rounded-0 text-start text-truncate' onClick={() => setActiveChannel({ id, name })}>
              {index === array.length - 1 ? <span className='me-1' ref={lastCreatChannel}>{t('homePage.prefix')}</span> : <span className='me-1'>{t('homePage.prefix')}</span>}
              {name}
            </Button>
            <Dropdown.Toggle split as='button' type='button' className='flex-grow-0 btn' id="dropdown-custom-2" />
            <Dropdown.Menu className="">
              <Dropdown.Item onClick={() => showModal('removing', id)}>{t('homePage.remove')}</Dropdown.Item>
              <Dropdown.Item onClick={() => showModal('renaming', id)}>{t('homePage.rename')}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav.Item>
      );
    }
    return (
      <Nav.Item as="li" key={id} className='w-100'>
        <Button variant={id === activeChannel.id ? 'secondary' : ''} className='w-100 rounded-0 text-start' onClick={() => setActiveChannel({ id, name })}>
          <span className='me-1'>{t('homePage.prefix')}</span>
          {name}
        </Button>
      </Nav.Item>
    );
  };
    

  return (
    <Container className='h-100 my-4 shadow rounded overflow-hidden'>
      <Row className='h-100 bg-white flex-md-row'>
        <Col bsPrefix='col-4' className='col-md-2 border-end px-0 bg-light flex-column h-100 d-flex'>
          <div className='d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4'>
            <b>{t('homePage.heading')}</b>
            <Button variant="group-vertical" className='p-0 text-primary' onClick={() => showModal('adding')}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
              </svg>
              <span className='visually-hidden'>{t('homePage.addChannelBtn')}</span>
            </Button>
            {renderModal({ modalInfo, hideModal, channels, setActiveChannel })}
          </div>
          <Nav as='ul' id='channels-box' className='flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block'>
            {channels.map(renderChannels)}
          </Nav>
        </Col>
        <Col className='p-0 h-100'>
          <MessageBox activeChannel={activeChannel} channels={channels} />
        </Col>
      </Row>
    </Container>
  );
}