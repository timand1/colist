export type Shoppinglist = {
    item : string,
    amount : number
    comment? : string
}

export type ToDoList = {
    todo : string
    comment? : string
}

export type TopList = {
    item : string
    placement : number
}

export type List = {
    author : string
    name : string
    id : string
    list : Shoppinglist[] | ToDoList[] | TopList[]
    users : string[]
}