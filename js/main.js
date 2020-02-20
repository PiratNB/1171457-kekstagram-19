'use strict';

// Коды клавиш
var ESC_KEY = 'Escape';
var ENTER_KEY = 'Enter';

// Количество случайных данных для моки
var PHOTO_COUNT = 25;
// Минимальное кол-во лайков
var MIN_LIKES_COUNT = 15;
// Максимальное кол-во лайков
var MAX_LIKES_COUNT = 200;
// Максимальное кол-во комментариев
var MAX_COMMENTS_COUNT = 7;
// Кол-во доступных аватарок
var COMMENTATORS_AVATAR_COUNT = 6;
// Эффект по умолчанию
var DEFAULT_EFFECT = 'effect-none';
// Масштаб по умолчанию
var DEFAULT_SCALE = 100;
// Шаг изменения масштаба
var SCALE_STEP = 25;
// Минимальный масштаб
var MIN_SCALE = 25;
// Максимальный масштаб
var MAX_SCALE = 100;
// Максимальная длина хэштэга
var MAX_HASHTAG_LENGTH = 20;
// Максимальное количество хэштэгов
var MAX_HASHTAG_COUNT = 5;
// Максимальная длина описания
var MAX_DESCRIPTION_LENGTH = 140;
// Ссылка на отправку формы
var FORM_UPLOAD_IMAGE_ACTION = 'https://js.dump.academy/kekstagram';
// Тексты сообщений комментариев
var commentMessages = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
// Имена коментаторов
var names = ['Иван',
  'Хуан Себастьян',
  'Мария',
  'Кристоф',
  'Виктор',
  'Юлия',
  'Люпита',
  'Вашингтон',
  'да Марья',
  'Верон',
  'Мирабелла',
  'Вальц',
  'Онопко',
  'Топольницкая',
  'Нионго',
  'Ирвинг'
];

// Контрол для загрузгки картинки пользователя
var uploadFileInput = document.querySelector('#upload-file');
// Элемент body на главной странице
var bodyIndex = document.querySelector('body');
// Форма загрузки и обработки картинки
var formUploadImage = document.querySelector('#upload-select-image');
// Контейнер для изображения
var imgUploadOverlay = document.querySelector('.img-upload__overlay');
// Контрол для ввода хэштэгов
var textHashtags = document.querySelector('.text__hashtags');
// Контрол для ввода описания картинки
var textDescription = document.querySelector('.text__description');
// Кнопка для закрытия окна настроек
var imgUploadCancel = document.querySelector('.img-upload__cancel');
// Картинка предварительного просмотра
var imgUploadPreview = document.querySelector('.img-upload__preview');
// Контейнер для отрисовки полноэкранной фотографии и инфомации о ней
var bigPicture = document.querySelector('.big-picture');
// Кнопка закрытия большой картинки
var pictureCancel = document.querySelector('#picture-cancel');
// список фильтров
var effectList = imgUploadOverlay.querySelector('.effects__list');
// Слайдер насыщености
var effectLevelPin = imgUploadOverlay.querySelector('.effect-level__pin');
// Прогрессбар слайдера
var effectLevelDepth = imgUploadOverlay.querySelector('.effect-level__depth');
// поле для хранения значения слайдера интенсивности фильтра
var effectLevelValue = imgUploadOverlay.querySelector('.effect-level__value');
// кнопка уменьшения масштаба
var scaleControlSmaller = imgUploadOverlay.querySelector('.scale__control--smaller');
// кнопка увеличения масштаба
var scaleControlBigger = imgUploadOverlay.querySelector('.scale__control--bigger');
// поле для хранения значения масштаба
var scaleControlValue = imgUploadOverlay.querySelector('.scale__control--value');
// филдсет со сладером эффектов
var fieldSetEffectLevel = imgUploadOverlay.querySelector('.effect-level');
// текущий выбранный фильтр
var currentFilterId;

// массив объектов фотографий
var photoDescriptions = getPhotoDescriptions(PHOTO_COUNT);

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

// Включение и выключение видимости элемента
function visibleToggle(element, isVisible) {
  if (isVisible) {
    element.classList.remove('hidden');
  } else {
    element.classList.add('hidden');
  }
}

