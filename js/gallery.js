'use strict';

/**
 * Модуль, который работает с галереей изображений
 */
(function () {

  // Интерфейс модуля
  window.gallery = {
    renderPictures: renderPictures // Отрисовка всех фотографий
  };

  /**
   * Отрисовка всех фотографий
   * @param {Array} photoDescriptionsArray массив объектов с описанием фотографий
   */
  function renderPictures(photoDescriptionsArray) {
    // Фрагмент для вставки
    var fragment = document.createDocumentFragment();

    photoDescriptionsArray.forEach(function (photo) {
      fragment.appendChild(window.picture.renderPicture(photo));
    });

    // Очистка предыдущего набора фотографий
    var pictures = document.querySelector('.pictures');
    var currentPictures = pictures.querySelectorAll('.picture');
    // удаляем предыдущий набор
    currentPictures.forEach(function (value) {
      value.remove();
    });

    // Вставляем фотографии
    document.querySelector('.pictures').appendChild(fragment);
  }

})();
