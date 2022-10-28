import { Accessor, Component, createEffect, createSignal, For, JSXElement, onMount, Setter, Show } from 'solid-js';
import { styled } from 'solid-styled-components';
import { SearchCard } from './search/SearchCard';
import { BiRegularFilterAlt, BiRegularLoaderAlt, BiRegularSearchAlt } from 'solid-icons/bi';
import { useTmdb } from '../components/TmdbProvider';
import { useNavigate, useParams } from '@solidjs/router';

export const SearchPage: Component = () => {

	const navigate = useNavigate()
	const params = useParams()

	const [ paramSearch, setParamSearch ] = createSignal("")

	onMount(() => {
		// console.log(params.searchString)
		if (params.searchString) {
			setParamSearch(decodeURI(params.searchString))
			setSearchInput(paramSearch())
			const input = document.getElementById("search-input")
			input?.focus()
		}
	})

	const [ searchResults, setSearchResults ]: [ Accessor<any[]>, Setter<any[]> ] = createSignal([])


	const [ searchInput, setSearchInput ] = createSignal("")

	let typingTimer: NodeJS.Timeout
	const doneTypingInterval = 400

	let inputElem = document.getElementById("search-input")
	onMount(() => {
		inputElem = document.getElementById("search-input")
	})

	const stoppedTyping = () => {
		// @ts-expect-error
		setSearchInput(inputElem.value)

		// @ts-expect-error
		if (searchInput() != inputElem.value) {
			setIsSearching(true)
		}
	}

	const tmdb = useTmdb()

	createEffect(() => {
		if (searchInput() != paramSearch()) {
			navigate(`/search/${encodeURI(searchInput())}`, { resolve: false, replace: true }) // TODO make it only replace when comming from search
		}

		if (searchInput()) {
			setIsSearching(true)
			tmdb.tmdbMultiSearch({
				query: {
					query: searchInput()
				},
				priority: 13
			}).then((r) => {
				setIsSearching(false)
				setSearchResults(r?.results.filter((v) => v.media_type != 'person') || [])
			})

		} else {
			setIsSearching(false)
			setSearchResults([])
		}
	})

	const [ isSearching, setIsSearching ] = createSignal(false)

	/* TODO
	 >> suggest last few searches
	 >> add filters panel
	 >> add filtering
	 */

	return (
		<>
			<HomePageStyle>
				<div
					id="top-background"
				>
					<div
						id="top-bar"
						onClick={(e) => {
							e.preventDefault()
							const input = document.getElementById("search-input")
							input?.focus()
						}}>

						<input id="search-input"
							type='search'
							autocomplete="off"
							placeholder='search here...'
							value={searchInput()}
							onClick={(e) => {
								e.stopPropagation()
							}}
							onKeyPress={(e) => {
								if (e.key == "Enter") {
									stoppedTyping()
								}
							}}>

						</input>

						<Show when={isSearching()} >
							<div class="search-bar-btn">
								<BiRegularLoaderAlt class="search-bar-ico" id="searching-ico" size={24} />
							</div>
						</Show>

						<button
							id="search-btn"
							class="search-bar-btn"
							onClick={(e) => {
								e.stopPropagation()

								clearTimeout(typingTimer)
								stoppedTyping()
							}}>
							<BiRegularSearchAlt class="search-bar-ico" size={24} />
						</button>

						<button disabled // TODO temporary
							id="filter-btn"
							class="search-bar-btn"
							onClick={(e) => {
								e.stopPropagation()
							}}>
							<BiRegularFilterAlt class="search-bar-ico" size={24} />
						</button>

					</div>
				</div>
				<Show when={searchInput()} fallback={
					<div id="empty-content">
						<span>Let's search for something :D</span>
					</div>
				}>
					<Show when={searchResults().length > 0 || isSearching()} fallback={
						<div id="empty-content">
							<span>We couldn't find what you're looking for D:</span>
						</div>
					}>
						<div id="cards">
							<For each={searchResults()}>
								{(card) => {
									// if (card.media_type == "tv") {
									return (
										<>
											<SearchCard class="card" card={card} />
										</>
									)
									// }
								}}
							</For>
						</div>
					</Show>
				</Show>
			</HomePageStyle>
		</>
	)
}

const HomePageStyle = styled("div")((props) => {
	return {
		height: "inherit",
		zIndex: "inherit",
		// overflow: "auto",

		display: "flex",
		flexDirection: "column",

		color: props.theme?.main.text,

		"#cards": {
			padding: "0 0.5em 12em 0.5em",
			overflow: "auto",
			zIndex: "0"
		},

		"#filter-btn": { //TODO temporary
			color: props.theme?.card.accent
		},

		"#empty-content": {
			// width: "fit-content",
			height: "100%",
			// margin: "auto",
			fontSize: "1.1em",

			display: "flex",
			flexDirection: "column",

			alignItems: "center",
			justifyContent: "center"
		},

		"#top-background": {
			backgroundColor: props.theme?.main.main,
			position: "sticky",
			top: "-1px",
			zIndex: "10",

			padding: "0.5em",
		},

		"#top-bar": {
			height: "4em",
			backgroundColor: props.theme?.card.main,
			borderRadius: "4em",

			display: "flex",
			flexDirection: "row",
			padding: "0 2em 0 2em",

			input: {
				width: "100%",
				backgroundColor: "unset",
				border: "none",
				color: props.theme?.main.text,
				fontSize: "1.5em"
			},

			'input[type="search"]::-webkit-search-decoration': {
				display: "none",
			},

			'input[ type = "search" ]::-webkit-search-cancel-button': {
				display: "none",
			},

			'input[ type = "search" ]::-webkit-search-results-button': {
				display: "none",
			},

			'input[ type = "search" ]::-webkit-search-results-decoration': {
				display: "none",
			},

			"input:focus": {
				outline: "none"
			}
		},

		".search-bar-btn": {
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",

			minHeight: "4em",
			minWidth: "3.5em",
			color: props.theme?.card.highlight
		},

		".search-bar-ico": {
			height: "calc(0.1em * 24)",
			width: "calc(0.1em * 24)"
		},

		"#searching-ico": {
			animationName: "loading",
			animationDuration: "1s",
			animationIterationCount: "infinite",
			animationTimingFunction: "ease-in-out"
		},

		// "@keyframes loading": {
		// 	"0%": {
		// 		rotate: "0deg"
		// 	},
		// 	"100%": {
		// 		rotate: "360deg"
		// 	}
		// }
	}
})
