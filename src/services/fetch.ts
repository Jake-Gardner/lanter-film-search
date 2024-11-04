import { Film, FilmSearchRequest } from '../types'
import { getSearchCacheKey, cacheGet, cacheSet } from './cache'

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

export const searchVHS = async (payload: FilmSearchRequest): Promise<[Film]> => {
    const cacheKey = `VHS_SEARCH:${getSearchCacheKey(payload)}`
    const cachedResult = cacheGet(cacheKey)
    if (cachedResult) {
        return cachedResult
    }

    const result = await postRequest('https://vhs.service.com/search', payload)
    cacheSet(cacheKey, result)
    return result
}

export const searchDVD = async (payload: FilmSearchRequest): Promise<[Film]> => {
    const cacheKey = `DVD_SEARCH:${getSearchCacheKey(payload)}`
    const cachedResult = cacheGet(cacheKey)
    if (cachedResult) {
        return cachedResult
    }

    const result = await postRequest('https://dvd.service.com/search', payload)
    cacheSet(cacheKey, result)
    return result
}

export const searchProjector = async (payload: FilmSearchRequest): Promise<[Film]> => {
    const cacheKey = `PROJECTOR_SEARCH:${getSearchCacheKey(payload)}`
    const cachedResult = cacheGet(cacheKey)
    if (cachedResult) {
        return cachedResult
    }

    const result = await postRequest('https://prjktr.service.com/search', payload)
    cacheSet(cacheKey, result)
    return result
}
