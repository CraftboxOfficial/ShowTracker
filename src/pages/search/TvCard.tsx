import { Component } from "solid-js";
import { styled } from 'solid-styled-components';

export const TvCard: Component = () => {
	return (
		<>
			<TvCardStyle>
				<span>Tv Card</span>
			</TvCardStyle>
		</>
	)
}

const TvCardStyle = styled("div")(() => {
	return {
		height: "100%",
		color: "white"
	}
})