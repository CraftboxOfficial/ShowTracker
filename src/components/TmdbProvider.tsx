import { connectFunctionsEmulator, getFunctions, HttpsCallable, httpsCallable, HttpsCallableResult } from "firebase/functions";
import { tmdbGetConfigurationData, tmdbGetConfigurationResponses, tmdbGetImagesData, TMDBMultiSearchQuery } from "functions/src";
import localforage from 'localforage';
import { useFirebaseApp } from "solid-firebase";
import { Component, createContext, JSXElement, onCleanup, onMount, useContext } from 'solid-js';
import { TMDBConfigurationGetApiConfiguration, TMDBSearchMultiSearch, TMDBTvGetDetails, TMDBTvGetDetailsQuery, TMDBTvSeasonsGetDetailsQuery, TMDBTvSeasonsGetDetails } from '../tmdb';

const TmdbContext = createContext()

interface TmdbContext {
	tmdbMultiSearch: (data: {
		priority: number
		query: TMDBMultiSearchQuery
		forceFetch?: boolean
	}) => Promise<TMDBSearchMultiSearch>,

	tmdbGetConfiguration: () => Promise<TMDBConfigurationGetApiConfiguration>,

	tmdbGetImage: (data: {
		priority: number,
		query: tmdbGetImage
		forceFetch?: boolean
	}) => Promise<Blob>,

	tmdbGetTvDetails: (data: {
		priority: number
		query: TMDBTvGetDetailsQuery
		forceFetch?: boolean
	}) => Promise<TMDBTvGetDetails>,

	tmdbGetTvSeasonsDetails: (data: {
		priority: number
		query: TMDBTvSeasonsGetDetailsQuery
		forceFetch?: boolean
	}) => Promise<TMDBTvSeasonsGetDetails>,
	// tmdbGetMovieDetails: (data: {
	// 	priority: number
	// 	query: TMDBTvGetDetailsQuery
	// }) => Promise<TMDBTvGetDetails>,
}

export type tmdbGetImage = {
	baseUrl: string,
	size: string,
	path: string,

}

interface savedData {
	lastUsedOn: Date,
	createdOn: Date,
	priority: number,
}

interface savedImage extends savedData {
	blob: Blob
}

interface savedSearchQuery extends savedData {
	data: TMDBSearchMultiSearch
}

interface savedTvDetails extends savedData {
	data: TMDBTvGetDetails
}

interface savedTvSeasonsDetails extends savedData {
	data: TMDBTvSeasonsGetDetails
}

interface savedApiConfiguration extends savedData {
	data: TMDBConfigurationGetApiConfiguration
}
// TODO cache auto cleaning
/* Higher number == lower priority

	deleting hierarchy:
		>> lower priority
			>> older last accessed date
				>> size
					>> older creation date

	Priorities:
	1 -> never cleared
	2 - 3 -> never cleared based on date, but on space, max up to 70 mb
	4 - 6 -> up to 60 days or space, max up to 50 mb
	7 - 10 -> up to 30 days or space, max up to 50 mb
	11 - 13 -> up to 15 days or space, max up to 15 mb at closing; up to 50 mb while running
	14+ -> cleaned on closing

 */
/*

	when I need to fetch:
		-> on app enter currently watched show that's airing; there may have been some changes
		-> loading new content
		-> when user refreshes the page; only currently's open page content

	refetching
		-> based on priority number of days from creation is calculated by f(x) = (1/3.25) * (x - 14)^2 where x is priority, x === <0; 14> , x > 14 is 0 , x < 0 

	clearing
		-> when not accessed for half of refetching time then it's removed
	
	1 >> 60
	2 >> 52
	3 >> 44
	4 >> 37
	5 >> 31
	6 >> 25
	7 >> 20
	8 >> 15
	9 >> 11
	10 >> 8
	11 >> 5
	12 >> 3
	13 >> 1
	14 >> 0
*/

const DB_NAMES = {
	SEARCH_QUERIES: "searchQueries",
	IMAGES: "images",
	DETAILS: "details",
	CONFIGURATION: "configuration"
}

const MEGABYTE = 1000000

