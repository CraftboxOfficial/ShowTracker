import { useParams } from "@solidjs/router";
import { BiRegularLoaderAlt } from "solid-icons/bi";
import { Accessor, Component, createSignal, Setter, onMount, Show, createEffect, For } from 'solid-js';
import { styled, useTheme } from 'solid-styled-components';
import { MediaType } from "../components/MediaType";
import { useTmdb } from '../components/TmdbProvider';
import { TMDBConfigurationGetApiConfiguration, TMDBTvGetDetails } from '../tmdb';
import { BackButton } from "./common/BackButton";
import { ImageLoader } from "./common/ImageLoader";
import { GenrePill } from "./common/GenrePill";
import { Scroll } from "./common/Scroll";

export const TvPage: Component = () => {

	const tmdb = useTmdb()
	const params = useParams()
	const theme = useTheme()

	const [ tvDetails, setTvDetails ]: [ Accessor<TMDBTvGetDetails | undefined>, Setter<TMDBTvGetDetails | undefined> ] = createSignal()

	onMount(async () => {

		setTvDetails(await tmdb.tmdbGetTvDetails({
			priority: 13,
			query: {
				tv_id: parseInt(params.tvId)
			}
		}))

		console.log(tvDetails())
	})

	function getTextDate() {
		const monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]

		if (tvDetails()?.first_air_date) {
			const date = tvDetails()?.first_air_date.split("-")
			// @ts-expect-error
			return `${monthNames[ parseInt(date[ 1 ]) - 1 ]} ${date[ 0 ]}`
		}

		return "Unknown"
	}

	const [ backdrop, setBackdrop ]: [ Accessor<string | undefined>, Setter<string | undefined> ] = createSignal()
	const [ backdropLoading, setBackdropLoading ] = createSignal(true)

	createEffect(async () => {
		tvDetails()
		setBackdropLoading(true)

		const config = await tmdb.tmdbGetConfiguration()

		if (tvDetails()?.backdrop_path) {
			const gotImage = await tmdb.tmdbGetImage({
				priority: 13,
				query: {
					baseUrl: config.images.secure_base_url,
					// @ts-expect-error
					path: tvDetails()?.backdrop_path,
					size: config.images.backdrop_sizes[ 1 ]
				}
			})

			if (gotImage) {
				setBackdrop(URL.createObjectURL(gotImage))
			}
		}

		setBackdropLoading(false)
	})

	function getTvStatus() {
		switch (tvDetails()?.status) {
			case "Canceled": {
				return {
					status: "Canceled",
					color: theme.status.canceled
				}
			}
			case "Ended": {
				return {
					status: "Ended",
					color: theme.status.ended
				}
			}
			case "In Production": {
				return {
					status: "In Production",
					color: theme.status.inProduction
				}
			}
			case "Pilot": {
				return {
					status: "Pilot",
					color: theme.status.pilot
				}
			}
			case "Planned": {
				return {
					status: "Planned",
					color: theme.status.planned
				}
			}
			case "Returning Series": {
				if (tvDetails()?.next_episode_to_air) {
					return {
						status: "Airing",
						color: theme.status.airing
					}
				}
				return {
					status: "Returning",
					color: theme.status.airing
				}
			}
			default: {
				return {
					status: "Unknown",
					color: theme.status.unknown
				}
			}
		}
	}

	// window.onload = (e) => {
	// 	const target = document.getElementById("show-genres")
	// 	console.log(target)
	// 	window.addEventListener("pointermove", (e) => {
	// 		if (pressing()) {
	// 			// console.log(e.movementX)
	// 		}

	// 		if (e.target == target) {
	// 			console.log(e.movementX)
	// 		}
	// 	})
	// }

	// createEffect(() => {
	// 	if (tvDetails()) {
	// 		const target = document.getElementById("show-genres") as HTMLElement

	// 		// console.log(target)

	// 		window.addEventListener("pointermove", (e) => {
	// 			// @ts-expect-error
	// 			const path = e.path as EventTarget[] || e.composedPath()

	// 			// if (pressing()) {
	// 			// 	// console.log(e.movementX)
	// 			// }

	// 			// console.log(e)

	// 			if (path.includes(target)) {
	// 				// console.log(e.movementX)
	// 				target?.scrollBy({ left: -e.movementX })
	// 			}
	// 		})
	// 	}
	// })


	return (
		<>
			<TvPageStyle>
				<BackButton />
				<Show when={tvDetails()}>
					<div id="tv-top" style={{ "background-image": `linear-gradient(${theme.main.main}00, ${theme.main.main}FF), url(${backdrop()})` }}>
						{/* <Show when={!backdropLoading()}>
							<div id="tv-backdrop" style={{ "background-image": `linear-gradient(${theme.main.main}00, ${theme.main.main}FF), url(${backdrop()})` }}>
							</div>
						</Show> */}
						<div id="tv-poster">
							<ImageLoader data={{
								priority: 13,
								query: {
									// @ts-expect-error
									path: tvDetails()?.poster_path,
									imageType: "poster",
									size: 3
								}
							}} />
						</div>
					</div>

					<div id="tv-content">
						<div id="tv-title">
							<span>{tvDetails()?.name}</span>
						</div>
						<div id="tv-info">
							<Show when={tvDetails()}>
								<div id="show-info">
									<div id="show-stats">
										<MediaType type={"tv"} />
										<span class="show-count">{tvDetails()?.number_of_seasons}S</span>
										<span class="show-count">{tvDetails()?.number_of_episodes}E</span>
									</div>
									<span id="air-status" style={{ "color": getTvStatus().color }}>{getTvStatus().status}</span>
									<span id="air-date">{getTextDate()}</span>
								</div>
								<div id="show-genres">
									<Scroll id="genres-pills" scrollId="genres" options={{ scrollX: true }}>
										<For each={tvDetails()?.genres}>
											{(genre) => (
												<>
													<GenrePill genre={genre.name} />
												</>
											)}
										</For>
									</Scroll>
								</div>
							</Show>
						</div>
						<div id="tv-overview">
							<span>{tvDetails()?.overview}</span>
						</div>
					</div>

				</Show>
			</TvPageStyle>
		</>
	)
}

