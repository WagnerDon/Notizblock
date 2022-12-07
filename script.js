let titles = [];
let notes = [];

let binTitles = [];
let binNotes = [];

load();
loadDustbin();

function renderContent() {
    let content = document.getElementById('content');   // Kann keine Globable Variable sein weil Code von oben nach unten lädt
    content.innerHTML = '';
    if (titles && notes) {
        for (x = titles.length - 1; x > -1; x--) {
            const title = titles[x];    // Muss hier drinnen sein wegen x
            const note = notes[x];
            renderHTML(x, title, note);
        }
    }
    document.getElementById('iconNote').setAttribute('src', 'img/note-dark.png');
    document.getElementById('iconDustbin').setAttribute('src', 'img/dustbin.png');
    loadLight();
}

function renderHTML(x, title, note) {
    content = document.getElementById('content');
    content.innerHTML += `
                    <div contenteditable="false" id="${x}" class="card padding10">
                        <h2>${x + 1} ${title}
                        <div>
                        <button class="header-outer" onclick="reconsider(${x})"><img id="${x + "ho"}" class="icons" src="img/edit.png"></button>
                        <button onmouseover="switchIcon(${x}, 'delete', 'delete-dark')" onmouseleave="switchIcon(${x}, 'delete', 'delete-bright')" class="header-outer" onclick="moveToBin(${x})"><img id="${x + "delete"}" class="icons" src="img/delete.png"></button>
                        </div>
                        </h2>
                        <div class="overflow-auto" id="${x + "hi"}">
                        ${note}
                        </div>
                    </div>
                `;
}

function switchIcon(x, y, z) {
    if (z == 'delete-dark') {
        document.getElementById(x + y).setAttribute('src', 'img/delete-dark.png');
    }

    if (z == 'delete-bright') {
        document.getElementById(x + y).setAttribute('src', 'img/delete.png');
    }

    if (z == 'restore-dark') {
        document.getElementById(x + y).setAttribute('src', 'img/recover-dark.png');
    }

    if (z == 'restore-bright') {
        document.getElementById(x + y).setAttribute('src', 'img/recover.png');
    }

    if (z == 'terminate-dark') {
        document.getElementById(x + y).setAttribute('src', 'img/delete-dark.png');
    }

    if (z == 'terminate-bright') {
        document.getElementById(x + y).setAttribute('src', 'img/delete.png');
    }
}

function renderTextfield() {
    let content = document.getElementById('content');
    if (!document.getElementById('template')) {
        content.innerHTML += `<div contenteditable="true" id="template" class="padding10"></div>`; // Frage white-space
        content.addEventListener("keydown", function (e) { if (e.keyCode == 13 && e.altKey) { addNote(); } })
    }
}

function addNote() {
    x = document.getElementById('title');   // Frage
    y = document.getElementById('template');

    if (x.value.length > 0 && y.innerHTML.length > 0) {
        titles.push(x.value);
        notes.push(y.innerHTML);
        x.value = '';

        save();
        renderContent();
    } else {
        renderContent();
    }
}

function save() {
    titlesString = JSON.stringify(titles);
    notesString = JSON.stringify(notes);

    localStorage.setItem('title', titlesString);
    localStorage.setItem('note', notesString);
}

function load() {
    titlesString = localStorage.getItem('title');
    notesString = localStorage.getItem('note');

    if (titlesString && notesString) {
        titles = JSON.parse(titlesString);
        notes = JSON.parse(notesString);
    }
}

function moveToBin(x) {
    binTitles.push(titles[x]);
    binNotes.push(notes[x]);

    titles.splice(x, 1);
    notes.splice(x, 1);

    renderContent();
    save();
    saveDustbin();
}

function reconsider(x) {
    let b;
    if (document.getElementById(x + "hi").contentEditable == "true") {
        b = "open";
    } else {
        b = "closed"
    }

    if (b == "closed") {
        document.getElementById(x + "hi").contentEditable = "true";
        document.getElementById(x + "hi").classList.add('border');
        document.getElementById(x + "ho").setAttribute('src', 'img/edit-dark.png');
    } else {
        document.getElementById(x + "hi").contentEditable = "false";
        document.getElementById(x + "hi").classList.remove('border');
        saveEdit(x);
        document.getElementById(x + "ho").setAttribute('src', 'img/edit.png');
    }
}

function saveEdit(x) {
    let toSave = document.getElementById(x + "hi");
    notes[x] = toSave.innerHTML;
    save();
}

function renderDustbin() {
    let content = document.getElementById('content');
    content.innerHTML = '';
    for (x = binTitles.length - 1; x > -1; x--) {
        const title = binTitles[x];
        const note = binNotes[x];
        renderDustbinHTML(x, title, note);
    }
    document.getElementById('iconNote').setAttribute('src', 'img/note.png');
    document.getElementById('iconDustbin').setAttribute('src', 'img/dustbin-dark.png');
}

function renderDustbinHTML(x, title, note) {
    content = document.getElementById('content');
    content.innerHTML += `
                <div class="card padding10 color">
                    <h2>${x + 1} ${title}
                    <div>
                    <button onmouseover="switchIcon(${x}, 'restore', 'restore-dark')" onmouseleave="switchIcon(${x}, 'restore', 'restore-bright')" class="header-outer" onclick="restore(${x})"><img class="icons" id="${x + "restore"}" src="img/recover.png"></button>
                    <button class="header-outer" onmouseover="switchIcon(${x}, 'terminate', 'terminate-dark')" onmouseleave="switchIcon(${x}, 'terminate', 'terminate-bright')" onclick="terminate(${x})"><img class="icons" id="${x + "terminate"}" src="img/delete.png"></button>
                    </div>
                    </h2>
                    <div class="overflow-auto">${note}</div>
                </div>
                `;
}

