import { getAuth } from "firebase/auth";
import { doc, getFirestore, onSnapshot, QueryDocumentSnapshot, QuerySnapshot } from "firebase/firestore";
import { useAuth, useFirebaseApp } from 'solid-firebase';
import { Component, createEffect, Show, createSignal, onMount, For } from 'solid-js';
import { styled } from 'solid-styled-components';
import { useNavigate } from '@solidjs/router';
import { useFirestore } from "../components/FirestoreProvider";
import { TrackList, DBShow } from 'src/db';

export const ShowsPage: Component = () => {

	const app = useFirebaseApp()
	const db = getFirestore(app)
	const auth = getAuth()

	const fireDb = useFirestore()

	// useAuth(auth).data.displayName
	const authState = useAuth(auth)

	const navigate = useNavigate()

	// const [trackedShows, setTrackedShows] = createSignal()

	// createEffect(() => {
	// 	setTrackedShows()
	// })

	// createEffect(() => {
	// 	if (fireDb.trackList().getCol()) {
	// 		console.log(fireDb.trackList().getCol())
	// 	}
	// })

	const [ getTrackLists, setTrackLists ] = createSignal<QueryDocumentSnapshot<TrackList>[]>([])
	const [ getTrackListShows, setTrackListShows ] = createSignal<Map<string, QueryDocumentSnapshot<DBShow>[]>>(new Map())
	// const [ getShows, setShows ] = createSignal<QueryDocumentSnapshot<DBShow>[]>([])


	const [ getLoading, setLoading ] = createSignal<boolean>(true)

	const map = () => new Map<string, QueryDocumentSnapshot<DBShow>[]>()

	onMount(() => {
		const q = fireDb.trackLists().getQuery()

		const unsub = onSnapshot(q, (snapshot) => {
			snapshot.forEach((r) => {
				setTrackLists((prev) => [ ...prev, r ])

				// const unsub2 = onSnapshot(fireDb.shows(r.id).getQuery(), (snap) => {
				// 	let showsArr: QueryDocumentSnapshot<DBShow>[] = []
				// 	snap.forEach((r) => {
				// 		showsArr.push(r)
				// 	})
				// 	setTrackListShows((prev) => prev.set(r.id, showsArr))
				// })


			})

			// setLoading(false)
		})

	})

	// onMount(() => {
	// 	const q = fireDb.shows("3nQjCQvSp8T3QPxwTCSg").getQuery()

	// 	const unsub = onSnapshot(q, (snap) => {
	// 		let showsArr: QueryDocumentSnapshot<DBShow>[] = []
	// 		snap.forEach((r) => {
	// 			showsArr.push(r)
	// 		})

	// 		// setShows(showsArr)
	// 		map().set("3nQjCQvSp8T3QPxwTCSg", showsArr)
	// 	})
	// })

	createEffect(() => {
		if (getTrackLists().length > 0) {

			getTrackLists().forEach((r) => {
				const unsub = onSnapshot(fireDb.shows(r.id).getQuery(), (snap) => {
					let showsArr: QueryDocumentSnapshot<DBShow>[] = []
					snap.forEach((r) => {
						showsArr.push(r)
					})
					setTrackListShows((prev) => prev.set(r.id, showsArr))
				})
			})

			console.log(getTrackListShows())
		}
	})

	// console.log(getTrackListShows())
	// })

	createEffect(() => {
		if (authState.data) {
			// console.log(authState.data.uid)
		}
	})

	createEffect(() => {
		console.log(getTrackListShows())
		// console.log(getTrackListShows().get(trackList.id))
	})
	return (
		<>
			<HomePageStyle>
				{/* <Show when={!getLoading()}> */}
				<span>Shows Page</span>
				<button onClick={(e) => {
					navigate("./add-list")
				}}>Add Track List</button>
				{/* <Show when={authState.data}> */}
				{/* {console.log(auth.currentUser?.uid)} */}
				{/* <span>{authState.data.email}</span> */}
				{/* </Show> */}
				<For each={getTrackLists()}>
					{(trackList) => {
						// console.log(getTrackListShows())

						const q = fireDb.shows(trackList.id).getQuery()

						const [ getShows, setShows ] = createSignal<QueryDocumentSnapshot<DBShow>[]>([])


						const unsub = onSnapshot(q, (snap) => {
							let showsArr: QueryDocumentSnapshot<DBShow>[] = []
							snap.forEach((r) => {
								showsArr.push(r)
							})

							setShows(showsArr)
							// map().set("3nQjCQvSp8T3QPxwTCSg", showsArr)
						})

						return (
							<div>
								<span>{trackList.data().name}</span>
								<button onClick={(e) => {
									navigate("./edit-list", { state: { docId: trackList.id } })
								}}>Edit</button>
								<div>
									<For each={getShows()}>
										{(show) => {
											console.log(show)
											return (
												<div class="show">
													<span>tmdbId: {show.data().tmdbId}</span>
													<span>watchthrough: {show.data().localWatchthrough}</span>
													<button onClick={(e) => {
														fireDb.shows(trackList.id).single(show.id, show.data().tmdbId).deleteDoc()
													}}>REMOVE</button>
												</div>
											)
										}}
									</For>
								</div>
							</div>
						)
					}}
				</For>
				{/* </Show> */}
			</HomePageStyle>
		</>
	)
}

const HomePageStyle = styled("div")(() => {
	return {
		height: "inherit",
		color: "white",
		display: "flex",
		flexDirection: "column",
		fontSize: "1.2em",
		"div": {
			marginTop: "0.5em"
		},

		".show": {
			display: "flex",
			flexDirection: "column"
		}
	}
})