const ACTIVE_TASK_KEY = "active_task_key";
const COMPLETED_TASK_KEY = "completed_task_key";
const ARCHIVE_TASK_KEY = "archive_task_key";

function checkForStorage() {
    return typeof (Storage) !== 'undefined';
}

//  ACTIVE TASK DATA
function putTaskData(data) {
    if (checkForStorage()) {

        let taskData;

        if (localStorage.getItem(ACTIVE_TASK_KEY) === null) {
            taskData = [];
        } else {
            taskData = JSON.parse(localStorage.getItem(ACTIVE_TASK_KEY));
        }

        taskData.unshift(data);

        localStorage.setItem(ACTIVE_TASK_KEY, JSON.stringify(taskData));

        renderTaskActive();
    }
}

function clearTaskData() {
    if (confirm("Clear all active tasks?")) {
        if (checkForStorage()) {

            let taskData;
            taskData = [];

            localStorage.setItem(ACTIVE_TASK_KEY, JSON.stringify(taskData));

            renderTaskActive();
        }
    }
}

function removeTask(index) {
    if (confirm("Remove this task?")) {

        if (checkForStorage()) {
            let taskData;

            if (localStorage.getItem(ACTIVE_TASK_KEY) === null) {
                taskData = [];
            } else {
                taskData = JSON.parse(localStorage.getItem(ACTIVE_TASK_KEY));
            }

            taskData.splice(index, 1);

            localStorage.setItem(ACTIVE_TASK_KEY, JSON.stringify(taskData));

            renderTaskActive();
        }
    }
}

function showTaskActive() {
    if (checkForStorage()) {
        return JSON.parse(localStorage.getItem(ACTIVE_TASK_KEY)) || [];
    } else {
        return [];
    }
}

function toggleClearButtonActiveTasks(totalData) {
    let btnClear = document.getElementById("btn-clear-activetask");
    let dummyDataNotice = document.getElementById("dummy-data-notice");
    if (totalData > 0) {
        btnClear.style.display = "block";
        dummyDataNotice.style.display = "none";
    } else {
        dummyDataNotice.style.display = "block";
        btnClear.style.display = "none";
    }
}

function renderTaskActive() {
    const taskData = showTaskActive();
    let taskList = document.querySelector("#task-list");

    taskList.innerHTML = "";

    //get total data then show it
    const active_task_total = document.querySelector("#active_task_total");

    let taskTotalData = taskData.length;
    active_task_total.innerText = "(" + taskTotalData + ")";
    //toggle clearButton, dummyDataButton
    toggleClearButtonActiveTasks(taskTotalData);

    let index = 0;
    for (let task of taskData) {
        let row = document.createElement('div');
        row.className = "flex-row card";
        row.innerHTML = "<div class='box box-2'><p class=task-title>" + task.title + "</p></div>";
        row.innerHTML += "<div class='box'><p class=task-date>" + task.date + "</p></div>";
        row.innerHTML += "<div class='box'>" +
            "<button onclick='moveToCompleted(" + index + ")' class='button button-secondary button-circle' title='Done'>&#10004;</button>" +
            "<button onclick='moveToArchiveFromActive(" + index + ")' class='button button-circle button-secondary button-warning' title='Archive'>&#11088;</button>" +
            "<button onclick='removeTask(" + index + ")' class='button button-circle button-secondary button-danger' title='Remove'>&#10005;</button>" +
            "</div>";

        index++;
        taskList.appendChild(row);
    }

}

function moveToCompleted(index) {
    if (confirm("Mark as Completed?")) {

        if (checkForStorage()) {

            let completedTaskData;
            let tasks = JSON.parse(localStorage.getItem(ACTIVE_TASK_KEY));
            let task = tasks.splice(index, 1); //remove from active 

            if (localStorage.getItem(COMPLETED_TASK_KEY) === null) {
                completedTaskData = [];
            } else {
                completedTaskData = JSON.parse(localStorage.getItem(COMPLETED_TASK_KEY));
            }

            const task_mark_as_complete = {
                title: task[0].title,
                date: task[0].date,
                active: false,
                archive: task[0].archive,
                completed: true
            };

            //add to completed
            completedTaskData.unshift(task_mark_as_complete);

            //set taskData again
            localStorage.setItem(ACTIVE_TASK_KEY, JSON.stringify(tasks));

            localStorage.setItem(COMPLETED_TASK_KEY, JSON.stringify(completedTaskData));

            renderTaskActive();
            renderTaskCompleted();
        }
    }
}

