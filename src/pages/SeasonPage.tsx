import { Accessor, Component, createSignal, For, onMount, Setter, Show, createEffect, createMemo } from 'solid-js';
import { styled } from 'solid-styled-components';
import { useParams, useNavigate, useLocation } from '@solidjs/router';
import { BackButton } from "./common/BackButton";
import { TMDBTvGetDetails, TMDBTvSeasonsGetDetails } from '../tmdb';
import { useTmdb } from '../components/TmdbProvider';
import { BiRegularLeftArrow, BiRegularLoaderAlt, BiRegularRightArrow } from "solid-icons/bi";
import { ImageLoader } from "./common/ImageLoader";
import { Line } from "./common/Line";
import { getTextDate } from "./common/methods";
import { EpisodeCard } from "./seasonPage/episodeCard";

export const SeasonPage: Component = () => {

	const tmdb = useTmdb()
	const params = useParams()
	const navigate = useNavigate()
	const location = useLocation()

	const pathname = createMemo(() => location.pathname)

	const [ seasonDetails, setSeasonDetails ]: [ Accessor<TMDBTvSeasonsGetDetails | undefined>, Setter<TMDBTvSeasonsGetDetails | undefined> ] = createSignal()

	onMount(async () => {
		setSeasonDetails(await tmdb.tmdbGetTvSeasonsDetails({
			priority: 13,
			query: {
				tv_id: parseInt(params.tvId),
				season_number: parseInt(params.seasonId)
			}
		}))

		// console.log(seasonDetails())
	})

	createEffect(async () => {
		pathname()
		setSeasonDetails(undefined)
		setSeasonDetails(await tmdb.tmdbGetTvSeasonsDetails({
			priority: 13,
			query: {
				tv_id: parseInt(params.tvId),
				season_number: parseInt(params.seasonId)
			}
		}))
	})

	const [ tvDetails, setTvDetails ]: [ Accessor<TMDBTvGetDetails | undefined>, Setter<TMDBTvGetDetails | undefined> ] = createSignal()

	onMount(async () => {

		setTvDetails(await tmdb.tmdbGetTvDetails({
			priority: 13,
			query: {
				tv_id: parseInt(params.tvId)
			}
		}))
	})

	const [ seasonIndex, setSeasonIndex ] = createSignal(0)

	createEffect(() => {
		tvDetails()?.seasons.forEach((d, i) => {
			if (d.id == seasonDetails()?.id) {
				setSeasonIndex(i)
			}
		})

		// console.log(">> " + (tvDetails()?.seasons.length - 1))
		// console.log("-> " + seasonIndex())
	})
	// function getSeasonIndex() {
	// 	let index: number | undefined = undefined

	// 	tvDetails()?.seasons.forEach((d, i) => {
	// 		if (d.id == seasonDetails()?.id) {
	// 			index = i
	// 		}
	// 	})

	// 	return index
	// }


	return (
		<>
			<SeasonStyle>
				<BackButton />
				<Show when={seasonDetails()} fallback={
					<div id="season-loading">
						<BiRegularLoaderAlt class="loading-ico" size={36} />
					</div>
				}>
					{/* <span>Season Page</span>
				<br></br>
				<span>{params.seasonId}</span> */}
					<div id="season-content">
						<div id="season-card">
							<div id="season-poster">
								<ImageLoader data={{
									priority: 13,
									query: {
										imageType: "poster",
										// @ts-expect-error
										path: seasonDetails()?.poster_path,
										size: 1
									}
								}} />
							</div>
							<div id="season-card-content">
								<div id="season-changer">
									<Show when={seasonIndex() > 0} fallback={
										<>
											<div class="change-arrow"></div>
										</>
									}>
										<BiRegularLeftArrow class="change-arrow" size={24} onClick={(e) => {
											// @ts-expect-error
											navigate(`/tv/${params.tvId}/${seasonDetails()?.season_number - 1}`, { replace: true })
											// location.reload()
										}} />
									</Show>
									<div id="season-title">
										<span>{seasonDetails()?.name}</span>
									</div>
									{/* @ts-expect-error */}
									<Show when={seasonIndex() < (tvDetails()?.seasons.length - 1)} fallback={
										<>
											<div class="change-arrow"></div>
										</>
									}>
										<BiRegularRightArrow class="change-arrow" size={24} onClick={(e) => {
											// @ts-expect-error
											navigate(`/tv/${params.tvId}/${seasonDetails()?.season_number + 1}`, { replace: true })
											// location.reload()
										}} />
									</Show>
								</div>
								<Line id="season-card-line" />
								<div id="season-info">
									<span id="season-count">{seasonDetails()?.episodes.length}E</span>
									<span id="season-air-date">{getTextDate(seasonDetails()?.air_date)}</span>
								</div>
							</div>
						</div>
						<div id="season-overview">
							<span>{seasonDetails()?.overview}</span>
						</div>
					</div>
					<Line id="season-line" />
					<For each={seasonDetails()?.episodes}>
						{(episode) => (
							<>
								<EpisodeCard data={episode} />
							</>
						)}
					</For>
				</Show>
			</SeasonStyle>
		</>
	)
}

const SeasonStyle = styled("div")((props) => {
	return {
		height: "inherit",
		color: props.theme?.main.text,

		padding: "0 0.5em",

		paddingTop: "7em",

		// margin: "0 1em",

		overflowY: "auto",

		"#season-card": {
			display: "flex",
			flexDirection: "row",

			height: "12em",

			borderRadius: "10px",
			backgroundColor: props.theme?.card.main,

			"#season-poster": {
				borderRadius: "10px",
				boxShadow: "8px 0 4px 0 #00000019",
				height: "100%",
				width: "8em"
			},

			"#season-card-content": {
				display: "flex",
				flexDirection: "column",

				width: "100%",

				justifyContent: "center",

				"#season-changer": {
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-evenly",

					color: props.theme?.card.highlight,

					".change-arrow": {
						height: "calc(0.1em * 24)",
						width: "calc(0.1em * 24)",

					},

					"#season-title": {
						fontSize: "2em",
						color: props.theme?.main.text
					}
				},

				"#season-card-line": {
					width: "calc(100% - 4em)",
					margin: "1em 2em"
				},

				"#season-info": {
					display: "flex",
					flexDirection: "row",

					margin: "0 3em",

					justifyContent: "space-between",

					"#season-count": {
						color: props.theme?.tv.highlight,
						fontSize: "1.2em",
						fontWeight: "bolder"
					},

					"#season-air-date": {
						color: props.theme?.card.highlight,
						fontSize: "1.2em",
						fontWeight: "bolder"
					}
				}
			}
		},

		"#season-overview": {
			margin: "1em 1em",
			fontSize: "1.2em"
		},

		"#season-line": {
			margin: "1em 0.5em"
		},

		"#season-loading": {
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
	}
})