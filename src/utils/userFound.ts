import { UserService } from "../services/user.service"

export const isUserFound=async(userId:string)=>{
    const user= await UserService.getUserByid(userId)
    if(!user){
        return false
    }
}