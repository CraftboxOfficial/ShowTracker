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

export const SearchPage: Component = () => {

	// const test: SearchCardTvI = {
	// 	firstAirDate: "2015-01-18",
	// 	genreIds: [
	// 		10759,
	// 		16,
	// 		35,
	// 		10765
	// 	],
	// 	id: 61923,
	// 	mediaType: "tv",
	// 	name: "Star vs. the Forces of Evil",
	// 	originalCountry: [
	// 		"US"
	// 	],
	// 	originalLanguage: "en",
	// 	originalName: "Star vs. the Forces of Evil",
	// 	overview: "Intergalactic warrior Star Butterfly arrives on Earth to live with the Diaz family. She continues to battle villains throughout the universe and high school, mainly to protect her extremely powerful wand, an object that still confuses her.",
	// 	popularity: 81.515,
	// 	posterPath: "/dKFL1AOdKNoazqZDg1zq2z69Lx1.jpg",
	// 	voteAverage: 8.4
	// }

	const worker = new Worker(new URL("../webWorkers/SearchWebWorker.ts", import.meta.url))



	const [ searchResults, setSearchResults ]: [ Accessor<[]>, Setter<[]> ] = createSignal([])


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

	const app = useFirebaseApp()

	const functions = getFunctions(app)
	connectFunctionsEmulator(functions, "localhost", 5001)

	const query = httpsCallable<TMDBMultiSearchQuery>(functions, "tmdbMultiSearch")

	const a = dummyJson
	createEffect(() => {
		// console.log(searchInput())
		// console.log(query())
		// if (searchInput()) {

		query({ query: searchInput() }).then((r) => {
			// @ts-ignore
			setSearchResults(r.data.results)
		})

		// }
		// query({
		// 	query: "star vs",
		// 	language: "en-US",
		// 	page: 1,
		// 	includeAdult: false,
		// 	region: ""

		// }).then((res) => {
		// 	console.log(res)
		// })


		// worker.postMessage([ "TMDBMultiSearch.Query", {
		// 	query: searchInput()
		// }, functions ])

		// worker.onmessage = (e) => {
		// 	if (e.data[ 0 ] == "TMDBMultiSearch.Result") {
		// 		console.log(e.data)
		// 	}
		// }

		// console.log(result)
	})

	return (
		<>
			<HomePageStyle>
				<div id="top-bar">
					<input id="search-input" onKeyUp={(e) => {
						console.log("onKeyUp")
						clearTimeout(typingTimer)
						typingTimer = setTimeout(stoppedTyping, doneTypingInterval)

					}} onKeyDown={(e) => {
						console.log("onKeyDown")
						clearTimeout(typingTimer)
						if (e.key == "Enter") {
							stoppedTyping()

						}
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
					{/* <SearchCard class="card" card={test} /> */}
					{/* <SearchCard class="card" card={undefined} />
					<SearchCard class="card" card={undefined} />
					<SearchCard class="card" card={undefined} />
					<SearchCard class="card" card={undefined} /> */}
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
