import * as functions from "firebase-functions";
import fetch from 'node-fetch';
import { TMDBConfigurationGetApiConfiguration, TMDBConfigurationGetCountries, TMDBConfigurationGetJobs, TMDBConfigurationGetPrimaryLanguages, TMDBConfigurationGetLanguages, TMDBConfigurationGetTimezones } from '../../src/tmdb.js';
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

export const tmdbMultiSearch = functions.runWith({ secrets: [ "TMDB_API_KEY" ] }).https.onCall(async (data: { language?: string, query: string, page?: number, includeAdult?: boolean, region?: string }, context) => {
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

export interface tmdbGetConfigurationData {
	getApiConfiguration?: boolean,
	getCountries?: boolean,
	getJobs?: boolean,
	getLanguages?: boolean,
	getPrimaryTranslations?: boolean,
	getTimezones?: boolean
}

export interface tmdbGetConfigurationResponses {
	apiConfiguration: null | TMDBConfigurationGetApiConfiguration,
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