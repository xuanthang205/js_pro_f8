const tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];

const taskList = document.getElementById("task-list");
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");

function escapeHtml(html) {
  const div = document.createElement("div");
  div.innerText = html;
  return div.innerHTML;
}

function cleanUpSpaces(value) {
  const words = value
    .split(" ")
    .filter((word) => {
      return word !== "";
    })
    .join(" ");
  return words;
}

function renderTasks() {
  if (!tasks.length) {
    taskList.innerHTML = `<li class="empty-message">Không có công việc nào trong danh sách.</li>`;
    return;
  }

  const html = tasks
    .map((task, index) => {
      return `<li class="task-item ${task.completed ? "completed" : ""}" data-task-index="${index}">
                    <span class="task-title">${escapeHtml(task.title)}</span>
                    <div class="task-action">
                        <button class="task-btn edit">Sửa</button>
                        <button class="task-btn done">${task.completed ? "Chưa hoàn thành" : "Hoàn thành"}</button>
                        <button class="task-btn delete">Delete</button>
                    </div>
                </li>`;
    })
    .join("");
  taskList.innerHTML = html;
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function isDuplicateTask(newTitle, excludeIndex = -1) {
  return tasks.some((task, index) => task.title.toLowerCase() === newTitle.toLowerCase() && index !== excludeIndex);
}

taskList.addEventListener("click", function (e) {
  const taskItem = e.target.closest(".task-item");
  if (!taskItem) return;
  const taskIndex = +taskItem.dataset.taskIndex;
  const task = tasks[taskIndex];

  if (e.target.closest(".edit")) {
    let newTitle = prompt("Nhập tiêu đề công việc mới:", task.title);

    if (newTitle === null) return;

    newTitle = cleanUpSpaces(newTitle);

    if (!newTitle) {
      alert("Tiêu đề công việc không được để trống.");
      return;
    }

    if (isDuplicateTask(newTitle, taskIndex)) {
      alert("Công việc đã tồn tại trong danh sách! Vui lòng nhập công việc khác."); // bam edit -> ok nhung van bao loi
      todoInput.value = "";
      return;
    }

    task.title = newTitle;
    renderTasks();
    saveTasks();
  } else if (e.target.closest(".done")) {
    task.completed = !task.completed;
    renderTasks();
    saveTasks();
  } else if (e.target.closest(".delete")) {
    if (confirm(`Bạn có chắc chắn muốn xóa công việc ${task.title} không?`)) {
      tasks.splice(taskIndex, 1);
      renderTasks();
      saveTasks();
    }
  }
});

todoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const value = cleanUpSpaces(todoInput.value);
  if (!value) {
    alert("Công việc không thể trống, vui lòng nhập một công việc!");
    todoInput.value = "";
    return;
  }

  if (isDuplicateTask(value)) {
    alert("Công việc đã tồn tại trong danh sách! Vui lòng nhập công việc khác.");
    todoInput.value = "";
    return;
  }
  tasks.push({ title: value, completed: false });
  renderTasks();
  saveTasks();
  todoInput.value = "";
});

// taskList.addEventListener("click", handleTaskClick);

renderTasks();


