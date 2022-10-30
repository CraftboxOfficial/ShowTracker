import { Component } from "solid-js";
import { styled } from 'solid-styled-components';

export const Line: Component<{ class?: string, id?: string }> = (props) => {
	return (
		<>
			<LineStyle class={props.class} id={props.id}>
			</LineStyle>
		</>
	)
}

const LineStyle = styled("div")((props) => {
	return {
		height: "0.2em",
		width: "inherit",
		borderRadius: "10px",
		backgroundColor: props.theme?.card.accent
	}
})