import { FilmSearchRequest } from '../types'

const cache: any = {}

export const getSearchCacheKey = (request: FilmSearchRequest) => {
    const { excludeVHS, excludeDVD, excludeProjector, currentPage, pageSize, sortField, sortDirection, search } = request
    return `${search.title}:${search.releaseYear}:${search.director}:${search.distributor}
:${excludeVHS}:${excludeDVD}:${excludeProjector}:${currentPage}:${pageSize}:${sortField}:${sortDirection}`
}

export const cacheGet = (key: string) => {
    return cache[key]
}

export const cacheSet = (key: string, value: any) => {
    cache[key] = value
}
