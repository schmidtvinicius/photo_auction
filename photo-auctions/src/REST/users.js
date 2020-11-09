import express from 'express'
import status from 'http-status-codes'
import {hashPassword} from "../authentication/util.js";
import {removeBidFromAuction} from "./auctions.js";

const router = new express.Router()
const { NOT_FOUND, BAD_REQUEST, NO_CONTENT, UNAUTHORIZED, CREATED } = status
let users = [
    {
        username: "vini",
        passwordHash: "$2b$10$7fe7KaFv9X0uJCNHKPAN/euy/qRjOjuhHfgI6lV/kqSup9dtTfHYS",
        email: "478336@student.saxion.nl",
        roles: ["user", "admin"],
        wonAuctions: [],
        bids: [
            {
                id: 1,
                name: 'first',
                bidValue: 15.00,
                auctionId: 1,
                placedAt: '15:10',
                isHighestBid: true,
                placedBy: 'vini'
            }
        ]
    },
    {
        username: "joyce",
        passwordHash: "$2b$10$Z6lGeVWg3ECHaucymLEsg.8ZlmJ17uV94cMaUvqriH5QoNFMhpVQO",
        email: "480801@student.saxion.nl",
        roles: ["user"],
        wonAuctions: [],
        bids: []
    }
]

router.get('', (req, res) =>{
    if(req.token.roles.includes("admin")){
        return res.json(users)
    }else{
        return res.status(UNAUTHORIZED).end(`Only administrators can access this content!`)
    }

})

router.get('/:username', (req, res) =>{
    let username = req.params.username
    if(req.token.roles.includes("admin") || req.token.username === username){
        const user = users.find(candidate => candidate.username === username)
        if(user !== undefined){
            return res.json(user)
        }else{
            return res.status(NOT_FOUND).end(`User not found`)
        }
    }else{
        return res.status(UNAUTHORIZED).end(`Only administrators can access this content!`)
    }
})

router.delete('/:username', (req, res) =>{
    let username = req.params.username
    if(req.token.roles.includes("admin") || req.token.username === username){
        const userIndex = users.findIndex(candidate => candidate.username === username)
        if(userIndex >= 0 && userIndex < users.length){
            users.splice(userIndex, 1)
            return res.status(NO_CONTENT).end(`User deleted successfully!`)
        }else{
            return res.status(NOT_FOUND).end(`User not found`)
        }
    }else{
        return res.status(UNAUTHORIZED).end(`Only administrators can access this content!`)
    }
})

router.put('/:username', (req, res) =>{
    const username = req.params.username
    if(req.token.roles.includes("admin") || req.token.username === username){
        const updatedInfo = req.body
        const user = users.find(candidate => candidate.username === username)
        if(user !== undefined){
            user.username = updatedInfo.username
            user.email = updatedInfo.email
            user.passwordHash= hashPassword(updatedInfo.password)
            return res.json(user)
        }else{
            return res.status(NOT_FOUND).end(`User not found`)
        }
    }else{
        return res.status(UNAUTHORIZED).end(`Only administrators can access this content!`)
    }

})

router.patch('/:username', (req, res) =>{
    const username = req.params.username
    if(req.token.roles.includes("admin") || req.token.username === username){
        const updatedInfo = req.body
        const user = users.find(candidate => candidate.username === username)
        if(user !== undefined){
            if(updatedInfo.password !== undefined){
                user.passwordHash = hashPassword(updatedInfo.password)
            }else if(updatedInfo.username !== undefined){
                user.username = updatedInfo.username
            }else if(updatedInfo.email !== undefined){
                user.email = updatedInfo.email
            }
            return res.json(user)
        }else{
            return res.status(NOT_FOUND).end(`User not found`)
        }
    }else{
        return res.status(UNAUTHORIZED).end(`Only administrators can access this content!`)
    }
})

router.get('/:username/won-auctions', (req, res) =>{
    const username = req.params.username
    if(req.token.roles.includes("admin") || req.token.username === username){
        const user = users.find(candidate => candidate.username === username)
        if(user !== undefined){
            return res.json(user.wonAuctions)
        }else{
            return res.status(NOT_FOUND).end(`User not found!`)
        }
    }else{
        return res.status(UNAUTHORIZED).end(`Only administrators can access this content!`)
    }

})

router.get('/:username/bids', (req, res) => {
    const username = req.params.username
    const user = getUser(username)
    console.log(user.bids)
    return res.json(user.bids)
})

//Delete a bid from an auction
router.delete('/:username/bids/:bidId', (req, res) => {
    let bidId = req.params.bidId
    if(!bidId.match(`^[0-9]+$`)){
        return res.status(BAD_REQUEST).end(`Auction id is invalid!`)
    }
    bidId = parseInt(bidId, 10)
    const username = req.params.username
    const user = getUser(username)
    const bidIndex = user.bids.findIndex(candidate => candidate.id === bidId)
    const bid  = user.bids[bidIndex]
    if(bidIndex >= 0 && bidIndex < user.bids.length){
        user.bids.splice(bidIndex, 1)
        removeBidFromAuction(bid)
        return res.json(user.bids)
    }else{
        return res.status(NOT_FOUND).end(`Bid not found!`)
    }
})

export function getUser(username){
    return users.find(candidate => candidate.username === username)
}

export function addUser(user){
    users.push(user)
}

export function usernameExists(username){
    for(const userIterator of users){
        if(userIterator.username === username) {
            return true
        }
    }
    return false
}

export default router