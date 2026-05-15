export class Todo {
    static fromJSON(data) {
        const todo = new Todo({
            ...data,
            id: data.id
        });
        return todo;
    }

    constructor({
        title, 
        description, 
        dueDate, 
        priority, 
        notes = '', 
        checklist =[],
        id = Date.now().toString(),
        completed = false
    }) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.checklist = checklist;
        this.id = id;
        this.completed = completed;

        this.checklist = checklist.map(item => typeof item === 'string' ? { text: item, completed: false } : item);
    }

    toggleComplete() {
        this.completed = !this.completed;
    }

    updatePriority(newPriority) {
        this.priority = newPriority;
    }

    toggleCheckListItem(index) {
        const item = this.checklist[index];
        if (item) {
            item.completed = !item.completed;
        }
    }
}