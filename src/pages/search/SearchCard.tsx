import { useNavigate, useParams } from '@solidjs/router';
import { Accessor, Component, createEffect, createSignal, Setter, Show } from 'solid-js';
import { styled } from 'solid-styled-components';
import { MediaType } from '../common/MediaType';
import { useTmdb } from '../../components/TmdbProvider';
import { TMDBConfigurationGetApiConfiguration, TMDBSearchMultiSearchMovie, TMDBSearchMultiSearchTv } from '../../tmdb';
import { BiRegularLoaderAlt } from 'solid-icons/bi';
import { ImageLoader } from '../common/ImageLoader';
import { getTextDate } from '../common/methods';

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

	// function getTextDate() {
	// 	const monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]

	// 	switch (props.card.media_type) {
	// 		case "tv": {
	// 			if (props.card.first_air_date) {
	// 				const date = props.card.first_air_date.split("-")
	// 				return `${monthNames[ parseInt(date[ 1 ]) - 1 ]} ${date[ 0 ]}`
	// 			}
	// 			return "Unknown"
	// 		}

	// 		case "movie": {
	// 			if (props.card.release_date) {
	// 				const date = props.card.release_date.split("-")
	// 				return `${monthNames[ parseInt(date[ 1 ]) - 1 ]} ${date[ 0 ]}`
	// 			}
	// 			return "Unknown"
	// 		}
	// 	}
	// }

	return (
		<>
			<SearchCardStyle
				class={props.class}
				onClick={(e) => {
					navigate(`${props.card.media_type}/${props.card?.id}`, { resolve: false })
				}}>
				<div class="show-poster">
					<ImageLoader class="show-image" data={{
						priority: 13,
						query: {
							path: props.card?.poster_path,
							imageType: "poster",
							size: 1
						}
					}} />
				</div>

				<div class="show-content" >
					<span class="show-title">{props.card.media_type == "tv" ? props.card.name : props.card.title}</span>
					<hr />
					<div class="show-info">
						<MediaType type={props.card.media_type} />
						<span class="air-date">{getTextDate(props.card.media_type == "tv" ? props.card.first_air_date : props.card.release_date)}</span>
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
			height: "12em",
			width: "8em",
			minWidth: "8em",
			borderRadius: "10px",

			// img: {
			// 	height: "100%",
			// 	width: "8em",
			// 	borderRadius: "10px",
			// 	boxShadow: "8px 0 4px 0 #00000019",

			// }

			".show-image": {
				height: "100%",
				width: "8em",
				borderRadius: "10px",
				boxShadow: "8px 0 4px 0 #00000019",
			},
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