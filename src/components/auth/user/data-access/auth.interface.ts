import { Request } from "express";
import { IUserDocument } from "../../../user/data-access/interfaces/user.interface.js";
import { CharityDocument } from "../../../charity/data-access/interfaces/charity.interface.js";
export interface authedRequest extends Request{
    user:IUserDocument
    charity:CharityDocument
}