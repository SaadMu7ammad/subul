// import { Request } from 'express';
// import { IUserDocument } from '../../../user/data-access/interfaces/user.interface';
// import { ICharityDocument } from '../../../charity/data-access/interfaces/charity.interface';
// export interface AuthedRequest extends Request {
//     user: IUserDocument;
//     charity: ICharityDocument;
// }
export interface IloginData  {
    email: string;
    password:string;
}