# film-search

This app is based on a prompt provided while interviewing for a software engineer role. The requirement was to create an API server that would be used to search for movies, which are held in three separate upstream services. This service would have to make requests to those services, passing along the specified criteria, and then aggregate the results into a single set of results to return to the client. Time spent on this was approximately two hours.

Pagination
----------
Guaranteeing correct pagination, given the specifications of this system, did seem like a significant problem to me. As an example, I imagined that a user requested `currentPage: 0` and `pageSize: 10`. In generating the response, the top 10 results by the specified sorting method (and therefore the entire page) were all from the VHS service, so the results pulled from the DVD and Projector services were all ignored and not sent back to the client. In this situation, if the user were to request `currentPage: 1`, the service should request `currentPage: 1` from the VHS service, and `currentPage: 0` from the DVD and Projector services, and aggregate the final result based on those responses. The only way for the service to know that this is the case is if it were to first generate the response for `currentPage: 0` before generating the response for `currentPage: 1`. Following this logic, if a user were to request `currentPage: 100`, the service would have to first determine pages 0-99, requiring up to 300 requests to the upstream services. To me, this would present an unacceptable amount of latency for the user. It could be mitigated through caching, but that would of course also present the possibility of stale data being presented to the user.

I've updated the code to reflect this solution, using a simple in-memory cache, which could easily be swapped out for a more robust solution like Redis, which would also provide expiration of cached values.

I saw two possible solutions to eliminating the pagination issue that were beyond the scope of this exercise. The first would be to combine all three services and store all different types of films in the same database. This would make pagination trivial, down to a simple query. The second solution, if it were necessary to keep them separate (or too complex to combine them), would be to use an event-based architecture to keep the front-facing aggregate service up-to-date with all necessary data stored in its own database. It could store only the fields necessary for searching and sorting, as well as unique ids for each record. This would allow a simple search with correct pagination to be done on the aggregate service's database, which could then make any necessary requests to the upstream services for extra data, using an array of ids to specify which records to retrieve.
