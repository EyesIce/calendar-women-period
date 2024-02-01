let dayDuration;
let startingDay;
let selectedDate;

function generateYears() {
//    console.log('generateYear');
    const yearSelect = document.getElementById("year");
    const currentYear = new Date().getFullYear();

    for (let year = currentYear - 2; year <= currentYear; year++) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    // Imposta l'anno corrente come valore di default
    yearSelect.value = currentYear;
}

function generateMonths() {
//    console.log('generateMonths');
    const monthSelect = document.getElementById("month");

    for (let month = 1; month <= 12; month++) {
        const option = document.createElement("option");
        option.value = month;
        option.textContent = new Date(2000, month - 1, 1).toLocaleString('en-US', { month: 'long' });
        monthSelect.appendChild(option);
    }

    // Imposta il mese corrente come valore di default
    const currentMonth = new Date().getMonth() + 1;
    monthSelect.value = currentMonth;
}

function generateCalendar() {
//    console.log('generateCalendar');
    const calendarGrid = document.querySelector('.calendar-grid');
    calendarGrid.innerHTML = '';

    const selectedYear = document.getElementById("year").value;
    const selectedMonth = document.getElementById("month").value;
    const firstDay = new Date(selectedYear, selectedMonth - 1, 1);
    const lastDay = new Date(selectedYear, selectedMonth, 0);
    const daysInMonth = lastDay.getDate();
    startingDay = firstDay.getDay();

    // Add the days of the week header
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let dayOfWeek of daysOfWeek) {
        const dayElement = document.createElement('div');
        dayElement.textContent = dayOfWeek;
        dayElement.classList.add('day-header');
        calendarGrid.appendChild(dayElement);
    }

    // Add empty cells before the first day of the month
    for (let i = 0; i < startingDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.textContent = '';
        emptyDay.classList.add('empty-day');
        calendarGrid.appendChild(emptyDay);
    }

    // Add days of the month
    const dayElements = [];
    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        dayElement.textContent = i;
        dayElement.classList.add('day-cell');

        // Modifica qui: Usa new Date(selectedYear, selectedMonth - 1, i + 1)
        dayElement.setAttribute('data-date', new Date(selectedYear, selectedMonth - 1, i + 1).toISOString().split('T')[0]);
        dayElements.push(dayElement);
        calendarGrid.appendChild(dayElement);
    }

    // Riattacca gli eventi ai nuovi elementi del giorno
    attachEvents();

    return dayElements;
}

function selectDuration() {
//    console.log('selectDuration');
    dayDuration = document.getElementById('period-duration'); // Inizializza dayDuration correttamente
    for (let i = 1; i < 61; i++) {
        let option = document.createElement("option");
        option.text = i.toString();
        dayDuration.add(option);
    }
    dayDuration.value = 28;
}

function dayClicked(clickedDayElement) {
//    console.log('dayClicked');
    // Verifica se l'elemento cliccato ha già la classe 'selected-day'
    const isSelected = clickedDayElement.classList.contains('selected-day');

    // Rimuovi la classe 'selected-day' da tutti gli elementi
    document.querySelectorAll('.day-cell').forEach(element => {
        element.classList.remove('selected-day');
    });

    // Aggiungi la classe 'selected-day' solo se l'elemento cliccato non è già selezionato
    if (!isSelected) {
        clickedDayElement.classList.add('selected-day');
        selectedDate = clickedDayElement.getAttribute('data-date');
    }
}

function attachEvents() {
//    console.log('attachEvents');
    const dayElements = document.querySelectorAll('.day-cell');

    dayElements.forEach((dayElement) => {
        dayElement.addEventListener('mouseover', function () {
            this.classList.add('hover-effect');
        });

        dayElement.addEventListener('mouseout', function () {
            this.classList.remove('hover-effect');
        });

        dayElement.addEventListener('click', function () {
            dayClicked(this);
        });
    });
}

function highlightPeriod(selectedDate, dayDuration) {
//    console.log('highlightPeriod');

const calendarGrid = document.querySelector('.calendar-grid');
/*calendarGrid.innerHTML = '';

const selectedYear = document.getElementById("year").value;
const selectedMonth = document.getElementById("month").value;
const firstDay = new Date(selectedYear, selectedMonth - 1, 1);
const lastDay = new Date(selectedYear, selectedMonth, 0);
*/
    if (!selectedDate) {
        return;
    }

    clearPeriodHighlights();
    
    const currentDate = new Date(selectedDate);
    const currentDayIndex = currentDate.getDate() + startingDay - 1;
    const dayCells = document.querySelectorAll('.day-cell:not(.empty-day)');
    let startPeriod = parseInt(currentDayIndex) + (dayDuration - 16);
    let endPeriod = parseInt(currentDayIndex) + (dayDuration - 12);


    for (let i = startPeriod; i <= endPeriod; i++) {
        // Modifica qui: Cerca l'elemento corrispondente nell'array dayCells
        const dayElement = dayCells[i];
        if (dayElement) {
            dayElement.classList.add('period');
        }
    }
}

function clearPeriodHighlights() {
//    console.log('clearPeriodHighLights');
    const periodElements = document.querySelectorAll('.period');
    periodElements.forEach((element) => {
        element.classList.remove('period');
    });
}

function __init__() {
//    console.log('__init__');
    generateYears();
    generateMonths();
    generateCalendar();
    selectDuration();
}

document.addEventListener("DOMContentLoaded", function () {
    __init__();
    document.getElementById('calculate').addEventListener('click', function () {
//        console.log('calculate');
        selectedDate = document.querySelector('.selected-day').getAttribute('data-date');
        highlightPeriod(selectedDate, dayDuration.value);
    });
});
