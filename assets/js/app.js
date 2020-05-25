const task = {
    title: null,
    date: null,
    active: false,
    completed: false,
    archive: false
};

const btnNewTask = document.querySelector("#btn-new-task");
btnNewTask.addEventListener('click', function () {
    inputTask();
});

const btnClearTask = document.querySelector("#btn-clear-activetask");
btnClearTask.addEventListener('click', function () {
    clearTaskData();
});

const btnClearCompletedTask = document.querySelector("#btn-clear-completedtask");
btnClearCompletedTask.addEventListener('click', function () {
    clearCompletedTasks();
});

// DUMMY
const btnUseDummy = document.querySelector("#btn-use-dummy");
btnUseDummy.addEventListener('click', function () {
    for (let i = 0; i < dummyData.length; i++) {
        putTaskData(dummyData[i]);
    }
    // console.log(dummyData[i]);
});

// INFO
const btnInfoOkay = document.querySelector("#btn-info-okay");
const divInfOkay = document.querySelector("#div-info-okay");
btnInfoOkay.addEventListener('click', function () {
    divInfOkay.style.display = 'none';
    divInfoApatadi.style.display = 'block';
});

const btnInfoApatadi = document.querySelector("#btn-info-apatadi");
const divInfoApatadi = document.querySelector("#div-info-apatadi");
btnInfoApatadi.addEventListener('click', function () {
    divInfoApatadi.style.display = 'none';
    divInfOkay.style.display = 'block';
});


// Input with Prompt
function inputTask() {
    const title = prompt("Task Title");
    const date = prompt("When ? (e.g. 28 April 2020 or Any Time)");

    task.title = title;
    task.date = date;
    task.active = true;

    if (title === "" || date === "" || title === null || date === null) {
        alert("*** Title and Date cannot be empty ***");
    } else {
        putTaskData(task);
    }
}