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
            const newProject = new Project(projectData.projectName, [], projectData.id);

            // 2. Rehydrating todo instances for each project
            newProject.todoList = projectData.todoList.map(todoData => Todo.fromJSON(todoData));

            return newProject;
        });

        this.projects = rehydratedProjects;
        
        if (this.projects.length === 0) {
            const defaultProject = new Project('Default Project');
            this.projects.push(defaultProject);
        }

        const savedActiveProjectID = localStorage.getItem('activeProjectID');
        const foundActiveProject = this.projects.find(project => project.id === savedActiveProjectID);
        this.activeProject = foundActiveProject || this.projects[0];
    }

    setActiveProject(projectID) {
        const currentProject = this.projects.find(project => project.id === projectID);
        
        if (!currentProject) {
            this.activeProject = this.projects[0];
        } else {
            this.activeProject = currentProject;
        }
        localStorage.setItem('activeProjectID', projectID);
        this.#saveToLocalStorage();
    }

    #saveToLocalStorage() {
        localStorage.setItem('projects', JSON.stringify(this.projects));
        localStorage.setItem('activeProjectID', this.activeProject?.id);
    }

    #loadFromLocalStorage() {
        const data = JSON.parse(localStorage.getItem('projects')) || [];
        return data.map(projectData => {
            const project = new Project(projectData.projectName, [], projectData.id);
            project.todoList = projectData.todoList.map(todoData => Todo.fromJSON(todoData));
            return project;
        });
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
        if (!this.activeProject) return;

        this.activeProject.addTodo(todoData);
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

    updateTodoInActive(todoID, updatedData) {
        if (!this.activeProject) return;

        const targetTodo = this.activeProject.todoList.find(todo => todo.id === todoID);

        if (targetTodo) {
            targetTodo.title = updatedData.title;
            targetTodo.description = updatedData.description;
            targetTodo.dueDate = updatedData.dueDate;
            targetTodo.priority = updatedData.priority;
            targetTodo.notes = updatedData.notes;
            targetTodo.checklist = updatedData.checklist;

            this.#saveToLocalStorage();
        }
    }

    updateTodo(todoID, updatedData) {
        for (const project of this.projects) {
            const targetTodo = project.todoList.find(t => t.id === todoID);
            if (targetTodo) {
                Object.assign(targetTodo, updatedData); // Clean way to update properties
                this.#saveToLocalStorage();
                break;
            }
        }
    }
}

export const manager = new ProjectManager();