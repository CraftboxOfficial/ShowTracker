import { Component } from "solid-js";
import { styled } from 'solid-styled-components';

export const ShowsPage: Component = () => {
	return (
		<>
			<HomePageStyle>
				<span>Shows Page</span>
			</HomePageStyle>
		</>
	)
}

const HomePageStyle = styled("div")(() => {
	return {
		height: "100%",
		color: "white"
	}
})