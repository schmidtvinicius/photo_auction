import express from 'express'
import status from 'http-status-codes'
import {getUser} from "./users.js";
import escapeHtml from 'escape-html'
import {checkExpiredDates, getTodayDate, getNextBidId} from "../authentication/util.js";

const router = new express.Router()
const {NOT_FOUND, BAD_REQUEST, NO_CONTENT, UNAUTHORIZED, FORBIDDEN} = status

const auctions = [
    {
        id: 1,
        productDescription: "Test",
        startingPrice: 10.00,
        productName: "first",
        category: 'Animals',
        dimension: '6.35x8.89',
        endDate: getTodayDate(),
        hasEnded: false,
        endTime: "21:10",
        highestBid: {
            id: 1,
            name: 'first',
            bidValue: 15.00,
            auctionId: 1,
            placedAt: '15:10',
            isHighestBid: true,
            placedBy: 'vini'
        },
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
        id: 2,
        productDescription: "Test2",
        startingPrice: 100.00,
        productName: "picture2",
        category: 'Nature',
        dimension: '15.2x20.3',
        endDate: getTodayDate(),
        hasEnded: false,
        endTime: "23:59",
        highestBid: {},
        bids: []
    },
    {
        id: 3,
        productDescription: "This is a nice picture of my sister's wedding. I'm selling it because she just got divorced =(",
        startingPrice: 100.00,
        productName: "Wedding picture",
        category: 'Wedding',
        dimension: '15.2x20.3',
        endDate: getTodayDate(),
        hasEnded: false,
        endTime: "23:59",
        highestBid: {},
        bids: []
    },
    {
        id: 4,
        productDescription: "This is a beautiful aerial picture of a Dutch farm.",
        startingPrice: 200.00,
        productName: "Dutch farm",
        category: 'Aerial',
        dimension: '15.2x20.3',
        endDate: getTodayDate(),
        hasEnded: false,
        endTime: "23:59",
        highestBid: {},
        bids: []
    }
]

