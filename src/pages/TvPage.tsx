import { useParams } from "@solidjs/router";
import { BiRegularCaretDown, BiRegularLoaderAlt } from "solid-icons/bi";
import { Accessor, Component, createSignal, Setter, onMount, Show, createEffect, For } from 'solid-js';
import { styled, useTheme } from 'solid-styled-components';
import { MediaType } from "./common/MediaType";
import { useTmdb } from '../components/TmdbProvider';
import { TMDBConfigurationGetApiConfiguration, TMDBTvGetDetails } from '../tmdb';
import { BackButton } from "./common/BackButton";
import { ImageLoader } from "./common/ImageLoader";
import { GenrePill } from "./common/GenrePill";
import { Scroll } from "./common/Scroll";
import { SeasonCard } from "./tvPage/seasonCard";
import { getTextDate } from "./common/methods";
import { Line } from "./common/Line";

export const TvPage: Component = () => {

	const tmdb = useTmdb()
	const params = useParams()
	const theme = useTheme()

	const [ tvDetails, setTvDetails ] = createSignal<TMDBTvGetDetails | undefined>()

	onMount(async () => {

		setTvDetails(await tmdb.tmdbGetTvDetails({
			priority: 7,
			query: {
				tv_id: parseInt(params.tvId)
			}
		}))
	})

	const [ backdrop, setBackdrop ] = createSignal<string | undefined>()
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
					color: theme.status.inProduction
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

	const [ hasPosterLoaded, setHasPosterLoaded ] = createSignal(false)

	return (
		<>
			<TvPageStyle>
				<BackButton />
				<Show when={tvDetails() && (tvDetails()?.backdrop_path ? backdrop() : true)} fallback={(
					<div id="show-loading">
						<BiRegularLoaderAlt class="loading-ico" size={36} />
					</div>
				)}>
					{/* <Scroll id="scrollable" scrollId="tv-page" options={{ scrollY: true }}> */}

					<div id="tv-top" style={{ "background-image": `linear-gradient(${theme.main.main}00, ${theme.main.main}FF), url(${backdrop()})` }}>
						<div id="tv-poster">
							<ImageLoader data={{
								priority: 13,
								query: {
									// @ts-expect-error
									path: tvDetails()?.poster_path,
									imageType: "poster",
									size: 3
								}
							}}
								hasLoadedSignal={setHasPosterLoaded}
							/>
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
									<span id="air-date">{getTextDate(tvDetails()?.first_air_date)}</span>
								</div>
								{/* @ts-expect-error */}
								<Show when={tvDetails()?.genres ? tvDetails()?.genres.length > 0 : false}>
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
							</Show>
						</div>
						<div id="tv-overview">
							<span>{tvDetails()?.overview}</span>
						</div>
						<div id="show-more-line">
							<Line class="show-line" />
							{/* <BiRegularCaretDown id="show-more-ico" size={24} /> */}
							{/* <Line class="show-line" /> */}
						</div>
						<div id="show-seasons">
							<For each={tvDetails()?.seasons}>
								{(season) => (
									<>
										<SeasonCard data={season} />
									</>
								)}
							</For>
						</div>
					</div>
					{/* </Scroll> */}

				</Show>
			</TvPageStyle>
		</>
	)
}

const TvPageStyle = styled("div")((props) => {
	return {
		height: "inherit",


		// "#scrollable": {

		// height: "inherit",
		color: props.theme?.main.text,

		// padding: "0 0.5em",

		display: "flex",
		flexDirection: "column",
		// alignItems: "strech",

		overflowY: "auto",
		// overflow: "hidden",

		// paddingBottom: "100px",


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
				width: "15em",

				margin: "3em 0",

				borderRadius: "10px",
				// boxShadow: "0 8px 10px 0 #00000019",

				img: {
					objectFit: "contain",
					objectPosition: "center",
					borderRadius: "10px",
					boxShadow: "0 8px 10px 0 #00000019",
					// boxShadow: "0 8px 10px 0 #00000019"
				},

				".no-image": {
					display: "none",
					boxShadow: "none",
					backgroundColor: "unset",
					justifyContent: "flex-end",
					// fontSize: "0.5em"
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
					justifyContent: "center",

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
		},

		"#show-more-line": {
			display: "flex",
			flexDirection: "row",

			color: props.theme?.card.highlight,

			justifyContent: "center",
			alignItems: "center",

			margin: "0.5em 1em",

			".show-line": {
				width: "100%",
				// height: "0.4em",

			},

			"#show-more-ico": {
				height: "calc(0.1em * 24)",
				width: "calc(0.1em * 24)",

			}
		},

		"#show-seasons": {
			display: "flex",
			flexDirection: "row",
			justifyContent: "center",
			flexWrap: "wrap",
			// margin: "0 1em",
			// padding: "10em 0"
		},

		"#show-loading": {
			height: "inherit",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center"
		},

		".loading-ico": {
			height: "calc(0.1em * 36)",
			width: "calc(0.1em * 36)",

			animationName: "loading",
			animationDuration: "1s",
			animationIterationCount: "infinite",
			animationTimingFunction: "ease-in-out"
		},

		"@keyframes loading": {
			"0%": {
				rotate: "0deg"
			},
			"100%": {
				rotate: "360deg"
			}
		}
		// },
	}

})