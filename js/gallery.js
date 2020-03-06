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

    photoDescriptionsArray.forEach(function (item) {
      fragment.appendChild(window.picture.render(item));
    });

    // Очистка предыдущего набора фотографий
    var pictures = document.querySelector('.pictures');
    var currentPictures = pictures.querySelectorAll('.picture');
    // удаляем предыдущий набор
    currentPictures.forEach(function (value) {
      value.remove();
    });

    // Вставляем фотографии
    pictures.appendChild(fragment);
  }

})();
