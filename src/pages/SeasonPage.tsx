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

		console.log(seasonDetails())
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
			console.log(d.id)
			console.log(seasonDetails()?.id)
			if (d.id == seasonDetails()?.id) {
				setSeasonIndex(i)
			}
		})

		// @ts-expect-error
		console.log(">> " + (tvDetails()?.seasons.length - 1))
		console.log("-> " + seasonIndex())
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
								<Show when={seasonIndex() > 0}>
									<BiRegularLeftArrow size={24} onClick={(e) => {
										navigate(`/tv/${params.tvId}/${seasonIndex() - 1}`, { replace: true })
										// location.reload()
									}} />
								</Show>
								<ImageLoader data={{
									priority: 13,
									query: {
										imageType: "poster",
										// @ts-expect-error
										path: seasonDetails()?.poster_path,
										size: 1
									}
								}} />
								{/* @ts-expect-error */}
								<Show when={seasonIndex() < (tvDetails()?.seasons.length - 1)}>
									<BiRegularRightArrow size={24} onClick={(e) => {
										console.log(params.tvId)
										navigate(`/tv/${params.tvId}/${seasonIndex() + 1}`, { replace: true })
										// location.reload()
									}} />
								</Show>
							</div>
							<div id="season-card-content">
								<div id="season-title">
									<span>{seasonDetails()?.name}</span>
								</div>
								<Line />
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
					<Line />
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

		"#season-card": {

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