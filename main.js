const tasks = [
  { title: "Design a website", completed: true },
  { title: "Write blog post", completed: false },
  { title: "Create marketing plan", completed: false }
];

const taskList = document.getElementById("task-list");
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");

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
                    <span class="task-title">${task.title}</span>
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

taskList.addEventListener("click", function (e) {
  const taskItem = e.target.closest(".task-item");
  const taskIndex = +taskItem.dataset.taskIndex;
  const task = tasks[taskIndex];

  if(e.target.closest(".edit")){
    let newTitle = prompt("Nhập tiêu đề công việc mới:", task.title);

    if(newTitle === null) return;

    newTitle = cleanUpSpaces(newTitle);

    if(!newTitle){
      alert("Tiêu đề công việc không được để trống.");
      return;
    }
    task.title = newTitle;
    renderTasks();
  }
})

todoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const value = cleanUpSpaces(todoInput.value);
  if (!value) {
    alert("Công việc không thể trống, vui lòng nhập một công việc!");
    todoInput.value = "";
    console.log(value);

    return;
  }

  const isDuplicate = tasks.some((task) => {
    return task.title.toLowerCase() === value.toLowerCase();
  });

  if (isDuplicate) {
    alert("Công việc đã tồn tại trong danh sách! Vui lòng nhập công việc khác.");
    todoInput.value = "";
    return;
  }
  tasks.push({ title: value, completed: false });
  renderTasks();
  todoInput.value = "";
});

// taskList.addEventListener("click", handleTaskClick);

renderTasks();


