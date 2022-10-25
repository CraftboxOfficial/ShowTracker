import { Component } from "solid-js";
import { styled } from 'solid-styled-components';
import { TMDBSearchMultiSearchTv, TMDBSearchMultiSearchMovie } from '../../tmdb';

export const Card: Component<{ card: (TMDBSearchMultiSearchTv | TMDBSearchMultiSearchMovie)}> = (props) => {

		const [ poster, setPoster ]: [ Accessor<string | undefined>, Setter<string | undefined> ] = createSignal()


	return (
		<>
			<CardStyle>
				<>
					<div class="content">
						<div class="poster">
							<img src={poster()}></img>
						</div>
						<div class="info">
							<span class="title">{cardContent()?.name}</span>
							<Switch>
								<Match when={infoView() == "details"}>
									<div class="details">
										<span>First aired: {cardContent()?.firstAirDate}</span>
										<span>Popularity: {cardContent()?.popularity}</span>
									</div>
								</Match>
								<Match when={infoView() == "overview"}>
									<div class="overview">
										<span>{cardContent()?.overview}</span>
									</div>
								</Match>
							</Switch>
						</div>
					</div>
					<div class="controls">
						<Button>add</Button>
						<Button onClick={(e) => setInfoView(infoView() == "details" ? "overview" : "details")}>Info</Button>
					</div>
				</>
			</CardStyle>
		</>
	)
}

const CardStyle = styled("div")(() => {
	return {
		color: "white",
		backgroundColor: "rgb(20%, 20%, 20%)",
		// margin: "0 5%",
		width: "100%",
		height: "fit-content",
		display: "flex",
		flexDirection: "column",
		borderRadius: "5px",


		".content": {
			display: "flex",
			flexDirection: "row",


			".info": {
				display: "flex",
				flexDirection: "column",
				width: "100%",
				margin: "10px",

				".title": {
					// margin: "10px 0 0 0",
					textAlign: "center"
				},

				".overview": {
					margin: "10px 0 10px 0",
					textOverflow: "clip",
					maxHeight: "25px"
					// width: "100%",
					// textAlign: "left"
				},

				".details": {
					margin: "10px 0 0 0",
					display: "flex",
					flexDirection: "column"
				},
			},

			".poster": {
				// padding: "10px",
				margin: "10px 0 10px 10px",
				borderRadius: "5px",
				// minHeight: "max(150px, 20vh)",
				// minWidth: "max(100px, 10vw)",
				minHeight: "150px",
				maxHeight: "150px",
				minWidth: "100px",
				maxWidth: "100px",
				backgroundColor: "whitesmoke",

				"img": {
					width: "100%",
					height: "100%"
				}
			}
		},

		".controls": {
			height: "50px",
			display: "flex",
			justifyContent: "end",
			margin: "0 0 10px 10px",

			button: {
				height: "100%",
				margin: "0 10px 0 0",
				backgroundColor: "grey",
				borderRadius: "5px",
				aspectRatio: "1 / 1"
			}
		},


		".content-skeleton": {
			display: "flex",
			flexDirection: "row",


			".info-skeleton": {
				display: "flex",
				flexDirection: "column",
				width: "100%",
				margin: "10px",

				".title-skeleton": {
					// margin: "10px 0 0 0",
					textAlign: "center",
					backgroundColor: "grey",
					borderRadius: "5px",
					height: "1em",

					animationName: "skeleton-loading-background",
					animationDuration: "3s",
					animationIterationCount: "infinite"
				},

				".overview": {
					margin: "10px 0 10px 0",
					textOverflow: "clip",
					maxHeight: "25px"
					// width: "100%",
					// textAlign: "left"
				},

				".details-skeleton": {
					margin: "10px 0 0 0",
					display: "flex",
					flexDirection: "column",

					".air-skeleton": {
						height: "1em",
						width: "60%",
						backgroundColor: "grey",
						borderRadius: "5px",

						animationName: "skeleton-loading-background",
						animationDuration: "3s",
						animationIterationCount: "infinite"
					},

					".popularity-skeleton": {
						margin: "10px 0 0 0",
						height: "1em",
						width: "60%",
						backgroundColor: "grey",
						borderRadius: "5px",

						animationName: "skeleton-loading-background",
						animationDuration: "3s",
						animationIterationCount: "infinite"
					}
				},
			},

			".poster-skeleton": {
				// padding: "10px",
				margin: "10px 0 10px 10px",
				borderRadius: "5px",
				// minHeight: "max(150px, 20vh)",
				// minWidth: "max(100px, 10vw)",
				minHeight: "150px",
				maxHeight: "150px",
				minWidth: "100px",
				maxWidth: "100px",

				animationName: "skeleton-loading-background",
				animationDuration: "3s",
				animationIterationCount: "infinite"
			}
		},

		".controls-skeleton": {
			height: "50px",
			display: "flex",
			justifyContent: "end",
			margin: "0 0 10px 10px",

			".button-skeleton": {
				animationName: "skeleton-loading-background",
				animationDuration: "3s",
				animationIterationCount: "infinite",

				height: "100%",
				margin: "0 10px 0 0",
				backgroundColor: "grey",
				borderRadius: "5px",
				aspectRatio: "1 / 1"
			}
		},

		"@keyframes skeleton-loading-background": {
			"0%": {
				backgroundColor: "rgb(30%, 30%, 30%)",
			},

			"50%": {
				backgroundColor: "rgb(50%, 50%, 50%)",
			},

			"100%": {
				backgroundColor: "rgb(30%, 30%, 30%)",
			},
		},

		"@keyframes skeleton-loading-color": {
			"0%": {
				color: "rgb(30%, 30%, 30%)"
			},

			"50%": {
				color: "rgb(50%, 50%, 50%)"
			},

			"100%": {
				color: "rgb(30%, 30%, 30%)"
			},
		}

	}

})