//Get all auctions
router.get('', (req, res) => {
    let searchQuery = req.query?.q
    const filters = req.query
    if(searchQuery){
        searchQuery = escapeHtml(searchQuery)
        const matchingAuctions = []
        for(const auction of auctions){
            if(auction.productName.toLowerCase().match(searchQuery.toLowerCase())||
                auction.productDescription.toLowerCase().match(searchQuery.toLowerCase())){
                matchingAuctions.push(checkExpiredDates(auction))

            }
        }
        if(matchingAuctions.length === 0){
            return res.status(NOT_FOUND).json({error: 'No auctions found'})
        }else{
            return res.json(matchingAuctions)
        }
    }else if(!isEmpty(filters)){
        let priceRange = filters.priceRange
        const selectedCategories = filters.selectedCategories
        const selectedDimension = filters.selectedDimension

        if(priceRange !== '' && selectedCategories.length > 0 && selectedDimension !== 'All'){
            priceRange = parseFloat(priceRange)
            const matchingAuctions = []
            for(const auction of auctions){
                if(isEmpty(auction.highestBid)){
                    if(auction.startingPrice <= priceRange && selectedCategories.includes(auction.category) && auction.dimension === selectedDimension){
                        matchingAuctions.push(checkExpiredDates(auction))
                    }
                }else{
                    if(auction.highestBid.bidValue <= priceRange && selectedCategories.includes(auction.category) && auction.dimension === selectedDimension){
                        matchingAuctions.push(checkExpiredDates(auction))
                    }
                }
            }
            return res.json(matchingAuctions)
        }else if (priceRange !== '' && selectedCategories.length > 0){

            priceRange = parseFloat(priceRange)
            const matchingAuctions = []
            for(const auction of auctions){
                if(isEmpty(auction.highestBid)){
                    if(auction.startingPrice <= priceRange && selectedCategories.includes(auction.category)){
                        matchingAuctions.push(checkExpiredDates(auction))
                    }
                }else{
                    if(auction.highestBid.bidValue <= priceRange && selectedCategories.includes(auction.category)){
                        matchingAuctions.push(checkExpiredDates(auction))
                    }
                }
            }
            return res.json(matchingAuctions)

        }else if(selectedCategories.length > 0 && selectedDimension !== 'All'){

            const matchingAuctions = []
            for(const auction of auctions){
                if(selectedCategories.includes(auction.category) && auction.dimension === selectedDimension){
                    matchingAuctions.push(checkExpiredDates(auction))
                }
            }
            return res.json(matchingAuctions)

        }else if(priceRange !== '' && selectedDimension !== 'All'){

            priceRange = parseFloat(priceRange)
            const matchingAuctions = []
            for(const auction of auctions){
                if(isEmpty(auction.highestBid)){
                    if(auction.startingPrice <= priceRange && auction.dimension === selectedDimension){
                        matchingAuctions.push(checkExpiredDates(auction))
                    }
                }else{
                    if(auction.highestBid.bidValue <= priceRange && auction.dimension === selectedDimension){
                        matchingAuctions.push(checkExpiredDates(auction))
                    }
                }
            }
            return res.json(matchingAuctions)

        }else if(priceRange !== ''){

            priceRange = parseFloat(priceRange)
            const matchingAuctions = []
            for(const auction of auctions){
                if(isEmpty(auction.highestBid)){
                    if(auction.startingPrice <= priceRange){
                        matchingAuctions.push(checkExpiredDates(auction))
                    }
                }else{
                    if(auction.highestBid.bidValue <= priceRange){
                        matchingAuctions.push(checkExpiredDates(auction))
                    }
                }
            }
            return res.json(matchingAuctions)

        }else if(selectedCategories.length > 0){
            const matchingAuctions = []
            for(const auction of auctions){
                if(selectedCategories.includes(auction.category)){
                    matchingAuctions.push(checkExpiredDates(auction))
                }
            }
            return res.json(matchingAuctions)

        }else if(selectedDimension !== 'All'){
            const matchingAuctions = []
            for(const auction of auctions){
                if(auction.dimension === selectedDimension){
                    matchingAuctions.push(checkExpiredDates(auction))
                }
            }
            return res.json(matchingAuctions)
        }else{
            for(let auction of auctions){
                auction = checkExpiredDates(auction)
            }
            return res.json(auctions)
        }
    }else{
        for(let auction of auctions){
            auction = checkExpiredDates(auction)
        }
        return res.json(auctions)
    }


})

//Get a specific auction with id
router.get('/:id', (req, res) => {
    let auctionId = req.params.id
    if(!auctionId.match(`^[0-9]+$`)){
        return res.status(BAD_REQUEST).end(`Auction id is invalid!`)
    }
    auctionId = parseInt(auctionId, 10)
    let auction = auctions.find(candidate => candidate.id === auctionId)
    if (auction !== undefined) {
        auction = checkExpiredDates(auction)
        return res.json(auction)
    } else {
        return res.status(NOT_FOUND).end(`Auction not found`)
    }
})

//Place a new auction
router.post('', (req, res) => {
    if(req.token.roles.includes("admin")){
        let auction = req.body
        auction = {
            id: auctions.length + 1,
            productDescription: auction.productDescription,
            startingPrice: parseFloat(auction.startingPrice),
            productName: auction.productName,
            highestBid: {},
            endDate: auction.endDate,
            endTime: auction.endTime,
            category: auction.category,
            dimension: auction.dimension,
            bids: []
        }
        auctions.push(auction)
        return res.json(auctions)
    }else{
        return res.status(UNAUTHORIZED).end(`Only administrators can add auctions!`)
    }

})

//Edit an auction
router.put('/:id', (req, res) => {
    if(req.token.roles.includes("admin")){
        let auctionId = req.params.id
        const updatedInfo = req.body
        if(!auctionId.match(`^[0-9]+$`)){
            return res.status(BAD_REQUEST).end(`Auction id is invalid!`)
        }
        auctionId = parseInt(auctionId, 10)
        const auction = auctions.find(candidate => candidate.id === auctionId)
        if (auction !== undefined) {
            auction.productDescription = updatedInfo.productDescription
            auction.productName = updatedInfo.productName
            auction.category = updatedInfo.category
            auction.dimension = updatedInfo.updatedDimensions

            return res.json(auction)
        } else {
            return res.status(NOT_FOUND).end('Auction not found')
        }
    }else{
        return res.status(UNAUTHORIZED).end(`Only administrators can edit auctions!`)
    }

})

