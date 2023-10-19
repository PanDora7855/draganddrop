const cont = document.querySelectorAll('.container-drop');
const dropArea = document.querySelectorAll('.drop-section');
const listSection = document.querySelectorAll('.list-section');
const listContainer = document.querySelectorAll('.list');
const fileSelectorInput = document.querySelectorAll('.file-selector-input');
const fileBtnAll = document.querySelectorAll('.file-selector, input[type="submit"]');
const forms = document.querySelectorAll('form');
const tabAll = document.querySelectorAll('button[role="tab"]');
let evNum = 0;

tabAll.forEach((e, index) => {
    e.addEventListener('click', () => {
        evNum = index;
        console.log(evNum);
    })
});

fileBtnAll.forEach((btns) => {
    btns.addEventListener('click', (e) => {
        e.preventDefault();
    })
});

let fd = new FormData();
let fdDel = new FormData();
let fdmas = [];
let h1mas = [];
let filemas = [];

const h1Text = document.querySelectorAll('h1');

h1Text.forEach((e) => {
    h1mas.push(e.innerHTML);
});

const fileName = document.querySelectorAll('input[type = "file"]');

fileName.forEach((e) => {
    filemas.push(e.name);
});

// меняем css у удаляемых файлов
function readyToDie(e) {
    e.preventDefault();
    let presentElement = e.target;
    //
    while (!presentElement.classList.contains('ready-to-delete')) {
        presentElement = presentElement.parentElement;
    }
    presentElement.classList.toggle('deleted'); // вкл/выкл класса deleted
}
    
// отправка файлов с активной вкладки
function uploadFile() {
    const inputTitles = forms[evNum].querySelectorAll('.head-text');
    const findDeletedClass = forms[evNum].querySelectorAll('.deleted');
    let newFd = new FormData();
    
    // перебор массива файлов и поиск файлов на активной странице
    for (let i of fdmas){
        if (fd.get(i).name.split('.').at(-1) != 'doc' && fd.get(i).name.split('.').at(-1) != 'docx') {
            return alert('есть ошибки');
        }
        if(evNum == i.split('_')[1]){  // поиск по цифре страницы (между подчёркиванием в названии файла)
            newName = `${i.split('_')[0]}${i.split('_')[2]}`;
            newFd.append(`${newName}`, fd.get(i));
        }
    }

    // поиск заголовка по странице
    for (let i = 0; i < inputTitles.length; i++){ 
        newFd.append(`${inputTitles[i].name}`, inputTitles[i].value);
        // fd.delete(`${i}`);
    }

    // добавление удаляемых файлов в FormData 
    let delNum;
    let formName;
    for (let i of findDeletedClass) {
        // if нужен что бы индексы ключей у разных форм шли с нуля
        if (formName != i.parentElement.parentElement.parentElement.parentElement.querySelector('input[type = "file"]').name) { // если меняется атрибут name то delNum обнуляется
            delNum = 0
        }
        formName = i.parentElement.parentElement.parentElement.parentElement.querySelector('input[type = "file"]').name; // получение атрибута name
        newFd.append(formName + `SelectedFilesToDelete[${delNum}]`, i.querySelector('.name').innerHTML);
        delNum++;
    }

    // let http = new XMLHttpRequest();
    // http.open('POST', 'sender.php', true);
    // http.send(newFd);
    // for (keys of newFd.entries()) {
    //     console.log(keys);
    // }
    fetch('upload.php', {
        method: 'POST',
        body: newFd,
        // redirect: 'error'
    })

    .then(res => {
        if (!res.ok) {
            throw new Error('Bad response');
        }
         console.log(res);
    })
    // .then(location.href = 'https://google.com')
    .catch(err => {
        console.log(err);
    })
    // http.onreadystatechange = function() { // listen for state changes
    //     if (http.readyState == 4 && http.status == 200) { // when completed we can move away
    //         window.location = "sender.php";
    //     }
    // }

    


//     // удаление элементов, отправленных по кнопке отправить
//     // for(let val in fdmas){ 
//     //     if(evNum == fdmas[val].split('_')[1]){
//     //     fd.delete(fdmas[val]);
//     //     newFd.delete(fdmas[val]);
//     //     fdmas[val] = "";
//     //     }
//     // }
//     // fdmas = fdmas.filter(word => word != "");
//     // fdmas = 
}

// function uploadFile(e) {
//     return new Promise(function (resolve, reject) {
//         const inputTitles = forms[evNum].querySelectorAll('.head-text');
//         const findDeletedClass = forms[evNum].querySelectorAll('.deleted');
//         let newFd = new FormData();
        
//         // перебор массива файлов и поиск файлов на активной странице
//         for (let i of fdmas){
//             if(evNum == i.split('_')[1]){  // поиск по цифре страницы (между подчёркиванием в названии файла)
//                 newName = `${i.split('_')[0]}${i.split('_')[2]}`;
//                 newFd.append(`${newName}`, fd.get(i));
//             }
//         }

//         // поиск заголовка по странице
//         for (let i = 0; i < inputTitles.length; i++){ 
//             newFd.append(`${inputTitles[i].name}`, inputTitles[i].value);
//             // fd.delete(`${i}`);
//         }