// Возвращает случайный элемент массива
function getRandomArraysElement(array, doRemove) {
  var index = Math.floor(Math.random() * array.length);
  var returnElement = array[index];
  if (doRemove) {
    array.splice(index, 1);
  }

  return returnElement;
}

// Возвращает случайное сообщение
function getCommentMessage(minMessageCount, maxMessageCount) {
  minMessageCount = minMessageCount || 1;
  maxMessageCount = maxMessageCount || 2;
  // Число сообщениий
  var messageCount = minMessageCount + Math.floor(Math.random() * maxMessageCount);
  // Возвращаемое сообщение
  var message = '';

  for (var k = 1; k <= messageCount; k++) {
    message += getRandomArraysElement(commentMessages, false) + ' ';
  }

  return message.trim();
}

// Возвращает массив объектов комментариев
function getComments() {
  var comments = [];
  var commentsCount = Math.floor(Math.random() * MAX_COMMENTS_COUNT);
  for (var j = 0; j < commentsCount; j++) {
    var comment = {};
    // Аватарка автора комментрия
    comment.avatar = 'img/avatar-' + Math.floor(Math.random() * COMMENTATORS_AVATAR_COUNT + 1) + '.svg';
    // Сообщение коментатора
    comment.message = getCommentMessage(1, 2);
    // Имя комментатора
    comment.name = getRandomArraysElement(names, false);
    comments.push(comment);
  }

  return comments;
}

// Возвращает объект описания фотографии
function getRandomPhotoDescription(indexes, minLikesCount, maxLikesCount) {
  return {
    // путь к фотографии
    url: 'photos/' + getRandomArraysElement(indexes, true) + '.jpg',
    // Описание фотографии
    description: 'Здесь должно быть описание фотографии',
    // Кол-во лайков
    likes: minLikesCount + Math.floor(Math.random() * (maxLikesCount - minLikesCount)),
    // Массив объектов комментариев
    comments: getComments()
  };
}

// Возвращает массив объектов с описаниями фотографий
function getPhotoDescriptions(photoCount) {
  // Массив индексов для заполнения случайными данными
  var indexes = [];
  // Заполнение массива индексов
  for (var i = 1; i <= photoCount; i++) {
    indexes.push(i);
  }
  // Возвращаемый массив описаний фотографий
  var returnArray = [];
  for (var n = 0; n < photoCount; n++) {
    returnArray.push(getRandomPhotoDescription(indexes, MIN_LIKES_COUNT, MAX_LIKES_COUNT));
  }

  return returnArray;
}

// Обрабртка клика по превью
function onSmallPictureClick(evt) {
  // Показ большой фотографии
  if (evt.target.pictureObject) {
    // Эмуляция клика по картинке
    showBigPicture(evt.target.pictureObject, bigPicture);
    return;
  }
  showBigPicture(evt.target.parentNode.pictureObject, bigPicture);
}

function oncloseBigPictureClick() {
  closeBigPicture();
}

// Скрытие окна с большой фотографией
function closeBigPicture() {
  visibleToggle(bigPicture, false);
  // Удаляем обработчики
  document.removeEventListener('keydown', onBigPictureKeyDown);
  pictureCancel.removeEventListener('click', oncloseBigPictureClick);
  // Добавляем прокрутку контейнера фотографий позади при скролле
  document.body.classList.remove('modal-open');
}

// Обработчик нажатия клавиш для большой картинки
function onBigPictureKeyDown(evt) {
  if (evt.key === ESC_KEY) {
    // Закрытие окна по Esc
    closeBigPicture();
  } else if (evt.key === ENTER_KEY) {
    if (evt.target === pictureCancel) {
      closeBigPicture();
    }
  }
}
// Возвращает отрисованный узел с фотографиями согласно шаблона
function renderPicture(picture) {
  // Шаблон для фотографии
  var pictureTemplate = document.querySelector('#picture ')
    .content
    .querySelector('.picture');
  var pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__comments').textContent = picture.comments.length.toString();
  // закрепляем объект за элементом
  pictureElement.pictureObject = picture;
  // Добавляем обработчик клика по превью
  pictureElement.addEventListener('click', onSmallPictureClick);
  return pictureElement;
}

