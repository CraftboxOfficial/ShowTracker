import { Component, JSXElement, onCleanup, onMount, createSignal, createEffect, children } from 'solid-js';
import { styled } from 'solid-styled-components';

export const Scroll: Component<{ children: JSXElement, id?: string, scrollId: string, options: { scrollY?: boolean, scrollX?: boolean, returnToStart?: boolean } }> = (props) => {

	let target: HTMLElement

	// const [ pointerDown, setPointerDown ] = createSignal(false)
	// const [ scrollY, setScrollY ] = createSignal(0)
	// const [ scrollX, setScrollX ] = createSignal(0)

	// const [ currentChildren, setCurrentChildren ] = createSignal(props.children)


	const pointerMoveScroll = (e: PointerEvent) => {
		// @ts-expect-error
		const path = e.path as EventTarget[] || e.composedPath()


		if (path.includes(target)) {

			if (props.options.scrollY || false) {
				target?.scrollBy({ top: -e.movementY })
				// setScrollY(e.movementY)

				// if (e.movementY > 5 || e.movementY < -5) {
				// 	console.log(e)
				// }
			}

			if (props.options.scrollX || false) {
				// target.scrollTo({ left: 0, top: 0, behavior: "smooth" })
				target?.scrollBy({ left: -e.movementX })
				// setScrollX(e.movementX)
			}
		}
	}

	const scrollToTop = (e: Event) => {
		target.scrollTo({ left: 0, top: 0, behavior: "smooth" })
	}

	onMount(() => {
		target = document.querySelector(`.${props.scrollId}-scroll`) as HTMLElement

		window.addEventListener("pointermove", pointerMoveScroll)

		if (props.options.returnToStart) {
			window.addEventListener("change", scrollToTop)
		}
	})

	onCleanup(() => {
		window.removeEventListener("pointermove", pointerMoveScroll)

		if (props.options.returnToStart) {
			window.removeEventListener("change", scrollToTop)
		}
	})

	// TODO return to scroll position when going back
	// TODO add smooth scroll ending when fast scrolling
	// TODO add custom scroll bar

	return (
		<>
			<ScrollStyle class={`${props.scrollId}-scroll`} id={`${props.id}`}>
				{props.children}
			</ScrollStyle>
		</>
	)
}

const ScrollStyle = styled("div")(() => {
	return {
		display: "inherit",
		touchAction: "none",
		overflow: "hidden",
	}
})