/* конфигурация */
let width = 91; // ширина картинки
let count = 1; // видимое количество изображений

let list = carousel.querySelector('ul');
let listElems = carousel.querySelectorAll('li');

let position = 0; // положение ленты прокрутки

carousel.querySelector('.prev').onclick = function() {
  // сдвиг влево
  position += width * count;
  // последнее передвижение влево может быть не на 3, а на 2 или 1 элемент
  position = Math.min(position, 0)
  list.style.marginLeft = position + 'vw';
};

carousel.querySelector('.next').onclick = function() {
  // сдвиг вправо
  position -= width * count;
  // последнее передвижение вправо может быть не на 3, а на 2 или 1 элемент
  position = Math.max(position, -width * (listElems.length - count));
  list.style.marginLeft = position + 'vw';
};

$('.add_subgroup').click(function () {
    console.log($(this).parent('li'));
    $(this).parent('li').before('<li>' + addPairsList(null, true) + '</li>');
    listElems = carousel.querySelectorAll('li');
});

function addPairsList($li=null, get=false) {
    let pairs = '',
        lesson = '<select class="lesson">',
        teacher = '<select class="teacher">',
        audience = '<select class="audience">',
        buttons = '<div class="buttons-pair">\n' +
                  '  <button type="button" name="delete">x</button>\n' +
                  '  <button type="button" name="type-switch">тип</button>\n' +
                  '  <button type="button" name="copy">коп</button>\n' +
                  '</div>';


    // Добавить заполнение дропдаунов
    lesson += '<option value="lesson" disabled selected>Предмет</option>';
    teacher += '<option value="teacher" disabled selected>Преподаватль</option>';
    audience += '<option value="audience" disabled selected>Аудитория</option>';

    lesson += '</select>';
    teacher += '</select>';
    audience += '</select>';
    for (let i = 0; i < 8; i++) pairs += '<div class="pair"><div class="wrapper-cell"><div class="dropdowns-pair">' +
        lesson + teacher + audience + '</div>' + buttons + '</div></div>';

    let elements = '<div class="pairs-list"><div class="column mon">' + pairs + '</div>';
    elements += '<div class="column tue">' + pairs + '</div>';
    elements += '<div class="column wed">' + pairs + '</div>';
    elements += '<div class="column thu">' + pairs + '</div>';
    elements += '<div class="column fri">' + pairs + '</div>';
    elements += '<div class="column sat">' + pairs + '</div>';

    elements += '</div>';

    if (get) return elements;

    $li.append(elements);
}
