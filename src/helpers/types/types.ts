export type Shoppinglist = {
    item : string,
    amount : number
    comment? : string
    done: boolean
    id: string
}

export type ToDoList = {
    todo : string
    comment? : string
    done: boolean
    id: string
}

export type NumberedList = {
    item : string
    placement : number
    id: string
}

export type List = {
    author : string
    name : string
    id : string
    list : Shoppinglist[] | ToDoList[] | NumberedList[] | []
    users : string[]
}