// Отрисовка всех фотографий
function renderPictures(photoDescriptionsArray) {
  // Фрагмент для вставки
  var fragment = document.createDocumentFragment();
  for (var p = 0; p < photoDescriptionsArray.length; p++) {
    fragment.appendChild(renderPicture(photoDescriptionsArray[p]));
  }

  // Элемент в который будем вставлять фотографии
  var similarListElement = document.querySelector('.pictures');
  similarListElement.appendChild(fragment);
}

// Возвращает отрисованный комментарий
function renderComment(list, comment) {
  // член списка с комментарием
  var socialComment = document.createElement('li');
  socialComment.classList.add('social__comment');
  // Аватар коментатора
  var socialPicture = document.createElement('img');
  socialPicture.classList.add('social__picture');
  socialPicture.src = comment.avatar;
  socialPicture.alt = comment.name;
  socialPicture.width = 35;
  socialPicture.height = 35;
  socialComment.appendChild(socialPicture);
  // Текст комментария
  var socialText = document.createElement('p');
  socialText.classList.add('social__text');
  socialText.textContent = comment.message;
  socialComment.appendChild(socialText);
  return socialComment;
}

// Показывает полноэкранную фотографию на основе объекта Описание фотографии
function showBigPicture(photoDescription, bigPictureElement) {
  // Показываем контейнер для полноэкранной фотографии
  visibleToggle(bigPictureElement, true);
  // Выключаем видимость счетчика коментариев
  visibleToggle(document.querySelector('.social__comment-count'), false);
  // Выключаем видимость кнопки загрузки новых комментариев
  visibleToggle(document.querySelector('.comments-loader'), false);
  // Убираем прокрутку контейнера фотографий позади при скролле
  document.body.classList.add('modal-open');
  // Добаляем обработчик нажатия клавиш при открытом диалоге большой картинки
  document.addEventListener('keydown', onBigPictureKeyDown);
  // Добавляем обработчик клика по кнопке закрытия
  pictureCancel.addEventListener('click', oncloseBigPictureClick);
  // Заменяем информацию для выбранной фотографии
  // url фотографии
  bigPictureElement.querySelector('img').src = photoDescription.url;
  // Кол-во лайков
  bigPictureElement.querySelector('.likes-count').textContent = photoDescription.likes;
  // Кол-во комментариев
  bigPictureElement.querySelector('.comments-count').textContent = photoDescription.comments.length.toString();
  // Описание фоторафии
  bigPictureElement.querySelector('.social__caption').textContent = photoDescription.description;

  // Список с коментариями
  var socialComments = bigPictureElement.querySelector('.social__comments');
  if (socialComments) {
    // Очистка предыдущих комментариев
    while (socialComments.firstChild) {
      socialComments.removeChild(socialComments.firstChild);
    }

    // Фрагмент для вставки
    var fragment = document.createDocumentFragment();
    // Генерация комментариев
    for (var li = 0; li < photoDescription.comments.length; li++) {
      fragment.appendChild(renderComment(socialComments, photoDescription.comments[li]));
    }

    socialComments.appendChild(fragment);
  }
}

// Присваивает класс фильтра превью картинке
function setFilterClass(filterClassName) {
  for (var i = 1; i < imgUploadPreview.className.length; i++) {
    imgUploadPreview.classList.remove(imgUploadPreview.classList[1]);
  }
  if (filterClassName !== DEFAULT_EFFECT) {
    imgUploadPreview.classList.add(filterOption[filterClassName].previewClass);
    visibleToggle(fieldSetEffectLevel, true);
  } else {
    visibleToggle(fieldSetEffectLevel, false);
  }
}

// Присваивает насыщенность фильтра
function setFilterValue(filterClassId, filterValue) {
  if (filterClassId === DEFAULT_EFFECT) {
    imgUploadPreview.style.fiter = '';
  } else {
    imgUploadPreview.style.filter = filterOption[filterClassId].filter(filterValue);
  }
  effectLevelValue.value = parseInt(filterValue * 100, 10);
}

