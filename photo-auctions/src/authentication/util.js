import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

let nextBidId = 1

export function getNextBidId(){
    nextBidId++
    return nextBidId
}

export function hashPassword(plainPassword){
    return bcrypt.hashSync(plainPassword, bcrypt.genSaltSync(10))
}

export function checkPassword(plainPassword, hashedPassword){
    return bcrypt.compareSync(plainPassword, hashedPassword)
}

const theSecret = 'K7f*x3Y@Epbaf4Y8b*VDZ%EjlDjCmrocY4hSthKn4', bearerPrefix = 'Bearer '

export function createToken(payload){
    return jwt.sign(payload, theSecret)
}

export function verifyToken(authorization){
    return authorization.startsWith(bearerPrefix) && jwt.verify(authorization.substr(bearerPrefix.length), theSecret)
}

// export function checkExpiredDates(auctions){
//     const today = getTodayDate()
//     for(const auction of auctions){
//         if(auction.endDate.localeCompare(today) < 0){
//             auction.hasEnded = true
//         }else if(auction.endDate.localeCompare(today) === 0){
//             const time = getTodayTime()
//             if(auction.endTime.localeCompare(time) < 0){
//                 auction.hasEnded = true
//             }
//         }
//     }
//     console.log(auctions)
//     return auctions
// }

export function checkExpiredDates(auction){
    const today = getTodayDate()
    if(auction.endDate.localeCompare(today) < 0){
        auction.hasEnded = true
    }else if(auction.endDate.localeCompare(today) === 0){
        const time = getTodayTime()
        if(auction.endTime.localeCompare(time) < 0){
            auction.hasEnded = true
        }
    }
    return auction
}

export function getTodayDate(){
    const today = new Date()

    let day = today.getDate()
    if(day < 10){
        day = '0'+day
    }

    let month = today.getMonth()+1
    if(month < 10){
        month = '0'+month
    }

    const year = today.getFullYear()

    return year+'-'+month+'-'+day
}

function getTodayTime(){
    const today = new Date()

    let hour = today.getHours()
    if(hour < 10){
        hour = '0'+hour
    }

    let minutes = today.getMinutes()
    if(minutes < 10){
        minutes = '0'+minutes
    }

    return hour+':'+minutes
}