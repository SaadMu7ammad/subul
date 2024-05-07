import { UserObject } from "./auth.user";

export interface authUserResponse {
    user: UserObject;
    msg?: string;
    token?: string; // must be optional cuz it comes from responseData as optional
};

export interface registerUserResponse { user: UserObject }