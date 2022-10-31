import { Component } from "solid-js";
import { styled } from 'solid-styled-components';
import { TMDBTvSeasonsGetDetails } from '../../tmdb';
import { ImageLoader } from "../common/ImageLoader";
import { getTextDate } from "../common/methods";

export const EpisodeCard: Component<{ data: TMDBTvSeasonsGetDetails[ "episodes" ][ 0 ] }> = (props) => {
	return (
		<>
			<EpisodeCardStyle>
				<div class="episode-still">
					<ImageLoader data={{
						priority: 13,
						query: {
							imageType: "still",
							path: props.data.still_path,
							size: 2
						}
					}} />
				</div>
				<div class="episode-content">
					<span class="episode-title">{props.data.name}</span>
					<span class="episode-air-date">{getTextDate(props.data.air_date, { day: true })}</span>
				</div>
			</EpisodeCardStyle>
		</>
	)
}

const EpisodeCardStyle = styled("div")((props) => {
	return {
		// height: "100%",
		// color: "white"
		display: "flex",
		flexDirection: "row",

		// height: "6em",
		minHeight: "8em",
		// maxHeight: "fit-content",
		marginBottom: "1em",

		borderRadius: "10px",

		backgroundColor: props.theme?.card.main,

		".episode-still": {
			// height: "100%",
			// minHeight: "6em",
			width: "100%",
			maxWidth: "12em",
			borderRadius: "10px",
			boxShadow: "8px 0 4px 0 #00000019",

			img: {
				display: "block",
				// height: "100%",
				objectFit: "cover",
				objectPosition: "center"
			}
		},

		".episode-content": {
			display: "flex",
			flexDirection: "column",
			// justifyContent: "center",

			padding: "1em",

			// width: "100%",
			// maxWidth: "100%",

			height: "100%",

			// textOverflow: "clip",
			// textOverflow: "ellipsis",
			// whiteSpace: "nowrap",

			".episode-title": {
				// display: "inline-block",
				fontSize: "1.4em",
				color: props.theme?.main.text,
				// whiteSpace: "nowrap",
				// "-webkit-line-clamp": "2",
				// textOverflow: "ellipsis",
				// maxHeight: "2.5em",
				// overflow: "hidden",
			},

			".episode-air-date": {
				marginTop: "0.5em",
				fontSize: "1em",
				color: props.theme?.card.highlight
			}
		}
	}
})