function moveToArchiveFromActive(index) {
    if (confirm("Move to Archive?")) {
        if (checkForStorage()) {

            let archiveTasks;
            let activeTasks = JSON.parse(localStorage.getItem(ACTIVE_TASK_KEY));
            let task = activeTasks.splice(index, 1); //1 task removed from active

            if (JSON.parse(localStorage.getItem(ARCHIVE_TASK_KEY)) === null) {
                archiveTasks = [];
            } else {
                archiveTasks = JSON.parse(localStorage.getItem(ARCHIVE_TASK_KEY));
            }

            const task_move_to_archive = {
                title: task[0].title,
                date: task[0].date,
                active: false,
                completed: task[0].completed,
                archive: true
            };

            //add to archive
            archiveTasks.unshift(task_move_to_archive);

            //set activeTasks again OR has been spliced
            localStorage.setItem(ACTIVE_TASK_KEY, JSON.stringify(activeTasks));

            localStorage.setItem(ARCHIVE_TASK_KEY, JSON.stringify(archiveTasks));

            renderTaskActive();
            renderTaskCompleted();
            renderArchiveTasks();
        }
    }
}

//  COMPLETED TASK DATA
function showTaskCompleted() {
    if (checkForStorage()) {
        return JSON.parse(localStorage.getItem(COMPLETED_TASK_KEY)) || [];
    } else {
        return [];
    }
}

function toggleClearButtonCompletedTasks(totalData) {
    let btnClear = document.getElementById("btn-clear-completedtask");
    if (totalData > 0) {
        btnClear.style.display = "block";
    } else {
        btnClear.style.display = "none";
    }
}

function renderTaskCompleted() {
    const taskData = showTaskCompleted();
    let completedTaskList = document.querySelector("#completed-task-list");

    completedTaskList.innerHTML = "";

    //get total data then show it
    const completed_task_total = document.querySelector("#completed_task_total");

    let completedTaskTotalData = taskData.length;
    completed_task_total.innerText = "(" + completedTaskTotalData + ")";
    //show or hide clear button
    toggleClearButtonCompletedTasks(completedTaskTotalData);

    let index = 0;
    for (let task of taskData) {
        let row = document.createElement('div');
        row.className = "flex-row card";
        row.innerHTML = "<div class='box box-2'><p class=task-title>" + task.title + "</p></div>";
        row.innerHTML += "<div class='box'><p class=task-date>" + task.date + "</p></div>";
        row.innerHTML += "<div class='box'>" +
            "<button onclick='moveToArchiveFromCompleted(" + index + ")' class='button button-circle button-secondary button-warning' title='Archive'>&#11088;</button>" +
            "<button onclick='moveToUncompleted(" + index + ")' class='button button-secondary button-circle button-grey' " +
            "title='Mark as Uncompleted'>&#128336;</button>" +
            // "<button class='button button-circle button-secondary button-danger' title='Remove'>&#10005;</button>" +
            "</div>";

        index++;
        completedTaskList.appendChild(row);
    }
}

function moveToUncompleted(index) {
    if (confirm("Set Active Again?")) {

        if (checkForStorage()) {

            let taskData;
            let completedTasks = JSON.parse(localStorage.getItem(COMPLETED_TASK_KEY));
            let completedTask = completedTasks.splice(index, 1); //remove from completed

            if (localStorage.getItem(ACTIVE_TASK_KEY) === null) {
                taskData = [];
            } else {
                taskData = JSON.parse(localStorage.getItem(ACTIVE_TASK_KEY));
            }

            const task_mark_as_uncompleted = {
                title: completedTask[0].title,
                date: completedTask[0].date,
                active: true,
                archive: completedTask[0].archive,
                completed: false
            };

            //add to active
            taskData.unshift(task_mark_as_uncompleted);

            //set completedTaskData again
            localStorage.setItem(COMPLETED_TASK_KEY, JSON.stringify(completedTasks));

            localStorage.setItem(ACTIVE_TASK_KEY, JSON.stringify(taskData));

            renderTaskActive();
            renderTaskCompleted();
        }
    }
}

