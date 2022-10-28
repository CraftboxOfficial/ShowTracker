import { useParams } from "@solidjs/router";
import { BiRegularLoaderAlt } from "solid-icons/bi";
import { Accessor, Component, createSignal, Setter, onMount, Show, createEffect } from 'solid-js';
import { styled } from 'solid-styled-components';
import { MediaType } from "../components/MediaType";
import { useTmdb } from '../components/TmdbProvider';
import { TMDBConfigurationGetApiConfiguration, TMDBTvGetDetails } from '../tmdb';
import { ImageLoader } from "./common/ImageLoader";

export const MoviePage: Component = () => {

	const tmdb = useTmdb()

	const params = useParams()

	const [ movieDetails, setMovieDetails ]: [ Accessor<TMDBTvGetDetails | undefined>, Setter<TMDBTvGetDetails | undefined> ] = createSignal()

	onMount(async () => {

		// setMovieDetails(await tmdb.tmdbGetTvDetails({
		// 	priority: 13,
		// 	query: {
		// 		tv_id: parseInt(params.tvId)
		// 	}
		// }))

	})

	function getTextDate() {
		const monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]

		const date = movieDetails()?.first_air_date.split("-")
		// @ts-ignore
		return `${monthNames[ parseInt(date[ 1 ]) ]} ${date[ 0 ]}`
	}

	return (
		<>
			<MoviePageStyle>
				<span>To be implemented</span>
				{/* <Show when={movieDetails()}>

					<div id="movie-backdrop">
						<ImageLoader data={{
							priority: 13,
							query: {
								// @ts-expect-error
								path: movieDetails()?.backdrop_path,
								imageType: "backdrop",
								size: 1
							}
						}} />

					</div>
					<div id="movie-poster">
						<ImageLoader data={{
							priority: 13,
							query: {
								// @ts-expect-error
								path: movieDetails()?.poster_path,
								imageType: "poster",
								size: 2
							}
						}} />

					</div>
					<div id="movie-title">
						<span>{movieDetails()?.name}</span>
					</div>
					<div id="movie-info">
						<Show when={movieDetails()}>
							<div id="movie-info">
								<MediaType type={"movie"} />
								<span id="air-date">{getTextDate()}</span>
							</div>
						</Show>
					</div>
					<div id="movie-overview">
						<span>{movieDetails()?.overview}</span>
					</div>
				</Show> */}
			</MoviePageStyle>
		</>
	)
}

const MoviePageStyle = styled("div")((props) => {
	return {
		height: "inherit",
		color: props.theme?.main.text,

		padding: "0 0.5em",

		display: "flex",
		flexDirection: "column",
		// alignItems: "strech",

		"#movie-title": {
			fontSize: "1.4em"
		},

		"#movie-backdrop": {
			// objectFit: "contain",
			// maxWidth: "100%"

			img: {
				width: "100%",
				objectPosition: "center",
				objectFit: "fill"
			}
		},

		"#movie-info": {
			display: "flex",
			flexDirection: "row",

			justifyContent: "space-between",
			alignItems: "center",

			backgroundColor: props.theme?.card.main,
			width: "100%",
			padding: "0.5em 0",

			"#air-date": {
				fontSize: "1.2em",
				fontWeight: "bolder",
				color: props.theme?.card.highlight
			}
		}
	}
})