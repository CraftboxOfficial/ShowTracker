import * as functions from "firebase-functions";
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
	return await fetch(url) // FIXME sanitize from api key
})