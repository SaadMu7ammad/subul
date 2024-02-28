import { Request } from "express";
import { IUserDocument } from "../../../user/data-access/interfaces/user.interface";
import { CharityDocument } from "../../../charity/data-access/interfaces/charity.interface";
export interface authedRequest extends Request{
    user:IUserDocument
    charity:CharityDocument
}