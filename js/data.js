'use strict';

/**
 * Модуль, который создаёт данные
 */
(function () {

  /**
   * Возвращает случайное сообщение
   * @param {number} minMessageCount Минимальное кол-во сообщений (по умолчанию - 1)
   * @param {number} maxMessageCount Максимальное кол-во сообщений (по умолчанию - 2)
   * @return {string}
   */
  function getCommentMessage(minMessageCount, maxMessageCount) {
    minMessageCount = minMessageCount || 1;
    maxMessageCount = maxMessageCount || 2;
    // Число сообщениий
    var messageCount = minMessageCount + Math.floor(Math.random() * maxMessageCount);
    // Возвращаемое сообщение
    var message = [];

    for (var k = 1; k <= messageCount; k++) {
      message.push(window.utils.getRandomArraysElement(window.settings.commentMessages, false));
    }

    return message.join(' ');
  }

  /**
   * Возвращает массив объектов комментариев
   * @return {Array}
   */
  function getComments() {
    var comments = [];
    var commentsCount = Math.floor(Math.random() * window.settings.MAX_COMMENTS_COUNT);
    for (var j = 0; j < commentsCount; j++) {
      var comment = {};
      // Аватарка автора комментрия
      comment.avatar = 'img/avatar-' + Math.floor(Math.random() * window.settings.COMMENTATORS_AVATAR_COUNT + 1) + '.svg';
      // Сообщение коментатора
      comment.message = getCommentMessage(1, 2);
      // Имя комментатора
      comment.name = window.utils.getRandomArraysElement(window.settings.commentsNames, false);
      comments.push(comment);
    }

    return comments;
  }

  /**
   * Возвращает объект описания фотографии
   * @param {Array} indexes Массив с индексами фотографий
   * @param {Number} minLikesCount Минимальное кол-во лайков
   * @param {Number} maxLikesCount Максимальное кол-во лайков
   * @return {{comments: Array, description: string, url: string, likes: number}}
   */
  function getRandomPhotoDescription(indexes, minLikesCount, maxLikesCount) {
    return {
      // путь к фотографии
      url: 'photos/' + window.utils.getRandomArraysElement(indexes, true) + '.jpg',
      // Описание фотографии
      description: 'Здесь должно быть описание фотографии',
      // Кол-во лайков
      likes: minLikesCount + Math.floor(Math.random() * (maxLikesCount - minLikesCount)),
      // Массив объектов комментариев
      comments: getComments()
    };
  }

  /**
   * Возвращает массив объектов с описаниями фотографий
   * @param {number} photoCount кол-во фотографий
   * @return {Array}
   */
  function getPhotoDescriptions(photoCount) {
    // Массив индексов для заполнения случайными данными
    // Заполнение массива индексов и возвращаемый массив описаний фотографий
    var returnArray = [];
    var indexes = [];
    for (var i = 1; i <= photoCount; i++) {
      indexes.push(i);
      returnArray.push(getRandomPhotoDescription(indexes, window.settings.MIN_LIKES_COUNT, window.settings.MAX_LIKES_COUNT));
    }

    return returnArray;
  }
  /**
   * Обработка сообщения об ошибке при общении с сервером  ---> Временная заглушка
   * @param {string} errorMessage сообщение об ошибке
   */
  function onErrorHandler(errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';
    node.className = 'xhr-error-message';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  }

  /**
   * Обработка успешного события загрузки данных с сервера
   * @param {Array} picturesData Массив магов с сервера
   */
  function onSuccessLoadData(picturesData) {
    window.gallery.renderPictures(picturesData);
  }

  /**
   * Обработка ошибочного события загрузки данных с сервера
   * @param {String} errorMessage Сообщение об ошибке при загрузке данных с сервера
   */
  function onErrorLoadData(errorMessage) {
    onErrorHandler(errorMessage);

    return;
  }


  if (window.settings.IS_USE_ONLINE_DATA) {
    // Загрузка данных с сервера
    window.backend.load(window.settings.DATA_URL, onSuccessLoadData, onErrorLoadData);

    return;
  }
  window.gallery.renderPictures(getPhotoDescriptions(window.settings.PHOTO_COUNT));
})();
