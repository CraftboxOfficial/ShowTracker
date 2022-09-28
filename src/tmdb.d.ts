export interface TMDBMultiSearchQuery {
	language?: string,
	query: string,
	page?: number,
	include_adult?: boolean,
	region?: string
}

export interface TMDBSearchMultiResponse {
	page: number,
	results: (TMDBSearchMultiResponseResultTv | TMDBSearchMultiResponseResultMovie | TMDBSearchMultiResponseResultPerson)[],
	total_results: number,
	total_pages: number
}

export interface TMDBSearchMultiResponseResultTv {
	poster_path: string | null,
	popularity: number,
	id: number,
	overview: string,
	backdrop_path: string,
	vote_average: number,
	media_type: "tv",
	first_air_date: string,
	origin_country: string[],
	genre_ids: number[]
	original_language: string,
	vote_count: number
	name: string,
	original_name: string,
}

export interface TMDBSearchMultiResponseResultMovie {
	poster_path: string | null,
	adult: boolean,
	overview: string,
	release_date: string,
	original_title: string,
	genre_ids: number[]
	id: number,
	media_type: "movie",
	original_language: string,
	title: string,
	backdrop_path: string,
	popularity: number,
	vote_count: number
	video: boolean,
	vote_average: number,
}

export interface TMDBSearchMultiResponseResultPerson {
	profile_path: string | null,
	adult: boolean,
	id: number,
	media_type: "person",
	known_for: (TMDBSearchMultiResponseResultTv | TMDBSearchMultiResponseResultMovie)[],
	name: string,
	popularity: number
}

export interface TMDBTvResponse {
	backdrop_path: string | null,
	created_by: {
		id: number,
		credit_id: string,
		name: string,
		gender: number,
		profile_path: string | null
	}[],
	episode_run_time: number[],
	first_air_date: string,
	genres: {
		id: number,
		name: string
	}[],
	homepage: string,
	id: number,
	in_production: boolean,
	languages: string[],
	last_air_date: string,
	last_episode_to_air: {
		air_date: string,
		episode_number: number,
		id: number,
		name: string,
		overview: string,
		production_code: string,
		season_number: Number,
		still_path: string,
		vote_average: number,
		vote_count: number
	},
	name: string,
	next_episode_to_air: null,
	networks: {
		name: string,
		id: string,
		logo_path: string | null,
		origin_country: string
	}[],
	number_of_episodes: number,
	number_of_seasons: number,
	origin_country: string[],
	original_language: string,
	original_name: string,
	overview: string,
	popularity: number,
	poster_path: string | null,
	production_companies: {
		id: number,
		logo_path: string | null,
		name: string,
		origin_country: string
	}[],
	production_countries: {
		iso_3166_1: string,
		name: string
	}[],
	seasons: {
		air_date: string,
		episode_count: number,
		id: number,
		name: string,
		overview: string,
		poster_path: string,
		season_number: number
	}[],
	spoken_languages: {
		english_name: string,
		iso_639_1: string,
		name: string
	}[],
	status: string,
	tagline: string,
	type: string,
	vote_average: number,
	vote_count: number
}