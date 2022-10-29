import { BiRegularLeftArrowAlt } from "solid-icons/bi";
import { Component } from "solid-js";
import { styled } from 'solid-styled-components';

export const BackButton: Component = () => {
	return (
		<>
			<BackButtonStyle onClick={(e) => {
				window.history.back()
			}}>
				<BiRegularLeftArrowAlt id="back-ico" size={24} />
			</BackButtonStyle>
		</>
	)
}

const BackButtonStyle = styled("button")((props) => {
	return {
		position: "absolute",

		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",

		backgroundColor: props.theme?.card.main,
		borderRadius: "50%",

		outline: `1px solid ${props.theme?.card.accent}`,

		color: props.theme?.card.highlight,

		top: "1em",
		left: "1em",

		"#back-ico": {
			padding: "1em",
			height: "calc(0.1em * 24)",
			width: "calc(0.1em * 24)",
		}
	}
})