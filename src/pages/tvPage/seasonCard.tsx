import { Component } from "solid-js";
import { styled } from 'solid-styled-components';
import { TMDBTvGetDetails } from '../../tmdb';
import { ImageLoader } from "../common/ImageLoader";
import { Line } from "../common/Line";
import { getTextDate } from "../common/methods";
import { useNavigate } from '@solidjs/router';

export const SeasonCard: Component<{ data: TMDBTvGetDetails[ "seasons" ][ 0 ] }> = (props) => {

	const navigate = useNavigate()

	return (
		<>
			<SeasonCardStyle onClick={(e) => {
				navigate(`${props.data.season_number}`, { resolve: true })
			}}>
				<ImageLoader class="season-img" data={{
					priority: 13,
					query: {
						imageType: "poster",
						path: props.data.poster_path,
						size: 2
					}
				}} />
				<div class="season-content">
					<span class="season-title">{props.data.name}</span>
					<Line class="season-line" />
					<div class="season-info">
						<span class="season-ep-count">{props.data.episode_count}E</span>
						<span class="season-air-date">{getTextDate(props.data.air_date)}</span>
					</div>
				</div>
			</SeasonCardStyle>
		</>
	)
}

const SeasonCardStyle = styled("div")((props) => {
	return {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		// height: "16em",

		margin: "0.6em 0.3em",
		// padding: "1em",

		width: "9.7em",
		// span: {
		// 	fontSize: "1.4em",
		// 	fontWeight: "bolder"
		// },

		backgroundColor: props.theme?.card.main,
		borderRadius: "10px",

		".season-img": {
			borderRadius: "10px",
			boxShadow: "0 8px 10px 0 #00000019",
			minHeight: "14.5em",
			height: "100%",
			width: "100%",

			img: {

				objectFit: "cover",
				objectPosition: "center",
			}
			// padding: "1em"
		},

		".season-content": {
			display: "flex",
			flexDirection: "column",
			alignItems: "center",

			width: "100%",

			padding: "1em 0",


		},

		".season-title": {
			fontSize: "1.4em",
			fontWeight: "bolder"
		},

		".season-line": {
			width: "calc(100% - 1em)",
			margin: "0.5em 0",
			// height: "1em"
		},

		".season-info": {
			width: "100%",
			display: "flex",
			flexDirection: "row",

			justifyContent: "space-between",
			alignItems: "center",

			// margin: "0 0.5em",

			// fontSize: "1.2em",

			// padding: "0 1em",



			".season-ep-count": {
				fontSize: "0.8em",
				fontWeight: "bolder",
				color: props.theme?.tv.highlight,
				paddingLeft: "1em"
			},

			".season-air-date": {
				fontSize: "0.8em",
				fontWeight: "bolder",
				color: props.theme?.card.highlight,
				paddingRight: "1em",
				textAlign: "center"
			}
		}
	}
})