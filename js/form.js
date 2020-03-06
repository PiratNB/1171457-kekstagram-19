'use strict';

/**
 * модуль, который работает с формой редактирования изображения
 */
(function () {
  // Форма загрузки и обработки картинки
  var formUploadImage = document.querySelector('#upload-select-image');
  // Контрол для загрузгки картинки пользователя
  var uploadFileInput = document.querySelector('#upload-file');
  // Контейнер для изображения
  var imgUploadOverlay = document.querySelector('.img-upload__overlay');
  // Кнопка для закрытия окна настроек
  var imgUploadCancel = imgUploadOverlay.querySelector('.img-upload__cancel');
  // Список фильтров
  var effectList = imgUploadOverlay.querySelector('.effects__list');
  // кнопка уменьшения масштаба
  var scaleControlSmaller = imgUploadOverlay.querySelector('.scale__control--smaller');
  // кнопка увеличения масштаба
  var scaleControlBigger = imgUploadOverlay.querySelector('.scale__control--bigger');
  // Контрол для ввода хэштэгов
  var textHashtags = imgUploadOverlay.querySelector('.text__hashtags');
  // Контрол для ввода описания картинки
  var textDescription = imgUploadOverlay.querySelector('.text__description');
  // поле для хранения значения масштаба
  var scaleControlValue = imgUploadOverlay.querySelector('.scale__control--value');
  // Картинка предварительного просмотра
  var imgUploadPreview = document.querySelector('.img-upload__preview');
  // Каринка для отрисовки
  var imgElement = imgUploadPreview.querySelector('IMG');

  // филдсет со сладером эффектов
  var fieldSetEffectLevel = imgUploadOverlay.querySelector('.effect-level');
  // Прогрессбар слайдера
  var effectLevelDepth = imgUploadOverlay.querySelector('.effect-level__depth');
  // поле для хранения значения слайдера интенсивности фильтра
  var effectLevelValue = imgUploadOverlay.querySelector('.effect-level__value');
  // текущий выбранный фильтр
  var currentFilterId;
  // Кнопка закрытия диалога с сообщением
  var closeMessageButton;

  // Объект настроек фильтров {id фильтра: {класс картинки предпросмотра, строка инлайн фильтра}}
  var filterOption = {
    'effect-chrome': {
      'previewClass': 'effects__preview--chrome',
      'filter': function (filterValue) {
        return 'grayscale(' + filterValue + ')';
      }
    },
    'effect-sepia': {
      'previewClass': 'effects__preview--sepia',
      'filter': function (filterValue) {
        return 'sepia(' + filterValue + ')';
      }
    },
    'effect-marvin': {
      'previewClass': 'effects__preview--marvin',
      'filter': function (filterValue) {
        return 'invert(' + filterValue * 100 + '%)';
      }
    },
    'effect-phobos': {
      'previewClass': 'effects__preview--phobos',
      'filter': function (filterValue) {
        return 'blur(' + filterValue * 3 + 'px)';
      }
    },
    'effect-heat': {
      'previewClass': 'effects__preview--heat',
      'filter': function (filterValue) {
        return 'brightness(' + (1 + filterValue * 2) + ')';
      }
    }
  };

  // Интерфейс модуля
  window.form = {
    setFilterValue: setFilterValue // Присваивает насыщенность фильтра
  };

  /**
   * // Обработчик загрузки пользовательского изображения
   * @param {Event} evt
   */
  function onUploadFileInputChange(evt) {
    if (evt.target.value === '') {
      closeImgUploadForm();

      return;
    }
    // первый из списка файлов
    var file = uploadFileInput.files[0];
    // Имя файла
    var fileName = file.name.toLowerCase();
    // проверка по расширению файла
    var matches = window.settings.FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        if (imgElement) {
          imgElement.src = reader.result;
        }

        // назначение картинок превьюшкам
        var effectPreviews = effectList.querySelectorAll('.effects__preview');
        effectPreviews.forEach(function (item) {
          item.style.backgroundImage = 'url(' + reader.result + ')';
        });
        // Показываем форму предварительного просмотра
        openImgUploadForm();
      });

      reader.readAsDataURL(file);
    }
  }

  /**
   * Обработчик нажатия клавиш
   * @param {KeyboardEvent} evt
   */
  function onUploadFormKeyDown(evt) {
    if (evt.target === textHashtags || evt.target === textDescription) {
      // Если фокус на инпуте ввода текстов - не закрывать окно настроек
      evt.stopPropagation();
    } else {
      window.utils.processEscAction(evt, closeImgUploadForm);
    }
    if (evt.target === imgUploadCancel) {
      window.utils.processEnterAction(evt, closeImgUploadForm, true);
    } else if (evt.target === scaleControlSmaller) {
      window.utils.processEnterAction(evt, changeScale(false), true);
    } else if (evt.target === scaleControlBigger) {
      window.utils.processEnterAction(evt, changeScale(true), true);
    }
  }

  /**
   * Обработчик клика для закрытия окна настроек
   */
  function onClickCloseUploadForm() {
    closeImgUploadForm();
  }

  /**
   * Обработчик переключения фильтров
   * @param {Event} evt
   */
  function onFilterChange(evt) {
    currentFilterId = evt.target.id;
    setFilterValue(1);
    setFilterClass(evt.target.id);
  }

  /**
   * Обработчик на увеличение масштаба
   */
  function onScaleIncreaseClick() {
    changeScale(true)();
  }

  /**
   * Обработчик на уменьшение масштаба
   */
  function onScaleDecreaseClick() {
    changeScale(false)();
  }

  /**
   * Обработчик на на ввод хэштэгов
   */
  function onTextHashTagsInput() {
    textHashtags.setCustomValidity(checkHashTags(textHashtags.value));
    textReportValidity(textHashtags);
  }

  /**
   * Обработчик на ввод описания картинки
   */
  function onTextDescriptionInput() {
    textDescription.setCustomValidity(checkDescription(textDescription.value));
    textReportValidity(textDescription);
  }

  /**
   * Обработка события удачной отправки данных на сервер
   */
  function onSuccessSaveData() {
    closeImgUploadForm();
    uploadMessage('success', 'Изображение успешно загружено');
  }

  /**
   * Обработка ошибочного события отправки данных на сервер
   * @param {String} errorMessage Сообщение об ошибке при загрузке данных с сервера
   */

  /**
   * Обработка ошибочного события отправки данных на сервер
   * @param {String} errorMessage Сообщение об ошибке при загрузке данных с сервера
   */
  function onErrorSaveData(errorMessage) {
    closeImgUploadForm();
    uploadMessage('error', errorMessage);
  }

  /**
   * Обработка отправки формы
   * @param {Event} evt
   */
  function onSetupFormSubmit(evt) {
    evt.preventDefault();
    var xhrErrorMessage = document.querySelector('.xhr-error-message');
    if (xhrErrorMessage) {
      xhrErrorMessage.remove();
    }
    // Отпрака данных формы на сервер с колбэками для удачной и не удачной отправки
    window.backend.save(window.settings.FORM_SEND_URL, new FormData(formUploadImage), onSuccessSaveData, onErrorSaveData);
  }

  /**
   * Действия необходимые при закрытии окна сообщения
   */
  function closeMessage() {
    // Удаляем обработчики закрытия окна сообщения
    document.removeEventListener('click', onMessageCloseClick);
    document.removeEventListener('keydown', onMessageCloseKeydown);
    // Удаляем секцию с сообщением
    document.querySelector('#upload-message-section').remove();
  }

  /**
   * Добавляем обработчики закрытия окна сообщения по клику вне окна сообщения
   * @param {Event} evt
   */
  function onMessageCloseClick(evt) {
    if (evt.target === document.querySelector('#upload-message-section')) {
      closeMessage();
    }
  }

  /**
   * Добавляем обработчики закрытия окна сообщения по нажатию Esc и Enter
   * @param {KeyboardEvent} evt
   */
  function onMessageCloseKeydown(evt) {
    // Закрытие окна по Esc
    window.utils.processEscAction(evt, closeMessage);
    // Закрытие окна по Enter на элементе
    if (evt.target === closeMessageButton) {
      window.utils.processEnterAction(evt, closeMessage, true);
    }
  }

  /**
   * Клонируем и рендерим сообщение о загрузке файла
   * @param {String} templateId Id шаблона
   * @param {String} infoMessage Сообщение для отображения
   */
  function uploadMessage(templateId, infoMessage) {
    // Шаблон для сообщения
    var messageTemplate = document.querySelector('#' + templateId)
      .content
      .querySelector('.' + templateId);
    // Клонируем секцию из шаблона
    var messageElement = messageTemplate.cloneNode(true);
    messageElement.id = 'upload-message-section';
    messageElement.querySelector('.' + templateId + '__title').textContent = infoMessage;
    // Кнопка закрытия сообщения
    closeMessageButton = messageElement.querySelector('.' + templateId + '__button');

    // Добавляем обработчики закрытия окна сообщения
    // по клику по кнопке
    closeMessageButton.addEventListener('click', closeMessage);
    // по клику вне окна сообщения
    document.addEventListener('click', onMessageCloseClick);
    // по нажатию Esc
    document.addEventListener('keydown', onMessageCloseKeydown);
    // вставляем секциюю с сообщением
    document.body.querySelector('main').insertAdjacentElement('afterbegin', messageElement);
  }

  /**
   * Проверка на валидность поля ввода
   * @param {Element} textElement
   */
  function textReportValidity(textElement) {
    if (textElement.validity.valid) {
      textElement.style.borderColor = 'initial';
    } else {
      textElement.style.borderColor = 'red';
    }
  }

  /**
   * Присваивает класс фильтра превью картинке
   * @param {string} filterClassName имя класса
   */
  function setFilterClass(filterClassName) {
    // Удаление всех лишних классов (если таковые устновлены), кроме установленного в разметке по умолчанию
    for (var i = 1; i < imgUploadPreview.classList.length; i++) {
      imgUploadPreview.classList.remove(imgUploadPreview.classList[1]);
    }

    if (filterClassName === window.settings.DEFAULT_EFFECT) {
      window.utils.visibleToggle(fieldSetEffectLevel, false);
      return;
    }
    imgUploadPreview.classList.add(filterOption[filterClassName].previewClass);
    window.utils.visibleToggle(fieldSetEffectLevel, true);
  }

  /**
   * Присваивает насыщенность фильтра
   * @param {number} filterValue [0..1] насыщенность фильтра в долях
   */
  function setFilterValue(filterValue) {
    if (currentFilterId === window.settings.DEFAULT_EFFECT) {
      imgUploadPreview.style.filter = '';
    } else {
      imgUploadPreview.style.filter = filterOption[currentFilterId].filter(filterValue);
    }
    effectLevelValue.value = parseInt(filterValue * 100, 10);
    window.settings.effectLevelPin.style.left = filterValue * 100 + '%';
    effectLevelDepth.style.width = filterValue * 100 + '%';

  }

  /**
   * Присваивает масштаб картинки
   * @param {number} scale масштаб кртинки
   */
  function setImageScale(scale) {
    imgUploadPreview.style.transform = 'scale(' + (scale / 100) + ')';
    scaleControlValue.value = scale + '%';
  }

  /**
   * Функция вычисления масштаба
   * @param {boolean} isIncrease если true то увеличивается, иначе уменьшается
   * @return {function(...[*]=)} Возвращает замыкание для колбэк-функции
   */
  function changeScale(isIncrease) {
    // Замыкание для колбэк-функции
    return function () {
      var curScale = Number.parseInt(scaleControlValue.value.slice(0, scaleControlValue.value.length - 1), 10);
      if (isIncrease) {
        curScale = Math.min(curScale + window.settings.SCALE_STEP, window.settings.MAX_SCALE);
      } else {
        curScale = Math.max(curScale - window.settings.SCALE_STEP, window.settings.MIN_SCALE);
      }
      setImageScale(curScale);
    };
  }

  /**
   * Проверяет отдельно взятый тэг на валидность
   * @param {String} hashTag Хэштэг
   * @return {string} В случае валидности хэштэга возвращает пустую строку, иначе строку ошибки
   */
  function getHashTagValidityString(hashTag) {
    if (hashTag.slice(0, 1) !== '#') {
      return 'Хэштэг должен начинаться с символа #';
    } else if (hashTag.length === 1) {
      return 'Хэштэг не может быть пустым';
    } else if (hashTag.length > window.settings.MAX_HASHTAG_LENGTH) {
      return 'Максимальная длина хэштэга: ' + window.settings.MAX_HASHTAG_LENGTH + ' (' + hashTag + ')';
    } else if (hashTag.match(/#[a-zA-Zа-яА-Я0-9]*/)[0] !== hashTag) {
      return 'Хэштэг должен содержать только буквы и числа';
    }

    return '';
  }

  /**
   * Проверяет валидность ввода строки тэгов
   * @param {string} hashTagStr проверяемая строка с хэштэгами
   * @return {string} строка с сообщением об ошибке
   */
  function checkHashTags(hashTagStr) {
    if (!hashTagStr.length) {
      return '';
    }
    // Массив хэштэтов
    var hashTags = hashTagStr.split(' ');
    // Строка валидности хэштэга
    var validityString;
    // Массив уникальных хэштэгов
    var uniqHashtags = [];
    // Хэштэг в верхнем регистре
    var upperHashTag;
    for (var i = 0; i < hashTags.length; i++) {
      validityString = getHashTagValidityString(hashTags[i]);
      if (validityString) {
        return validityString;
      }

      // Если отдельный хэштэг прошел проверку, проверяем на уникальность
      upperHashTag = hashTags[i].toUpperCase();
      if (uniqHashtags.includes(upperHashTag)) {
        return 'Хэштэги не должны повторяться (' + hashTags[i] + ')';
      }

      uniqHashtags.push(upperHashTag);
    }

    // Если все хэштэги прошли проверку, проверям на разрешенное количество
    if (uniqHashtags.length > window.settings.MAX_HASHTAG_COUNT) {
      return 'Максимальное количество хэштэгов: ' + window.settings.MAX_HASHTAG_COUNT;
    }

    return '';
  }

  /**
   * Проверяет валидность ввода описания картинки
   * @param {string} descriptionStr проверяемая строка с описанием
   * @return {string} строка с сообщением об ошибке
   */
  function checkDescription(descriptionStr) {
    if (!descriptionStr.length) {
      return '';
    } else if (descriptionStr.length > window.settings.MAX_DESCRIPTION_LENGTH) {
      return 'Максимальная длина описания: ' + window.settings.MAX_DESCRIPTION_LENGTH;
    }

    return '';
  }

  /**
   * Сбрасываем настройки в состояние по умолчанию
   * @param {Boolean} clearUploadFileInputValue если true - сбрасываем значение поля выбора файла
   */
  function setDefaultState(clearUploadFileInputValue) {
    currentFilterId = window.settings.DEFAULT_EFFECT;
    setFilterClass(currentFilterId);
    // слайдер на 100%
    setFilterValue(1);
    // По умолчанию выставляем без фильтров
    imgUploadOverlay.querySelector('#' + window.settings.DEFAULT_EFFECT).checked = true;
    setImageScale(window.settings.DEFAULT_SCALE);
    // Очистка полей ввода и ошибок валидации
    textHashtags.value = '';
    textHashtags.setCustomValidity('');
    textReportValidity(textHashtags);
    textDescription.value = '';
    textDescription.setCustomValidity('');
    textReportValidity(textDescription);
    // сбрасывем значение поля выбора файла
    if (clearUploadFileInputValue) {
      uploadFileInput.value = '';
    }
  }

  /**
   * Открытие формы загрузки изображения
   */
  function openImgUploadForm() {
    window.utils.visibleToggle(imgUploadOverlay, true);
    // Убираем прокрутку контейнера фотографий позади при скролле
    document.body.classList.add('modal-open');
    // Добавляем обработчик на закрытие/открытие окна настроек по клавишам
    document.addEventListener('keydown', onUploadFormKeyDown);
    // Добавляем обработчик на закрытие окна по клику
    imgUploadCancel.addEventListener('click', onClickCloseUploadForm);
    // Добавляем обработчик переключения фильтров
    effectList.addEventListener('change', onFilterChange);
    // Добавляем обработчик клика на уменьшение масштаба
    scaleControlSmaller.addEventListener('click', onScaleDecreaseClick);
    // Добавляем обработчик клика на увеличение масштаба
    scaleControlBigger.addEventListener('click', onScaleIncreaseClick);
    // Добавляем обработчик ввода хэштэгов
    textHashtags.addEventListener('input', onTextHashTagsInput);
    // Добавляем обработчик ввода хэштэгов
    textDescription.addEventListener('input', onTextDescriptionInput);
    // Установка ограничения для длины описания
    textDescription.maxLength = window.settings.MAX_DESCRIPTION_LENGTH;
    // Установки по умолчанию
    setDefaultState(false);
  }

  /**
   * Закрытие формы загрузки изображения
   */
  function closeImgUploadForm() {
    window.utils.visibleToggle(imgUploadOverlay, false);
    // Возвращаем прокрутку контейнера фотографий позади при скролле
    document.body.classList.remove('modal-open');
    // выключаем обработчики
    document.removeEventListener('keydown', onUploadFormKeyDown);
    imgUploadCancel.removeEventListener('click', onClickCloseUploadForm);
    effectList.removeEventListener('change', onFilterChange);
    scaleControlSmaller.removeEventListener('click', onScaleDecreaseClick);
    scaleControlBigger.removeEventListener('click', onScaleIncreaseClick);
    textHashtags.removeEventListener('input', onTextHashTagsInput);
    textDescription.removeEventListener('input', onTextDescriptionInput);
    // Установки по умолчанию
    setDefaultState(true);
  }

  // Назначение action для формы
  formUploadImage.action = window.settings.FORM_UPLOAD_IMAGE_ACTION;
  // Обработчик загрузки пользовательского изображения
  if (uploadFileInput) {
    uploadFileInput.addEventListener('change', onUploadFileInputChange);
  }
  // Добавляем обработчик отправки формы
  formUploadImage.addEventListener('submit', onSetupFormSubmit);

})();
