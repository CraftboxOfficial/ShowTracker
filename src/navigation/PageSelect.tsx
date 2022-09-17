import { useStoreon } from "@storeon/solidjs";
import { Accessor, Component, createEffect, createSignal, Setter, Show } from "solid-js";
import { styled } from 'solid-styled-components';
import { Button } from "../components/Button";
import { Events, State, Pages } from "../State";
import { produce } from "solid-js/store";
import { useNavigate } from "@solidjs/router";
export const PageSelect: Component = () => {

	// const [ store, dispatch ] = useStoreon<State, Events>()
	// const [ getSelectedPage, setSelectedPage ] = createSignal(store)

	// createEffect(() => {
	// console.log(getSelectedPage())
	// })

	const [ selectedPage, setSelectedPage ]: [ Accessor<Pages>, Setter<Pages> ] = createSignal("home")
	const navigate = useNavigate()

	return (
		<>
			<TabSelectStyle>
				<Button onClick={(e) => {
					setSelectedPage("home")
					navigate("/")
				}}>
					<Show when={selectedPage() == "home"} fallback={
						<img src="/src/assets/icons/settings.svg" />
					}>
						<img src="/src/assets/icons/search.svg" />
					</Show>
					<span>Home</span>
				</Button>

				<Button onClick={(e) => {
					setSelectedPage("search")
					navigate("/search")
				}}>
					<Show when={selectedPage() == "search"} fallback={
						<img src="/src/assets/icons/settings.svg" />
					}>
						<img src="/src/assets/icons/search.svg" />
					</Show>
					<span>Search</span>
				</Button>

				<Button onClick={(e) => {
					setSelectedPage("shows")
					navigate("/shows")
				}}>
					<Show when={selectedPage() == "shows"} fallback={
						<img src="/src/assets/icons/settings.svg" />
					}>
						<img src="/src/assets/icons/search.svg" />
					</Show>
					<span>Shows</span>
				</Button>
			</TabSelectStyle>
		</>
	)
}

const TabSelectStyle = styled("div")(() => {
	return {
		height: "80px",
		maxHeight: "8vh",
		width: "100%",
		backgroundImage: "linear-gradient(rgba(0%, 0%, 0%, 0%), rgba(0%, 0%, 0%, 50%))", // TODO set to theme
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-around",
		fontSize: "smaller",
		// position: "absolute",
		// bottom: "0px",


		button: {
			// margin: "0 3%",
			aspectRatio: "1 / 1",
			margin: "5px 0"
		},
		img: {
			maxHeight: "75%"
		}
	}
})