'use strict';

/**
 * Модуль для отрисовки увеличенного изображения
 */
(function () {
  // Кнопка закрытия большой картинки
  var pictureCancel = document.querySelector('#picture-cancel');
  // Контейнер для отрисовки полноэкранной фотографии и инфомации о ней
  var bigPicture = document.querySelector('.big-picture');

  // Интерфейс модуля
  window.preview = {
    showBigPicture: showBigPicture // Показывает полноэкранную фотографию на основе объекта Описание фотографии
  };

  /**
   * Обработчик нажатия клавиш для большой картинки
   * @param {KeyboardEvent} evt
   */
  function onBigPictureKeyDown(evt) {
    // Закрытие окна по Esc
    window.utils.processEscAction(evt, closeBigPicture);
    if (evt.target === pictureCancel) {
      window.utils.processEnterAction(evt, closeBigPicture);
    }
  }

  /**
   * Обработчик клика на кнопку закрытия окна для большой картинки
   */
  function onCloseBigPictureClick() {
    closeBigPicture();
  }

  /**
   * Скрытие окна с большой фотографией
   */
  function closeBigPicture() {
    window.utils.visibleToggle(bigPicture, false);
    // Удаляем обработчики
    document.removeEventListener('keydown', onBigPictureKeyDown);
    pictureCancel.removeEventListener('click', onCloseBigPictureClick);
    // Добавляем прокрутку контейнера фотографий позади при скролле
    document.body.classList.remove('modal-open');
  }

  /**
   * Возвращает отрисованный комментарий
   * @param {Element} list Список-контейнер для комментариев
   * @param {Object} comment Объект с данными о коментарии
   * @return {HTMLLIElement} член списка с комментарием
   */
  function renderComment(list, comment) {
    // член списка с комментарием
    var socialComment = document.createElement('li');
    socialComment.classList.add('social__comment');
    // Аватар коментатора
    var socialPicture = document.createElement('img');
    socialPicture.classList.add('social__picture');
    socialPicture.src = comment.avatar;
    socialPicture.alt = comment.name;
    socialPicture.width = 35;
    socialPicture.height = 35;
    socialComment.appendChild(socialPicture);
    // Текст комментария
    var socialText = document.createElement('p');
    socialText.classList.add('social__text');
    socialText.textContent = comment.message;
    socialComment.appendChild(socialText);

    return socialComment;
  }

  /**
   * Показывает полноэкранную фотографию на основе объекта Описание фотографии
   * @param {Object} photoDescription Объект с данными о фотографии
   */
  function showBigPicture(photoDescription) {
    // Показываем контейнер для полноэкранной фотографии
    window.utils.visibleToggle(bigPicture, true);
    // Выключаем видимость счетчика коментариев
    window.utils.visibleToggle(document.querySelector('.social__comment-count'), false);
    // Выключаем видимость кнопки загрузки новых комментариев
    window.utils.visibleToggle(document.querySelector('.comments-loader'), false);
    // Убираем прокрутку контейнера фотографий позади при скролле
    document.body.classList.add('modal-open');

    // Добаляем обработчик нажатия клавиш при открытом диалоге большой картинки
    document.addEventListener('keydown', onBigPictureKeyDown);
    // Добавляем обработчик клика по кнопке закрытия
    pictureCancel.addEventListener('click', onCloseBigPictureClick);

    // Заменяем информацию для выбранной фотографии
    // url фотографии
    bigPicture.querySelector('img').src = photoDescription.url;
    // Кол-во лайков
    bigPicture.querySelector('.likes-count').textContent = photoDescription.likes;
    // Кол-во комментариев
    bigPicture.querySelector('.comments-count').textContent = photoDescription.comments.length.toString();
    // Описание фоторафии
    bigPicture.querySelector('.social__caption').textContent = photoDescription.description;

    // Список с коментариями
    var socialComments = bigPicture.querySelector('.social__comments');
    if (socialComments) {
      // Очистка предыдущих комментариев
      while (socialComments.firstChild) {
        socialComments.removeChild(socialComments.firstChild);
      }
      // Фрагмент для вставки
      var fragment = document.createDocumentFragment();
      // Генерация комментариев
      photoDescription.comments.forEach(function (comment) {
        fragment.appendChild(renderComment(socialComments, comment));
      });

      socialComments.appendChild(fragment);
    }
  }

})();
