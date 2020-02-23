'use strict';

/**
 * Модуль, который создаёт данные
 */
(function () {

  // массив объектов фотографий
  var photoDescriptions = getPhotoDescriptions(window.settings.PHOTO_COUNT);

  // Интерфейс модуля
  window.data = {
    photoDescriptions: photoDescriptions // массив объектов фотографий
  };

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
})();
