// Начальные настройки окна диалога
let $dialog = $('#dialog');

$dialog.dialog({
    autoOpen: false,
    resizable: false,
    modal: true
});

/* конфигурация карусели */
let width = 90; // ширина картинки
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
  if (!$('.faculty_input').val()) {
    $dialog.empty()
           .append('<p>Для начала создайте или загрузите расписание!</p>')
           .dialog({title: 'Ошибка'})
           .dialog('open');
  } else {
    if (position < -width * (listElems.length - count)) add_subgroup();
    // последнее передвижение вправо может быть не на 3, а на 2 или 1 элемент
    position = Math.max(position, -width * (listElems.length - count));
    list.style.marginLeft = position + 'vw';
  }
};

// Кнопки навбара - начало
$('.create_btn').click(function () {
    $dialog.empty()
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
                       $('ul').empty().append('<li></li>');
                       $(this).dialog("close");
                       add_subgroup();
                   }},
                   {text: "Отмена", click: function() { $(this).dialog("close"); }}]
           })
           .dialog('open');
});

$('.load_btn').click(function () {
    $dialog.empty()
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
                               $dialog.empty()
                                      .append('<p>Получен ответ от сервера на запрос:\n' +
                                              '/edit/get/' + faculty + '/' + direction + '/' + course + '</p>')
                                      .dialog({title: 'Успешная загрузка', buttons: []})
                                      .dialog('open');
                           } else {
                               $dialog.empty()
                                      .append('<p>Получена ошибка на запрос:\n' +
                                              '/edit/get/' + faculty + '/' + direction + '/' + course + '</p>')
                                      .dialog({title: 'Ошибка загрузки', buttons: []})
                                      .dialog('open');
                           }
                       });
                   }},
                   {text: "Отмена", click: function() { $(this).dialog("close"); }}]
           })
           .dialog('open');
});

$('.save_btn').click(function () {
    $dialog.empty()
           .append('<p>Сохранить расписания?</p>')
           .dialog({
               title: 'Сохранение',
               buttons: [
                   {text: "Да", click: function() {
                       let data = getTimetables();
                       $.ajax({
                           type: 'POST',
                           contentType: 'application/json',
                           url: '/edit/save/',
                           dataType : 'json',
                           data : JSON.stringify(data),
                           success : function() {
                               $dialog.empty()
                                      .append('<p>Расписания успешно сохранены!</p>')
                                      .dialog({title: 'Успех', buttons: []})
                                      .dialog('open');
                           },
                           error : function(){
                               $dialog.empty()
                                      .append('<p>Ошибка сохранения!</p>')
                                      .dialog({title: 'Ошибка', buttons: []})
                                      .dialog('open');
                           }
                       });
                   }},
                   {text: "Нет", click: function() { $(this).dialog("close"); }}]
	       })
           .dialog('open');
});
// Кнопки навбара - конец



// Функция добавления группы/подгруппы (добавляет элемент li с парами в конец)
function add_subgroup() {
    if (listElems.length < 5) {
        $dialog.empty()
               .append('<input class="dialog_group" type="text" placeholder="Группа">\n' +
                       '<input class="dialog_subgroup" type="text" placeholder="Подгруппа">')
               .dialog({
                   title: 'Добавление группы',
                   buttons: [
                       {text: "Добавить", click: function() {
                           let info = 'data-group="' + $('.dialog_group').val() +
                                      '" data-subgroup="' + $('.dialog_subgroup').val() + '"';
                           $('ul').append('<li>' + addPairsList(null, true, info) + '</li>');
                           listElems = carousel.querySelectorAll('li');
                           carousel.querySelector('.next').click();
                           $(this).dialog("close");
                       }},
                       {text: "Отмена", click: function() { $(this).dialog("close"); }}]
               })
               .dialog('open');
        listElems = carousel.querySelectorAll('li');
    } else {
        $dialog.empty()
               .append('<p>Количество доступных подгрупп: 5</p>')
               .dialog({
                   title: 'Невозможно добавить',
                   buttons: [{text: "Ок", click: function() { $(this).dialog("close"); }}]
               })
               .dialog('open');
    }
}

// Функция генерирует сетку из пар и вставляет ее в переданный элемент $li, если get=false
// И возвращает сетку из пар при get=true
function addPairsList($li=null, get=false, info) {
    let pairs = '',
        lesson = '<select class="lesson">',
        teacher = '<select class="teacher">',
        audience = '<select class="audience">',
        buttons = '<div class="buttons-pair">\n' +
                  '  <button type="button" name="delete">x</button>\n' +
                  '  <button type="button" name="type-switch" onclick="typeChange(this)">тип</button>\n' +
                  '  <button type="button" name="copy">коп</button>\n' +
                  '</div>';


    // TODO: Добавить заполнение дропдаунов
    lesson += '<option value="lesson" disabled selected>Предмет</option>';
    teacher += '<option value="teacher" disabled selected>Преподаватль</option>';
    audience += '<option value="audience" disabled selected>Аудитория</option>';

    lesson += '</select>';
    teacher += '</select>';
    audience += '</select>';
    for (let i = 0; i < 8; i++) pairs += '<div class="pair" data-type=""><div class="wrapper-cell"><div class="dropdowns-pair pair' + i.toString() + '">' +
        lesson + teacher + audience + '</div>' + buttons + '</div></div>';

    let elements = '<div class="pairs-list" ' + info + '><div class="column mon">' + pairs + '</div>';
    elements += '<div class="column tue">' + pairs + '</div>';
    elements += '<div class="column wed">' + pairs + '</div>';
    elements += '<div class="column thu">' + pairs + '</div>';
    elements += '<div class="column fri">' + pairs + '</div>';
    elements += '<div class="column sat">' + pairs + '</div>';

    elements += '</div>';

    if (get) return elements;

    $li.append(elements);
}


function getTimetables() {
    let data = {};
    $('.pairs-list').each(function (num) {
        let timetable = [[[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]]];
        let $this = $(this), group = $this.data('group'), subgroup = $this.data('subgroup'),
            days = $this.find('.column');
        $($(days)).each(function (day) {
            $($(this).find('.pair')).each(function (pair) {
                if ($(this).attr('data-type')) {
                    timetable[day][pair] = [$(this).find('.lesson').text(), $(this).find('.teacher').text(), $(this).find('.audience').text(), $(this).attr('data-type')];
                }
            });
        });
        data[num] = {group: group, subgroup: subgroup, timetable: timetable};
    });

    return data;
}

// Функция изменения типа пары
function typeChange(elem) {
  // 0 - лекция, 1 - практическое, 2 - лабораторное
  let $pair = $(elem).closest('.pair');
  let type = parseInt($pair.attr('data-type'));
  if (isNaN(type)) type = -1;
  type += 1;
  if (type === 3) type = 0;
  $pair.attr('data-type', type.toString());
}