// Присваивает масштаб картинки
function setImageScale(Scale) {
  imgUploadPreview.style.transform = 'scale(' + (Scale / 100) + ')';
  scaleControlValue.value = Scale + '%';
}

// Функция вычисления масштаба
function changeScale(isIncrease) {
  var curScale = Number.parseInt(scaleControlValue.value.slice(0, scaleControlValue.value.length - 1), 10);
  if (isIncrease) {
    curScale = Math.min(curScale + SCALE_STEP, MAX_SCALE);
  } else {
    curScale = Math.max(curScale - SCALE_STEP, MIN_SCALE);
  }
  setImageScale(curScale);
}

// Проверяет отдельно взятый тэг на валидность
function getHashTagValidityString(hashTag) {
  if (hashTag.slice(0, 1) !== '#') {
    return 'Хэштэг должен начинаться с символа #';
  } else if (hashTag.length === 1) {
    return 'Хэштэг не может быть пустым';
  } else if (hashTag.length > MAX_HASHTAG_LENGTH) {
    return 'Максимальная длина хэштэга: ' + MAX_HASHTAG_LENGTH + ' (' + hashTag + ')';
  } else if (hashTag.match('#[a-zA-Zа-яА-Я0-9]*')[0] !== hashTag) {
    return 'Хэштэг должен содержать только буквы и числа';
  }
  return '';
}

// Проверяет валидность ввода строки тэгов
function checkHashTags(hashTagStr) {
  if (hashTagStr.length === 0) {
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
    if (!validityString) {
      upperHashTag = hashTags[i].toUpperCase();
      if (uniqHashtags.includes(upperHashTag)) {
        return 'Хэштэги не должны повторяться (' + hashTags[i] + ')';
      }
      uniqHashtags.push(upperHashTag);
    } else {
      return validityString;
    }
  }
  if (uniqHashtags.length > MAX_HASHTAG_COUNT) {
    return 'Максимальное количество хэштэгов: ' + MAX_HASHTAG_COUNT;
  }
  return '';
}

// Проверяет валидность ввода описания картинки
function checkDescription(descriptionStr) {
  if (descriptionStr.length === 0) {
    return '';
  } else if (descriptionStr.length > MAX_DESCRIPTION_LENGTH) {
    return 'Максимальная длина описания: ' + MAX_DESCRIPTION_LENGTH;
  }
  return '';
}

function setDefaultState(clearUploadFileInputValue) {
  currentFilterId = DEFAULT_EFFECT;
  setFilterClass(DEFAULT_EFFECT);
  setFilterValue(DEFAULT_EFFECT, 1);
  // слайдер на 100%
  effectLevelPin.style.left = '100%';
  effectLevelDepth.style.width = '100%';
  // По умолчанию выставляем без фильтров
  imgUploadOverlay.querySelector('#' + DEFAULT_EFFECT).checked = true;
  setImageScale(DEFAULT_SCALE);
  // Очистка полей ввода
  textHashtags.value = '';
  textDescription.value = '';
  // сбрасывем значение поля выбора файла
  if (clearUploadFileInputValue) {
    uploadFileInput.value = '';
  }
}

// Проверка на валидность поля ввода
function textReportValidity(textElement) {
  if (textElement.validity.valid) {
    textElement.style.borderColor = 'initial';
  } else {
    textElement.style.borderColor = 'red';
  }
  formUploadImage.reportValidity();
}

// Обработчик загрузки пользовательского изображения
function onUploadFileInputChange(evt) {
  if (evt.target.value === '') {
    closeImgUploadForm();
    return;
  }
  openImgUploadForm();
}

// Обработчик клика для закрытия окна настроек
function onClickCloseUploadForm() {
  closeImgUploadForm();
}


// Обработчик нажатия клавиш
function onUploadFormKeyDown(evt) {
  if (evt.key === ESC_KEY) {
    // Закрытие окна по Esc
    if (evt.target === textHashtags || evt.target === textDescription) {
      // Если фокус на инпуте ввода текстов - не закрывать окно настроек
      evt.stopPropagation();
    } else {
      closeImgUploadForm();
    }
  } else if (evt.key === ENTER_KEY) {
    evt.preventDefault();
    // Закрытие окна по Enter
    if (evt.target === imgUploadCancel) {
      closeImgUploadForm();
    } else if (evt.target === scaleControlSmaller) {
      changeScale(false);
    } else if (evt.target === scaleControlBigger) {
      changeScale(true);
    }
  }
}

