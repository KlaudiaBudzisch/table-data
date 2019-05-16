let array = [{
        "imie": "Jan",
        "nazwisko": "Kowalski",
        "dzial": "IT",
        "wynagrodzenie": 3000,
        "waluta": "PLN"
    },
    {
        "imie": "Anna",
        "nazwisko": "Bąk",
        "dzial": "Administracja",
        "wynagrodzenie": 2400.50,
        "waluta": "PLN"
    },
    {
        "imie": "Paweł",
        "nazwisko": "Zabłocki",
        "dzial": "IT",
        "wynagrodzenie": 3300,
        "waluta": "PLN"
    },
    {
        "imie": "Tomasz",
        "nazwisko": "Osiecki",
        "dzial": "Administracja",
        "wynagrodzenie": 2100,
        "waluta": "PLN"
    },
    {
        "imie": "Iwona",
        "nazwisko": "Leihs-Gutowska",
        "dzial": "Handlowiec",
        "wynagrodzenie": 3100,
        "waluta": "PLN"
    },
];


const table = document.querySelector("table");
const filters = document.querySelector('#filterType');

function generateTable(table, array) {
    let row, cell;
    array.forEach(function (obj) {
        row = table.insertRow();

        for (let [key, value] of Object.entries(obj)) {
            cell = row.insertCell()
            let text = document.createTextNode(value);
            cell.appendChild(text);
            cell.dataset.key = value;
        }
    });

    let keys = Object.keys(array[0]);
    return generateTableHead(table, keys);
}

function generateTableHead(table, keys) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of keys) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}

function getKey(target, array) {
    let keyArray = array.map(function (obj) {
        for (let [key, value] of Object.entries(obj)) {
            if (key === target) {
                return value;
            }
        }
    });

    filters.insertAdjacentHTML('beforeend', `<fieldset id='${target}'><legend></legend></fieldset>`)
    createFilters(keyArray);
}

function createFilters(array) {
    let set = Array.from(new Set([...array]));
    set.forEach(function (name) {
        let chk = `<label><input type="checkbox" data-filter="${name}" checked>${name}</label>`;
        filters.lastElementChild.insertAdjacentHTML('beforeend', chk);
    });
};

function filterKey(e) {
    const tgt = e.target;
    let name = tgt.dataset.filter;
    let keys = document.querySelectorAll(`[data-key="${name}"]`);
    for (let cell of keys) {
        if (tgt.checked) {
            cell.closest('tr').classList.remove('off');
        } else {
            cell.closest('tr').classList.add('off');
        }
    }
}

generateTable(table, array);
getKey('dzial', array);


filters.onchange = filterKey;

document.querySelector('#newPerson').addEventListener('submit', (e) => {

    let nameP = document.querySelector('#name').value;
    let surname = document.querySelector('#surname').value;
    let department = document.querySelector('#department').value;
    let salary = document.querySelector('#salary').value;
    let currency = document.querySelector('#currency').value;

    if (!validation(nameP, surname, department, salary, currency)) {
        return false;
    }

    const personData = {
        imie: nameP,
        nazwisko: surname,
        dzial: department,
        wynagrodzenie: Number(salary),
        waluta: currency
    }


    document.querySelector('#newPerson').reset();
    array.push(personData);

    let newRow = `<tr>
                        <td data-key="${name}">${nameP}</td>
                        <td data-key="${surname}">${surname}</td>
                        <td data-key="${department}">${department}</td>
                        <td data-key="${salary}">${salary}</td>
                        <td data-key="${currency}">${currency}</td>
                        </tr> `;
    table.lastElementChild.insertAdjacentHTML('beforeend', newRow);

    summary.innerHTML = ' ';
    filters.innerHTML = ' ';
    getDepartments('dzial', array);
    getKey('dzial', array);
    e.preventDefault();
})

function validation(nameP, surname, department, salary, currency) {
    if (!nameP || !surname || !department || !salary || !currency) {
        alert('Please fill in the form');
        return false;
    }
    return true;
}

function filterPerson(e) {
    let filter = e.target.value.toUpperCase();
    let tableRows = document.querySelector("table tbody").rows;

    for (let i = 0; i < tableRows.length; i++) {

        let firstCol = tableRows[i].cells[0].textContent.toUpperCase();
        let secondCol = tableRows[i].cells[1].textContent.toUpperCase();

        if (firstCol.indexOf(filter) > -1 || secondCol.indexOf(filter) > -1) {
            tableRows[i].style.display = "";
        } else {
            tableRows[i].style.display = "none";
        }
    }
}

let tableRows = document.querySelector("table tbody").rows;

function filterSalary(e) {
    let filter = e.target.value;
    let checkID = e.target.getAttribute('id');

    for (let i = 0; i < tableRows.length; i++) {

        let nameColumn = tableRows[i].cells[0].textContent.toUpperCase();
        let surnameColumn = tableRows[i].cells[1].textContent.toUpperCase();
        let salaryColumn = tableRows[i].cells[3].textContent;

        if ((salaryColumn >= filter && checkID == 'minSalaryFilter') || (salaryColumn == filter && checkID == 'maxSalaryFilter') ||
            (nameColumn.indexOf(filter.toUpperCase()) > -1 && checkID == 'personFilter') ||
            (surnameColumn.indexOf(filter.toUpperCase()) > -1 && checkID == 'personFilter')) {
            tableRows[i].style.display = " ";
        } else {
            tableRows[i].style.display = "none";
        }
    }
};

function filterMinMax() {
    let min = document.querySelector('#minSalaryFilter').value;
    let max = document.querySelector('#maxSalaryFilter').value;
    for (let i = 0; i < tableRows.length; i++) {
        let salaryColumn = tableRows[i].cells[3].textContent;

        if (salaryColumn >= min | salaryColumn == max) {
            tableRows[i].style.display = " ";
        } else {
            tableRows[i].style.display = "none";
        }
    }

}

document.querySelector('#showSalary').addEventListener('click', filterMinMax);
document.querySelector('#personFilter').addEventListener('keyup', filterPerson, false);


const summary = document.querySelector('div.summary');


function getDepartments(target, array) {
    let keyArray = array.map(function (obj) {
        for (let [key, value] of Object.entries(obj)) {
            if (key === target) {
                return value;
            }
        }

    });

    const getSalary = function (name) {
        return array.filter(({
            dzial
        }) => dzial == name).reduce((accu, {
            wynagrodzenie
        }) => accu + wynagrodzenie, 0);
    }

    const createDepartments = function (array) {
        let set = Array.from(new Set([...array]));
        set.forEach(function (name) {

            let totalSum = getSalary(name);

            let chk = `<span>Suma wynagrodzeń działu <b><font color="#6078ff">${name}</font>: <font color="#ff5656">${totalSum} PLN</font></b></span>`;
            summary.lastElementChild.insertAdjacentHTML('beforeend', chk);
        });
    };
    const totalSalary = array.reduce((acc, salary) => acc + salary.wynagrodzenie, 0);
    summary.insertAdjacentHTML('beforeend', `<div class="dataSummary"><h4>Suma wszystkich wynagrodzeń <font color="#ff5656">${totalSalary} PLN</font></h4><span></span></fieldset>`)
    createDepartments(keyArray);
}

getDepartments('dzial', array);
