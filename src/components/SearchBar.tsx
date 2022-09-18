import { Component } from "solid-js";
import { styled } from 'solid-styled-components';

export const SearchBar: Component = () => {
	return (
		<>
			<SearchBarStyle id="search-bar">
				<input></input>
				<span>Search</span>
			</SearchBarStyle>
		</>
	)
}

const SearchBarStyle = styled("div")(() => {
	return {
		display: "flex",
		flexDirection: "row",
		color: "black",
		backgroundColor: "white",
		input: {
			color: "white",
			backgroundColor: "blue",
			height: "100%",
			width: "100%",
			border: "none",
			"&:focus": {
				outline: "none",
				border: "none",
			}
		}
	}
})