'use strict';

(function () {

  var XHR_TIMEOUT = 10000;
  var OK = 200;
  var BAD_REQUEST = 400;
  var UNAUTHORIZED = 401;
  var NOT_FOUND = 404;

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
        case OK:
          onSuccess(xhr.response);
          break;
        case BAD_REQUEST:
          error = 'Неверный запрос';
          break;
        case UNAUTHORIZED:
          error = 'Пользователь не авторизован';
          break;
        case NOT_FOUND:
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

    // Обработчик при превышении таймаута
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    // Выставляем таймаут
    xhr.timeout = XHR_TIMEOUT;

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
