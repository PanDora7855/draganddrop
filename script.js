const cont = document.querySelectorAll('.container');
const dropArea = document.querySelectorAll('.drop-section');
const listSection = document.querySelectorAll('.list-section');
const listContainer = document.querySelectorAll('.list');
const fileSelectorInput = document.querySelectorAll('.file-selector-input');
const mainSection = document.querySelector('.main');
const headWord = document.querySelectorAll('.head-text');
const fileBtnAll = document.querySelectorAll('.file-selector, .btn-submit');
const forms = document.querySelectorAll('form');
// const formbtn = document.querySelectorAll('.change');

// formbtn.forEach(abc => {
//     abc.addEventListener('click', () => {
//         forms.forEach(e => {
//             e.classList.toggle('hidden');
//         })
//     });
// });

fileBtnAll.forEach((btns) => {
    btns.addEventListener('click', (e) => {
        e.preventDefault();
    })
}) 
document.querySelector('.tab').click();
function openTab(evt, cityName) {
    let i, tabcontent, tablinks;

    tabcontent = document.querySelectorAll(".tab__content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.querySelectorAll(".tab");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.querySelector(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

let fd1 = new FormData();
let fd2 = new FormData();
let fdmas = [];
let h1mas = [];
const h1Text = document.querySelectorAll('h1');

h1Text.forEach((e) => {
    h1mas.push(e.innerHTML);
});

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
                <img src="icons/${iconSelector(file.type)}" alt="" width="40" lenght="50">
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
        if (contNum == 0 || contNum == 1 || contNum == 2) {
            fd1.append(`${h1mas[contNum]}0[${i}]`, file);
            fdmas.push(`${h1mas[contNum]}0[${i}]`);
        }
        else {
            fd2.append(`${h1mas[contNum]}1[${i}]`, file);
            fdmas.push(`${h1mas[contNum]}1[${i}]`);
        }
        
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
        fd.delete('file['+index+']');
        if (li.parentElement.childElementCount == 1){
            li.parentElement.parentElement.style.display = 'none';
        }
        li.remove();
    }
    
    function uploadFile(subm) {
        let formNum = -1
        while (subm.parentElement != forms[formNum]) {
            formNum++;
        }
        for(let headNum = 2*formNum; headNum < 2*formNum+2; headNum++) {
            fdmas.push(`title${formNum}[${headNum}]`);
            if (formNum == 0) {
                fd1.append(`title${formNum}[${headNum}]`, headWord[headNum].value);
            }
            else {
                fd2.append(`title${formNum}[${headNum}]`, headWord[headNum].value);
            }
        }
        let http = new XMLHttpRequest();
        http.open('POST', 'sender.php', true);
        if (formNum == 0) {
            http.send(fd1);
            for (let key of fdmas) {
                fd1.delete(key);
            }
        }
        else {
            http.send(fd2);
            for (let key of fdmas) {
                fd2.delete(key);
            }
        }
        fdmas = [];
        // window.location.replace("http://draganddrop/upload.php");
    }
}

// const savedFiles = document.querySelector('.saved-files');

// var request = new XMLHttpRequest();

// request.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//         console.log(this.responseText);
//         savedFiles.innerHTML = `<li>${this.responseText}</li>`
//     }
// };

// request.open('GET', 'upload.php');
// request.send();
