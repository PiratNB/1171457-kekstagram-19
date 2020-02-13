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

var bigPicture = document.querySelector('.big-picture');
var bigPictureImg = bigPicture.querySelector('.big-picture__img');
var commentsList = bigPicture.querySelector('.social__comments');
var commentTemplate = commentsList.querySelector('.social__comment');

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
for (var i = 0; i <= AMOUNT_PHOTOS; i++) {
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


// module3-task3 Показываем большое фото
bigPicture.classList.remove('hidden');

bigPicture.querySelector('.social__comment-count').classList.add('hidden');
bigPicture.querySelector('.comments-loader').classList.add('hidden');
document.querySelector('body').classList.add('modal-open');

// Заполняет блок bigPicture информацией из первого объекта массива postItems
var createBigPicture = function (post) {
  bigPictureImg.querySelector('.big-picture__img').src = post.url;
  bigPicture.querySelector('.likes-count').textContent = post.likes;
  bigPicture.querySelector('.comments-count').textContent = post.comments.length;
  bigPicture.querySelector('.social__caption').textContent = post.description;

  var postComments = createComment(postItems[0].comments);
  addCommentElement(postComments);

  return bigPicture;
};

// Удаляет старые комментарии и добавляет новые
var addCommentElement = function (commentNodes) {
  commentsList.innerHTML = '';
  commentsList.appendChild(commentNodes);
};

// Клонирует и заполняет шаблон комментария
var renderComment = function (comment) {
  var commentElement = commentTemplate.cloneNode(true);
  commentElement.querySelector('.social__picture').src = comment.avatar;
  commentElement.querySelector('.social__picture').alt = comment.name;
  commentElement.querySelector('.social__text').textContent = comment.message;

  return commentElement;
};

var fragment = document.createDocumentFragment();

// Заполняет fragment DOM-элементами
var createSimilarPicture = function (array) {
  for (var k = 0; k < array.length; k++) {
    fragment.appendChild(renderPicture(array[k]));
  }
};

createSimilarPicture(postItems);

// функция заполнения блока commentFragment DOM-элементами комментариями
var createComment = function (array) {
  var commentFragment = document.createDocumentFragment();
  for (var n = 0; n < array.length; n++) {
    commentFragment.appendChild(renderComment(array[n]));
  }
  return commentFragment;
};

createBigPicture(postItems[0]);

// Отрисовка сгенерированных DOM-элементов в виде fragment в соответствующий блок
similarPicturesElement.appendChild(fragment);


