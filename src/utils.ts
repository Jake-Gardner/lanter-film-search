import { unionBy } from 'lodash'
import { Film } from './types'

export const unionFilms = (films1: Film[], films2: Film[], ...rest: Film[][]): Film[] => {
    const results = unionBy(films1, films2, (film) => `${film.title} ${film.releaseYear}`)

    if (rest.length > 0) {
        return unionFilms(results, rest[0], ...rest)
    }
    return results
}
