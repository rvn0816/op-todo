import { Project } from './project';
import { Todo } from './todo';

export class ProjectManager {
    static instance;

    constructor() {
        if (ProjectManager.instance) {
            return ProjectManager.instance;
        }

        this.projects = [];
        this.activeProject = null;

        ProjectManager.instance = this;

        // rehydrate projects from localStorage
        const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];

        const rehydratedProjects = savedProjects.map(projectData => {
            // 1. Rehydrating project instances
            const newProject = new Project(projectData.projectName);

            // 2. Rehydrating todo instances for each project
            newProject.todoList = projectData.todoList.map(todoData => Todo.fromJSON(todoData));

            return newProject;
        });
        this.projects = rehydratedProjects;
        if (this.projects.length === 0) {
            const defaultProject = new Project('Default Project');
            this.projects.push(defaultProject);
        }

        this.activeProject = this.projects[0];
    }

    setActiveProject(projectID) {
        const currentProject = this.projects.find(project => {
            return project.id === projectID;
        });
        if (!currentProject) {
            this.activeProject = this.projects[0];
        } else {
            this.activeProject = currentProject;
        }
    }

    #saveToLocalStorage() {
        localStorage.setItem('projects', JSON.stringify(this.projects));
        localStorage.setItem('activeProjectID', this.activeProject?.id);
    }

    addProject(name) {
        const newProject = new Project(name);
        this.projects.push(newProject);
        this.#saveToLocalStorage();
    }

    deleteProject(projectID) {
        const updatedProjects = this.projects.filter(project => {
            return project.id !== projectID;
        });
        this.projects = updatedProjects;
        this.activeProject = this.projects[0] || null;
        this.#saveToLocalStorage();
    }

    addTodoToActive(todoData) {
        if (!this.activeProject) {
            console.error('No active project selected');
            return;
        }
        this.activeProject.addTodo(
            todoData.title,
            todoData.description,
            todoData.dueDate,
            todoData.priority,
            todoData.notes,
            todoData.checklist
        );
        this.#saveToLocalStorage();
    }

    removeTodoFromActive(todoID) {
        if (!this.activeProject) {
            console.error('No active project selected');
            return;
        }
        this.activeProject.removeTodo(todoID);
        this.#saveToLocalStorage();
    }

    toggleTodoInActive(todoID, itemIndex = null) {
        if (!this.activeProject) return;

        const targetTodo = this.activeProject.todoList.find(todo => todo.id === todoID);

        if (targetTodo) {
            if (itemIndex !== null) {
                // checklist item toggle
                targetTodo.toggleCheckListItem(itemIndex);
            } else {
                // main task toggle
                targetTodo.toggleComplete();
            }
            this.#saveToLocalStorage();
        }
    }
}

export const manager = new ProjectManager();