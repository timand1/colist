export type Shoppinglist = {
    item : string,
    amount : number
    comment? : string
}

export type ToDoList = {
    todo : string
    comment? : string
}

export type NumberedList = {
    item : string
    placement : number
}

export type List = {
    author : string
    name : string
    id : string
    list : Shoppinglist[] | ToDoList[] | NumberedList[] | []
    users : string[]
}