import { Component } from "solid-js";
import { styled } from 'solid-styled-components';
import { TMDBTvSeasonsGetDetails } from '../../tmdb';

export const EpisodeCard: Component<{ data: TMDBTvSeasonsGetDetails[ "episodes" ][ 0 ] }> = (props) => {
	return (
		<>
			<EpisodeCardStyle>
				<span>{props.data.name}</span>
			</EpisodeCardStyle>
		</>
	)
}

const EpisodeCardStyle = styled("div")(() => {
	return {
		// height: "100%",
		color: "white"
	}
})