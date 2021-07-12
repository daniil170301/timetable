// Начальные настройки окна диалога
$('#dialog').dialog({
    autoOpen: false,
    resizable: false,
    modal: true});

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

// Кнопки навбара - начало
$('.create_btn').click(function () {
    $('#dialog')
        .empty()
        .append('<input class="dialog_faculty_input" type="text" placeholder="Факультет" value="' + $('.faculty_input').val() + '">\n' +
                '<input class="dialog_direction_input" type="text" placeholder="Направление" value="' + $('.direction_input').val() + '">\n' +
                '<input class="dialog_course_input" type="text" placeholder="Курс" value="' + $('.course_input').val() + '">')
        .dialog({
            title: 'Создание расписания',
            buttons: [
                {text: "Создать", click: function() {
                    $('.faculty_input').val($('.dialog_faculty_input').val());
                    $('.direction_input').val($('.dialog_direction_input').val());
                    $('.course_input').val($('.dialog_course_input').val());
                    $(this).dialog("close");
                }},
                {text: "Отмена", click: function() { $(this).dialog("close"); }}]
	}).dialog('open');
});

$('.load_btn').click(function () {
    $('#dialog')
        .empty()
        .append('<input class="dialog_faculty_input" type="text" placeholder="Факультет">\n' +
                '<input class="dialog_direction_input" type="text" placeholder="Направление">\n' +
                '<input class="dialog_course_input" type="text" placeholder="Курс">')
        .dialog({
            title: 'Загрузка расписаний',
            buttons: [
                {text: "Загрузить", click: function() {
                    let faculty = $('.dialog_faculty_input').val(),
                        direction = $('.dialog_direction_input').val(),
                        course = $('.dialog_course_input').val();
                    $.post('/edit/get/' + faculty + '/' + direction + '/' + course, function (data) {
                        if (data['success'] === 'yes') {
                            $('#dialog').empty()
                                .append('<p>Получен ответ от сервера на запрос:\n' +
                                '/edit/get/' + faculty + '/' + direction + '/' + course + '</p>')
                                .dialog({title: 'Успешная загрузка', buttons: []}).dialog('open');
                        } else {
                            $('#dialog').empty()
                                .append('<p>Получена ошибка на запрос:\n' +
                                '/edit/get/' + faculty + '/' + direction + '/' + course + '</p>')
                                .dialog({title: 'Ошибка загрузки', buttons: []}).dialog('open');
                        }
                    });
                }},
                {text: "Отмена", click: function() { $(this).dialog("close"); }}]
	}).dialog('open');
});

$('.save_btn').click(function () {
    $('#dialog')
        .empty()
        .append('<p>Сохранить расписания?</p>')
        .dialog({
            title: 'Сохранение',
            buttons: [
                {text: "Да", click: function() {
                    $.post('/edit/save/', function (data) {
                        if (data['success'] === 'yes') {
                            $('#dialog').empty()
                                .append('<p>Расписания успешно сохранены!</p>')
                                .dialog({title: 'Успех', buttons: []}).dialog('open');
                        } else {
                            $('#dialog').empty()
                                .append('<p>Ошибка сохранения!</p>')
                                .dialog({title: 'Ошибка', buttons: []}).dialog('open');
                        }
                    });
                }},
                {text: "Нет", click: function() { $(this).dialog("close"); }}]
	}).dialog('open');
});
// Кнопки навбара - конец



// Кнопка добавить подгруппу (добавляет элемент li с парами перед своим родительским элементом li)
$('.add_subgroup').click(function () {
    $(this).parent('li').before('<li data-group="' + $('.dialog_group').val() +
                              '" data-subgroup="' + $('.dialog_subgroup').val() + '">'
                              + addPairsList(null, true) + '</li>');
    listElems = carousel.querySelectorAll('li');
});


// Этот способ почему-то не работает -_-
/*$('.add_subgroup').click(function () {
    let $this = $(this);
    if (listElems.length < 10) {
        $('#dialog').empty()
        .append('<input class="dialog_group" type="text" placeholder="Группа">\n' +
                '<input class="dialog_subgroup" type="text" placeholder="Подгруппа">')
        .dialog({
            title: 'Добавление группы',
            buttons: [
                {text: "Добавить", click: function() {
                    let group = $('.dialog_group').val(),
                        subgroup = $('.dialog_subgroup').val();
                    $this.parent('li').before('<li data-group="' + group + '" data-subgroup="' + subgroup + '">' +
                                               addPairsList(null, true) + '</li>');
                    $(this).dialog("close");
                }},
                {text: "Отмена", click: function() { $(this).dialog("close"); }}]
        }).dialog('open');
        listElems = carousel.querySelectorAll('li');
    } else {
        $('#dialog').empty()
        .append('<p>Количество доступных подгрупп: 10</p>')
        .dialog({
            title: 'Невозможно добавить',
            buttons: [{text: "Ок", click: function() { $(this).dialog("close"); }}]
	    }).dialog('open');
    }
});*/

// Функция генерирует сетку из пар и вставляет ее в переданный элемент $li, если get=false
// И возвращает сетку из пар при get=true
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
