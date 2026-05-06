import { Todo } from './todo';

export class Project {
    constructor(projectName, todoList = []) {
        this.projectName = projectName,
        this.todoList = todoList
    };

    addTodo(
        title, 
        description, 
        dueDate, 
        priority, 
        notes, 
        checklist
    ) {
        const newTodo = new Todo(
            title, 
            description, 
            dueDate, 
            priority, 
            notes, 
            checklist
        );

        this.todoList.push(newTodo);
    };
    
    removeTask(indexToRemove) {
        const updatedTodoList = this.todoList.filter((todo, index) => {
            return index !== indexToRemove;
        });
        this.todoList = updatedTodoList;
    };
}