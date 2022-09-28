// import { FirebaseApp } from 'firebase/app';
// import { getFunctions, httpsCallable } from 'firebase/functions';
import { TMDBMultiSearchQuery, TMDBSearchMultiResponse } from '../tmdb';



// const imageWorker = new SharedWorker(new URL("./ImageWebWorker.ts", import.meta.url))
// imageWorker.port.start()
// async function getCachedData(cacheName, keyName) {
// 	const cacheStorage = await caches.open(cacheName)
// 	const cachedResponse = await cacheStorage.match(keyName)
// }

const workingCache: Map<TMDBMultiSearchQuery, TMDBSearchMultiResponse> = new Map()

// const cache = async (query: TMDBMultiSearchQuery) => {
// 	const cacheStorage = await caches.open("tmdb-multisearch-responses")
// 	const cachedRespone = await cacheStorage.match(query)
// }

self.onmessage = (e: MessageEvent<[ "TMDBMultiSearch.Query", TMDBMultiSearchQuery ]>) => {
	// const functions = getFunctions(e.data[ 2 ])

	if (e.data[ 0 ] == "TMDBMultiSearch.Query") {
		// const query = httpsCallable<TMDBMultiSearchQuery>(functions, "tmdbMultiSearch")

		// query(e.data[ 1 ]).then((response) => {
		// 	console.log(response)
		// })

		// self.postMessage([ "TMDBMultiSearch.Result", request ])
	}
}

/**
 * -> caches search queries
 * -> if new query has the same start as cached, then uses one from cache instead on api request (name: cached query)
 * -> if cached query results in 3 or less results then api request is sent
 * -> caches images
 */