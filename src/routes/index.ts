import { Router} from 'express'
import { FilmSearchRequest } from '../types'
import { getSearchCacheKey, cacheGet, cacheSet } from '../services/cache'
import { search } from '../services/search'
import { unionFilms } from '../utils'

const router = Router()

router.post('/search', async (req, res) => {
    const { currentPage, pageSize, sortField, sortDirection } = req.body as FilmSearchRequest

    const cacheKey = `SEARCH:${getSearchCacheKey(req.body)}`
    const cachedResult = cacheGet(cacheKey)
    if (cachedResult) {
        res.json({ results: cachedResult })
        return
    }

    const pageNumbers = Array.from({ length: currentPage + 1 }, (_, i) => i)

    // Request results for all pages up to the current one
    const pages = await Promise.all(pageNumbers.map(pageNum => search({
        ...req.body,
        currentPage: pageNum
    })))

    let results = pages.length > 1 ? unionFilms(pages[0], pages[1], ...pages.slice(2)) : pages[0]

    // Sort results appropriately
    results.sort((a, b) => {
        if (sortField === 'releaseYear') {
            // Default to 'ASC' for invalid sort order values
            return sortDirection === 'DESC' ? b.releaseYear - a.releaseYear : a.releaseYear - b.releaseYear
        } else {
            // Default to 'title' for invalid sort field values
            if (sortDirection === 'DESC') {
                return a.title > b.title ? -1 : 1
            } else {
                return a.title > b.title ? 1 : -1
            }
        }
    })

    // Trim results down to page size if necessary
    results = results.slice(currentPage * pageSize, (currentPage + 1) * pageSize)

    cacheSet(cacheKey, results)

    res.json({ results })
})

export default router