//         // добавление удаляемых файлов в FormData 
//         let delNum;
//         let formName;
//         for (let i of findDeletedClass) {
//             // if нужен что бы индексы ключей у разных форм шли с нуля
//             if (formName != i.parentElement.parentElement.parentElement.parentElement.querySelector('input[type = "file"]').name) { // если меняется атрибут name то delNum обнуляется
//                 delNum = 0
//             }
//             formName = i.parentElement.parentElement.parentElement.parentElement.querySelector('input[type = "file"]').name; // получение атрибута name
//             newFd.append(formName + `SelectedFilesToDelete[${delNum}]`, i.querySelector('.name').innerHTML);
//             delNum++;
//         }
//         let xhr = new XMLHttpRequest();
//         xhr.open('POST', 'sender.php');
        
//         xhr.onload = function () {
//             if (this.status >= 200 && this.status < 300) {
//                 resolve(xhr.response);
//                 //window.location.href = 'https://google.com';
//                 document.location.replace('https://google.com');
//             } else {
//                 reject({
//                     status: this.status,
//                     statusText: xhr.statusText
//                 });
//             }
//         };
//         xhr.onerror = function () {
//             reject({
//                 status: this.status,
//                 statusText: xhr.statusText
//             });
//         };
//         xhr.responseType = 'json';
//         xhr.send(newFd);
//     });
// }

for (let contNum = 0; contNum < cont.length; contNum++) {
    
    // upload files with browse button
    dropArea[contNum].onclick = (e) => {
        fileSelectorInput[contNum].click();
    }

    fileSelectorInput[contNum].onchange = (e) => {
        e.preventDefault();
        [...fileSelectorInput[contNum].files].forEach((file) => {
            // if(typeValidation(file.type)){
                addFile(file);
                // fileSelectorInput[contNum].value = "";
            // }
            // else {
            // }
        })
    }

    // when file is over the drag area
    dropArea[contNum].ondragover = (e) => {
        e.preventDefault();
        [...e.dataTransfer.items].forEach((item) => {
            // if(typeValidation(item.type)){
                dropArea[contNum].classList.add('drag-over-effect');
            // }
        })
    }
    // when file leave the drag area
    dropArea[contNum].ondragleave = () => {
        dropArea[contNum].classList.remove('drag-over-effect');
    }
    // when file drop on the drag area
    dropArea[contNum].ondrop = (e) => {
        e.preventDefault();
        dropArea[contNum].classList.remove('drag-over-effect')
        if(e.dataTransfer.items){
            [...e.dataTransfer.items].forEach((item) => {
                if(item.kind === 'file'){
                    const file = item.getAsFile();
                    // if(typeValidation(file.type)){
                        addFile(file);
                        // fileSelectorInput[contNum].value = "";
                    // }
                }
            })
        }else {
            [...e.dataTransfer.files].forEach((file) => {
                // if(typeValidation(file.type)){
                    addFile(file);
                    // fileSelectorInput[contNum].value = "";
                // }
            })
        }
    }

    // check the file type
    function typeValidation(type){
        if(type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || type == 'application/vnd.ms-excel' || type == 'application/msword' || type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
            return true;
        }
        else {
            alert('Нужен другой тип файла');
        }
    }

    // upload file function
    let i = 0;
    function addFile(file){
        listSection[contNum].style.display = 'flex';
        listSection[contNum].style.flexDirection = 'column';
        const li = document.createElement('li');
        li.classList.add(`num${i}`, `cont-${contNum}`);
        li.innerHTML = `
            <div class="col">
                <img src="bs-icons/${iconSelector(file.type)}" alt="" width="40" lenght="50">
            </div>
            <div class="col">
                <div class="file-name">
                    <div class="name">${file.name}</div>
                </div>
            </div>
            <div class="col" onclick="deleteItem('.num${i}', ${i}, 'cont-${contNum}')">
                <svg xmlns="http://www.w3.org/2000/svg" class="cross" height="20" width="20"><path d="m5.979 14.917-.854-.896 4-4.021-4-4.062.854-.896 4.042 4.062 4-4.062.854.896-4 4.062 4 4.021-.854.896-4-4.063Z"/></svg>
            </div>
        `

        listContainer[contNum].append(li);
        fd.append(`${filemas[contNum]}_${evNum}_[${i}]`, file);
        // console.log(`${filemas[contNum]}_${evNum}_[${i}]`, file);
        fdmas.push(`${filemas[contNum]}_${evNum}_[${i}]`);  
        i++;
    }

    // find icon for file
    function iconSelector(type){
        newIcon = (type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || type == 'application/vnd.ms-excel') ? 'xls.png' : 'doc.png';
        return newIcon;
    }

    // delete file from list    
    function deleteItem(num, index, contNumm) {
        let li = document.querySelector(`${num}.${contNumm}`);
        contNumm = contNumm.split('-')[1];
        fd.delete(`${filemas[contNumm]}_${evNum}_[${index}]`);
        for (let val in fdmas){
           if (fdmas[val] == `${filemas[contNumm]}_${evNum}_[${index}]`){
            // fdmas[val] = "";
            fdmas.splice(val, 1);
           }
           /////       
        }
        if (li.parentElement.childElementCount == 1){
            li.parentElement.parentElement.style.display = 'none';
        }
        li.remove();
    }
}