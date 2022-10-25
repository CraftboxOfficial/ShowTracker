import { Accessor, Component, createMemo, createSignal, createEffect, onMount } from 'solid-js';
import { styled } from 'solid-styled-components';
import { BiRegularHomeAlt, BiRegularListUl, BiRegularSearchAlt } from 'solid-icons/bi'
import { useNavigate, useParams as useLocation } from '@solidjs/router';

export const NavBar: Component<{ selectedPage: Accessor<"home" | "search" | "list" | ""> }> = (props) => {


	const navigate = useNavigate()

	function navigateToPage(page: "home" | "search" | "list") {
		navigate(`/${page}`)
	}


	return (
		<>
			<NavBarStyle>
				<button
					id={"home-nav"}
					class={`nav-btn ${props.selectedPage() == "home" ? "nav-btn-selected" : ""}`}
					onClick={(e) => navigateToPage("home")}>

					<BiRegularHomeAlt class="nav-ico" size={24} />
					<span>home</span>

				</button>
				<button
					id={"search-nav"}
					class={`nav-btn ${props.selectedPage() == "search" ? "nav-btn-selected" : ""}`}
					onClick={(e) => navigateToPage("search")}>

					<BiRegularSearchAlt class="nav-ico" size={24} />
					<span>search</span>

				</button>
				<button
					id={"list-nav"}
					class={`nav-btn ${props.selectedPage() == "list" ? "nav-btn-selected" : ""}`}
					onClick={(e) => navigateToPage("list")}>

					<BiRegularListUl class="nav-ico" size={24} />
					<span>list</span>

				</button>
			</NavBarStyle>
		</>
	)
}

const NavBarStyle = styled("div")((props) => {
	return {
		fontSize: "inherit",

		height: "fit-content",
		maxHeight: "fit-content",
		width: "100%",
		backgroundColor: props.theme?.card.main,
		padding: "0.5em 0",
		borderRadius: "25px 25px 0px 0px",

		display: "flex",
		flexDirection: "row",
		justifyContent: "space-around",

		// borderWidth: "10px",
		// borderStyle: "solid",
		// borderImage: `linear-gradient(0deg, #555555FF, #55555540) 100% round`,
		// border: "10px solid",


		".nav-btn": {
			position: "relative",
			width: "3em",
			padding: "0 0.5em",

			background: "none",
			border: "none",
			color: props.theme?.card.highlight,

			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center"
		},

		".nav-ico": {
			height: "calc(0.1em * 24)",
			width: "calc(0.1em * 24)"
		},

		".nav-btn-selected": {
			color: props.theme?.card.highlight2,
		},

		".nav-btn-selected::after": {
			position: "absolute",
			borderRadius: "25px 25px 0px 0px",

			content: '""',

			width: "4em",
			height: "0.5em",

			bottom: "-0.5em",

			backgroundColor: props.theme?.card.highlight2,
		}
	}
})