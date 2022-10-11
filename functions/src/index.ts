import * as functions from "firebase-functions";
import fetch from 'node-fetch';
import { TMDBConfigurationGetApiConfiguration, TMDBConfigurationGetCountries, TMDBConfigurationGetJobs, TMDBConfigurationGetLanguages, TMDBConfigurationGetPrimaryLanguages, TMDBConfigurationGetTimezones, TMDBTvEpisodesGetImages, TMDBTvGetDetailsQuery } from '../../src/tmdb.js';
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export interface TMDBMultiSearchQuery {
	language?: string,
	query: string,
	page?: number,
	includeAdult?: boolean,
	region?: string
}

export const tmdbMultiSearch = functions
	.runWith({ secrets: [ "TMDB_API_KEY" ] })
	.https.onCall(async (data: {
		language?: string,
		query: string,
		page?: number,
		includeAdult?: boolean,
		region?: string
	}, context) => {
		const request = {
			apiKey: process.env.TMDB_API_KEY,
			language: data.language || "en-US",
			query: encodeURI(data.query),
			page: data.page || 1,
			includeAdult: data.includeAdult || false,
			region: data.region
		}
		const url = `https://api.themoviedb.org/3/search/multi?api_key=${request.apiKey}&language=${request.language}&query=${request.query}&page=${request.page}&include_adult=${request.includeAdult}${request.region ? `&region=${request.region}` : ""}`
		return await (await fetch(url)).json()
	})

export const tmdbTvGetDetails = functions
	.runWith({ secrets: [ "TMDB_API_KEY" ] })
	.https.onCall(async (data: TMDBTvGetDetailsQuery | TMDBTvGetDetailsQuery[], context) => {
		if (Array.isArray(data)) {
			const queries = data.map((v) => ({
					apiKey: process.env.TMDB_API_KEY,
					language: v.language || "en-US",
					tvId: v.tv_id,
			}))

			const results = queries.map( async (query) => {
				const url = `https://api.themoviedb.org/3/tv/${query.tvId}?api_key=${query.apiKey}&language=${query.language}`
				return await (await fetch(url)).json()
			})

			return results
		}

		const request = {
			apiKey: process.env.TMDB_API_KEY,
			language: data.language || "en-US",
			tvId: data.tv_id,
		}
		const url = `https://api.themoviedb.org/3/tv/${request.tvId}?api_key=${request.apiKey}&language=${request.language}`
		return await (await fetch(url)).json()
	})

export interface tmdbGetConfigurationData {
	getApiConfiguration?: boolean,
	getCountries?: boolean,
	getJobs?: boolean,
	getLanguages?: boolean,
	getPrimaryTranslations?: boolean,
	getTimezones?: boolean
}

export interface tmdbGetConfigurationResponses {
	apiConfiguration: TMDBConfigurationGetApiConfiguration,
	countries: null | TMDBConfigurationGetCountries,
	jobs: null | TMDBConfigurationGetJobs,
	languages: null | TMDBConfigurationGetLanguages,
	primaryTranslations: null | TMDBConfigurationGetPrimaryLanguages,
	timezones: null | TMDBConfigurationGetTimezones
}

export const tmdbGetConfiguration = functions
	.runWith({ secrets: [ "TMDB_API_KEY" ] })
	.https.onCall(async (data: tmdbGetConfigurationData, context) => {
		const apiKey = process.env.TMDB_API_KEY
		const responses: tmdbGetConfigurationResponses = {
			// @ts-expect-error
			apiConfiguration: null,
			countries: null,
			jobs: null,
			languages: null,
			primaryTranslations: null,
			timezones: null
		}

		if (data.getApiConfiguration) {
			const url = `https://api.themoviedb.org/3/configuration?api_key=${apiKey}`
			responses.apiConfiguration = await (await fetch(url)).json() as TMDBConfigurationGetApiConfiguration
		}

		if (data.getCountries) {
			const url = `https://api.themoviedb.org/3/configuration/countries?api_key=${apiKey}`
			responses.countries = await (await fetch(url)).json() as TMDBConfigurationGetCountries
		}

		if (data.getJobs) {
			const url = `https://api.themoviedb.org/3/configuration/jobs?api_key=${apiKey}`
			responses.jobs = await (await fetch(url)).json() as TMDBConfigurationGetJobs
		}

		if (data.getLanguages) {
			const url = `https://api.themoviedb.org/3/configuration/languages?api_key=${apiKey}`
			responses.languages = await (await fetch(url)).json() as TMDBConfigurationGetLanguages
		}

		if (data.getPrimaryTranslations) {
			const url = `https://api.themoviedb.org/3/configuration/primary_translations?api_key=${apiKey}`
			responses.primaryTranslations = await (await fetch(url)).json() as TMDBConfigurationGetPrimaryLanguages
		}

		if (data.getTimezones) {
			const url = `https://api.themoviedb.org/3/configuration/timezones?api_key=${apiKey}`
			responses.timezones = await (await fetch(url)).json() as TMDBConfigurationGetTimezones
		}

		return responses
	})

