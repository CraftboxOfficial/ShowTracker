import { Component } from "solid-js";
import { styled } from 'solid-styled-components';

export const MovieCard: Component = () => {
	return (
		<>
			<MovieCardStyle>
				<span>Movie Card</span>
			</MovieCardStyle>
		</>
	)
}

const MovieCardStyle = styled("div")(() => {
	return {
		height: "100%",
		color: "white"
	}
})