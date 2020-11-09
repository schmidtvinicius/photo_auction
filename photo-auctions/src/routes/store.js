import {readable, writable} from 'svelte/store';

export let roles = writable(undefined)

export const categories = readable([
    'Animals',
    'Nature',
    'Urban/city',
    'Portrait',
    'Landscape',
    'Architecture',
    'Action',
    'Sports',
    'Aerial',
    'Wedding',
    'Fashion'
])

export const dimensions = readable([
    '6.35x8.89',
    '8.89x12.7',
    '10.2x15.2',
    '12.7x17.8',
    '15.2x20.3',
    '20.3x25.4',
    '20.3x30.5',
    '25.4x30.5'
])

export function reloadRoles(){
    const payload = getTokenPayload()
    if(payload){
        roles.set(payload.roles)
    }
}

export function saveToken(token) {
    // use a better mechanism to store tokens more permanently
    localStorage.setItem('sessionToken', token)
    const payload = getTokenPayload()
    roles.set(payload.roles)
    //sessionToken = token
}

export function resetToken() {
    // clear token when users logs out
    localStorage.removeItem('sessionToken')
    roles.set(undefined)
}

export function getTokenPayload() {
    const sessionToken = localStorage.getItem('sessionToken')
    if (sessionToken) {
        // extract JSON payload from token string
        return JSON.parse(atob(sessionToken.split('.')[1]))
    }
    return undefined
}