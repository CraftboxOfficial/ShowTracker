import { useParams } from "@solidjs/router";
import { BiRegularLoaderAlt } from "solid-icons/bi";
import { Accessor, Component, createSignal, Setter, onMount, Show, createEffect } from 'solid-js';
import { styled } from 'solid-styled-components';
import { MediaType } from "../components/MediaType";
import { useTmdb } from '../components/TmdbProvider';
import { TMDBConfigurationGetApiConfiguration, TMDBTvGetDetails } from '../tmdb';
import { ImageLoader } from "./common/ImageLoader";

export const TvPage: Component = () => {

	const tmdb = useTmdb()

	const params = useParams()

	const [ tvDetails, setTvDetails ]: [ Accessor<TMDBTvGetDetails | undefined>, Setter<TMDBTvGetDetails | undefined> ] = createSignal()

	onMount(async () => {

		setTvDetails(await tmdb.tmdbGetTvDetails({
			priority: 13,
			query: {
				tv_id: parseInt(params.tvId)
			}
		}))

	})

	function getTextDate() {
		const monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]

		const date = tvDetails()?.first_air_date.split("-")
		// @ts-ignore
		return `${monthNames[ parseInt(date[ 1 ]) ]} ${date[ 0 ]}`
	}

	return (
		<>
			<TvPageStyle>
				<Show when={tvDetails()}>

					<div id="tv-backdrop">
						<ImageLoader data={{
							priority: 13,
							query: {
								// @ts-expect-error
								path: tvDetails()?.backdrop_path,
								imageType: "backdrop",
								size: 1
							}
						}} />

					</div>
					<div id="tv-poster">
						<ImageLoader data={{
							priority: 13,
							query: {
								// @ts-expect-error
								path: tvDetails()?.poster_path,
								imageType: "poster",
								size: 2
							}
						}} />

					</div>
					<div id="tv-title">
						<span>{tvDetails()?.name}</span>
					</div>
					<div id="tv-info">
						<Show when={tvDetails()}>
							<div id="show-info">
								<MediaType type={"tv"} />
								<span id="air-date">{getTextDate()}</span>
							</div>
						</Show>
					</div>
					<div id="tv-overview">
						<span>{tvDetails()?.overview}</span>
					</div>
				</Show>

			</TvPageStyle>
		</>
	)
}

const TvPageStyle = styled("div")((props) => {
	return {
		height: "inherit",
		color: props.theme?.main.text,

		padding: "0 0.5em",

		display: "flex",
		flexDirection: "column",
		// alignItems: "strech",

		"#tv-title": {
			fontSize: "1.4em"
		},

		"#tv-backdrop": {
			// objectFit: "contain",
			// maxWidth: "100%"

			img: {
				width: "100%",
				objectPosition: "center",
				objectFit: "fill"
			}
		},

		"#show-info": {
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