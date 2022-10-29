// import original module declarations
import "solid-styled-components";

// and extend them!
declare module "solid-styled-components" {
	export interface DefaultTheme {
		main: {
			text: string,
			main: string
		},

		card: {
			main: string,
			accent: string,
			highlight: string,
			highlight2: string,
			outlineTop: [ string, string ],
			outLineBottom: [ string, string ],
		},

		tv: {
			main: string,
			highlight: string
		},

		movie: {
			main: string,
			highlight: string
		},

		effects: {
			accept: string
		},

		tags: {
			fantasy: string
		},

		status: {
			airing: string,
			planned: string,
			pilot: string,
			inProduction: string,
			ended: string,
			canceled: string,
			unknown: string
		},

		genres: {
			text: string,
			actionAndAdventure: string,
			comedy: string,
			crime: string,
			documentary: string,
			drama: string,
			kids: string,
			mystery: string,
			news: string,
			reality: string,
			sciFiAndFantasy: string,
			soap: string,
			talk: string,
			warAndPolitics: string,
			western: string,
			animation: string
		}
	}
}