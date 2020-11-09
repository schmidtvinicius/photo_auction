import express from 'express'
import users from './users.js'
import auctions from './auctions.js'
import {verifyToken} from  '../authentication/util.js';
import status from 'http-status-codes'

const {UNAUTHORIZED} = status

const router = new express.Router()

// add routes to the router

router.use((req, res, next) =>{
    try{
        const payload = verifyToken(req.header('Authorization'))
        if(payload){
            req.token = payload
            return next()
        }
    }catch (problem){
    }
    return res.status(UNAUTHORIZED).json({error: 'User must be logged in'})
})

router.use('/users', users)
router.use('/auctions', auctions)
export default router