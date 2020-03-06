'use strict';

/**
 * Модуль, который создаёт данные
 */
(function () {
  // секция с фильтрами
  var filterSection = document.querySelector('.img-filters');
  // элемент фильтр по умолчанию
  var defaultFilter = filterSection.querySelector('#filter-default');
  // последний из запущенных таймеров
  var lastTimeout;
  // Форма со списком фильтров
  var filterForm = document.querySelector('.img-filters__form');
  // Текущий фильтр
  var currentFilter;

  // объект с обработчиками клика по фильтрам
  var filterClick = {
    'filter-default': showDefaultPictures,
    'filter-random': showRandomPictures,
    'filter-discussed': showDiscussedPictures
  };

  // Данные фотографий загруженные с сервера
  var picturesFromServer;

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
   * Обработка клика по фильтру
   * @param {Event} evt
   */
  function onFilterClick(evt) {
    // кликнутый элемент
    var clickedElement = evt.target;
    // если клик не по кнопке или по активному фильтру - выходим
    if (clickedElement.tagName !== 'BUTTON' || clickedElement.classList.contains('img-filters__button--active')) {
      return;
    }

    // убираем активность с текущего фильтра
    currentFilter.classList.remove('img-filters__button--active');
    // делаем активным кликнутый
    clickedElement.classList.add('img-filters__button--active');
    // переназначаем текущий фильтр
    currentFilter = clickedElement;

    // сбрасываем таймер при необходимости
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }

    // выставляем новый таймер
    lastTimeout = window.setTimeout(function () {
      // фильтруем фотографии
      filterClick[clickedElement.id]();
    }, window.settings.DEBOUNCE_INTERVAL);
  }

  /**
   * Загрузка случайных фотографий
   */
  function showRandomPictures() {
    // копируем оригинал
    var copiedPictures = picturesFromServer.slice();
    // массив с случайными фотограциями
    var randomPictures = [];

    // отбираем случайные фотографии
    for (var i = 0; i < window.settings.RANDOM_FILTER_COUNT; i++) {
      randomPictures.push(window.utils.getRandomArraysElement(copiedPictures, true));
    }

    window.gallery.renderPictures(randomPictures);
  }

  /**
   * Загрузка обсуждаемых фотографий
   */
  function showDiscussedPictures() {
    // копируем оригинал
    var copiedPictures = picturesFromServer.slice();
    // сортируем по количеству комментариев
    copiedPictures.sort(function (left, right) {
      return right.comments.length - left.comments.length;
    });

    window.gallery.renderPictures(copiedPictures);
  }

  /**
   * Загрузка всех фотографий с сервера
   */
  function showDefaultPictures() {
    // отрисовываем фотографии с сервера
    window.gallery.renderPictures(picturesFromServer);
  }

  /**
   * Обработка успешного события загрузки данных с сервера
   * @param {Array} picturesData Массив магов с сервера
   */
  function onSuccessLoadData(picturesData) {
    // нативные данные с сервера
    picturesFromServer = picturesData;

    // показываем фильтры
    filterSection.classList.remove('img-filters--inactive');
    // навешиваем обработчики клика, нажатия по фильтрам
    filterForm.addEventListener('click', onFilterClick);

    // Отрисовка всех фотографий с сервера
    currentFilter = defaultFilter;
    showDefaultPictures();
  }

  /**
   * Обработка ошибочного события загрузки данных с сервера
   * @param {String} errorMessage Сообщение об ошибке при загрузке данных с сервера
   */
  function onErrorLoadData(errorMessage) {
    onErrorHandler(errorMessage);
  }

  // Загрузка данных с сервера
  window.backend.load(window.settings.DATA_URL, onSuccessLoadData, onErrorLoadData);

})();
