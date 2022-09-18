import { Component, createSignal, createEffect } from 'solid-js';
import { styled } from 'solid-styled-components';
import { SearchCard, SearchCardTvI } from '../components/SearchCard';
import { SearchBar } from '../components/SearchBar';

export const SearchPage: Component = () => {

	const test: SearchCardTvI = {
		firstAirDate: "2015-01-18",
		genreIds: [
			10759,
			16,
			35,
			10765
		],
		id: 61923,
		mediaType: "tv",
		name: "Star vs. the Forces of Evil",
		originalCountry: [
			"US"
		],
		originalLanguage: "en",
		originalName: "Star vs. the Forces of Evil",
		overview: "Intergalactic warrior Star Butterfly arrives on Earth to live with the Diaz family. She continues to battle villains throughout the universe and high school, mainly to protect her extremely powerful wand, an object that still confuses her.",
		popularity: 81.515,
		posterPath: "/dKFL1AOdKNoazqZDg1zq2z69Lx1.jpg",
		voteAverage: 8.4
	}


	return (
		<>
			<HomePageStyle>
				{/* <SearchBar /> */}
				{/* <span>Search Page {a()}</span> */}
				<div id="top-bar">
					<input></input>
				</div>
				<div id="cards">
					<SearchCard class="card" card={test} />
					<SearchCard class="card" card={undefined} />
					<SearchCard class="card" card={undefined} />
					<SearchCard class="card" card={undefined} />
					<SearchCard class="card" card={undefined} />
				</div>
			</HomePageStyle>
		</>
	)
}

const HomePageStyle = styled("div")(() => {
	return {
		height: "100%",
		maxHeight: "100%",
		// minHeight: "100%",
		width: "100%",
		color: "white",
		display: "flex",
		flexDirection: "column",
		alignContent: "center",
		alignItems: "center",
		overflow: "hidden",

		"#top-bar": {
			// width: "50vw",
			minHeight: "40px",
			width: "100%",
			padding: "10px 0 10px 0",
			position: "sticky",
			// top: "0",
			// backgroundColor: "rgba(0%, 0%, 0%, 0%)"
			// backgroundImage: "linear-gradient(rgba(0%, 0%, 0%, 100%), rgba(0%, 0%, 0%, 0%))", // TODO set to theme
			display: "flex",
			flexDirection: "row",
			justifyContent: "space-around",

		},

		"#cards": {
			width: "100%",
			display: "flex",
			flexDirection: "column",
			alignContent: "center",
			alignItems: "center",
			overflowY: "scroll",

			//calc(50px + 1.25%)
			padding: "0 0 25vh 0",

			// ".filler": {
			// 	width: "100%",
			// 	height: "100px"
			// }

			".card": {
				width: "95%",
				margin: "1.25% 0"
			}
		},

	}
})