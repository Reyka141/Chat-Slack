import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import filter from 'leo-profanity';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMessagesQuery, useAddMessageMutation } from '../services/messagesApi';
import Spiner from './Spiner.jsx';
import { actions as messagesActions, selector as messagesSelector } from '../services/messagesSlice.js';

const MessageBox = ({ activeChannel, channels }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    data, isLoading, refetch, error,
  } = useGetMessagesQuery();
  const inputEl = useRef();
  const messagesEndRef = useRef();
  const [sendMessage] = useAddMessageMutation();
  const messages = useSelector((state) => messagesSelector.selectAll(state));
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };
  useEffect(() => {
    if (error) {
      switch (error.status) {
        case 'FETCH_ERROR':
          toast.error(t('toasts.fetchError'));
          break;
        default:
          toast.error(t('toasts.otherError'));
      }
    }
  }, [error, t]);

  useEffect(() => {
    if (data) {
      dispatch(messagesActions.addMessages(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    refetch();
  }, [channels, refetch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChannel]);

  useEffect(() => {
    if (!isLoading) {
      inputEl.current.focus();
    }
  }, [activeChannel, isLoading]);

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    onSubmit: async ({ message }) => {
      const username = localStorage.getItem('username');
      const newMessage = { body: message, channelId: activeChannel.id, username };
      formik.values.message = '';
      inputEl.current.focus();
      sendMessage(newMessage);
    },
  });

  if (isLoading) {
    return <Spiner />;
  }

  const messagesFromChannel = messages.filter(({ channelId }) => channelId === activeChannel.id);
  const countMessage = messagesFromChannel.length;

  return (
    <div className="d-flex flex-column h-100">
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0">
          <b>{`# ${filter.clean(activeChannel.name)}`}</b>
        </p>
        <span className="text-muted">
          {t('homePage.messageCount.keyWithCount', { count: countMessage })}
        </span>
      </div>
      <div id="messages-box" className="chat-messages overflow-auto px-5">
        {messagesFromChannel.map(({ id, body, username }, index, array) => {
          if (index === array.length - 1) {
            return (
              <div key={id} className="text-break mb-2" ref={messagesEndRef}>
                <b>{username}</b>
                :
                {filter.clean(body)}
              </div>
            );
          }
          return (
            <div key={id} className="text-break mb-2">
              <b>{username}</b>
              :
              {filter.clean(body)}
            </div>
          );
        })}
      </div>
      <div className="mt-auto px-5 py-3">
        <Form noValidate className="py-1 border rounded-2" onSubmit={formik.handleSubmit}>
          <Form.Group className="input-group has-validation">
            <Form.Control
              ref={inputEl}
              autoComplete="off"
              type="input"
              aria-label={t('homePage.inputLabel')}
              placeholder={t('homePage.inputMessage')}
              id="message"
              name="message"
              className="border-0 p-0 ps-2"
              onChange={formik.handleChange}
              value={formik.values.message}
            />
            <Button variant="group-vertical" disabled={!formik.values.message.trim()} type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor"><path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" /></svg>
              <span className="visually-hidden">{t('homePage.sendMessageBtn')}</span>
            </Button>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
};

export default MessageBox;
