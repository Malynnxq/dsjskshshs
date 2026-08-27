const STORAGE_KEY = "meal-counter-meals-v1";
const mealForm = document.querySelector("#meal-form");
const mealNameInput = document.querySelector("#meal-name");
const mealError = document.querySelector("#meal-error");
const mealList = document.querySelector("#meal-list");
const emptyState = document.querySelector("#empty-state");
const mealCount = document.querySelector("#meal-count");

let meals = loadMeals();

function loadMeals() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveMeals() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
}

function formatTotal(value) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value);
}

function parsePortion(rawValue) {
  const normalized = rawValue.trim().replace(",", ".");
  if (!/^((0([.,]\d+)?)|1([.,]0+)?)$/.test(rawValue.trim())) return null;
  const value = Number(normalized);
  return Number.isFinite(value) && value >= 0 && value <= 1 ? value : null;
}

function render() {
  mealList.replaceChildren();
  emptyState.classList.toggle("hidden", meals.length > 0);
  mealCount.textContent = `${meals.length} ${meals.length === 1 ? "meal" : "meals"}`;

  meals.forEach((meal) => {
    const card = document.createElement("article");
    card.className = "meal-card";
    card.dataset.id = meal.id;

    const top = document.createElement("div");
    top.className = "meal-top";
    const title = document.createElement("h3");
    title.className = "meal-name";
    title.textContent = meal.name;
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete meal";
    deleteButton.dataset.action = "delete";
    top.append(title, deleteButton);

    const total = document.createElement("p");
    total.className = "total-label";
    total.append("Total: ");
    const totalValue = document.createElement("span");
    totalValue.className = "total";
    totalValue.textContent = formatTotal(meal.total);
    total.append(totalValue);

    const row = document.createElement("div");
    row.className = "portion-row";
    const input = document.createElement("input");
    input.className = "portion-input";
    input.inputMode = "decimal";
    input.placeholder = "0,25 / 0.5 / 1";
    input.setAttribute("aria-label", `Amount to add to ${meal.name}`);
    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "add-button";
    addButton.dataset.action = "add";
    addButton.textContent = "Add";
    row.append(input, addButton);

    const error = document.createElement("p");
    error.className = "portion-error";
    error.setAttribute("role", "alert");
    card.append(top, total, row, error);
    mealList.append(card);
  });
}

mealForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = mealNameInput.value.trim();
  if (!name) {
    mealError.textContent = "Please enter a meal name.";
    mealNameInput.focus();
    return;
  }
  meals.unshift({ id: crypto.randomUUID(), name, total: 0 });
  saveMeals();
  mealForm.reset();
  mealError.textContent = "";
  render();
  mealNameInput.focus();
});

mealList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const card = button.closest(".meal-card");
  const meal = meals.find((item) => item.id === card.dataset.id);
  if (!meal) return;

  if (button.dataset.action === "delete") {
    meals = meals.filter((item) => item.id !== meal.id);
    saveMeals();
    render();
    return;
  }

  const input = card.querySelector(".portion-input");
  const error = card.querySelector(".portion-error");
  const portion = parsePortion(input.value);
  if (portion === null) {
    error.textContent = "Enter a number from 0 to 1.";
    input.focus();
    return;
  }

  meal.total = Math.round((meal.total + portion) * 100) / 100;
  saveMeals();
  render();
});

mealList.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.target.matches(".portion-input")) {
    event.preventDefault();
    event.target.closest(".meal-card").querySelector(".add-button").click();
  }
});

render();
