const cont = document.querySelectorAll('.container');
const dropArea = document.querySelectorAll('.drop-section');
const listSection = document.querySelectorAll('.list-section');
const listContainer = document.querySelectorAll('.list');
const fileSelectorInput = document.querySelectorAll('.file-selector-input');
const mainSection = document.querySelector('.main');
let fd = new FormData();

for (let contNum = 0; contNum < cont.length; contNum++) {
    
    // upload files with browse button
    dropArea[contNum].onclick = () => {
        fileSelectorInput[contNum].click();
    }
    fileSelectorInput[contNum].onchange = () => {
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
        if (!!fd.get('file['+i+']')) {
            i++;
        }
        listSection[contNum].style.display = 'flex';
        listSection[contNum].style.flexDirection = 'column';
        const li = document.createElement('li');
        li.classList.add('in-prog');
        li.classList.add(`num${i}`, `cont-${contNum}`);
        li.innerHTML = `
            <div class="col">
                <img src="icons/${iconSelector(file.type)}" alt="" width="40" lenght="50">
            </div>
            <div class="col">
                <div class="file-name">
                    <div class="name">${file.name}</div>
                    <span>0%</span>
                </div>
                <div class="file-progress">
                    <span></span>
                </div>
                <div class="file-size">${(file.size/(1024*1024)).toFixed(2)} MB</div>
            </div>
            <div class="col" onclick="deleteItem('.num${i}', ${i}, 'cont-${contNum}')">
                <svg xmlns="http://www.w3.org/2000/svg" class="cross" height="20" width="20"><path d="m5.979 14.917-.854-.896 4-4.021-4-4.062.854-.896 4.042 4.062 4-4.062.854.896-4 4.062 4 4.021-.854.896-4-4.063Z"/></svg>
            </div>
        `

        if (listSection[0].childNodes[3].childElementCount == 0 && listSection[1].childNodes[3].childElementCount == 0) {
            mainSection.insertAdjacentHTML('afterend', '<input type="submit" value="Submit" class="btn-submit" onclick="uploadFile()">');
        }
        // btnSubmit = document.querySelectorAll('.btn-submit');
        listContainer[contNum].append(li);
        
        fd.append('file['+i+']', file);
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
        let lenght = 0;
        fd.forEach(() => {
            lenght++
        })
        console.log(!!lenght);
        if (!!length == false) {
            document.querySelector('body').childNodes[2].remove();
        }
        li.remove();
    }

    // upload file to server
    function uploadFile() {
        const listAll = document.querySelectorAll('.in-prog, .complete');
        let newFile;
        let index = 0;
        for (value of fd.values()) {
            // if (value.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            //     alert (value.name);
            //     break;
            // }
            let item = listAll[index];
            if (item.classList.contains('in-prog')){
                newFile = value;
                const newFd = new FormData();
                newFd.append('file[]', newFile);
                let http = new XMLHttpRequest();
                http.onload = () => {
                    item.classList.add('complete');
                    item.classList.remove('in-prog');
                };
                http.upload.onprogress = (e) => {
                    let percent_complete = (e.loaded / e.total)*100;
                    item.querySelectorAll('span')[0].innerHTML = Math.round(percent_complete) + '%';
                    item.querySelectorAll('span')[1].style.width = percent_complete + '%';
                };
                http.open('POST', 'sender.php', true);
                http.send(newFd);
                item.querySelector('.cross').onclick = () => http.abort();
                http.onabort = () => item.remove();
            }
            index++
        }
        index = 0;
    }

}