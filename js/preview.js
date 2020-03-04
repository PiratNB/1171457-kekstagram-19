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
    // Закрытие окна по Enter на элементе
    if (evt.target === pictureCancel) {
      window.utils.processEnterAction(evt, closeBigPicture);
    }
  }

  /**
   * Скрытие окна с большой фотографией
   */
  function closeBigPicture() {
    window.utils.visibleToggle(bigPicture, false);
    // Удаляем обработчики
    document.removeEventListener('keydown', onBigPictureKeyDown);
    pictureCancel.removeEventListener('click', closeBigPicture);
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
    // Убираем прокрутку контейнера фотографий позади при скролле
    document.body.classList.add('modal-open');

    // Добаляем обработчик нажатия клавиш при открытом диалоге большой картинки
    document.addEventListener('keydown', onBigPictureKeyDown);
    // Добавляем обработчик клика по кнопке закрытия
    pictureCancel.addEventListener('click', closeBigPicture);
    // Разделяем описания картинок от хэштэгов
    var descriptionPart = photoDescription.description.match(/(?:[^#])*/);
    // Заменяем информацию для выбранной фотографии
    // url фотографии
    bigPicture.querySelector('img').src = photoDescription.url;
    // альтернативное описание фотографии
    bigPicture.querySelector('img').alt = descriptionPart;
    // Кол-во лайков
    bigPicture.querySelector('.likes-count').textContent = photoDescription.likes;
    // Кол-во комментариев
    bigPicture.querySelector('.comments-count').textContent = photoDescription.comments.length.toString();
    // Описание фоторафии
    bigPicture.querySelector('.social__caption').textContent = descriptionPart;
    // Сохраняем ссылку на массив комментариев
    bigPicture.comments = photoDescription.comments;

    // Список с коментариями
    var socialComments = bigPicture.querySelector('.social__comments');
    if (socialComments) {
      // Очистка предыдущих комментариев
      while (socialComments.firstChild) {
        socialComments.removeChild(socialComments.firstChild);
      }

      // показываем блок комментариев
      showComments();
    }
  }
  function showComments() {
    // Список с коментариями
    var socialComments = bigPicture.querySelector('.social__comments');
    // Массив комментариев
    var comments = bigPicture.comments;
    // Текущее количество показанных комментариев
    var currentShowedComments = socialComments.childElementCount;
    // массив с новыми комментариями для показа
    var newCommentsForShow = comments.slice(currentShowedComments, currentShowedComments + window.settings.LOAD_COMMENTS_COUNT);
    // Контейнер для отображения прогресса показанных комментариев
    var progressContainer = bigPicture.querySelector('.social__comment-count');
    // Создаем текстовый узел с прогресом отображения комментариев
    var progressCommentsContent = document.createTextNode((currentShowedComments + newCommentsForShow.length) + ' из ');
    // заменяем содержимое предыдущего состояния прогресса
    progressContainer.replaceChild(progressCommentsContent, progressContainer.childNodes[0]);

    // Фрагмент для вставки
    var fragment = document.createDocumentFragment();
    // Генерация комментариев
    for (var li = 0; li < newCommentsForShow.length; li++) {
      fragment.appendChild(renderComment(socialComments, newCommentsForShow[li]));
    }

    // Вставляем блок с комментариями
    socialComments.appendChild(fragment);

    // управление видимостью кнопки загрузки новых комментариев
    window.utils.visibleToggle(document.querySelector('.comments-loader'),
        currentShowedComments + newCommentsForShow.length < comments.length);
  }

  // Добавляем обработчик клика по кнопке загрузки новых комментариев
  document.querySelector('.comments-loader').addEventListener('click', showComments);

})();
