import { useNavigate, useParams } from '@solidjs/router';
import { Accessor, Component, createEffect, createSignal, JSX, Setter, Show, onMount } from 'solid-js';
import { styled } from 'solid-styled-components';
import { MediaType } from '../common/MediaType';
import { useTmdb } from '../../components/TmdbProvider';
import { TMDBConfigurationGetApiConfiguration, TMDBSearchMultiSearchMovie, TMDBSearchMultiSearchTv } from '../../tmdb';
import { BiRegularLoaderAlt, BiRegularStar } from 'solid-icons/bi';
import { ImageLoader } from '../common/ImageLoader';
import { bigNumberShortener, getTextDate } from '../common/methods';
import { Line } from '../common/Line';
import { useFirebaseApp, useAuth } from 'solid-firebase';
import { doc, DocumentSnapshot, getDoc, getFirestore, onSnapshot, setDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { TrackedShow } from 'src/db';
import { useFirestore } from '../../components/FirestoreProvider';

export interface SearchCardTvI {
	backdropPath: string,
	firstAirDate: string,
	genreIds: number[]
	id: number,
	mediaType: "tv",
	name: string,
	originalCountry: string[],
	originalLanguage: string,
	originalName: string,
	overview: string,
	popularity: number,
	posterPath: string,
	voteAverage: number,
	voteCount: number
}

export interface SearchCardMovieI {
	backdropPath: string,
	firstAirDate: string,
	genreIds: number[]
	id: number,
	mediaType: "tv",
	name: string,
	originalCountry: string[],
	originalLanguage: string,
	originalName: string,
	overview: string,
	popularity: number,
	posterPath: string,
	voteAverage: number,
	voteCount: number
}

type InfoViewI = "overview" | "details"

interface SearchCard extends HTMLDivElement {
	card: (SearchCardTvI | SearchCardMovieI | undefined)
}
export const SearchCard: Component<{ card: (TMDBSearchMultiSearchTv | TMDBSearchMultiSearchMovie), class?: string }> = (props) => {

	const app = useFirebaseApp()
	const db = getFirestore(app)
	const auth = getAuth()
	const authState = useAuth(auth)

	const fireDb = useFirestore()
	const tmdb = useTmdb()

	const navigate = useNavigate()

	const [ isFav, setIsFav ] = createSignal(false)
	const [ loaded, setLoaded ] = createSignal(false)

	createEffect(() => {
		// console.log(authState.data)
		if (authState.data) {
			const trackedShowRef = fireDb.getTrackedShowRef(props.card.id)

			const unsub = onSnapshot(trackedShowRef, (doc) => {
				console.log(doc.id + " Fav state: " + doc.data()?.favorite)
				setIsFav(doc.data()?.favorite || false)
			})

			setLoaded(true)
		}
	})


	const favButton: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = async (e) => {
		e.stopPropagation()

		// console.log(useAuth(auth))
		// const trackedShowRef = doc(db, "users", authState.data.uid, "trackedShows", props.card.id.toString())
		const trackedShowRef = fireDb.getTrackedShowRef(props.card.id)

		const trackedShowSnap = await getDoc(trackedShowRef)

		// console.log(trackedShowSnap)
		if (!trackedShowSnap.exists()) {
			console.log("doc doesn't exist; creating one")
			setDoc(trackedShowRef, {
				addedOn: Timestamp.fromDate(new Date()),
				favorite: true,
				lastUpdatedOn: Timestamp.fromDate(new Date()),
				tags: [],
				watchthroughs: 0
			} as TrackedShow)

		} else {
			if (trackedShowSnap.data().favorite) {
				console.log("set fav to false")
				setDoc(trackedShowRef, {
					favorite: false
				} as TrackedShow, { merge: true })

			} else {
				console.log("set fav to true")
				setDoc(trackedShowRef, {
					favorite: true
				} as TrackedShow, { merge: true })
			}
		}
	}

	return (
		<>
			<Show when={loaded()}>
				<SearchCardStyle
					class={props.class}
					onClick={(e) => {
						navigate(`${props.card.media_type}/${props.card?.id}`, { resolve: false })
					}}>
					<div class="show-poster">
						<ImageLoader class="show-image" data={{
							priority: 13,
							query: {
								path: props.card?.poster_path,
								imageType: "poster",
								size: 1
							}
						}} />
					</div>

					<div class="show-content" >
						<span class="show-title">{props.card.media_type == "tv" ? props.card.name : props.card.title}</span>
						<Line class="show-content-line" />
						<div class="show-content-bottom">
							<div class="show-info">
								<MediaType type={props.card.media_type} />
								<span class="air-date">{getTextDate(props.card.media_type == "tv" ? props.card.first_air_date : props.card.release_date)}</span>
							</div>
							<div class="show-stats">
								<div class="show-vote">
									<BiRegularStar class="show-vote-ico" size={16} />
									<span class="show-vote-text">{props.card.vote_average} / {bigNumberShortener(props.card.vote_count)}</span>
								</div>
								<button onClick={favButton}>Fav {isFav() ? "yes" : "no"}</button>
							</div>
						</div>
					</div>
				</SearchCardStyle>
			</Show>
		</>
	)
}

const SearchCardStyle = styled("div")((props) => {
	return {
		marginTop: "20px",
		height: "12em",
		borderRadius: "10px",

		backgroundColor: props.theme?.card.main,

		display: "flex",
		flexDirection: "row",

		zIndex: "inherit",

		".show-poster": {
			height: "12em",
			width: "8em",
			minWidth: "8em",
			borderRadius: "10px",

			// img: {
			// 	height: "100%",
			// 	width: "8em",
			// 	borderRadius: "10px",
			// 	boxShadow: "8px 0 4px 0 #00000019",

			// }

			".show-image": {
				height: "100%",
				width: "8em",
				borderRadius: "10px",
				boxShadow: "8px 0 4px 0 #00000019",
			},
		},

		".show-content": {
			width: "100%",
			padding: "1.4em 1.8em",
			display: "flex",
			flexDirection: "column",

			".show-title": {
				fontSize: "1.4em",
				color: props.theme?.main.text
			},

			".show-content-line": {
				margin: "0.8em 0"
			},

			// hr: {
			// 	height: "0.1em",
			// 	// borderWidth: "1px",
			// 	border: "none",
			// 	backgroundColor: props.theme?.card.accent
			// },

			".show-content-bottom": {
				display: "flex",
				flexDirection: "column",
				height: "100%",
				justifyContent: "space-between",

				padding: "0 1em",

				// ".show-info": {
				// 	padding: "0 1em"
				// },

				".show-stats": {
					// justifySelf: "flex-end",
					// height: "1em",
					// marginTop: "1em",
					".show-vote": {
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						// textAlign: "center",

						fontSize: "1.1em",

						color: props.theme?.card.highlight,
						fontWeight: "bolder",

						".show-vote-ico": {
							height: "calc(0.1em * 16)",
							width: "calc(0.1em * 16)",
						},

						".show-vote-text": {
							height: "1em",
							marginLeft: "0.5em"
						}
						// textAlign: "center"
					}
				}
			}

		},

		".show-info": {
			display: "flex",
			flexDirection: "row",

			justifyContent: "space-between",
			alignItems: "center",

			".air-date": {
				fontSize: "1.2em",
				fontWeight: "bolder",
				color: props.theme?.card.highlight
			}
		}
	}
})