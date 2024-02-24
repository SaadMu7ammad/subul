import { Request } from "express";
import { IUserDocument } from "../../../user/data-access/interfaces/user.interface";
export interface authedRequest extends Request{
    user:IUserDocument
}