//Edit an auction
router.patch('/:id', (req, res) => {
    if(req.token.roles.includes("admin")){
        let auctionId = req.params.id
        const updatedInfo = req.body
        if(!auctionId.match(`^[0-9]+$`)){
            return res.status(BAD_REQUEST).end(`Auction id is invalid!`)
        }
        auctionId = parseInt(auctionId, 10)
        const auction = auctions.find(candidate => candidate.id === auctionId)
        if (auction !== undefined) {
            if (!updatedInfo.productDescription) {
                auction.productDescription = updatedInfo.productDescription
            } else if (!updatedInfo.expiryDate) {
                auction.expiryDate = updatedInfo.expiryDate
            } else if (!updatedInfo.productName) {
                auction.productName = updatedInfo.productName
            }
            return res.json(auction)
        } else {
            return res.status(NOT_FOUND).end('Auction not found')
        }
    }else{
        return res.status(UNAUTHORIZED).end(`Only administrators can edit auctions!`)
    }

})

//Delete an auction
router.delete('/:id', (req, res) => {
    if(req.token.roles.includes('admin')){
        let auctionId = req.params.id
        if(!auctionId.match(`^[0-9]+$`)){
            return res.status(BAD_REQUEST).end(`Auction id is invalid!`)
        }
        auctionId = parseInt(auctionId, 10)
        const auctionIndex = auctions.findIndex(candidate => candidate.id === auctionId)
        if (auctionIndex >= 0 && auctionIndex < auctions.length) {
            auctions.splice(auctionIndex, 1)
            return res.json(auctions)
        } else {
            return res.status(NOT_FOUND).end(`Auction not found`)
        }
    }else{
        return res.status(UNAUTHORIZED).end(`Only admins can delete auctions!`)
    }

})

//Place a bid on a auction
router.post('/:id/bids', (req, res) => {
    if(req.token !== undefined){
        const username = req.token.username
        let auctionId = req.params.id
        if(!auctionId.match(`^[0-9]+$`)){
            return res.status(BAD_REQUEST).end(`Auction id is invalid!`)
        }
        auctionId = parseInt(auctionId, 10)
        const auction = auctions.find(candidate => candidate.id === auctionId)
        if(auction !== undefined){
            const bidToPlace = req.body
            bidToPlace.bidValue = parseFloat(bidToPlace.bidValue)
            const user = getUser(username)
            let currentHighestBid = auction.highestBid
            if(bidToPlace.bidValue > auction.startingPrice){
                if(!isEmpty(currentHighestBid) && currentHighestBid.bidValue >= bidToPlace.bidValue){
                    return res.status(BAD_REQUEST).json({error: 'There may only be placed bids with a larger value than the current highest bid!'})
                }
                bidToPlace.id = getNextBidId()
                bidToPlace.name = auction.productName
                bidToPlace.auctionId = auctionId
                bidToPlace.placedBy = username
                const today = new Date();
                const placedAt = today.getHours() + ":" + ('0'+today.getMinutes()).slice(-2)
                bidToPlace.placedAt = placedAt
                if(!isEmpty(currentHighestBid)){
                    auction.highestBid.isHighestBid = false
                }
                bidToPlace.isHighestBid = true
                auction.highestBid = bidToPlace
                auction.bids.unshift(bidToPlace)
                user.bids.push(bidToPlace)
                return res.json(auction)
            }else{
                return res.status(BAD_REQUEST).json({error: 'There may only be placed bids with a larger value than the starting price!'})
            }
        }else{
            return res.status(NOT_FOUND).json({error: 'Auction not found!'})
        }
    }else{
        return res.status(FORBIDDEN).json({error: 'User must be logged in to place a bid!'})
    }

})

function isEmpty(object){
    return Object.keys(object).length === 0
}

export function removeBidFromAuction(bid){
    const auctionId = bid.auctionId
    const auction = auctions.find(candidate => candidate.id === auctionId)
    auction.bids.splice(auction.bids.findIndex(candidate => candidate.id === bid.id), 1)
    if(auction.highestBid.id === bid.id){
        auction.highestBid = {}
    }
}

export default router
