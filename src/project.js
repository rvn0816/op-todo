import { Todo } from './todo';

export class Project {
    static fromJSON(data) {
        const todos = data.todoList.map(todoData => Todo.fromJSON(todoData));
        return new Project(data.projectName, todos, data.id);
    }

    constructor(projectName, todoList = [], id = Date.now().toString()) {
        this.projectName = projectName;
        this.todoList = todoList;
        this.id = id;
    }

    addTodo(todoData) {
        const newTodo = new Todo(todoData);
        this.todoList.push(newTodo);
        return newTodo;
    };
    
    removeTodo(todoID) {
        const updatedTodoList = this.todoList.filter((todo) => {
            return todo.id !== todoID;
        });
        this.todoList = updatedTodoList;
    };
}