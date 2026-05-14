import { Todo } from './todo';
import { Project } from './project';
import { ProjectManager, manager } from './projectManager';

// Containers
const projectContainer = document.getElementById('project-list-container');
const todoContainer = document.getElementById('todo-list-container');
const activeProjectName = document.getElementById('active-project-name');

const todoModal = document.getElementById('todo-modal');
const todoForm = document.getElementById('todo-form');
const addTodoBtn = document.getElementById('add-todo-btn');
const cancelTodoBtn = document.getElementById('cancel-todo-btn');

// Render Functions
export function renderApp() {
    renderSidebar();
    renderTodoList();
}

function renderSidebar() {
    // resets the content
    projectContainer.innerHTML = '';

    manager.projects.forEach(project => {
        const btn = document.createElement('button');
        btn.textContent = project.projectName;
        btn.classList.add('project-btn');

        // get the active project displayed
        const isActive = project.id === manager.activeProject?.id;
        if (isActive) {
            btn.classList.add('active-project');
        }

        // Attach ID for the event listener
        btn.dataset.projectID = project.id;

        projectContainer.appendChild(btn);
    });
}

function renderTodoList() {
    todoContainer.innerHTML = '';

    if (!manager.activeProject) return;

    activeProjectName.textContent = manager.activeProject.projectName;

    manager.activeProject.todoList.forEach(todo => {
        const todoCard = document.createElement('div');
        todoCard.classList.add('todo-card');

        todoCard.innerHTML = `
            <div class="todo-info">
                <h3>${todo.title}</h3>
                <p>${todo.dueDate}</p>
                <ul class="checklist-container">
                    ${todo.checklist.map((item, index) => `
                        <li class="checklist-item">
                            <input type="checkbox"
                                    class="toggle-check"
                                    data-todo-id="${todo.id}"
                                    data-index="${index}"
                                    ${item.completed ? 'checked' : ''}>
                            <span>${item.text}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            <div class="todo-actions">
                <button class="delete-todo" data-id="${todo.id}">Delete</button>
            </div>
        `;

        todoContainer.appendChild(todoCard);
    });
}

// event listeners
todoContainer.addEventListener('click', (event) => {
    // completed todo
    const toggleCheck = event.target.closest('.toggle-check');

    if (toggleCheck) {
        const todoID = toggleCheck.dataset.todoId;
        const itemIndex = toggleCheck.dataset.index;

        manager.toggleTodoInActive(
            todoID, 
            itemIndex !== undefined ? Number(itemIndex) : null);

        renderApp();
    }

    // delete todo
    const deleteBtn = event.target.closest('.delete-todo');

    if (deleteBtn) {
        const todoID = deleteBtn.dataset.id;
        manager.removeTodoFromActive(todoID);
        renderApp();
    }
});

// ---- todo modal ----
// open modal
addTodoBtn.addEventListener('click', () => {
    todoModal.showModal();
});

//close modal
cancelTodoBtn.addEventListener('click', () => {
    todoForm.reset();
    todoModal.close();
});

// submit form - add new todo
todoForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(todoForm);
    const todoData = Object.fromEntries(formData.entries());

    manager.addTodoToActive(todoData);

    todoForm.reset();
    todoModal.close();
    renderApp();
});