function moveToArchiveFromCompleted(index) {
    if (confirm("Move to Archive?")) {
        if (checkForStorage()) {

            let archiveTasks;
            let completedTasks = JSON.parse(localStorage.getItem(COMPLETED_TASK_KEY));
            let task = completedTasks.splice(index, 1); //1 task removed from completed

            if (JSON.parse(localStorage.getItem(ARCHIVE_TASK_KEY)) === null) {
                archiveTasks = [];
            } else {
                archiveTasks = JSON.parse(localStorage.getItem(ARCHIVE_TASK_KEY));
            }

            const task_move_to_archive = {
                title: task[0].title,
                date: task[0].date,
                active: false,
                completed: task[0].completed,
                archive: true
            };

            //add to archive
            archiveTasks.unshift(task_move_to_archive);

            //set completedTasks again OR has been spliced
            localStorage.setItem(COMPLETED_TASK_KEY, JSON.stringify(completedTasks));

            localStorage.setItem(ARCHIVE_TASK_KEY, JSON.stringify(archiveTasks));

            renderTaskActive();
            renderTaskCompleted();
            renderArchiveTasks();
        }
    }
}

function clearCompletedTasks() {
    if (confirm("Clear all completed tasks?")) {
        if (checkForStorage()) {

            let completedTasks;
            completedTasks = [];

            localStorage.setItem(COMPLETED_TASK_KEY, JSON.stringify(completedTasks));

            renderTaskCompleted();
        }
    }
}


//  ARCHIVE TASK DATA
function showArchiveTasks() {
    if (checkForStorage()) {
        return JSON.parse(localStorage.getItem(ARCHIVE_TASK_KEY)) || [];
    } else {
        return [];
    }
}

function renderArchiveTasks() {
    const archiveTasks = showArchiveTasks();
    let archiveTaskList = document.querySelector("#archive-tasks-list");

    archiveTaskList.innerHTML = "";

    //get total data then show it
    const archive_tasks_total = document.querySelector("#archive_tasks_total");

    let archiveTasksTotalData = archiveTasks.length;
    archive_tasks_total.innerText = "(" + archiveTasksTotalData + ")";

    let index = 0;
    for (let task of archiveTasks) {
        let row = document.createElement('div');
        let labelCompleted = (task.completed === false) ? "" : "<label class='label'>Completed</label>";
        row.className = "flex-row card";
        row.innerHTML = "<div class='box box-2'><p class=task-title>" + task.title + "</p></div>";
        row.innerHTML += "<div class='box'><p class=task-date>" + task.date + "</p></div>";
        row.innerHTML += "<div class='box'> " + labelCompleted +
            // "<button class='button button-circle button-secondary button-warning' title='Archive'>&#11088;</button>" +
            "<button onclick='unarchiveToActiveOrCompleted(" + index + "," + task.completed + ")' class='button button-secondary button-circle button-yellow' " +
            "title='Unarchive'>&#128275;</button>" +
            // "<button class='button button-circle button-secondary button-danger' title='Remove'>&#10005;</button>" +
            "</div>";

        index++;
        archiveTaskList.appendChild(row);
    }
}

function unarchiveToActiveOrCompleted(index, completed) {
    if (confirm("Unarchive This Task?")) {
        if (checkForStorage()) {

            let destinationTasks; // use for activeTask OR completedTask
            let archiveTasks;
            let task;
            let key;
            let active;

            if (completed === true) {
                key = COMPLETED_TASK_KEY;
                active = false;
            } else {
                key = ACTIVE_TASK_KEY;
                active = true;
            }

            if (JSON.parse(localStorage.getItem(key)) === null) {
                destinationTasks = [];
            } else {
                destinationTasks = JSON.parse(localStorage.getItem(key));
            }

            archiveTasks = JSON.parse(localStorage.getItem(ARCHIVE_TASK_KEY));
            task = archiveTasks.splice(index, 1); // 1 data with status active/completed removed from archive

            task = {
                title: task[0].title,
                date: task[0].date,
                active: active,
                completed: task[0].completed,
                archive: false
            };

            //add task to activeTasks OR completedTasks
            destinationTasks.unshift(task);

            // set archiveTasks again after spliced
            localStorage.setItem(ARCHIVE_TASK_KEY, JSON.stringify(archiveTasks));

            localStorage.setItem(key, JSON.stringify(destinationTasks));

            renderTaskActive();
            renderTaskCompleted();
            renderArchiveTasks();
        }
    }
}


// Always Render
renderTaskActive();
renderTaskCompleted();
renderArchiveTasks();