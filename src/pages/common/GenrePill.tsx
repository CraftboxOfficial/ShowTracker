import { Component } from "solid-js";
import { DefaultTheme, styled, useTheme } from 'solid-styled-components';
import { TMDBTvGetDetails } from "src/tmdb";


export const GenrePill: Component<{ genre: TMDBTvGetDetails[ "genres" ][ 0 ][ "name" ], options?: { genereateColor?: boolean } }> = (props) => {

	const theme = useTheme()

	let backgroundColor: string

	const genre = props.genre
	switch (genre) {
		case ("Action & Adventure"): {

			backgroundColor = theme.genres.actionAndAdventure
			break
		}
		case ("Comedy"): {

			backgroundColor = theme.genres.comedy
			break
		}
		case ("Crime"): {

			backgroundColor = theme.genres.crime
			break
		}
		case ("Documentary"): {

			backgroundColor = theme.genres.documentary
			break
		}
		case ("Drama"): {

			backgroundColor = theme.genres.drama
			break
		}
		case ("Kids"): {

			backgroundColor = theme.genres.kids
			break
		}
		case ("Mystery"): {

			backgroundColor = theme.genres.mystery
			break
		}
		case ("News"): {

			backgroundColor = theme.genres.news
			break
		}
		case ("Reality"): {

			backgroundColor = theme.genres.reality
			break
		}
		case ("Sci-Fi & Fantasy"): {

			backgroundColor = theme.genres.sciFiAndFantasy
			break
		}
		case ("Soap"): {

			backgroundColor = theme.genres.soap
			break
		}
		case ("Talk"): {

			backgroundColor = theme.genres.talk
			break
		}
		case ("War & Politics"): {

			backgroundColor = theme.genres.warAndPolitics
			break
		}
		case ("Western"): {

			backgroundColor = theme.genres.western
			break
		}
		case ("Animation"): {

			backgroundColor = theme.genres.animation
			break
		}
		default: {

			backgroundColor = "#000000"
			break
		}
	}

	return (
		<>
			<GenrePillStyle class="text-pill" style={{ "background-color": backgroundColor }}>
				<span>{genre}</span>
			</GenrePillStyle>
		</>
	)
}

const GenrePillStyle = styled("div")(() => {
	return {
		width: "fit-content",
		height: "fit-content",

		fontSize: "1.2em",
		padding: "0.5em 1em",
		margin: "0",
		// backgroundColor: "red",

		// textOverflow: "clip",
		whiteSpace: "nowrap",

		borderRadius: "1.5em",
		fontWeight: "bolder"
	}
})