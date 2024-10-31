import { Film, FilmSearchRequest } from '../types'

const postRequest = async (url: string, payload: any) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })

    return await response.json()
}

export const searchVHS = (payload: FilmSearchRequest): Promise<[Film]> => {
    return postRequest('https://vhs.service.com/search', payload)
}

export const searchDVD = async (payload: FilmSearchRequest): Promise<[Film]> => {
    return postRequest('https://dvd.service.com/search', payload)
}

export const searchProjector = async (payload: FilmSearchRequest): Promise<[Film]> => {
    return postRequest('https://prjktr.service.com/search', payload)
}
