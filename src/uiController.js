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

        const priorityClass = todo.priority.toLowerCase() === 'high' ? 'high-priority' : todo.priority.toLowerCase() === 'medium' ? 'medium-priority' : 'low-priority';
        todoCard.classList.add(priorityClass);

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
                <button class="edit-todo" data-id="${todo.id}">Edit</button>
                <button class="delete-todo" data-id="${todo.id}">Delete</button>
            </div>
        `;

        todoContainer.appendChild(todoCard);
    });
}

// delete project
function handleDeleteProject(projectID) {
    manager.deleteProject(projectID);
    renderApp();
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

    // edit btn
    const editBtn = event.target.closest('.edit-todo');

    if (editBtn) {
        const todoID = editBtn.dataset.id;
        const todoToEdit = manager.activeProject.todoList.find(todo => todo.id === todoID);

        if (todoToEdit) {
            document.getElementById('todo-title').value =todoToEdit.title;
            document.getElementById('todo-description').value = todoToEdit.description;
            document.getElementById('todo-due-date').value = todoToEdit.dueDate;
            document.getElementById('todo-priority').value = todoToEdit.priority;

            // clear existing checklist inputs
            const checklistInputsContainer = document.getElementById('checklist-inputs');
            checklistInputsContainer.innerHTML = '';

            // populate checklist inputs
            todoToEdit.checklist.forEach(item => {
                const checklistItemDiv = document.createElement('div');
                checklistItemDiv.classList.add('checklist-item');

                checklistItemDiv.innerHTML = `
                    <input type="text" value="${item.text}" class="checklist-item-input">
                `;

                checklistInputsContainer.appendChild(checklistItemDiv);
            });

            todoModal.showModal();
        }
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
    // clear hidden ID to ensure we're in "add" mode
    document.getElementById('edit-todo-id').value = '';

    // clear checklist container for new todo
    document.getElementById('checklist-inputs').innerHTML = '';

    todoForm.reset();
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

    // 1. Grab the hidden ID field to determine if we're editing or adding
    const editID = document.getElementById('edit-todo-id').value;

    // 2. Collect form data
    const formData = new FormData(todoForm);
    const todoData = Object.fromEntries(formData.entries());

    // 3. Collect checklist items
    const checklistItems = todoForm.querySelectorAll('.checklist-item-input');
    todoData.checklist = Array.from(checklistItems).map(input => ({
        text: input.value,
        completed: false
    }));

    // 4. Determine if we're editing or adding
    if (editID) {
        manager.updateTodoInActive(editID, todoData);
    } else {
        manager.addTodoToActive(todoData);
    }

    // 5. Reset form and close modal
    todoForm.reset();
    document.getElementById('edit-todo-id').value = '';
    todoModal.close();

    // 6. Re-render the app to reflect changes
    renderApp();
});

// --- checklist item input ---
// 1. Grab the elements related to checklist items
const addChecklistItemBtn = document.getElementById('add-checklist-item-btn');
const checklistInputsContainer = document.getElementById('checklist-inputs');

// 2. Click event to add new checklist item input
addChecklistItemBtn.addEventListener('click', () => {
    const checklistItemDiv = document.createElement('div');
    checklistItemDiv.classList.add('checklist-item');

    checklistItemDiv.innerHTML = `
        <input type="text" placeholder="Enter sub-task" class="checklist-item-input">
        <button type="button" class="remove-step-btn">Remove</button>
    `;
    checklistInputsContainer.appendChild(checklistItemDiv);
});