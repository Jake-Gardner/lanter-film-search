import { FilmSearchRequest } from '../types'
import { searchDVD, searchProjector, searchVHS } from './fetch'
import { unionFilms } from '../utils'

export const search = async (payload: FilmSearchRequest) => {
    const { excludeVHS, excludeDVD, excludeProjector, sortField, sortDirection } = payload

    const requests = [
        excludeVHS === true ? [] : searchVHS(payload),
        excludeDVD === true ? [] : searchDVD(payload),
        excludeProjector === true ? [] : searchProjector(payload)
    ]
    const [vhsResults, dvdResults, projectorResults] = await Promise.all(requests)

    // Combine results from all three sources, deduplicating by title and year
    return unionFilms(vhsResults, dvdResults, projectorResults)
}
