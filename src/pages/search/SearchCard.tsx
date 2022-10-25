import { useNavigate } from '@solidjs/router';
import { Accessor, Component, createEffect, createSignal, Setter, Show } from 'solid-js';
import { styled } from 'solid-styled-components';
import { useTmdb } from '../../components/TmdbProvider';
import { TMDBConfigurationGetApiConfiguration, TMDBSearchMultiSearchTv } from '../../tmdb';

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
export const SearchCard: Component<{ card: (TMDBSearchMultiSearchTv | undefined), class?: string }> = (props) => {

	const tmdb = useTmdb()

	const navigate = useNavigate()

	const [ cardContent, setCardContent ]: [ Accessor<(TMDBSearchMultiSearchTv | undefined)>, Setter<(TMDBSearchMultiSearchTv | undefined)> ] = createSignal(props.card)
	const [ infoView, setInfoView ]: [ Accessor<InfoViewI>, Setter<InfoViewI> ] = createSignal("details")

	const [ configuration, setConfiguration ]: [ Accessor<TMDBConfigurationGetApiConfiguration | undefined>, Setter<TMDBConfigurationGetApiConfiguration | undefined> ] = createSignal()
	tmdb.tmdbGetConfiguration().then((c) => setConfiguration(c))

	const [ poster, setPoster ]: [ Accessor<string | undefined>, Setter<string | undefined> ] = createSignal()

	// createEffect(() => {
	// console.log(cardContent())
	createEffect(() => {
		if (cardContent()) {
			tmdb.tmdbGetImage({
				priority: 13,
				query: {
					// @ts-expect-error
					baseUrl: configuration()?.images.secure_base_url,
					// @ts-expect-error
					path: cardContent()?.poster_path,
					size: "w154"
				}
			}).then((blob) => {
				// console.log(blob)
				if (blob) {
					setPoster(URL.createObjectURL(blob))
				}
			})
		}
	})
	// })


	return (
		<>
			<SearchCardStyle
				class={props.class}
				onClick={(e) => {
					navigate(`tv/${props.card?.id}`)
				}}>
				<div class="show-poster">
					<Show when={poster()}>
						<img src={poster()}></img>
					</Show>
				</div>

				<div class="show-content" >
					<span class="show-title">{cardContent()?.name}</span>
					<hr />
					<div class="show-info"></div>
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

		".show-poster": {
			height: "100%",
			width: "8em",
			// maxWidth: "30%",
			// aspectRatio: "16 / 9",
			borderRadius: "10px",
			// backgroundColor: "red",

			img: {
				height: "100%",
				width: "8em",
				borderRadius: "10px",
				boxShadow: "8px 0 4px 0 #00000019",

			}
		},

		".show-content": {
			width: "100%",
			padding: "0.8em",

			".show-title": {
				fontSize: "1.2em",
				color: props.theme?.main.text
			},

			hr: {
				height: "0.1em",
				// borderWidth: "1px",
				border: "none",
				backgroundColor: props.theme?.card.accent
			}
		}
	}
})