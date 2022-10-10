import { httpsCallable, getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { tmdbGetConfiguration } from 'functions/src';
import { Component, createContext, JSXElement, useContext, onMount } from 'solid-js';
import { TMDBConfigurationGetCountries, TMDBConfigurationGetJobs, TMDBConfigurationGetLanguages, TMDBConfigurationGetPrimaryLanguages, TMDBConfigurationGetTimezones, TMDBTvGetDetails, TMDBTvSeasonsGetDetails } from 'src/tmdb';
import { TMDBConfigurationCategories, TMDBConfigurationGetApiConfiguration } from '../tmdb';
import { useFirebaseApp } from 'solid-firebase';
import { tmdbGetConfigurationData } from '../../functions/src/index';
import { useTmdb } from './TmdbProvider';
import localforage from 'localforage';


interface CacheContext {
	configuration: ConfConfiguration,
	images: {
		save: (images: Map<string, Blob>) => void,
		retrive: (keys: string[]) => Map<string, (Blob | null)>
	}
}


interface CacheObj {
	configuration: ConfConfiguration,
	searchQueries: Map<object, object>,
	searchImages: Map<string, Blob>,
	showImages: Map<string, Blob>,
	shows: Map<string, { tv: TMDBTvGetDetails, seasons: TMDBTvSeasonsGetDetails[] }>
}

interface ConfConfiguration {
	apiConfiguration: ConfApiConfiguration | null,
	countries: ConfCountries | null,
	jobs: ConfJobs | null,
	languages: ConfLanguages | null,
	primaryTranslations: string[] | null,
	timezones: ConfTimezones | null
}

interface ConfApiConfiguration {
	images: {
		base_url: string,
		secure_base_url: string,
		backdrop_sizes: string[],
		logo_sizes: string[],
		poster_sizes: string[],
		profile_sizes: string[],
		still_sizes: string[]
	},
	change_keys: string[]
}

interface ConfCountries {
	iso_3166_1: string,
	english_name: string
}[]

interface ConfJobs {
	departament: string,
	jobs: string[]
}[]

interface ConfLanguages {
	iso_639_1: string,
	english_name: string,
	name: string
}[]

interface ConfTimezones {
	iso_3166_1: string,
	zones: string[]
}

type ContentType = "application/object" | "image/png" | "img/svg"

const Cache: CacheContext = {
	configuration: {
		apiConfiguration: null,
		countries: null,
		jobs: null,
		languages: null,
		primaryTranslations: null,
		timezones: null
	},
	images: {
		save: saveImages,
		retrive: retriveImages
	}
}

const imageStore = localforage.createInstance({
	name: "images"
})

function retriveImages(keys: string[]) {
	const images = keys.map(async (key) => {
		return await imageStore.getItem(key) as Blob | null
	})

	const mapped = new Map<string, (Blob | null)>()
	keys.forEach(async (key, index) => {
		mapped.set(key, await images[ index ])
	})

	return mapped
}

async function saveImages(images: Map<string, Blob>) {
	images.forEach((value, key) => {
		localforage.setItem(key, value)
	})
}


const CacheContext = createContext(Cache)

export const CacheProvider: Component<{ children: JSXElement }> = (props) => {

	const tmdb = useTmdb()

	async function loadCacheObj(cache: Cache, url: string) {
		return await (await cache.match(url))?.json()
	}

	function saveCacheObj(cache: Cache, url: string, data: object) {
		cache.put(url, new Response(JSON.stringify({ data: data }), { headers: { 'Content-Type': "application/json" } }))
	}


	async function loadCaches() {
		const configurationCache = await caches.open("configuration")
		const configurationObj = Cache.configuration

		Object.keys(configurationObj).forEach(async (key: string) => {
			const cachedData = await configurationCache.match(key)
			if (cachedData) {
				//@ts-expect-error
				configurationObj[ key ] = loadCacheObj(configurationCache, key)
			}
		})

	}

	async function getMissingCache() {
		const configurationCache = await caches.open("configuration")
		let configurationObj = Cache.configuration
		const configurationMap = new Map(Object.entries(configurationObj))
		const missingConfiguration: string[] = []
		configurationMap.forEach((value, key) => {
			if (!value) {
				missingConfiguration.push(key)
			}
		})

		if (missingConfiguration.length > 0) {
			// console.log(missingConfiguration)
			const request = await tmdb.tmdbGetConfiguration({
				// getApiConfiguration: missingConfiguration.includes("apiConfiguration"),
				// getCountries: missingConfiguration.includes("countries"),
				// getJobs: missingConfiguration.includes("jobs"),
				// getLanguages: missingConfiguration.includes("languages"),
				// getPrimaryTranslations: missingConfiguration.includes("primaryTranslations"),
				// getTimezones: missingConfiguration.includes("timezones")
			})

			configurationObj = { ...configurationObj, ...request.data as object }

			Object.entries(configurationObj).forEach(([ key, value ]) => {
				saveCacheObj(configurationCache, key, value)
			})
		}


	}

	window.addEventListener("load", async (e) => {
		await loadCaches()
		await getMissingCache()
	})

	window.addEventListener("close", (e) => {
	})


	onMount(async () => {
		await loadCaches()
		await getMissingCache()
	})


	return (
		<CacheContext.Provider value={Cache}>
			{props.children}
		</CacheContext.Provider>
	)
}

export function useCache() {
	return useContext(CacheContext) as CacheContext
}

/**
 * Required caches:
 * - search
 *  > last 50 searches; when searching if match is found in cache it's returned instead of server query
 *  > last 30 days of image queries up to 5mb; same priority
 *  > last 50 shows; same priority
 * - tracked shows
 *  > with status of 'watching' are fully cached with images
 *  > with status of 'to be watched' episodes images are not cached
 *  > with status of 'watched' only poster images are cached
 * - settings
 * - configuration
 */