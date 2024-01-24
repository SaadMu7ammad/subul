import jwt from 'jsonwebtoken'

const generateToken = (res, id,payloadType) => {
    let payload;
    if(payloadType === 'user'){
        payload = {userId:id};
    }else if(payloadType === 'charity'){
        payload = {charityId:id};
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn:'30d'
    })
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV,
        sameSite: 'strict',
        maxAge:30*24*60*60*1000
    })
}

export default generateToken;