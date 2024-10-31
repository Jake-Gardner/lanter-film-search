import { Router} from 'express'
import { unionBy } from 'lodash'
import { searchVHS, searchDVD, searchProjector } from '../services/fetch'
import { FilmSearchRequest } from '../types'

const router = Router()

router.post('/search', async (req, res) => {
    const { excludeVHS, excludeDVD, excludeProjector, pageSize, sortField, sortDirection } = req.body as FilmSearchRequest

    const requests = [
        excludeVHS === true ? [] : searchVHS(req.body),
        excludeDVD === true ? [] : searchDVD(req.body),
        excludeProjector === true ? [] : searchProjector(req.body)
    ]
    const [vhsResults, dvdResults, projectorResults] = await Promise.all(requests)

    // Combine results from all three sources, deduplicating by title and year
    let results = unionBy(vhsResults, dvdResults, (film) => `${film.title} ${film.releaseYear}`)
    results = unionBy(results, projectorResults, (film) => `${film.title} ${film.releaseYear}`)

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
    results = results.slice(0, pageSize)

    res.json({ results })
})

export default router