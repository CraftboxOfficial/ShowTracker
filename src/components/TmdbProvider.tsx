import { connectFunctionsEmulator, getFunctions, HttpsCallable, httpsCallable, HttpsCallableResult } from "firebase/functions";
import { tmdbGetConfigurationData, tmdbGetConfigurationResponses, tmdbGetImagesData, TMDBMultiSearchQuery } from "functions/src";
import { useFirebaseApp } from "solid-firebase";
import { Component, createContext, JSXElement, useContext, onMount, createSignal, onCleanup } from 'solid-js';
import { useCache } from "./CacheProvider";
import { base64 } from '@firebase/util';
import localforage from 'localforage';
import { TMDBConfigurationGetApiConfiguration, TMDBSearchMultiSearch, TMDBTvGetDetails, TMDBTvGetDetailsQuery } from '../tmdb';

const TmdbContext = createContext()

interface TmdbContext {
	tmdbMultiSearch: (data: {
		priority: number
		query: TMDBMultiSearchQuery
	}) => Promise<TMDBSearchMultiSearch | undefined>,

	tmdbGetConfiguration: () => Promise<TMDBConfigurationGetApiConfiguration | undefined>,

	tmdbGetImagesData: HttpsCallable<tmdbGetImagesData, unknown>,

	tmdbGetImage: (data: {
		priority: number,
		query: tmdbGetImage
	}) => Promise<Blob | undefined>,

	tmdbGetTvDetails: (data: {
		priority: number
		query: TMDBTvGetDetailsQuery
	}) => Promise<TMDBTvGetDetails | undefined>,
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
	14+ -> cleand on closing

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
	const cache = useCache()

	const functions = getFunctions(app)
	connectFunctionsEmulator(functions, "localhost", 5001)


	const cloudFunctions: TmdbContext = { //TODO convert all of these to be similar to the last one
		tmdbMultiSearch: async (data) => {
			const call = httpsCallable<TMDBMultiSearchQuery>(functions, "tmdbMultiSearch")

			const searchQueryStore = localforage.createInstance({
				name: DB_NAMES.SEARCH_QUERIES
			})

			const queryKey = JSON.stringify(data.query)

			const retrivedQuery = await searchQueryStore.getItem(queryKey) as savedSearchQuery | null

			if (retrivedQuery) {
				searchQueryStore.setItem(queryKey, {
					...retrivedQuery,
					lastUsedOn: new Date(),
					priority: data.priority
				} as savedSearchQuery)

				return retrivedQuery.data
			}

			if (!retrivedQuery) {
				const response = await call({ ...data.query }) as HttpsCallableResult<TMDBSearchMultiSearch>

				searchQueryStore.setItem(queryKey, {
					lastUsedOn: new Date(),
					createdOn: new Date(),
					priority: data.priority,
					data: response.data
				} as savedSearchQuery)

				return response.data
			}

		},

		tmdbGetConfiguration: async () => {
			const call = httpsCallable<tmdbGetConfigurationData>(functions, "tmdbGetConfiguration")

			const configurationStore = localforage.createInstance({
				name: DB_NAMES.CONFIGURATION
			})

			const configurationKey = "tmdbApiConfiguration"

			const retrivedConfiguration = await configurationStore.getItem(configurationKey) as savedApiConfiguration | null

			if (retrivedConfiguration) {
				configurationStore.setItem(configurationKey, {
					...retrivedConfiguration,
					lastUsedOn: new Date(),
					priority: 1
				} as savedApiConfiguration)

				return retrivedConfiguration.data
			}

			if (!retrivedConfiguration) {
				const response = await call({ getApiConfiguration: true }) as HttpsCallableResult<tmdbGetConfigurationResponses>

				configurationStore.setItem(configurationKey, {
					lastUsedOn: new Date(),
					createdOn: new Date(),
					priority: 1,
					data: response.data.apiConfiguration
				} as savedApiConfiguration)

				return response.data.apiConfiguration
			}

		},

		tmdbGetImagesData: httpsCallable<tmdbGetImagesData>(functions, "tmdbGetImagesData"),

		tmdbGetImage: async (image) => {

			const imageStore = localforage.createInstance({
				name: DB_NAMES.IMAGES
			})

			const imageKey = `${image.query.size}${image.query.path}`

			const retrivedImage = await imageStore.getItem(imageKey) as savedImage | null

			if (retrivedImage) {
				imageStore.setItem(imageKey, {
					...retrivedImage,
					lastUsedOn: new Date(),
					priority: image.priority
				} as savedImage)

				return retrivedImage.blob
			}

			if (!retrivedImage) {
				const url = `${image.query.baseUrl}${image.query.size}${image.query.path}`
				const blob = await (await fetch(url, { method: "GET" })).blob()

				imageStore.setItem(imageKey, {
					lastUsedOn: new Date(),
					createdOn: new Date(),
					priority: image.priority,
					blob: blob
				} as savedImage)

				return blob
			}
		},

		tmdbGetTvDetails: async (data) => {
			const call = httpsCallable<TMDBTvGetDetailsQuery>(functions, "tmdbTvGetDetails")

			const detailsStore = localforage.createInstance({
				name: DB_NAMES.DETAILS
			})

			async function getDetail(data: {
				priority: number
				query: TMDBTvGetDetailsQuery
			}) {


				const detailsKey = JSON.stringify(data.query)

				const retrivedDetails = await detailsStore.getItem(detailsKey) as savedTvDetails | null

				if (retrivedDetails) {
					detailsStore.setItem(detailsKey, {
						...retrivedDetails,
						lastUsedOn: new Date(),
						priority: data.priority
					} as savedTvDetails)

					return retrivedDetails.data
				}

				if (!retrivedDetails) {
					const response = await call({ ...data.query }) as HttpsCallableResult<TMDBTvGetDetails>

					detailsStore.setItem(detailsKey, {
						lastUsedOn: new Date(),
						createdOn: new Date(),
						priority: data.priority,
						data: response.data
					} as savedTvDetails)

					return response.data
				}
			}

			return await getDetail(data)
		}
	}

