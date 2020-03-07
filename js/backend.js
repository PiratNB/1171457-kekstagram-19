'use strict';

(function () {

  var HTTP_OK = 200;
  var HTTP_BAD_REQUEST = 400;
  var HTTP_UNAUTHORIZED = 401;
  var HTTP_NOT_FOUND = 404;
  // Интерфейс модуля
  window.backend = {
    load: load, // Загрузка данных
    save: save // Сохранение данных
  };

  function getXhr(onSuccess, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    // Обработчик окончания загрузки
    xhr.addEventListener('load', function () {
      // для хранения текста ошибки при ее возникновении
      var error;
      switch (xhr.status) {
        case HTTP_OK:
          onSuccess(xhr.response);
          break;

        case HTTP_BAD_REQUEST:
          error = 'Неверный запрос';
          break;
        case HTTP_UNAUTHORIZED:
          error = 'Пользователь не авторизован';
          break;
        case HTTP_NOT_FOUND:
          error = 'Ничего не найдено';
          break;

        default:
          error = 'Статус ответа: : ' + xhr.status + ' ' + xhr.statusText;
      }
      if (error) {
        onError(error);
      }
    });

    // Обработчик при ошибке соединения
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    // Обработчик превышения таймаута
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    // Выставляем таймаут
    xhr.timeout = window.settings.XHR_TIMEOUT;

    return xhr;
  }

  function load(url, onSuccess, onError) {
    // Получаем объект XMLHttpRequest
    var xhr = getXhr(onSuccess, onError);

    // Получаем данные
    xhr.open('GET', url);
    xhr.send();
  }

  function save(url, data, onSuccess, onError) {
    // Получаем объект XMLHttpRequest
    var xhr = getXhr(onSuccess, onError);

    // Отсылаем данные
    xhr.open('POST', url);
    xhr.send(data);
  }

})();
