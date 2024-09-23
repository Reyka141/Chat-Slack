import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import socket from '../socket';

import { getMessages, addMessage } from '../services/messagesApi.js';

export const MessageBox = ({ activeChannel }) => {
  const { data, isLoading, } = getMessages();
  const [messages, setMessages] = useState([]);
  const inputEl = useRef();
  const massagesContainer = useRef();
  const [sendMassage] = addMessage();

  const scrollToBottom = () => {
    if (massagesContainer.current) {
      massagesContainer.current.scrollTop = massagesContainer.current.scrollHeight;
    }
  };
  scrollToBottom();
  
  useEffect(() => {
    if (!isLoading) {
      inputEl.current.focus();
      scrollToBottom();
    }
  }, [activeChannel, isLoading]);

  useEffect(() => {
    if (data) {
      setMessages(data);
    }
    
  }, [data]);

  useEffect(() => {
    // Обработчик получения сообщений от сервера
    socket.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('newMessage');
    };
  }, []);

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    onSubmit: async ({ message }) => {
      const username = localStorage.getItem('username');
      const newMessage = { body: message, channelId: activeChannel.id, username };
      formik.values.message = '';
      inputEl.current.focus();
      sendMassage(newMessage);
    },
  });

  if (isLoading) {
    return <div>Загрузка</div>;
  }

  const messagesFromChannel =  messages.filter(({ channelId }) => channelId === activeChannel.id);
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
      <div id="messages-box" className='chat-messages overflow-auto px-5' ref={massagesContainer}>
        {messagesFromChannel.map(({ id, body, username }) => (
          <div key={id}  className='text-break mb-2'>
            <b>{username}</b>: {body}
          </div>
        ))}
      </div>
      <div className='mt-auto px-5 py-3'>
        <Form noValidate className='py-1 border rounded-2' onSubmit={formik.handleSubmit}>
          <Form.Group className='input-group has-validation'>
            <Form.Control 
              ref={inputEl}
              autoСomplete="off"
              type="input"
              placeholder="Введите сообщение..." 
              id="message"
              name="message"
              className='border-0 p-0 ps-2'
              onChange={formik.handleChange}
              value={formik.values.message}
            />
            <Button variant='group-vertical' disabled={!formik.values.message.trim()} type='submit' >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor"><path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"></path></svg>
              <span className='visually-hidden'>Отправить</span>
            </Button>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
};