import { Component } from "solid-js";
import { styled } from 'solid-styled-components';
import { SearchBar } from '../components/SearchBar';

export const SearchPage: Component = () => {
	return (
		<>
			<HomePageStyle>
				<SearchBar />
				<span>Search Page</span>
			</HomePageStyle>
		</>
	)
}

const HomePageStyle = styled("div")(() => {
	return {
		height: "100%",
		// minHeight: "100%",
		width: "100%",
		color: "white",
		display: "flex",
		flexDirection: "column",
		alignContent: "center",
		alignItems: "center",

		"#search-bar": {
			width: "50vw",
			height: "5%"
		}
	}
})