function terminate(x) {
    binTitles.splice(x, 1);
    binNotes.splice(x, 1);

    renderDustbin();
    saveDustbin();
}

function restore(x) {
    titles.push(binTitles[x]);
    notes.push(binNotes[x]);

    binTitles.splice(x, 1);
    binNotes.splice(x, 1)

    renderDustbin();
    save();
    saveDustbin();
}

function saveDustbin() {
    binTitlesStringify = JSON.stringify(binTitles);
    binNotesStringify = JSON.stringify(binNotes);

    localStorage.setItem('binTitle', binTitlesStringify);
    localStorage.setItem('binNote', binNotesStringify);
}

function loadDustbin() {
    binTitlesStringify = localStorage.getItem('binTitle');
    binNotesStringify = localStorage.getItem('binNote');

    if (binTitlesStringify && binNotesStringify) {
        binTitles = JSON.parse(binTitlesStringify);
        binNotes = JSON.parse(binNotesStringify)
    }
}

function menu() {
    let x;
    if (document.getElementById('q').classList.contains('display-none')) {
        document.getElementById('q').classList.remove('display-none');
        document.getElementById('w').classList.remove('display-none');
        document.getElementById('e').classList.add('display-none');
        document.getElementById('r').classList.add('display-none');
        x = "open";  //entfernen x = 0
        localStorage.setItem('Options', x);
        document.getElementById('iconOption').setAttribute('src', 'img/option-dark.png');
    } else {
        document.getElementById('q').classList.add('display-none');
        document.getElementById('w').classList.add('display-none');
        document.getElementById('e').classList.remove('display-none');
        document.getElementById('r').classList.remove('display-none');
        x = "closed";  //hinzufügen x = 1
        localStorage.setItem('Options', x);
        document.getElementById('iconOption').setAttribute('src', 'img/option.png');
    }
}

function loadMenu() {
    x = localStorage.getItem('Options')
    if (x == 'open') {
        document.getElementById('q').classList.remove('display-none');
        document.getElementById('w').classList.remove('display-none');
        document.getElementById('e').classList.add('display-none');
        document.getElementById('r').classList.add('display-none');
    }

    if (x == 'closed') {
        document.getElementById('q').classList.add('display-none');
        document.getElementById('w').classList.add('display-none');
        document.getElementById('e').classList.remove('display-none');
        document.getElementById('r').classList.remove('display-none');
    }
}

function light() {
    let x;
    if (document.getElementById('header').classList.contains('light2')) {
        x = "dark";
    }

    if (!document.getElementById('header').classList.contains('light2')) {
        x = "bright";
    }

    if (x == "bright") {
        document.getElementById('header').classList.add('light2');
        document.getElementById('background').classList.add('light');
        document.getElementById('header').classList.add('black');
        document.getElementById('iconBulb').setAttribute('src', 'img/bulb-dark.png');
        elements = document.getElementsByClassName('card');
        for (i = 0; i < elements.length; i++) {
            elements[i].style.backgroundColor = "#d8e6f2";
        }
    }

    if (x == "dark") {
        document.getElementById('header').classList.remove('light2');
        document.getElementById('background').classList.remove('light');
        document.getElementById('header').classList.remove('black');
        document.getElementById('iconBulb').setAttribute('src', 'img/bulb.png');
        elements = document.getElementsByClassName('card');
        for (i = 0; i < elements.length; i++) {
            elements[i].style.backgroundColor = "rgb(73 78 115)";
        }
    }

    localStorage.setItem('Light', x);
}

function testLight() {
    if (document.getElementById('header').classList.contains('light2')) {
        localStorage.setItem('Light', "bright");
    } else {
        localStorage.setItem('Light', "dark");
    }
}

function loadLight() {
    let x = localStorage.getItem('Light');
    if (x == "bright") {
        document.getElementById('header').classList.add('light2');
        document.getElementById('background').classList.add('light');
        document.getElementById('header').classList.add('black');
        elements = document.getElementsByClassName('card');
        for (i = 0; i < elements.length; i++) {
            elements[i].style.backgroundColor = "#d8e6f2";
        }
    }

    if (x == "dark") {
        document.getElementById('header').classList.remove('light2');
        document.getElementById('background').classList.remove('light');
        document.getElementById('header').classList.remove('black');
        elements = document.getElementsByClassName('card');
        for (i = 0; i < elements.length; i++) {
            elements[i].style.backgroundColor = "rgb(73 78 115)";
        }
    }
}

function check() {
    if (document.getElementById('header').classList.contains('light2')) {
        document.getElementById('iconBulb').setAttribute('src', 'img/bulb-dark.png');
    } else {
        document.getElementById('iconBulb').setAttribute('src', 'img/bulb.png');
    }

    if (document.getElementById('q').classList.contains('display-none')) {
        document.getElementById('iconOption').setAttribute('src', 'img/option.png');
    } else {
        document.getElementById('iconOption').setAttribute('src', 'img/option-dark.png');
    }
}

function init() {
    loadMenu();
    renderContent();
    check();
    testLight();
}