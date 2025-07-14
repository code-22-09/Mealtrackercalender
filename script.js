const datePicker = document.getElementById('datePicker');
const mealForm = document.getElementById('mealForm');
const mealType = document.getElementById('mealType');
const foodName = document.getElementById('foodName');
const cost = document.getElementById('cost');
const mealList = document.getElementById('mealList');
const dailyTotal = document.getElementById('dailyTotal');
const exportTXT = document.getElementById('exportTXT');
const exportCSV = document.getElementById('exportCSV');
const exportPDF = document.getElementById('exportPDF');

let mealsData = JSON.parse(localStorage.getItem('mealsData')) || {};

function updateMealList() {
    const date = datePicker.value;
    mealList.innerHTML = '';
    let total = 0;
    if (mealsData[date]) {
        mealsData[date].forEach(meal => {
            const li = document.createElement('li');
            li.textContent = `${meal.type}: ${meal.name} - $${meal.cost.toFixed(2)}`;
            mealList.appendChild(li);
            total += meal.cost;
        });
    }
    dailyTotal.textContent = `Total Cost: $${total.toFixed(2)}`;
}

mealForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const date = datePicker.value;
    if (!date) {
        alert('Please select a date.');
        return;
    }

    const newMeal = {
        type: mealType.value,
        name: foodName.value,
        cost: parseFloat(cost.value)
    };

    if (!mealsData[date]) {
        mealsData[date] = [];
    }

    mealsData[date].push(newMeal);
    localStorage.setItem('mealsData', JSON.stringify(mealsData));
    updateMealList();
    mealForm.reset();
});

datePicker.addEventListener('change', updateMealList);

exportTXT.addEventListener('click', () => {
    let txt = '';
    for (let date in mealsData) {
        txt += `Date: ${date}\n`;
        let total = 0;
        mealsData[date].forEach(meal => {
            txt += `${meal.type}: ${meal.name} - $${meal.cost.toFixed(2)}\n`;
            total += meal.cost;
        });
        txt += `Total Cost: $${total.toFixed(2)}\n--------------------------\n`;
    }
    downloadFile('meals.txt', txt);
});

exportCSV.addEventListener('click', () => {
    let csv = 'Date,Meal Type,Food Name,Cost\n';
    for (let date in mealsData) {
        mealsData[date].forEach(meal => {
            csv += `${date},${meal.type},${meal.name},${meal.cost}\n`;
        });
    }
    downloadFile('meals.csv', csv);
});

function downloadFile(filename, content) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

exportPDF.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10;
    doc.setFontSize(12);
    doc.text("My Daily Meals Tracker", 10, y);
    y += 10;

    for (let date in mealsData) {
        doc.text(`Date: ${date}`, 10, y);
        y += 7;
        let total = 0;
        mealsData[date].forEach(meal => {
            doc.text(`${meal.type}: ${meal.name} - $${meal.cost.toFixed(2)}`, 15, y);
            y += 7;
            total += meal.cost;
        });
        doc.text(`Total Cost: $${total.toFixed(2)}`, 15, y);
        y += 10;
    }

    doc.save('meals.pdf');
});
