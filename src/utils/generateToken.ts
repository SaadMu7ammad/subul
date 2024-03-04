import jwt from 'jsonwebtoken'
import * as configurationProvider from '../libraries/configuration-provider/index'
const generateToken = (res, id, payloadType:string) => {
    let payload:object|{charityId:string}|{userId:string}={};
    if(payloadType === 'user'){
        payload = {userId:id};
    }else if(payloadType === 'charity'){
        payload = {charityId:id};
    }
    const token:string = jwt.sign(payload, configurationProvider.getValue('hashing.jwtSecret'), {
        expiresIn:'3d'
    })
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: configurationProvider.getValue('environment.nodeEnv'),
        sameSite: 'strict',
        maxAge:3*24*60*60*1000
    })
    return token;
}

export default generateToken;