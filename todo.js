// ===============================
// SELECT ELEMENTS
// ===============================

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const emptyMessage = document.getElementById("empty-message");
const filterButtons = document.querySelectorAll(".filter-btn");


// ===============================
// APPLICATION STATE
// ===============================

let tasks = JSON.parse(localStorage.getItem("sharanyaTasks")) || [];

let currentFilter = "all";


// ===============================
// SAVE TASKS
// ===============================

function saveTasks() {

    localStorage.setItem(
        "sharanyaTasks",
        JSON.stringify(tasks)
    );

}


// ===============================
// CREATE TASK
// ===============================

taskForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    const newTask = {

        id: Date.now(),

        text: taskText,

        completed: false

    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    renderTasks();

});


// ===============================
// READ / DISPLAY TASKS
// ===============================

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;


    if (currentFilter === "active") {

        filteredTasks = tasks.filter(
            task => !task.completed
        );

    }


    if (currentFilter === "completed") {

        filteredTasks = tasks.filter(
            task => task.completed
        );

    }


    filteredTasks.forEach(task => {

        const listItem = document.createElement("li");

        listItem.className = "task-item";

        listItem.dataset.id = task.id;


        if (task.completed) {

            listItem.classList.add("completed");

        }


        listItem.innerHTML = `

            <div class="task-content">

                <input
                    type="checkbox"
                    class="complete-checkbox"
                    ${task.completed ? "checked" : ""}
                    aria-label="Mark task as completed">

                <span class="task-text">
                    ${escapeHTML(task.text)}
                </span>

            </div>


            <div class="task-actions">

                <button
                    type="button"
                    class="edit-btn"
                    data-action="edit">

                    Edit

                </button>

                <button
                    type="button"
                    class="delete-btn"
                    data-action="delete">

                    Delete

                </button>

            </div>

        `;


        taskList.appendChild(listItem);

    });


    updateTaskCount();

    updateEmptyMessage();

}


// ===============================
// UPDATE TASK
// ===============================

function updateTask(id, newText) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,
                text: newText
            };

        }

        return task;

    });


    saveTasks();

    renderTasks();

}


// ===============================
// DELETE TASK
// ===============================

function deleteTask(id) {

    tasks = tasks.filter(
        task => task.id !== id
    );


    saveTasks();

    renderTasks();

}


// ===============================
// TOGGLE COMPLETED
// ===============================

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });


    saveTasks();

    renderTasks();

}


// ===============================
// EVENT DELEGATION
// ===============================

taskList.addEventListener("click", function (event) {

    const taskItem =
        event.target.closest(".task-item");


    if (!taskItem) {
        return;
    }


    const id = Number(taskItem.dataset.id);


    // DELETE

    if (
        event.target.matches(
            '[data-action="delete"]'
        )
    ) {

        deleteTask(id);

        return;

    }


    // EDIT

    if (
        event.target.matches(
            '[data-action="edit"]'
        )
    ) {

        const task = tasks.find(
            task => task.id === id
        );


        const newText = prompt(
            "Edit your task:",
            task.text
        );


        if (
            newText !== null &&
            newText.trim() !== ""
        ) {

            updateTask(
                id,
                newText.trim()
            );

        }

    }

});


// ===============================
// COMPLETION EVENT
// ===============================

taskList.addEventListener("change", function (event) {

    if (
        event.target.classList.contains(
            "complete-checkbox"
        )
    ) {

        const taskItem =
            event.target.closest(".task-item");

        const id =
            Number(taskItem.dataset.id);

        toggleTask(id);

    }

});


// ===============================
// FILTERS
// ===============================

filterButtons.forEach(button => {

    button.addEventListener("click", function () {

        currentFilter =
            this.dataset.filter;


        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        this.classList.add("active");


        renderTasks();

    });

});


// ===============================
// TASK COUNT
// ===============================

function updateTaskCount() {

    const activeTasks =
        tasks.filter(
            task => !task.completed
        ).length;


    taskCount.textContent =
        `${activeTasks} active task${activeTasks !== 1 ? "s" : ""}`;

}


// ===============================
// EMPTY MESSAGE
// ===============================

function updateEmptyMessage() {

    if (tasks.length === 0) {

        emptyMessage.style.display = "block";

        return;

    }


    const visibleTasks =
        document.querySelectorAll(
            "#task-list .task-item"
        );


    if (visibleTasks.length === 0) {

        emptyMessage.textContent =
            "No tasks match this filter.";

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

    }

}


// ===============================
// SECURITY HELPER
// ===============================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ===============================
// INITIAL RENDER
// ===============================

renderTasks();