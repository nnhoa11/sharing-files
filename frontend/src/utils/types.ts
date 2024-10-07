interface Project { 
    _id: String,
    name : String,
    description : String,
    price: Number,
    files?: String,
    owner?: String
}
interface User{
    userId: string,
    username: string,
    type: string,
    success: boolean
}
export type { Project, User } 