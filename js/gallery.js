'use strict';

/**
 * Модуль, который работает с галереей изображений
 */
(function () {

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
    // Вставляем фотографии
    document.querySelector('.pictures').appendChild(fragment);
  }
  // Отрисовка массива описаний фотографий
  renderPictures(window.data.photoDescriptions);
})();