// Обработчик переключения фильтров
function onFilterChange(evt) {
  setFilterValue(evt.target.id, 1);
  setFilterClass(evt.target.id);
  currentFilterId = evt.target.id;
}

// Обработчик на увеличение масштаба
function onScaleIncreaseClick() {
  changeScale(true);
}

// Обработчик на уменьшение масштаба
function onScaleDecreaseClick() {
  changeScale(false);
}

// Обработчик отпускания кнопки мыши на слайдере
function onSliderMouseUp(evt) {
  // слайдер
  var target = evt.target;
  // родитель слайдера
  var parentTarget = evt.target.parentElement;
  // позиция слайдера
  var sliderPosition = target.offsetLeft / parentTarget.offsetWidth;
  setFilterValue(currentFilterId, sliderPosition);
  // console.log(imgUploadPreview.style);
}

// Обработчик на на ввод хэштэгов
function onTextHashTagsInput() {
  textHashtags.setCustomValidity(checkHashTags(textHashtags.value));
  textReportValidity(textHashtags);
}

// Обработчик на на ввод описания картинки
function onTextDescriptionInput() {
  textDescription.setCustomValidity(checkDescription(textDescription.value));
  textReportValidity(textDescription);
}

// Открытие формы загрузки изображения
function openImgUploadForm() {
  visibleToggle(imgUploadOverlay, true);
  bodyIndex.classList.add('modal-open');
  // Добавляем обработчик на закрытие/открытие окна настроек по клавишам
  document.addEventListener('keydown', onUploadFormKeyDown);
  // Добавляем обработчик на закрытие окна по клику
  imgUploadCancel.addEventListener('click', onClickCloseUploadForm);
  // Добавляем обработчик переключения фильтров
  effectList.addEventListener('change', onFilterChange);
  // Добавляем обработчик отпускания кнопки мыши на слайдере
  effectLevelPin.addEventListener('mouseup', onSliderMouseUp);
  // Добавляем обработчик клика на уменьшение масштаба
  scaleControlSmaller.addEventListener('click', onScaleDecreaseClick);
  // Добавляем обработчик клика на увеличение масштаба
  scaleControlBigger.addEventListener('click', onScaleIncreaseClick);
  // Добавляем обработчик ввода хэштэгов
  textHashtags.addEventListener('input', onTextHashTagsInput);
  // Добавляем обработчик ввода хэштэгов
  textDescription.addEventListener('input', onTextDescriptionInput);
  // Установка ограничения для длины описания
  textDescription.maxLength = MAX_DESCRIPTION_LENGTH;
  // Установки по умолчанию
  setDefaultState(false);
}

// Закрытие формы загрузки изображения
function closeImgUploadForm() {
  visibleToggle(imgUploadOverlay, false);
  bodyIndex.classList.remove('modal-open');
  // выключаем обработчики
  document.removeEventListener('keydown', onUploadFormKeyDown);
  imgUploadCancel.removeEventListener('click', onClickCloseUploadForm);
  effectList.removeEventListener('change', onFilterChange);
  effectLevelPin.removeEventListener('mouseup', onSliderMouseUp);
  scaleControlSmaller.removeEventListener('click', onScaleDecreaseClick);
  scaleControlBigger.removeEventListener('click', onScaleIncreaseClick);
  textHashtags.removeEventListener('input', onTextHashTagsInput);
  // Установки по умолчанию
  setDefaultState(true);
}

// Основная выполняющая функция
function initialisation() {
  // Отрисовка массива описаний фотографий
  renderPictures(photoDescriptions);

  // Назначение action для формы
  formUploadImage.action = FORM_UPLOAD_IMAGE_ACTION;
  // Обработчик загрузки пользовательского изображения
  if (uploadFileInput) {
    uploadFileInput.addEventListener('change', onUploadFileInputChange);
  }
}

initialisation();