export type tmdbGetImagesData = ({
	type: "tv",
	tvId: number,
	language?: string
} | {
	type: "tvSeason",
	tvId: number,
	seasonNumber: number,
	language?: string
} | {
	type: "tvEpisode",
	tvId: number,
	seasonNumber: number,
	episodeNumber: number
} | {
	type: "movie",
	movieId: number,
	language?: string,
	includeImageLanguage?: string
})[]

export const tmdbGetImagesData = functions
	.runWith({ secrets: [ "TMDB_API_KEY" ] })
	.https.onCall(async (data: tmdbGetImagesData, context) => {
		const apiKey = process.env.TMDB_API_KEY

		const retrivedImages = data.map(async (request) => {
			switch (request.type) {
				case "tv": {
					const url = `https://api.themoviedb.org/3/tv/${request.tvId}/images?api_key=${apiKey}${request.language ? `&language=${request.language}` : ``}`
					return await (await fetch(url)).json() as TMDBTvEpisodesGetImages
				}
				case "tvSeason": {
					const url = `https://api.themoviedb.org/3/tv/${request.tvId}/season/${request.seasonNumber}/images?api_key=${apiKey}${request.language ? `&language=${request.language}` : ``}`
					return await (await fetch(url)).json() as TMDBTvEpisodesGetImages
				}
				case "tvEpisode": {
					const url = `https://api.themoviedb.org/3/tv/${request.tvId}/season/${request.seasonNumber}/episode/${request.episodeNumber}/images?api_key=${apiKey}`
					return await (await fetch(url)).json() as TMDBTvEpisodesGetImages
				}
				case "movie": {
					const url = `https://api.themoviedb.org/3/movie/${request.movieId}/images?api_key=${apiKey}${request.language ? `&language=${request.language}` : ``}${request.includeImageLanguage ? `&include_image_language=${request.includeImageLanguage}` : ``}`
					return await (await fetch(url)).json() as TMDBTvEpisodesGetImages
				}
				default: {
					return {
						errorMessage: "This type of request is not yet supported. Consider implementing as you were too lazy to do so earlier you lazy butt.",
						request: request
					}
				}
			}
		})

		return retrivedImages
	})

export type tmdbGetImages = {
	baseUrl: string,
	size: string,
	path: string
}[]

// export const tmdbGetImages = functions.https.onCall(async (data: tmdbGetImages, context) => {
// 	// console.log(data)
// 	const retrivedImages: any[] = []

// 	// const a = async () => data.forEach(async (image) => {
// 	// 	const url = `${image.baseUrl}${image.size}${image.path}`
// 	// 	retrivedImages.push(await (await fetch(url, { method: "GET" })).arrayBuffer())
// 	// 	// @ts-ignore
// 	// 	// const b = new Blob()
// 	// 	// return new Promise(async (resolve, reject) => {
// 	// 	// 	const reader = new FileReader()
// 	// 	// 	reader.onloadend = () => resolve(reader.result)
// 	// 	// 	reader.readAsDataURL(await(await fetch(url, { method: "GET" })).blob())
// 	// 	// })
// 	// })

// 	// retrivedImages.forEach(async (v) => console.log((await v).size))
// 	// await a()
// 	for (let index = 0; index < data.length; index++) {
// 		const image = data[ index ]
// 		const url = `${image.baseUrl}${image.size}${image.path}`
// 		const blob = await (await fetch(url, { method: "GET" })).blob()
// 		blob.arrayBuffer().then((v) => {
// 			const a = String.fromCharCode(...new Uint8Array(v))
			
// 			retrivedImages.push(base64.encodeString(a))
// 		})
// 	}

// 	// console.log(retrivedImages)

// 	// return []
// 	return retrivedImages
// })