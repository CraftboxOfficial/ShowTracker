import { Component, JSX } from 'solid-js';
import { styled } from 'solid-styled-components';
export const Button: Component<JSX.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
	return (
		<>
			<ButtonStyle {...props}>{props.children}</ButtonStyle>
		</>
	)
}

const ButtonStyle = styled("button")(() => {
	return ({
		background: "none",
		border: "none",
		outline: "none",
		color: "white", // TODO set to theme
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "stretch",

		transition: "all 150ms",

		"&:hover": {
			scale: "0.97",
			filter: "brightness(90%)", // TODO set to theme

			// transition: "all 100ms"
		},

		"&:active": {
			// boxShadow: "0px 0px -10px 0px black",
			scale: "0.95",
			filter: "brightness(50%)", // TODO set to theme

			// transition: "all 200ms"
		}

	})
})