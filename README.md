# lanter-film-search

Design
------

* I decided to build this API as a standalone Node/Express service, since this could allow an easy jumping-off point for further endpoints or more robust behavior in the future.
* Express was an obvious choice for quickly getting a basic server up and running. The built-in fetch function was perfectly sufficient for making API calls to the downstream services rather than bringing in an extra library. I did choose to use lodash specifically for the array deduplication method, since that kind of operation has the potential for being inefficient had I decided to reinvent the wheel instead of taking advantage of an existing method.
* The three downstream API request functions are only called if the corresponding exclude flags are not true, in which case they're replaced by an empty array, treating them as though no results were returned. I made the assumption that it was safe to use a string composed of the film title and year for deduplication, since films with identical titles can have been produced in different years. I decided to have the sorting default to title ascending, rather than returnining an array if those parameters are invalid, for a smoother user experience.