	function cleanupDB() { // TODO add other cache auto cleaning
		const searchQueryStore = localforage.createInstance({
			name: DB_NAMES.SEARCH_QUERIES
		})

		const imageStore = localforage.createInstance({
			name: DB_NAMES.IMAGES
		})

		searchQueryStore.iterate((v: savedSearchQuery, k) => {
			console.log(v)
			if (v.priority >= 14) {
				searchQueryStore.removeItem(k)
			}
		})

		let imagesSize = {
			"14": 0,
			"13": 0,
			"10": 0,
			"6": 0,
			"3": 0,
			"1": 0
		}
		imageStore.iterate((v: savedImage, k) => {
			if (v.priority == 1) {
				imagesSize[ 1 ] += v.blob.size
			}

			if (v.priority >= 2 && v.priority <= 3) {
				imagesSize[ 3 ] += v.blob.size
			}

			if (v.priority >= 4 && v.priority <= 6) {
				imagesSize[ 6 ] += v.blob.size
			}

			if (v.priority >= 7 && v.priority <= 10) {
				imagesSize[ 10 ] += v.blob.size
			}

			if (v.priority >= 11 && v.priority <= 13) {
				imagesSize[ 13 ] += v.blob.size
			}

			if (v.priority >= 14) {
				imagesSize[ 14 ] += v.blob.size
			}
		})

		imageStore.iterate((v: savedImage, k) => {
			if (v.priority >= 14) {
				searchQueryStore.removeItem(k)
			}

			if (v.priority <= 13 && v.priority >= 11) {
				{
					const currentDate = new Date()
					const difference = currentDate.getTime() - v.createdOn.getTime()
					const differenceDays = difference / (1000 * 3600 * 24)

					if (differenceDays >= 15) {
						searchQueryStore.removeItem(k)
					}
				}
				{
					// TODO make it prioritize oldest
					if (imagesSize[ 13 ] > 15 * MEGABYTE) {
						imagesSize[ 13 ] -= v.blob.size
						searchQueryStore.removeItem(k)
					}
				}
			}
		})
	}

	onCleanup(() => {
		cleanupDB()
	})

	window.addEventListener("beforeunload", (e) => {
		cleanupDB()
	})

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