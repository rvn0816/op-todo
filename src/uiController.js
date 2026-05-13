import { Todo } from './todo';
import { Project } from './project';
import { ProjectManager } from './projectManager';

// Containers
const projectContainer = document.getElementById('project-list-container');
const todoContainer = document.getElementById('todo-list-container');
const activeProjectName = document.getElementById('active-project-name');

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
        const isActive = project.id === projectManager.activeProject?.id;
        projectElement.classList.toggle('active-project', isActive);

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
                    ${todo.checklist.map((item, index) => {`
                        <li class="checklist-item">
                            <input type="checkbox"
                                    class="toggle-check"
                                    data-todo-id="${todo.id}"
                                    data-index="${index}"
                                    ${item.completed ? 'checked' : ''}>
                            <span>${item.text}</span>
                        </li>
                    `}).join('')}
                </ul>
            </div>
            <div class="todo-actions">
                <button class="delete-todo" data-id="${todo.id}">Delete</button>
            </div>
        `;

        todoContainer.appendChild(todoCard);
    });
}

// delete Todo
const deleteBtn = event.target.closest('.delete-todo');

if (deleteBtn) {
    const todoID = deleteBtn.dataset.id;
    manager.removeTodoFromActive(todoID);
    renderApp();
}