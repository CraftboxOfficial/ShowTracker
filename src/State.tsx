import { createStoreon, StoreonModule } from 'storeon';

export interface State {
	interface: {
		selectedPage: Pages
	}
}

export type Pages = "home" | "search" | "shows"

export interface Events {
	setSelectedPage: Pages
}

const state: StoreonModule<State, Events> = store => {
	store.on("@init", (state: State) => ({
		interface: {
			selectedPage: "home"
		}
	}))

	store.on("setSelectedPage", (state: State, events: Events[ "setSelectedPage" ]) => {
		state.interface.selectedPage = events
		// console.log(state)
		// return state
	})
}

export const store = createStoreon([ state ])