// export interface decodedIds{
//     userId?: string,
//     charityId?:string
// }  
export interface Decoded {
    userId?: string,
    charityId?:string,
    iat: number;
    exp: number;
  }