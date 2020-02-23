'use strict';

/**
 * Модуль с независимыми вспомогательными функциями
 */
(function () {
// Названия клавиш
  var ESC_KEY = 'Escape';
  var ENTER_KEY = 'Enter';

  // Интерфейс модуля
  window.utils = {
    visibleToggle: visibleToggle, // Включение и выключение видимости элемента (класс hidden)
    getRandomArraysElement: getRandomArraysElement, // Возвращает случайный элемент массива
    processEscAction: processEscAction, // Запуск колл-бэка при нажатии Esc
    processEnterAction: processEnterAction // Запуск колл-бэка при нажатии Enter
  };

  /**
   * Включение и выключение видимости элемента
   * @param {Element} element элемент для которого переключается видимость
   * @param {boolean} isVisible Признак видимости элемента
   */
  function visibleToggle(element, isVisible) {
    if (isVisible) {
      element.classList.remove('hidden');
    } else {
      element.classList.add('hidden');
    }
  }

  /**
   * Возвращает случайный элемент массива
   * @param {Array} array Входной массив
   * @param {boolean} doRemove Удалить или нет элемент массива, по умолчанию false
   * @return {*} случайный элемент массива
   */
  function getRandomArraysElement(array, doRemove) {
    doRemove = typeof doRemove !== 'undefined' ? doRemove : false;
    var index = Math.floor(Math.random() * array.length);
    var returnElement = array[index];
    if (doRemove) {
      array.splice(index, 1);
    }

    return returnElement;
  }


  /**
   * Запускает колбэк-фунцию если нажата клавиша Esc
   * @param {Event} evt событие
   * @param {Function} action Колбэк-фунция
   */
  function processEscAction(evt, action) {
    if (evt.key === ESC_KEY) {
      action();
    }
  }

  /**
   * Запускает колбэк-фунцию если нажата клавиша Enter
   * @param {Event} evt событие
   * @param {Function} action Колбэк-фунция
   * @param {Boolean} isPreventDefault Если True - отменять действия по умодчанию
   */
  function processEnterAction(evt, action, isPreventDefault) {
    if (evt.key === ENTER_KEY) {
      if (isPreventDefault) {
        evt.preventDefault();
      }
      action();
    }
  }

})();
