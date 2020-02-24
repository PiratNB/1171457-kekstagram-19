'use strict';

/**
 * Модуль для управлениея сдайдером насыщенности фильтра
 */
(function () {
  // Слайдер насыщености эффекта
  var effectLevelPin = document.querySelector('.effect-level__pin');

  /**
   * Обработка нажатия кнопки мыши на слайдер
   * @param {Event} evt
   */
  function onSliderMouseDown(evt) {
    evt.preventDefault();
    // Координата на начало движения мышки
    var startCoordX = evt.clientX;
    // Смещение слайдера относительно родителя
    var currentOffsetX = evt.target.offsetLeft;
    // Ширина родителя
    var parentWidth = evt.target.parentElement.offsetWidth;

    /**
     * Обработчик отпускания кнопки мыши на слайдере
     * @param {Event} upEvt
     */
    function onSliderMouseUp(upEvt) {
      upEvt.preventDefault();
      // Удаляем обработчики
      document.removeEventListener('mousemove', onSliderMouseMove);
      document.removeEventListener('mouseup', onSliderMouseUp);
    }

    /**
     * // Обработчик события передвижения мыши
     * @param {Event} moveEvt
     */
    function onSliderMouseMove(moveEvt) {
      moveEvt.preventDefault();
      // Новая позиция слайдера
      var newSliderPosition;
      // Разница в координатах по X
      var diffX = moveEvt.clientX - startCoordX;
      // вычисление новой позиции слайдера с учетом границ родителя
      if (diffX > 0) {
        newSliderPosition = (currentOffsetX + Math.min(parentWidth - currentOffsetX, diffX)) / parentWidth;
      } else {
        newSliderPosition = (currentOffsetX - Math.min(currentOffsetX, -diffX)) / parentWidth;
      }

      // Установка нового значения насыщенности фильтра
      window.form.setFilterValue(newSliderPosition);
    }

    // Добавим обработчики события передвижения мыши и отпускания кнопки мыши
    document.addEventListener('mousemove', onSliderMouseMove);
    document.addEventListener('mouseup', onSliderMouseUp);
  }


  // Добавляем обработчик нажатия кнопки мыши на слайдер
  effectLevelPin.addEventListener('mousedown', onSliderMouseDown);

})();
