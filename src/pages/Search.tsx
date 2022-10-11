import { Component, createSignal, createEffect, onMount, For, Accessor, Setter } from 'solid-js';
import { styled } from 'solid-styled-components';
import { SearchCard, SearchCardTvI } from '../components/SearchCard';
import { SearchBar } from '../components/SearchBar';
// @ts-expect-error
import dummyJson from "../../apiMultiSearch.dummy.json"
// import * as functions from 'firebase-functions';
import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions';
import { TMDBMultiSearchQuery } from 'functions/src';
import { useFirebaseApp } from 'solid-firebase';
import { useCache } from '../components/CacheProvider';
import { useTmdb } from '../components/TmdbProvider';

export const SearchPage: Component = () => {

	const [ searchResults, setSearchResults ]: [ Accessor<any[]>, Setter<any[]> ] = createSignal([])


	const [ searchInput, setSearchInput ] = createSignal("")

	let typingTimer: NodeJS.Timeout
	const doneTypingInterval = 1000

	let inputElem = document.getElementById("search-input")
	onMount(() => {
		inputElem = document.getElementById("search-input")
		// console.log(worker)
	})

	const stoppedTyping = () => {
		// @ts-expect-error
		setSearchInput(inputElem.value)
	}

	const tmdb = useTmdb()

	createEffect(() => {
		if (searchInput()) {

			tmdb.tmdbMultiSearch({
				query: {
					query: searchInput()
				},
				priority: 13
			}).then((r) => {
				setSearchResults(r?.results || [])
			})

		} else {
			setSearchResults([])
		}
	})

	return (
		<>
			<HomePageStyle>
				<div id="top-bar">
					<input id="search-input"
						onInput={(e) => {
							clearTimeout(typingTimer)
							typingTimer = setTimeout(stoppedTyping, doneTypingInterval)
						}}></input>
				</div>
				<div id="cards">
					<For each={searchResults()}>
						{(card) => {
							return (
								<>
									<SearchCard class="card" card={card} />
								</>
							)
						}}
					</For>
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
			height: "100%",
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
