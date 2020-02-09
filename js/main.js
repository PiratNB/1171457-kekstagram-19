'use strict';

// Константы
var AMOUNT_PHOTOS = 25;
var MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var PHOTO_DESCRIPIONS = [
  'Гуляем!',
  'Хорошоооо)))',
  'Класс!',
  'Мы тут d;',
  'Эт я (-=',
  'А это ты!'
];
var NAMES = ['Рама', 'Жук', 'Кузя', 'Галля', 'Дядя', 'Гарик'];
var MIN_LIKES = 15;
var MAX_LIKES = 200;
var MIN_COMMENTS = 0;
var MAX_COMMENTS = 11;
var MIN_AVATAR = 1;
var MAX_AVATAR = 6;

// Переменные
var postItems = [];

var similarPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var similarPicturesElement = document.querySelector('.pictures');

// Выбирает случайное число из заданного промежутка
function getRandomFromTo(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Выбирает случайное число из массива
function getRandomItem(array) {
  return Math.floor(Math.random() * array.length);
}

// Создает случайный объект комментария
function createRandomComment(count) {
  var commentItems = [];
  for (var i = 0; i <= count; i++) {
    commentItems.push({
      avatar: 'img/avatar-' + getRandomFromTo(MIN_AVATAR, MAX_AVATAR) + '.svg',
      message: MESSAGES[getRandomFromTo(0, MESSAGES.length)],
      name: NAMES[getRandomFromTo(0, NAMES.length)]
    });
  }
  return commentItems;
}

// Создает случайный объект поста
for (var i = 0; i <= AMOUNT_PHOTOS.length; i++) {
  postItems.push({
    url: 'photos/' + (i + 1) + '.jpg',
    description: getRandomItem(PHOTO_DESCRIPIONS),
    likes: getRandomFromTo(MIN_LIKES, MAX_LIKES),
    comments: createRandomComment(getRandomFromTo(MIN_COMMENTS, MAX_COMMENTS))
  });
}

// Функция создания DOM-элемента
var renderPicture = function (post) {
  var pictureElement = similarPictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = post.url;
  pictureElement.querySelector('.picture__likes').textContent = post.likes;
  pictureElement.querySelector('.picture__comments').textContent = post.comments.length;

  return pictureElement;
};

var fragment = document.createDocumentFragment();

// функция заполнения блока DOM-элементами
var createSimilarPicture = function (array) {
  for (var k = 0; k < array.length; k++) {
    fragment.appendChild(renderPicture(array[k]));
  }
};

createSimilarPicture(postItems);

similarPicturesElement.appendChild(fragment);
