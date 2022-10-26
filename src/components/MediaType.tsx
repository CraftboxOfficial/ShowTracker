import { Component, Match, Switch } from "solid-js";
import { styled } from 'solid-styled-components';

export const MediaType: Component<{ type: "tv" | "movie" }> = (props) => {


	return (
		<>
			<MediaTypeStyle>
				<Switch>
					<Match when={props.type == "tv"}>
						<div class="card-type card-type-tv">
							<span>TV</span>
						</div>
					</Match>
					<Match when={props.type == "movie"}>
						<div class="card-type card-type-movie">
							<span>Movie</span>
						</div>
					</Match>
				</Switch>
			</MediaTypeStyle>
		</>
	)
}

const MediaTypeStyle = styled("div")((props) => {
	return {
		// height: "100%",
		// color: "white"
		width: "fit-content",

		".card-type": {

			minWidth: "2em",

			padding: "0.3em",
			borderRadius: "4px",

			fontSize: "1.2em",
			fontWeight: "bolder",
			textAlign: "center"
		},

		".card-type-tv": {
			color: props.theme?.tv.highlight,
			backgroundColor: props.theme?.tv.main
		},

		".card-type-movie": {
			color: props.theme?.movie.highlight,
			backgroundColor: props.theme?.movie.main
		},
	}
})