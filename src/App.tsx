import { Component, useContext } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';
import { Route, Routes } from '@solidjs/router';
import { HomePage } from './pages/Home';
import { styled } from 'solid-styled-components';
import { PageSelect } from './navigation/PageSelect';
import { StoreonProvider } from '@storeon/solidjs';
import { store } from './State';
import { SearchPage } from './pages/Search';
import { ShowsPage } from './pages/Shows';

const App: Component = () => {

	// const app = useApp()

	return (
		<>
			<StoreonProvider store={store}>
				<AppStyle>
					<Routes>
						<Route path="/" component={HomePage} />
						<Route path="/search" component={SearchPage} />
						<Route path="/shows" component={ShowsPage} />
					</Routes>
					<PageSelect />
				</AppStyle>
			</StoreonProvider>
		</>
	);
};

export default App;

const AppStyle = styled("div")(() => {
	return {
		height: "100%",
		minHeight: "100%",
		width: "100%",
		minWidth: "100%",
		display: "flex",
		flexDirection: "column",
		backgroundColor: "rgb(10%, 10%, 10%)"
	}
})