const TvPageStyle = styled("div")((props) => {
	return {
		height: "inherit",
		color: props.theme?.main.text,

		// padding: "0 0.5em",

		display: "flex",
		flexDirection: "column",
		// alignItems: "strech",

		overflowY: "auto",

		"#tv-top": {
			height: "28em",

			display: "flex",
			flexDirection: "column",
			alignItems: "center",

			backgroundRepeat: "no-repeat",
			backgroundSize: "cover",
			backgroundPosition: "center",

			"#tv-poster": {

				height: "22em",
				// width: "16em",

				margin: "3em 0",

				img: {
					borderRadius: "10px",
					boxShadow: "0 8px 10px 0 #00000019"
				}
			}
		},

		"#tv-content": {
			padding: "0 0.5em",

			// display: "flex",
			// flexDirection: "column",
			// alignItems: "center",

			"#tv-title": {
				textAlign: "center",
				fontSize: "2.2em",
				padding: "0.5em"
			},

			"#tv-info": {
				display: "flex",
				flexDirection: "column",


				"#show-info": {
					display: "flex",
					flexDirection: "row",

					justifyContent: "space-between",
					alignItems: "center",

					backgroundColor: props.theme?.card.main,
					// width: "100%",
					padding: "1em 2em",
					margin: "1em 0",

					fontSize: "1.2em",

					borderRadius: "10px",

					"#show-stats": {
						display: "flex",
						flexDirection: "row",
						alignItems: "center",

						".show-count": {
							fontSize: "1.2em",
							fontWeight: "bolder",
							color: props.theme?.tv.highlight,
							paddingLeft: "0.3em"
						}
					},

					"#air-status": {
						fontSize: "1.2em",
						fontWeight: "bolder",
						padding: "0 1em"
					},

					"#air-date": {
						fontSize: "1.2em",
						fontWeight: "bolder",
						color: props.theme?.card.highlight,
						textAlign: "center"
					},
				},

				"#show-genres": {
					position: "relative",
					height: "3em",

					display: "flex",
					flexDirection: "row",
					alignItems: "center",

					margin: "1em 0",

					"#genres-pills": {
						// margin: "0 1em",
						display: "flex",
						flexDirection: "row",

						touchAction: "none",
						overflowX: "hidden",
						// boxSizing: "content-box",

						".text-pill": {
							margin: "0 0.5em"
						},
					},
				},

				"#show-genres::after": {
					content: '""',
					width: "100%",

					height: "3em",

					position: "absolute",
					bottom: "0",

					pointerEvents: "none",

					backgroundImage: `linear-gradient(90deg, ${props.theme?.main.main}FF 0%, ${props.theme?.main.main}00 5%, ${props.theme?.main.main}00 95%, ${props.theme?.main.main}FF 100%)`
				}
			},

			"#tv-overview": {
				margin: "0.5em 0",

				padding: "0 1em",
				// span: {
				fontSize: "1.4em"
				// }
			}
		}
	}
})