import { Component, createEffect, createSignal } from 'solid-js';

import { Route, Routes, useLocation, useNavigate } from '@solidjs/router';
import { StoreonProvider } from '@storeon/solidjs';
import { DefaultTheme, styled, ThemeProvider } from 'solid-styled-components';
import { CacheProvider } from './components/CacheProvider';
import { NavBar } from './components/NavBar';
import { TmdbProvider } from './components/TmdbProvider';
import { HomePage } from './pages/Home';
import { SearchPage } from './pages/Search';
import { ShowsPage } from './pages/Shows';
import { TvPage } from './pages/TvPage';
import { store } from './State';
import { MoviePage } from './pages/MoviePage';

export const App: Component = () => {

	const c = navigator.userAgent
	// const app = useApp()

	const navigate = useNavigate()
	const location = useLocation()

	const currentPath = () => (() => {
		const arr = location.pathname.split("/")
		if (arr.length >= 2) {
			return arr[ 1 ]
		} else {
			return null
		}
	})() as "home" | "search" | "list" | "" | null
	const [ currentPage, setCurrentPage ] = createSignal(currentPath())

	createEffect(() => {
		setCurrentPage(currentPath())
		if (currentPath() == "") {
			navigate("/home")
		}
	})

	const darkTheme: DefaultTheme = {
		main: {
			text: "#FFFFFF",
			main: "#2B2B2B"
		},
		card: {
			main: "#383838",
			accent: "#555555",
			highlight: "#B5B5B5",
			highlight2: "#E9E9E9",
			outlineTop: [ "#55555540", "#555555FF" ],
			outLineBottom: [ "#555555FF", "#55555540" ]
		},
		tv: {
			main: "#3C4CDC",
			highlight: "#B7BEFF"
		},
		movie: {
			main: "#AA3B3B",
			highlight: "#FFC9C9"
		},
		effects: {
			accept: "#5CDC3C"
		},
		tags: {
			fantasy: "#DC3C75"
		}
	}

	return (
		<>
			<ThemeProvider theme={darkTheme}>
				<StoreonProvider store={store}>
					<TmdbProvider>
						{/* <CacheProvider> */}
						<AppStyle>
							<Routes>
								<Route path="/home" component={HomePage} />
								<Route path="/search" component={SearchPage} />
								<Route path="/search/:searchString" component={SearchPage} />
								<Route path="/tv" component={() => { navigate("/search", { resolve: false }); return <></> }} />
								<Route path="/tv/:tvId" component={TvPage} />
								<Route path="/list" component={ShowsPage} />
								<Route path="/movie/:movieId" component={MoviePage} />
							</Routes>
							<NavBar selectedPage={currentPage} />
						</AppStyle>
						{/* </CacheProvider> */}
					</TmdbProvider>
				</StoreonProvider>
			</ThemeProvider>
		</>
	);
};

const AppStyle = styled("div")((props) => {
	return {
		fontSize: "inherit",

		button: {
			fontSize: "inherit",
			padding: "0",
			margin: "0",
			backgroundColor: "unset",
			border: "unset",
		},

		// "input:focus-visible": {
		// 	transition: "outline-offset 75ms ease-out",
		// 	outlineOffset: "0.2em",
		// 	outline: "1px orange solid",
		// 	zIndex: "100"
		// },

		"button:focus-visible": {
			transition: "outline-offset 75ms ease-out",
			outlineOffset: "0.2em",
			outline: "1px orange solid",
			zIndex: "100"
		},

		"button:not(:active):focus-visible": {
			outlineOffset: "0.2em"
		},


		height: "100%",
		minHeight: "100%",
		width: "100%",
		minWidth: "100%",
		display: "flex",
		flexDirection: "column",

		backgroundColor: props.theme?.main.main
	}
})