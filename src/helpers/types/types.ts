export type Shoppinglist = {
    item : string,
    amount : number
    comment? : string
    done: boolean
    id: string
    assigned : User[]
}

export type ToDoList = {
    todo : string
    comment? : string
    done: boolean
    id: string
    assigned : User[]
}

export type NumberedList = {
    item : string
    placement : number
    id: string
    assigned : User[]
}

export type TimeList = {
    item: string
    time: string
    date? : number
    id: string
    assigned : User[]
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
    users : User[],
    updated : string
    invited: User[]
}