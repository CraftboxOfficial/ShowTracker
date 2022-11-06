import { Component, createEffect, createSignal, lazy } from 'solid-js';

import { Route, RouteDefinition, RouteProps, Routes, useLocation, useNavigate, useRoutes } from '@solidjs/router';
import { StoreonProvider } from '@storeon/solidjs';
import { DefaultTheme, styled, ThemeProvider } from 'solid-styled-components';
import { CacheProvider } from './components/CacheProvider';
import { NavBar } from './pages/common/NavBar';
import { TmdbProvider } from './components/TmdbProvider';
import { HomePage } from './pages/Home';
import { SearchPage } from './pages/Search';
import { ShowsPage } from './pages/Shows';
import { TvPage } from './pages/TvPage';
import { store } from './State';
import { MoviePage } from './pages/MoviePage';
import { SeasonPage } from './pages/SeasonPage';
import { SignInPage } from './pages/signing/SignInPage';
import { SignUpPage } from './pages/signing/SignUpPage';


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
		},

		status: {
			airing: "#5CDC3C",
			planned: "#9984EE",
			pilot: "#7DC5E4",
			inProduction: "#30A1E0",
			ended: "#A66C4B",
			canceled: "#CD5353",
			unknown: "#A0A0A0"
		},

		genres: {
			text: "#FFFFFF",
			actionAndAdventure: "#80A56A",
			comedy: "#4782DB",
			crime: "#62471E",
			documentary: "#3B3F9A",
			drama: "#DC5353",
			kids: "#58CD55",
			mystery: "#5B3B74",
			news: "#3170EB",
			reality: "#62A599",
			sciFiAndFantasy: "#A51247",
			soap: "#A7B036",
			talk: "#AD4747",
			warAndPolitics: "#466490",
			western: "#5F8EB0",
			animation: "#DC3C75",
			family: "#AF501A"
		}
	}

	const routes: RouteDefinition[] = [
		{
			path: "/",
			component: () => { navigate("/home", { resolve: false }); return (<></>) }
		},
		{
			path: "/home",
			component: HomePage
		},
		{
			path: "/search",
			component: SearchPage,
			children: [
				{
					path: "/:searchString",
					component: SearchPage
				}
			]
		},
		{
			path: "/tv",
			component: () => { navigate("/search", { resolve: false }); return (<></>) },
			children: [
				{
					path: "/:tvId",
					component: TvPage,
					children: [
						{
							path: "/:seasonId",
							component: SeasonPage
						}
					]
				}
			]
		},
		{
			path: "/movie",
			component: () => { navigate("/search", { resolve: false }); return (<></>) },
			children: [
				{
					path: "/:movieId",
					component: MoviePage
				}
			]
		},
		{
			path: "/list",
			component: ShowsPage
		}
	]


	// const Routes = useRoutes(routes)

	return (
		<>
			<ThemeProvider theme={darkTheme}>
				<StoreonProvider store={store}>
					<TmdbProvider>
						{/* <CacheProvider> */}
						<AppStyle>
							{/* <Routes /> */}
							<Routes>

								<Route path="/account">
									<Route path="/" component={() => { navigate("/home", { resolve: false }); return <></> }} />
									<Route path="/sign-in" component={SignInPage} />
									<Route path="/sign-up" component={SignUpPage} />
								</Route>

								<Route path="/home" component={HomePage} />

								<Route path="/search" >
									<Route path="/" component={SearchPage} />
									<Route path="/:searchString" >
										<Route path="/" component={SearchPage} />
									</Route>
								</Route>

								<Route path="/tv" >
									<Route path="/" component={() => { navigate("/search", { resolve: false }); return <></> }} />
									<Route path="/:tvId" >
										<Route path="/" component={TvPage} />
										<Route path="/:seasonId">
											<Route path="/" component={SeasonPage} />
										</Route>
									</Route>
								</Route>

								<Route path="/list" >
									<Route path="/" component={ShowsPage} />
								</Route>

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
			// backgroundColor: "inherit",
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


		// height: "calc(100% + 10vh)",
		height: "100%",
		minHeight: "100%",
		width: "100%",
		minWidth: "100%",
		display: "flex",
		flexDirection: "column",

		backgroundColor: props.theme?.main.main
	}
})