export const TmdbProvider: Component<{ children: JSXElement }> = (props) => {

	const app = useFirebaseApp()

	const functions = getFunctions(app)
	connectFunctionsEmulator(functions, "192.168.1.182", 5001)


	const cloudFunctions: TmdbContext = { //TODO convert all of these to be similar to the last one
		tmdbMultiSearch: async (data) => {
			const call = httpsCallable<TMDBMultiSearchQuery>(functions, "tmdbMultiSearch")

			const searchQueryStore = localforage.createInstance({
				name: DB_NAMES.SEARCH_QUERIES
			})

			const queryKey = JSON.stringify(data.query)

			let retrivedQuery = data.forceFetch ? null : await searchQueryStore.getItem(queryKey) as savedSearchQuery | null

			if (priorityHandler(retrivedQuery) == "toBeRefetched") {
				console.log("refetch")
				retrivedQuery = null
			}

			if (retrivedQuery) {
				searchQueryStore.setItem(queryKey, {
					...retrivedQuery,
					lastUsedOn: new Date(),
					priority: data.priority
				} as savedSearchQuery)

				return retrivedQuery.data
			}

			// if (!retrivedQuery) {
			const response = await call({ ...data.query }) as HttpsCallableResult<TMDBSearchMultiSearch>

			searchQueryStore.setItem(queryKey, {
				lastUsedOn: new Date(),
				createdOn: new Date(),
				priority: data.priority,
				data: response.data
			} as savedSearchQuery)

			return response.data
			// }

		},

		tmdbGetConfiguration: async () => {
			const call = httpsCallable<tmdbGetConfigurationData>(functions, "tmdbGetConfiguration")

			// opens or creates new database instance
			const configurationStore = localforage.createInstance({
				name: DB_NAMES.CONFIGURATION
			})

			const configurationKey = "tmdbApiConfiguration"

			// if data not found locally returns null
			let retrivedConfiguration = await configurationStore.getItem(configurationKey) as savedApiConfiguration | null

			if (priorityHandler(retrivedConfiguration) == "toBeRefetched") {
				console.log("refetch")
				retrivedConfiguration = null
			}

			// updates date of last locall access if data found
			if (retrivedConfiguration) {
				configurationStore.setItem(configurationKey, {
					...retrivedConfiguration,
					lastUsedOn: new Date(),
					priority: 1
				} as savedApiConfiguration)

				return retrivedConfiguration.data
			}

			// fetches data if not found locally
			const response = await call({ getApiConfiguration: true }) as HttpsCallableResult<tmdbGetConfigurationResponses>

			// saves data locally
			configurationStore.setItem(configurationKey, {
				lastUsedOn: new Date(),
				createdOn: new Date(),
				priority: 1,
				data: response.data.apiConfiguration
			} as savedApiConfiguration)

			return response.data.apiConfiguration
		},

		tmdbGetImage: async (data) => {

			const imageStore = localforage.createInstance({
				name: DB_NAMES.IMAGES
			})

			const imageKey = `${data.query.size}${data.query.path}`

			const retrivedImage = data.forceFetch ? null : await imageStore.getItem(imageKey) as savedImage | null

			if (retrivedImage) {
				imageStore.setItem(imageKey, {
					...retrivedImage,
					lastUsedOn: new Date(),
					priority: data.priority
				} as savedImage)

				return retrivedImage.blob
			}

			// if (!retrivedImage) {
			const url = `${data.query.baseUrl}${data.query.size}${data.query.path}`
			const blob = await (await fetch(url, { method: "GET" })).blob()

			imageStore.setItem(imageKey, {
				lastUsedOn: new Date(),
				createdOn: new Date(),
				priority: data.priority,
				blob: blob
			} as savedImage)

			return blob
			// }
		},

		tmdbGetTvDetails: async (data) => {
			const call = httpsCallable<TMDBTvGetDetailsQuery>(functions, "tmdbTvGetDetails")

			const detailsStore = localforage.createInstance({
				name: DB_NAMES.DETAILS
			})

			const detailsKey = JSON.stringify(data.query)

			let retrivedDetails = data.forceFetch ? null : await detailsStore.getItem(detailsKey) as savedTvDetails | null

			if (priorityHandler(retrivedDetails) == "toBeRefetched") {
				console.log("refetch")
				retrivedDetails = null
			}

			if (retrivedDetails) {
				detailsStore.setItem(detailsKey, {
					...retrivedDetails,
					lastUsedOn: new Date(),
					priority: data.priority
				} as savedTvDetails)

				return retrivedDetails.data
			}

			// if (!retrivedDetails) {
			const response = await call({ ...data.query }) as HttpsCallableResult<TMDBTvGetDetails>

			detailsStore.setItem(detailsKey, {
				lastUsedOn: new Date(),
				createdOn: new Date(),
				priority: data.priority,
				data: response.data
			} as savedTvDetails)

			return response.data

		},

		tmdbGetTvSeasonsDetails: async (data) => {
			const call = httpsCallable<TMDBTvSeasonsGetDetailsQuery>(functions, "tmdbTvSeasonsGetDetails")

			const detailsStore = localforage.createInstance({
				name: DB_NAMES.DETAILS
			})

			const detailsKey = JSON.stringify(data.query)

			let retrivedDetails = data.forceFetch ? null : await detailsStore.getItem(detailsKey) as savedTvSeasonsDetails | null

			if (priorityHandler(retrivedDetails) == "toBeRefetched") {
				console.log("refetch")
				retrivedDetails = null
			}

			if (retrivedDetails) {
				detailsStore.setItem(detailsKey, {
					...retrivedDetails,
					lastUsedOn: new Date(),
					priority: data.priority
				} as savedTvSeasonsDetails)

				return retrivedDetails.data
			}

			// if (!retrivedDetails) {
			const response = await call({ ...data.query }) as HttpsCallableResult<TMDBTvSeasonsGetDetails>

			detailsStore.setItem(detailsKey, {
				lastUsedOn: new Date(),
				createdOn: new Date(),
				priority: data.priority,
				data: response.data
			} as savedTvSeasonsDetails)

			return response.data
		}
	}

	// f(x) = (1/2.8) * (x - 14)^2 where x is priority, x === <0; 14> , x > 14 is 0 , x < 0 

	function priorityHandler(data: savedData | null, options?: { dataRefetching?: boolean, dataClearing?: boolean }): "toBeCleared" | "toBeRefetched" | null {
		if (!data) {
			return null
		}

		const daysTillRefetch = data.priority > 14 || data.priority < 0 ? 0 : Math.round(parseFloat(((1 / 3.25) * (data.priority - 15) ** 2).toPrecision(2)))


		const daysFromCreation = Math.round(((new Date()).getTime() - data.createdOn.getTime()) / 1000 / 3600 / 24)
		const daysFromLastUse = Math.round(((new Date()).getTime() - data.lastUsedOn.getTime()) / 1000 / 3600 / 24)

		if ((options?.dataRefetching || true) && !options && daysFromCreation >= daysTillRefetch) {
			// console.log("toBeRefetched")
			return "toBeRefetched"
		}

		if (options?.dataClearing && daysFromLastUse >= (daysTillRefetch / 2)) {
			return "toBeCleared"
		}

		// console.log(data.createdOn)
		// console.log(data.lastUsedOn)
		// console.log(new Date())
		// // console.log(Math.round(((new Date()).getTime() - data.createdOn.getTime()) / 1000 / 3600 / 24))
		// console.log(daysFromCreation)
		// console.log(daysFromLastUse)
		// console.log(daysTillRefetch)

		return null
	}

	function cleanupDB() { // TODO add other cache auto cleaning
		const searchQueryStore = localforage.createInstance({
			name: DB_NAMES.SEARCH_QUERIES
		})

		const imageStore = localforage.createInstance({
			name: DB_NAMES.IMAGES
		})

		const detailsStore = localforage.createInstance({
			name: DB_NAMES.DETAILS
		})

		const configurationStore = localforage.createInstance({
			name: DB_NAMES.CONFIGURATION
		})

		searchQueryStore.iterate((v: savedSearchQuery, k) => {
			if (priorityHandler(v, { dataClearing: true }) == "toBeCleared") {
				// console.log("clear search " + k)
				searchQueryStore.removeItem(k)
			}
		})

		imageStore.iterate((v: savedImage, k) => {
			if (priorityHandler(v, { dataClearing: true }) == "toBeCleared") {
				// console.log("clear img " + k)
				imageStore.removeItem(k)
			}
		})

		detailsStore.iterate((v: savedData, k) => {
			if (priorityHandler(v, { dataClearing: true }) == "toBeCleared") {
				// console.log("clear det " + k)
				detailsStore.removeItem(k)
			}
		})

		configurationStore.iterate((v: savedApiConfiguration, k) => {
			if (priorityHandler(v, { dataClearing: true }) == "toBeCleared") {
				// console.log("clear conf " + k)
				configurationStore.removeItem(k)
			}
		})
	}

	onMount(() => {
		cleanupDB()
	})

	onCleanup(() => {
		cleanupDB()
	})

	// window.addEventListener("load", (e) => {
	// 	cleanupDB()
	// })

	// window.addEventListener("beforeunload", (e) => {
	// 	cleanupDB()
	// })

	onMount(() => {
		cloudFunctions.tmdbGetConfiguration()
	})

	return (
		<TmdbContext.Provider value={cloudFunctions}>
			{props.children}
		</TmdbContext.Provider>
	)
}

export function useTmdb() {
	return useContext(TmdbContext) as TmdbContext
}