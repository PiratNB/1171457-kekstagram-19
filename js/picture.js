'use strict';

/**
 * Модуль для отрисовки миниатюры
 */
(function () {

  // Шаблон для фотографии
  var pictureTemplate = document.querySelector('#picture ')
  .content
  .querySelector('.picture');


  // Интерфейс модуля
  window.picture = {
    renderPicture: renderPicture // Возвращает отрисованный узел с фотографиями согласно шаблона
  };

  /**
   * Обрабртка клика по превью
   * @param {Event} evt
   */
  function onPictureClick(evt) {
    // Показ большой фотографии
    if (evt.target.pictureObject) {
      // Эмуляция клика по картинке
      window.preview.showBigPicture(evt.target.pictureObject);

      return;
    }
    window.preview.showBigPicture(evt.target.parentNode.pictureObject);
  }

  /**
   * Возвращает отрисованный узел с фотографиями согласно шаблона
   * @param {Object} picture Объект Описание к фотографии
   * @return {Node}
   */
  function renderPicture(picture) {
    var pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length.toString();
    // закрепляем объект за элементом
    pictureElement.pictureObject = picture;
    // Добавляем обработчик клика по превью
    pictureElement.addEventListener('click', onPictureClick);

    return pictureElement;
  }

})();
