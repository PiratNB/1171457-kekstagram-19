'use strict';

/**
 * Модуль с настройками для проекта (общие константы, переменные...)
 */
(function () {
  // Эффект по умолчанию
  var DEFAULT_EFFECT = 'effect-none';
  // Масштаб по умолчанию
  var DEFAULT_SCALE = 100;
  // Шаг изменения масштаба
  var SCALE_STEP = 25;
  // Минимальный масштаб
  var MIN_SCALE = 25;
  // Максимальный масштаб
  var MAX_SCALE = 100;
  // Максимальная длина хэштэга
  var MAX_HASHTAG_LENGTH = 20;
  // Максимальное количество хэштэгов
  var MAX_HASHTAG_COUNT = 5;
  // Максимальная длина описания
  var MAX_DESCRIPTION_LENGTH = 140;
  // Количество фотографий для случайного фильтра
  var RANDOM_FILTER_COUNT = 10;
  // Таймаут для устранения дребезга
  var DEBOUNCE_INTERVAL = 500;
  // Размер порции комментариев
  var LOAD_COMMENTS_COUNT = 5;
  // Ссылка на отправку формы
  var FORM_UPLOAD_IMAGE_ACTION = 'https://js.dump.academy/kekstagram';
  // URL для загрузки данных с сервера
  var DATA_URL = 'https://js.dump.academy/kekstagram/data';
  // URL для отправки данных формы
  var FORM_SEND_URL = 'https://js.dump.academy/kekstagram';
  // Ширина картинки для аватара
  var AVATAR_IMAGE_WIDTH = 35;
  // Высота картинки для аватара
  var AVATAR_IMAGE_HEIGHT = 35;
  // Слайдер насыщености эффекта
  var effectLevelPin = document.querySelector('.effect-level__pin');

  // Тексты сообщений комментариев
  var commentMessages = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];
  // Имена коментаторов
  var names = [
    'Иван',
    'Хуан Себастьян',
    'Мария',
    'Кристоф',
    'Виктор',
    'Юлия',
    'Люпита',
    'Вашингтон',
    'да Марья',
    'Верон',
    'Мирабелла',
    'Вальц',
    'Онопко',
    'Топольницкая',
    'Нионго',
    'Ирвинг'
  ];

  // Поддерживаемые типы файлов аватарок
  var FILE_TYPES = [
    'gif',
    'jpg',
    'jpeg',
    'png'
  ];

  // Интерфейс модуля
  window.settings = {
    DEFAULT_EFFECT: DEFAULT_EFFECT, // Эффект по умолчанию
    DEFAULT_SCALE: DEFAULT_SCALE, // Масштаб по умолчанию
    SCALE_STEP: SCALE_STEP, // Шаг изменения масштаба
    MIN_SCALE: MIN_SCALE, // Минимальный масштаб
    MAX_SCALE: MAX_SCALE, // Максимальный масштаб
    MAX_HASHTAG_LENGTH: MAX_HASHTAG_LENGTH, // Максимальная длина хэштэга
    MAX_HASHTAG_COUNT: MAX_HASHTAG_COUNT, // Максимальное количество хэштэгов
    MAX_DESCRIPTION_LENGTH: MAX_DESCRIPTION_LENGTH, // Максимальная длина описания
    FORM_UPLOAD_IMAGE_ACTION: FORM_UPLOAD_IMAGE_ACTION, // Ссылка на отправку формы
    RANDOM_FILTER_COUNT: RANDOM_FILTER_COUNT, // Количество фотографий для случайного фильтра
    DEBOUNCE_INTERVAL: DEBOUNCE_INTERVAL, // Таймаут для устранения дребезга
    DATA_URL: DATA_URL, // URL для загрузки данных с сервера
    FORM_SEND_URL: FORM_SEND_URL, // URL для отправки данных формы
    LOAD_COMMENTS_COUNT: LOAD_COMMENTS_COUNT, // Размер порции комментариев
    FILE_TYPES: FILE_TYPES, // Поддерживаемые типы файлов аватарок
    AVATAR_IMAGE_WIDTH: AVATAR_IMAGE_WIDTH, // Ширина картинки для аватара
    AVATAR_IMAGE_HEIGHT: AVATAR_IMAGE_HEIGHT, // Высота картинки для аватара
    effectLevelPin: effectLevelPin, // Слайдер насыщености эффекта
    commentMessages: commentMessages, // Тексты сообщений комментариев
    commentsNames: names // Имена коментаторов
  };
})();
