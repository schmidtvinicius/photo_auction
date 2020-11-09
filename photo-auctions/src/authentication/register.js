import express from 'express'
import status from 'http-status-codes'
import {createToken, hashPassword} from './util.js';
import {addUser, usernameExists} from "../REST/users.js";

const router = new express.Router()
const { NOT_FOUND, BAD_REQUEST, NO_CONTENT, UNAUTHORIZED, CREATED } = status

export default function(req, res){
    let user = req.body
    if(usernameExists(user.username)){
        return res.status(BAD_REQUEST).json({error: 'Username is already taken'})
    }
    const passwordHash = hashPassword(user.password)
    user = {
        username: user.username,
        passwordHash: passwordHash,
        email: user.email,
        roles: ["user"],
        wonAuctions: []
    }
    addUser(user)
    const payload = {
        username: user.username,
        roles: user.roles
    }
    return res.json({token: createToken(payload)}).status(CREATED)

}