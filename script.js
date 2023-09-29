const cont = document.querySelectorAll('.container-drop');
const dropArea = document.querySelectorAll('.drop-section');
const listSection = document.querySelectorAll('.list-section');
const listContainer = document.querySelectorAll('.list');
const fileSelectorInput = document.querySelectorAll('.file-selector-input');
const fileBtnAll = document.querySelectorAll('.file-selector, input[type="submit"]');
const forms = document.querySelectorAll('form');
const tabAll = document.querySelectorAll('button[role="tab"]');
console.log(tabAll);
let evNum = 0;

console.log(cont);
tabAll.forEach((e) => {
    e.addEventListener('click', () => {
        evNum = e.getAttribute('data-event-id') - 4; 
    })
});

fileBtnAll.forEach((btns) => {
    btns.addEventListener('click', (e) => {
        e.preventDefault();
    })
});

let fd = new FormData();
let fdmas = [];
let h1mas = [];
const h1Text = document.querySelectorAll('h1');

h1Text.forEach((e) => {
    h1mas.push(e.innerHTML);
});

    
// отправка файлов с активной вкладки
function uploadFile() {
    console.log(evNum);
    const inputTitles = forms[evNum].querySelectorAll('.head-text');
    // console.log(inputTitles[0].name);
    let newFd = new FormData();
    
    // перебор массива файлов и поиск файлов на активной странице
    for(let i of fdmas){
        if(evNum == i.split('_')[1]){  // поиск по цифре страницы (между подчёркиванием в названии файла)
            newName = `${i.split('_')[0]}${i.split('_')[2]}`
            newFd.append(`${newName}`, fd.get(i));
        }
    }

    // поиск заголовка по странице
    for(let i = 0; i < inputTitles.length; i++){ 
        newFd.append(`${inputTitles[i].name}`, inputTitles[i].value);
        // fd.delete(`${i}`);
    }
    let http = new XMLHttpRequest();
    http.open('POST', 'sender.php', true);
    http.send(newFd);
    
    // удаление элементов, отправленных по кнопке отправить
    for(let val in fdmas){ 
        if(evNum == fdmas[val].split('_')[1]){
        fd.delete(fdmas[val]);
        fdmas[val] = "";
        }
    }
    fdmas = fdmas.filter(word => word != "");
}

for (let contNum = 0; contNum < cont.length; contNum++) {
    
    // upload files with browse button
    dropArea[contNum].onclick = (e) => {
        fileSelectorInput[contNum].click();
    }

    fileSelectorInput[contNum].onchange = (e) => {
        e.preventDefault();
        [...fileSelectorInput[contNum].files].forEach((file) => {
            if(typeValidation(file.type)){
                addFile(file);
                // fileSelectorInput[contNum].value = "";
            }
            else {
            }
        })
    }

    // when file is over the drag area
    dropArea[contNum].ondragover = (e) => {
        e.preventDefault();
        [...e.dataTransfer.items].forEach((item) => {
            if(typeValidation(item.type)){
                dropArea[contNum].classList.add('drag-over-effect');
            }
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
                    if(typeValidation(file.type)){
                        addFile(file);
                        // fileSelectorInput[contNum].value = "";
                    }
                }
            })
        }else {
            [...e.dataTransfer.files].forEach((file) => {
                if(typeValidation(file.type)){
                    addFile(file);
                    // fileSelectorInput[contNum].value = "";
                }
            })
        }
    }


    // check the file type
    function typeValidation(type){
        if(type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || type == 'application/vnd.ms-excel' || type == 'application/msword' || type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
            return true;
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
        fd.append(`${h1mas[contNum]}_${evNum}_[${i}]`, file);
        fdmas.push(`${h1mas[contNum]}_${evNum}_[${i}]`);  
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
        fd.delete(`${h1mas[index]}${evNum}[${i}]`);
        if (li.parentElement.childElementCount == 1){
            li.parentElement.parentElement.style.display = 'none';
        }
        li.remove();
    }
}

