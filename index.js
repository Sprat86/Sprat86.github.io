"use strict";

let wrapper__table = document.querySelector('.wrapper__table');
let input__search = document.querySelector('.wrapper__input input');
let button__search = document.querySelector('.wrapper__input button');
let input_search =  document.querySelector('.input__search');
let button_search =  document.querySelector('.button__search');
let body = document.querySelector('body');
let ENTER_KEYCODE = 13;


// let URL = "http://edu.nd.ru/tests/test1.json";
let URL = "./test1.json";


let arrayForFilter = [];

/** Загрузка данных из backend:*/
let setup = function (onLoad, onError) {
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 10000;        

    xhr.addEventListener('load', function () {
        switch (xhr.status) {
            case 200:
                onLoad(xhr.response);                
                break;
            default:
                onError('Ошибка данных: ' + xhr.status + ' ' + xhr.statusText);
        }  
    let arrayResponse = xhr.response.teachers;
    arrayResponse.forEach(function (item) {
        arrayForFilter.push(item);
        });

    });
        

    xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
        console.log(onError);
    });
    return xhr;
};


/** Функция скачивания данных с сервера: */
let download = function (onLoad, onError, url) {
    let xhr = setup(onLoad, onError);
    xhr.open('GET', url);        
    xhr.send();
};



/** Функция создания таблицы с данными:*/
let createTableCell = function (form, avatars) {
    avatars.forEach(function (item, key) {
        // console.log(item);
        let table__row = document.createElement('div');
        table__row.setAttribute('class', 'table__row');

        let table__cell_number = document.createElement('div');
        table__cell_number.setAttribute('class', 'table__cell');
        let number = document.createTextNode(key + 1);
        table__cell_number.appendChild(number);

        let table__cell_fullname = document.createElement('div');
        table__cell_fullname.setAttribute('class', 'table__cell');
        let fullname = document.createTextNode(item.fullname);
        table__cell_fullname.appendChild(fullname);

        let table__cell_birthdate = document.createElement('div');
        table__cell_birthdate.setAttribute('class', 'table__cell');
        let birthdate = document.createTextNode(item.birthdate);
        table__cell_birthdate.appendChild(birthdate);

        let table__cell_qualification_category = document.createElement('div');
        table__cell_qualification_category.setAttribute('class', 'table__cell');
        let qualification_category = document.createTextNode(item.qualification_category);
        table__cell_qualification_category.appendChild(qualification_category);

        let table__cell_organization = document.createElement('div');
        table__cell_organization.setAttribute('class', 'table__cell');
        let organization = document.createTextNode(item.organization);
        table__cell_organization.appendChild(organization);

        let table__cell_org_type = document.createElement('div');
        table__cell_org_type.setAttribute('class', 'table__cell');
        let org_type = document.createTextNode(item.org_type);
        table__cell_org_type.appendChild(org_type);

        let table__cell_status = document.createElement('div');
        table__cell_status.setAttribute('class', 'table__cell');
        let status = document.createTextNode(item.vid);
        table__cell_status.appendChild(status);

        let table__cell_territory = document.createElement('div');
        table__cell_territory.setAttribute('class', 'table__cell');
        let territory = document.createTextNode(item.territory);
        table__cell_territory.appendChild(territory);

        let table__cell_location = document.createElement('div');
        table__cell_location.setAttribute('class', 'table__cell');
        let location = document.createTextNode(item.location);
        table__cell_location.appendChild(location);

        table__row.appendChild(table__cell_number);
        table__row.appendChild(table__cell_fullname);
        table__row.appendChild(table__cell_birthdate);
        table__row.appendChild(table__cell_qualification_category);
        table__row.appendChild(table__cell_organization);
        table__row.appendChild(table__cell_org_type);
        table__row.appendChild(table__cell_status);
        table__row.appendChild(table__cell_territory);
        table__row.appendChild(table__cell_location);

        form.appendChild(table__row);
    });
};



/** Функция рендеринга таблицы на основе входных параметров:*/
let renderTableCell = function (avatars) {
    createTableCell(wrapper__table, avatars.teachers);    
};



/** Функция удаления неиспользуемых строк таблицы*/
let deleteTableCell = function () {
    let table__row_del = document.querySelectorAll('.table__row');
    // console.log(table__row_del);
    for (let i = 1; i < table__row_del.length; i++) {
        wrapper__table.removeChild(table__row_del[i]);
    }
};

/** Функция загрузки данных при загрузке страницы:*/
document.addEventListener("DOMContentLoaded", function () {    
    download(renderTableCell, errorHandler, URL);       
});



/** НАВЕШИВАЕМ ОБРАБОТЧИКИ СОБЫТИЙ НА КНОПКИ*/

/** Функция колбэк для поиска данных*/
let searchString = function () {   
    let filterArray = []; 
    
    filterArray = arrayForFilter.filter(function (item) {       
        for (let key in item){ // Пробегаемся циклом по ключам объекта:
            if (item[key].toLowerCase().indexOf(input__search.value.toLowerCase()) !== -1) { 
            return item;
                }            
            }        
    });
    if (filterArray.length === 0) {
        errorHandler("Данные не найдены");        
    }
    if (input__search.value.length === 0) {    
        filterArray.length = 0;    
        errorHandler("Введите данные");
    }
    console.log(filterArray);    
    deleteTableCell(); 
    createTableCell(wrapper__table, filterArray);
};


/** Обработчик события на нажатие кнопки Enter, когда поле ввода поиска активно*/
input__search.addEventListener("keydown", function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
        searchString();
    }
});

button__search.addEventListener('click', searchString);


/** Создание окна "ошибки загрузки" данных с сервера:*/
let createPopup = function () {
    let popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.zIndex = 1;
    popup.style.padding = '50px';
    popup.style.background = '#fff';
    popup.style.border = '5px solid #ff6d51';
    popup.style.borderRadius = '20px';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.cursor = 'pointer';
    popup.className = 'popup hidden';
    return popup;
};


/** Функция добавления элементов диалогового окна на страницу*/
let renderDialog = function () {
    let fragment = document.createDocumentFragment();
    fragment.appendChild(createPopup());
    document.body.appendChild(fragment);    
};

/** Функция показа диалогового окна*/
let showDialog = function (message) {
    popup.textContent = message;
    popup.classList.remove('hidden');    
};

/** Функция скрытия диалогового окна*/
let hideDialog = function () {
    popup.classList.add('hidden');
};

renderDialog();

/** Функция, выводящая окно с ошибкой при неудачной обработке данных*/
let errorHandler = function (errorMessage) {
    showDialog(errorMessage);    
    input_search.setAttribute('disabled', true);
    button_search.setAttribute('disabled', true);
    body.classList.add("opacity");
    arrayForFilter.length = 0; 
};

let popup = document.querySelector('.popup');

popup.addEventListener("mouseup", function () {
    hideDialog();
    input_search.removeAttribute('disabled');
    button_search.removeAttribute('disabled');
    body.classList.remove("opacity");
    download(renderTableCell, errorHandler, URL);    
});
