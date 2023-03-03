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

export type TimeList = {
    item : string
    placement : number
    id: string
}

export type User = {
    name : string
    id : string
    img : string
    email : string
}

export type List = {
    author : User
    name : string
    type: string
    id : string
    list : Shoppinglist[] | ToDoList[] | NumberedList[] | TimeList[] | []
    users : User[]
}