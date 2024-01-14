"use strict";

const $form = document.querySelector("#todolist-form");
const $taskInput = document.querySelector(".todolist-input-wrapper > input");
const $taskCollection = document.querySelector("#task-collection");
const $deleteAll = document.querySelector("#delete-all-btn");
let ALL_TASKS = JSON.parse(localStorage.getItem("alltasks")) || [];

$form.addEventListener("submit", createTask);
renderTask(ALL_TASKS);

function createTask(e) {
  e.preventDefault();
  if ($taskInput.value.trim().length > 0) {
    const task = {
      taskName: $taskInput.value,
      minute: new Date().getMinutes(),
      hour: new Date().getHours(),
      date: new Date().getDate(),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      isCompleted: false,
      isBeingEdited: false,
      whenCompleted: null,
    };
    ALL_TASKS.unshift(task);
    localStorage.setItem("alltasks", JSON.stringify(ALL_TASKS));
  }
  renderTask(ALL_TASKS);
  $taskInput.value = "";
}

function renderTask(tasks) {
  $taskCollection.innerHTML = "";
  const $allTasksFragment = document.createDocumentFragment();
  tasks.forEach((taskInfo, index) => {
    const $taskElement = document.createElement("div");
    $taskElement.className = "task-item";
    $taskElement.innerHTML = `
            <h3 contenteditable="${taskInfo.isBeingEdited}"  style="${
      taskInfo.isCompleted ? "background: green; color: #fff" : ""
    }">${taskInfo.taskName}</h3>
            <div data-item-id="${index}">
                <button class="complete-btn">Complete</button>
                <button class="edit-btn">${
                  taskInfo.isBeingEdited ? "Save" : "Edit"
                }</button>
                <button>${String(taskInfo.hour).padStart(2, "0")} : ${String(
      taskInfo.minute
    ).padStart(2, "0")}
                    <small class="task-date">${String(taskInfo.date).padStart(
                      2,
                      "0"
                    )}/${String(taskInfo.month).padStart(2, "0")}/${
      taskInfo.year
    }</small>
                </button>
                
                <button class="delete-btn">Delete</button>
            </div>
        `;
    $allTasksFragment.appendChild($taskElement);
  });
  $taskCollection.appendChild($allTasksFragment);
}

$deleteAll.addEventListener("click", () => {
  let userResponse;
  if (ALL_TASKS[0]) {
    userResponse = confirm("Are you going to delete all tasks?");
  }

  if (userResponse) {
    // 1
    // $taskCollection.innerHTML = ""
    // ALL_TASKS = []
    // 2
    while ($taskCollection.firstChild) {
      $taskCollection.firstChild.remove();
    }
    while (ALL_TASKS[0]) {
      ALL_TASKS.shift();
    }
    localStorage.setItem("alltasks", JSON.stringify(ALL_TASKS));
  }
});

$taskCollection.addEventListener("click", (e) => {
  if (e.target.className === "complete-btn") {
    const id = +e.target.parentElement.getAttribute("data-item-id");
    ALL_TASKS[id].isCompleted = !ALL_TASKS[id].isCompleted;
    ALL_TASKS[id].whenCompleted = new Date().getMinutes();
    localStorage.setItem("alltasks", JSON.stringify(ALL_TASKS));
    renderTask(ALL_TASKS);
  }
  if (e.target.className === "delete-btn") {
    const id = +e.target.parentElement.getAttribute("data-item-id");
    ALL_TASKS.splice(id, 1);
    localStorage.setItem("alltasks", JSON.stringify(ALL_TASKS));
    renderTask(ALL_TASKS);
  }
  if (e.target.className === "edit-btn") {
    const id = +e.target.parentElement.getAttribute("data-item-id");
    ALL_TASKS[id].isBeingEdited = !ALL_TASKS[id].isBeingEdited;
    renderTask(ALL_TASKS);
    ALL_TASKS[id].taskName =
      e.target.parentElement.previousElementSibling.textContent;
    localStorage.setItem("alltasks", JSON.stringify(ALL_TASKS));
    renderTask(ALL_TASKS);
  }
});
