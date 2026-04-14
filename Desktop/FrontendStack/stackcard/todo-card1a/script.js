const task = {
  title: "Stage 1 - Task for Todo Item",
  description:
    "Improve mobile responsiveness, and prepare the page for mentor review.",
  priority: "High",
  dueDate: "2026-04-18T18:00",
  status: "In Progress",
  tags: ["HNG Tasks", "Frontend", "Stage 1", "Mark: 100"],
};

let isEditing = false;
let isExpanded = false;
let timeInterval = null;
let lastFocusedEditButton = null;

const card = document.querySelector('[data-testid="test-todo-card"]');
const viewSection = document.getElementById("todoView");
const editForm = document.getElementById("todoEditForm");

const titleEl = document.querySelector('[data-testid="test-todo-title"]');
const descriptionEl = document.querySelector('[data-testid="test-todo-description"]');
const priorityEl = document.querySelector('[data-testid="test-todo-priority"]');
const priorityIndicatorEl = document.querySelector(
  '[data-testid="test-todo-priority-indicator"]'
);
const dueDateEl = document.querySelector('[data-testid="test-todo-due-date"]');
const timeRemainingEl = document.querySelector('[data-testid="test-todo-time-remaining"]');
const overdueIndicatorEl = document.querySelector(
  '[data-testid="test-todo-overdue-indicator"]'
);
const statusEl = document.querySelector('[data-testid="test-todo-status"]');
const checkboxEl = document.querySelector('[data-testid="test-todo-complete-toggle"]');
const tagsEl = document.querySelector('[data-testid="test-todo-tags"]');
const editButtonEl = document.querySelector('[data-testid="test-todo-edit-button"]');
const deleteButtonEl = document.querySelector('[data-testid="test-todo-delete-button"]');
const statusControlEl = document.querySelector('[data-testid="test-todo-status-control"]');
const expandToggleEl = document.querySelector('[data-testid="test-todo-expand-toggle"]');
const collapsibleSectionEl = document.querySelector(
  '[data-testid="test-todo-collapsible-section"]'
);

const editTitleInput = document.querySelector('[data-testid="test-todo-edit-title-input"]');
const editDescriptionInput = document.querySelector(
  '[data-testid="test-todo-edit-description-input"]'
);
const editPrioritySelect = document.querySelector(
  '[data-testid="test-todo-edit-priority-select"]'
);
const editDueDateInput = document.querySelector('[data-testid="test-todo-edit-due-date-input"]');
const cancelButtonEl = document.querySelector('[data-testid="test-todo-cancel-button"]');

function formatDueDate(dateString) {
  const date = new Date(dateString);

  return `Due ${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)}`;
}

