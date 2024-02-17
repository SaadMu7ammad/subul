import jwt from 'jsonwebtoken'
import * as configurationProvider from '../libraries/configuration-provider/index.js'
const generateToken = (res, id,payloadType) => {
    let payload;
    if(payloadType === 'user'){
        payload = {userId:id};
    }else if(payloadType === 'charity'){
        payload = {charityId:id};
    }
    const token = jwt.sign(payload, configurationProvider.getValue('hashing.jwtSecret'), {
        expiresIn:'30d'
    })
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: configurationProvider.getValue('environment.nodeEnv'),
        sameSite: 'strict',
        maxAge:30*24*60*60*1000
    })
}

export default generateToken;