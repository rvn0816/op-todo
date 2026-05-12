export class Todo {
    static fromJSON(data) {
        const todo = new Todo(
            data.title,
            data.description, 
            data.dueDate, 
            data.priority, 
            data.notes, 
            data.checklist
        );
        todo.id = data.id;
        todo.completed = data.completed;
        return todo;
    }

    constructor(
        title, 
        description, 
        dueDate, 
        priority, 
        notes = '', 
        checklist =[]
    ) {
        this.id = Date.now().toString();
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.checklist = checklist;
        this.completed = false;
    }

    toggleComplete() {
        this.completed = !this.completed;
    }

    updatePriority(newPriority) {
        this.priority = newPriority;
    }
}