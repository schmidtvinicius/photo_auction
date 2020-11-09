 import status from 'http-status-codes'

import {getUser} from '../REST/users.js'
import {checkPassword, createToken} from './util.js'

const {FORBIDDEN, UNAUTHORIZED} = status

export default function(req, res){
    const user = getUser(req.body?.username)
    if(!user || !checkPassword(req.body.password, user.passwordHash)){
        return res.status(UNAUTHORIZED).json({error: 'Invalid credentials'})
    }else{
        const payload = {
            username: user.username,
            roles: user.roles
        }
        return res.json({token: createToken(payload)})
    }
}