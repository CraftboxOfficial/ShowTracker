import { useNavigate, useParams } from '@solidjs/router';
import { Accessor, Component, createEffect, createSignal, Setter, Show } from 'solid-js';
import { styled } from 'solid-styled-components';
import { MediaType } from '../../components/MediaType';
import { useTmdb } from '../../components/TmdbProvider';
import { TMDBConfigurationGetApiConfiguration, TMDBSearchMultiSearchMovie, TMDBSearchMultiSearchTv } from '../../tmdb';
import { BiRegularLoaderAlt } from 'solid-icons/bi';

export interface SearchCardTvI {
	backdropPath: string,
	firstAirDate: string,
	genreIds: number[]
	id: number,
	mediaType: "tv",
	name: string,
	originalCountry: string[],
	originalLanguage: string,
	originalName: string,
	overview: string,
	popularity: number,
	posterPath: string,
	voteAverage: number,
	voteCount: number
}

export interface SearchCardMovieI {
	backdropPath: string,
	firstAirDate: string,
	genreIds: number[]
	id: number,
	mediaType: "tv",
	name: string,
	originalCountry: string[],
	originalLanguage: string,
	originalName: string,
	overview: string,
	popularity: number,
	posterPath: string,
	voteAverage: number,
	voteCount: number
}

type InfoViewI = "overview" | "details"

interface SearchCard extends HTMLDivElement {
	card: (SearchCardTvI | SearchCardMovieI | undefined)
}
export const SearchCard: Component<{ card: (TMDBSearchMultiSearchTv | TMDBSearchMultiSearchMovie), class?: string }> = (props) => {

	const tmdb = useTmdb()

	const navigate = useNavigate()

	const [ configuration, setConfiguration ]: [ Accessor<TMDBConfigurationGetApiConfiguration | undefined>, Setter<TMDBConfigurationGetApiConfiguration | undefined> ] = createSignal()
	tmdb.tmdbGetConfiguration().then((c) => setConfiguration(c))

	const [ poster, setPoster ]: [ Accessor<string | undefined>, Setter<string | undefined> ] = createSignal()

	const [ posterLoading, setPosterLoading ] = createSignal(true)

	createEffect(() => {
		if (props.card.poster_path && configuration()) {
			setPosterLoading(true)
			tmdb.tmdbGetImage({
				priority: 13,
				query: {
					// @ts-expect-error
					baseUrl: configuration().images.secure_base_url,
					path: props.card?.poster_path,
					size: "w154"
				}
			}).then((blob) => {
				if (blob) {
					setPoster(URL.createObjectURL(blob))
				}
			})
		}
		setPosterLoading(false)
	})


	function getTextDate() {
		const monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]

		switch (props.card.media_type) {
			case "tv": {
				const date = props.card.first_air_date.split("-")
				return `${monthNames[ parseInt(date[ 1 ]) ]} ${date[ 0 ]}`
			}

			case "movie": {
				const date = props.card.release_date.split("-")
				return `${monthNames[ parseInt(date[ 1 ]) ]} ${date[ 0 ]}`
			}
		}
	}

	return (
		<>
			<SearchCardStyle
				class={props.class}
				onClick={(e) => {
					navigate(`tv/${props.card?.id}`, { resolve: false })
				}}>
				<div class="show-poster">
					<Show when={!posterLoading()} fallback={
						<div class="image-loading">
							<BiRegularLoaderAlt id="searching-ico" size={24} />
						</div>
					}>
						<Show when={poster()} fallback={
							<div class="show-no-image">
								<span>No image</span>
							</div>
						}>
							<img src={poster()}></img>
						</Show>
					</Show>
				</div>

				<div class="show-content" >
					<span class="show-title">{props.card.media_type == "tv" ? props.card.name : props.card.title}</span>
					<hr />
					<div class="show-info">
						<MediaType type={props.card.media_type} />
						<span class="air-date">{getTextDate()}</span>
					</div>
				</div>
			</SearchCardStyle>
		</>
	)
}

const SearchCardStyle = styled("div")((props) => {
	return {
		marginTop: "20px",
		height: "12em",
		borderRadius: "10px",

		backgroundColor: props.theme?.card.main,

		display: "flex",
		flexDirection: "row",

		zIndex: "inherit",

		".show-poster": {
			height: "100%",
			width: "8em",
			minWidth: "8em",
			borderRadius: "10px",

			img: {
				height: "100%",
				width: "8em",
				borderRadius: "10px",
				boxShadow: "8px 0 4px 0 #00000019",

			}
		},

		".show-content": {
			width: "100%",
			padding: "0.8em 1.8em",

			".show-title": {
				fontSize: "1.4em",
				color: props.theme?.main.text
			},

			hr: {
				height: "0.1em",
				// borderWidth: "1px",
				border: "none",
				backgroundColor: props.theme?.card.accent
			}
		},

		".show-no-image": {
			height: "100%",
			width: "8em",
			borderRadius: "10px",

			backgroundColor: props.theme?.card.accent,

			display: "flex",
			alignItems: "center",
			justifyContent: "center",

			boxShadow: "8px 0 4px 0 #00000019",

			span: {
				fontSize: "1.1em",
				color: props.theme?.card.highlight2
			}
		},

		".image-loading": {
			height: "100%",
			width: "100%",
			borderRadius: "10px",

			// backgroundColor: "red",
			boxShadow: "8px 0 4px 0 #00000019",

			display: "flex",
			alignItems: "center",
			justifyContent: "center",

			"#searching-ico": {
				height: "calc(0.1em * 36)",
				width: "calc(0.1em * 36)"
			}
		},

		".show-info": {
			display: "flex",
			flexDirection: "row",

			justifyContent: "space-between",
			alignItems: "center",

			".air-date": {
				fontSize: "1.2em",
				fontWeight: "bolder",
				color: props.theme?.card.highlight
			}
		}
	}
})