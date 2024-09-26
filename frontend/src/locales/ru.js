/* eslint-disable import/no-anonymous-default-export */
export default {
  translation: {
    languages: {
      ru: 'Русский',
    },
    loginAndSignUp: {
      heading: 'Войти',
      headingSignUp: 'Регистрация',
      username: 'Ваш ник',
      usernameSignUp: 'Имя пользователя',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
      loginBtn: 'Войти',
      signupBtn: 'Зарегистрироваться',
      footerSpan: 'Нет аккаунта? ',
      linkSignUp: 'Регистрация',
      errors: {
        validation: {
          required: 'Обязательное поле',
          confirmPassword: 'Пароли должны совпадать',
          pasMinSumbols: 'Не менее 6 символов',
          nameSymbols: 'От 3 до 20 символов',
          wrongData: 'Неверные имя пользователя или пароль',
          status409: 'Такой пользователь уже существует',
        },
      },
    },
    navbar: {
      homeLink: 'Hexlet Chat',
      logOutBtn: 'Выйти',
    },
    homePage: {
      heading: 'Каналы',
      channelСontrolBtn: 'Управление каналом',
      loading: 'Загрузка',
      prefix: '#',
      remove: 'Удалить',
      rename: 'Переименовать',
      addChannelBtn: '+',
      messageCount: {
        keyWithCount_one: '{{count}} сообщение', // 1
        keyWithCount_few: '{{count}} сообщения', // для 2-4
        keyWithCount_many: '{{count}} сообщений', // для 5 и больше
        keyWithCount_other: '{{count}} сообщений', // 0, 5...
      },
      sendMessageBtn: 'Отправить',
    },
    notFoundPage: {
      header: '404 - Страница не найдена',
      body: 'Извините, страница, которую вы ищете, не существует.',
      btn: 'Вернуться на главную',
    },
    modal: {
      submitBtn: 'Отправить',
      cancelBtn: 'Отменить',
      name: 'Имя канала',
      add: {
        header: 'Добовить канал',
      },
      remove: {
        header: 'Удалить канал',
        body: 'Уверены?',
        submitBtn: 'Удалить',
      },
      rename: {
        header: 'Переименовать канал',
      },
      errors: {
        validation: {
          required: 'Обязательное поле',
          minMax: 'От 3 до 20 символов',
          unique: 'Должно быть уникальным',
        },
      },
    },
    toasts: {
      createChannel: 'Канал создан',
      removeChannel: 'Канал удалён',
      renameChannel: 'Канал переименован',
      fetchError: 'Ошибка сети',
      otherError: 'Ошибка в загрузке данных',
    },
  },
};
