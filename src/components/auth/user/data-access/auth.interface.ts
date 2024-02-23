import { Request } from "express";
import { IUser } from "../../../user/data-access/interfaces/user.interface";
export interface authedRequest extends Request{
    user:IUser
}