function getTimeRemaining(dateString, status) {
  if (status === "Done") {
    return "Completed";
  }

  const now = new Date();
  const dueDate = new Date(dateString);
  const diff = dueDate - now;
  const absDiff = Math.abs(diff);

  const minutes = Math.floor(absDiff / (1000 * 60));
  const hours = Math.floor(absDiff / (1000 * 60 * 60));
  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));

  if (diff > 0) {
    if (days >= 1) return `Due in ${days} day${days > 1 ? "s" : ""}`;
    if (hours >= 1) return `Due in ${hours} hour${hours > 1 ? "s" : ""}`;
    return `Due in ${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }

  if (days >= 1) return `Overdue by ${days} day${days > 1 ? "s" : ""}`;
  if (hours >= 1) return `Overdue by ${hours} hour${hours > 1 ? "s" : ""}`;
  return `Overdue by ${minutes} minute${minutes !== 1 ? "s" : ""}`;
}

function isTaskOverdue() {
  return task.status !== "Done" && new Date(task.dueDate) < new Date();
}

function getPriorityColor(priority) {
  if (priority === "High") return "#dc2626";
  if (priority === "Medium") return "#d97706";
  return "#16a34a";
}

function getPriorityBadgeColors(priority) {
  if (priority === "High") {
    return { bg: "#fee2e2", text: "#b91c1c" };
  }

  if (priority === "Medium") {
    return { bg: "#fef3c7", text: "#92400e" };
  }

  return { bg: "#dcfce7", text: "#166534" };
}

function getStatusColors(status) {
  if (status === "Done") {
    return { bg: "#dcfce7", text: "#166534" };
  }

  if (status === "In Progress") {
    return { bg: "#dbeafe", text: "#1d4ed8" };
  }

  return { bg: "#e2e8f0", text: "#0f172a" };
}

function renderTags() {
  tagsEl.innerHTML = "";

  task.tags.forEach((tag) => {
    const li = document.createElement("li");
    li.className = "tag-chip";
    li.textContent = tag;
    li.setAttribute("data-testid", `test-todo-tag-${tag.toLowerCase()}`);
    tagsEl.appendChild(li);
  });
}

function renderDescription() {
  const isLong = task.description.length > 140;
  const shouldCollapse = isLong && !isExpanded;

  descriptionEl.textContent = shouldCollapse
    ? `${task.description.slice(0, 140)}...`
    : task.description;

  collapsibleSectionEl.setAttribute("aria-expanded", String(!shouldCollapse));

  if (isLong) {
    expandToggleEl.classList.remove("hidden");
    expandToggleEl.textContent = isExpanded ? "Show Less" : "Show More";
    expandToggleEl.setAttribute("aria-expanded", String(isExpanded));
  } else {
    expandToggleEl.classList.add("hidden");
    expandToggleEl.setAttribute("aria-expanded", "false");
  }
}

function renderVisualState() {
  card.classList.remove("done-state", "overdue-state", "in-progress-state");
  titleEl.classList.remove("done");
  overdueIndicatorEl.classList.add("hidden");
  timeRemainingEl.classList.remove("overdue-text");

  const priorityColors = getPriorityBadgeColors(task.priority);
  const statusColors = getStatusColors(task.status);

  priorityEl.style.background = priorityColors.bg;
  priorityEl.style.color = priorityColors.text;

  statusEl.style.background = statusColors.bg;
  statusEl.style.color = statusColors.text;

  if (task.status === "Done") {
    card.classList.add("done-state");
    titleEl.classList.add("done");
  } else if (isTaskOverdue()) {
    card.classList.add("overdue-state");
    overdueIndicatorEl.classList.remove("hidden");
    timeRemainingEl.classList.add("overdue-text");
  } else if (task.status === "In Progress") {
    card.classList.add("in-progress-state");
  }
}

function renderTask() {
  titleEl.textContent = task.title;
  priorityEl.textContent = `${task.priority} Priority`;
  statusEl.textContent = task.status;
  dueDateEl.textContent = formatDueDate(task.dueDate);
  dueDateEl.setAttribute("datetime", task.dueDate);
  timeRemainingEl.textContent = getTimeRemaining(task.dueDate, task.status);
  timeRemainingEl.setAttribute("datetime", task.dueDate);
  checkboxEl.checked = task.status === "Done";
  statusControlEl.value = task.status;
  priorityIndicatorEl.style.background = getPriorityColor(task.priority);

  renderTags();
  renderDescription();
  renderVisualState();
}

function fillEditForm() {
  editTitleInput.value = task.title;
  editDescriptionInput.value = task.description;
  editPrioritySelect.value = task.priority;
  editDueDateInput.value = task.dueDate;
}

function openEditMode() {
  isEditing = true;
  fillEditForm();

  viewSection.classList.add("hidden");
  editForm.classList.remove("hidden");

  lastFocusedEditButton = editButtonEl;
  editTitleInput.focus();
}

function closeEditMode(returnFocus = true) {
  isEditing = false;
  editForm.classList.add("hidden");
  viewSection.classList.remove("hidden");

  if (returnFocus && lastFocusedEditButton) {
    lastFocusedEditButton.focus();
  }
}

function saveEdit(event) {
  event.preventDefault();

  const newTitle = editTitleInput.value.trim();
  const newDescription = editDescriptionInput.value.trim();
  const newDueDate = editDueDateInput.value;

  task.title = newTitle || task.title;
  task.description = newDescription || task.description;
  task.priority = editPrioritySelect.value;
  task.dueDate = newDueDate || task.dueDate;

  if (task.description.length <= 140) {
    isExpanded = false;
  }

  closeEditMode();
  renderTask();
}

function cancelEdit() {
  fillEditForm();
  closeEditMode();
}

function handleCheckboxChange() {
  if (checkboxEl.checked) {
    task.status = "Done";
  } else {
    task.status = "Pending";
  }

  renderTask();
}

function handleStatusChange() {
  task.status = statusControlEl.value;
  checkboxEl.checked = task.status === "Done";
  renderTask();
}

function handleExpandToggle() {
  isExpanded = !isExpanded;
  renderDescription();
}

function startTimeUpdates() {
  if (timeInterval) {
    clearInterval(timeInterval);
  }

  timeInterval = setInterval(() => {
    if (!isEditing && task.status !== "Done") {
      timeRemainingEl.textContent = getTimeRemaining(task.dueDate, task.status);
      renderVisualState();
    }
  }, 30000);
}

editButtonEl.addEventListener("click", openEditMode);

deleteButtonEl.addEventListener("click", () => {
  alert("Delete action clicked. Functional delete was not required.");
});

editForm.addEventListener("submit", saveEdit);
cancelButtonEl.addEventListener("click", cancelEdit);
checkboxEl.addEventListener("change", handleCheckboxChange);
statusControlEl.addEventListener("change", handleStatusChange);
expandToggleEl.addEventListener("click", handleExpandToggle);

renderTask();
startTimeUpdates();