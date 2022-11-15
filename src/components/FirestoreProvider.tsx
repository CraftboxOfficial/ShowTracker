import { getAuth } from 'firebase/auth'
import { addDoc, collection, CollectionReference, deleteDoc, doc, DocumentData, DocumentReference, DocumentSnapshot, enableIndexedDbPersistence, FieldPath, getDoc, getDocs, getFirestore, increment, query, Query, QueryDocumentSnapshot, QuerySnapshot, setDoc, Timestamp, updateDoc, where, WhereFilterOp, WithFieldValue } from 'firebase/firestore'
import { useFirebaseApp, useAuth } from 'solid-firebase';
import { Component, createContext, useContext, JSXElement, Show, createSignal, createEffect } from 'solid-js'
import { TrackedShow, DBUser, SetTrackedShow, TrackList, SetTrackList, DBSetShow, DBShow, SetSeasonTrackList, SeasonTrackList, EpisodeTrackList, SetEpisodeTrackList } from 'src/db';

const FirestoreContext = createContext()

interface FirestoreContext {
	trackedShow: (tmdbId: number) => {
		getRef: () => DocumentReference<TrackedShow>
		updateDoc: (data: WithFieldValue<SetTrackedShow>) => void
		getSnap: () => Promise<DocumentSnapshot<TrackedShow>>
	}

	trackLists: () => {
		getCol: () => CollectionReference<TrackList>
		getQuerySnap: () => Promise<QuerySnapshot<TrackList>>
		getQuery: (whereSel?: { fieldPath: string | FieldPath, opStr: WhereFilterOp, value: unknown }) => Query<TrackList>
		/**
		 * Returns methods for manipulating single track list
		 */
		single: (trackListId?: string) => {
			getRef: () => DocumentReference<TrackList>
			updateDoc: (data: WithFieldValue<SetTrackList>) => void
			deleteDoc: () => void
			getSnap: () => Promise<DocumentSnapshot<TrackList>>
		}
	}

	shows: (trackListId: string) => {
		getCol: () => CollectionReference<DBShow>
		getQuerySnap: () => Promise<QuerySnapshot<DBShow>>
		getQuery: (whereSel?: { fieldPath: string | FieldPath, opStr: WhereFilterOp, value: unknown }) => Query<DBShow>
		/**
		 * Returns methods for manipulating single show in a track list
		 */
		single: (showId?: string, tmdbId?: number) => {
			getRef: () => DocumentReference<DBShow>
			updateDoc: (data: WithFieldValue<DBSetShow>) => void
			/**
			 * requires showId and tmdbId
			 */
			deleteDoc: () => void
			getSnap: () => Promise<DocumentSnapshot<DBShow>>
		}
	},

	seasons: (trackListId: string, showId: string) => {
		getCol: () => CollectionReference<SeasonTrackList>
		getQuerySnap: () => Promise<QuerySnapshot<SeasonTrackList>>
		getQuery: (whereSel?: { fieldPath: string | FieldPath, opStr: WhereFilterOp, value: unknown }) => Query<SeasonTrackList>

		single: (seasonNumber: number) => {
			getRef: () => DocumentReference<SeasonTrackList>
			updateDoc: (data: WithFieldValue<SetSeasonTrackList>) => void
			deleteDoc: () => void
			getSnap: () => Promise<DocumentSnapshot<SeasonTrackList>>
		}
	},

	episodes: (trackListId: string, showId: string, seasonNumber: number) => {
		getCol: () => CollectionReference<EpisodeTrackList>
		getQuerySnap: () => Promise<QuerySnapshot<EpisodeTrackList>>
		getQuery: (whereSel?: { fieldPath: string | FieldPath, opStr: WhereFilterOp, value: unknown }) => Query<EpisodeTrackList>

		single: (episodeNumber: number) => {
			getRef: () => DocumentReference<EpisodeTrackList>
			updateDoc: (data: WithFieldValue<SetEpisodeTrackList>) => void
			deleteDoc: () => void
			getSnap: () => Promise<DocumentSnapshot<EpisodeTrackList>>
		}
	}
}

export const FirestoreProvider: Component<{ children: JSXElement }> = (props) => {

	const app = useFirebaseApp()
	const db = getFirestore(app)
	const auth = getAuth()
	const authState = useAuth(auth)

	function createCollection<T = DocumentData>(path: string, ...pathSegments: string[]) {
		return collection(db, path, ...pathSegments) as CollectionReference<T>
	}

	const [ getLoading, setLoading ] = createSignal<boolean>(true)

	createEffect(() => {
		if (authState.data) {
			setLoading(false)
		}
	})

	enableIndexedDbPersistence(db)
		.catch((err) => {
			console.warn("Failed enabling offline persistance on firestore" + err)
			if (err.code == 'failed-precondition') {
				// Multiple tabs open, persistence can only be enabled
				// in one tab at a a time.
				// ...
			} else if (err.code == 'unimplemented') {
				// The current browser does not support all of the
				// features required to enable persistence
				// ...
			}
		});

	const firestoreFunctions: FirestoreContext = {
		trackedShow(tmdbId) {
			return {
				getRef() {
					const trackedShowsCol = createCollection<TrackedShow>("users", authState.data.uid, "trackedShows")
					return doc(trackedShowsCol, tmdbId.toString())
				},

				// updates or creates doc; dates are handled automatically
				async updateDoc(data) {
					const trackedShowSnap = await this.getSnap()

					if (trackedShowSnap.exists()) {
						updateDoc<SetTrackedShow>(this.getRef(), {
							...data,
							lastUpdatedOn: Timestamp.fromDate(new Date()),
						})

					} else {
						setDoc<SetTrackedShow>(this.getRef(), {
							favorite: false,
							notes: [],
							tags: [],
							watchthroughs: 0,
							...data,
							addedOn: Timestamp.fromDate(new Date()),
							lastUpdatedOn: Timestamp.fromDate(new Date()),
						})
					}
				},

				getSnap() {
					return getDoc(this.getRef())
				},
			}
		},

		trackLists() {
			return {
				getCol() {
					const trackListCol = createCollection<TrackList>("users", authState.data.uid, "trackLists")
					return trackListCol
				},

				getQuerySnap() {
					return getDocs(this.getCol())
				},

				getQuery(whereSel) {
					if (whereSel) {
						return query(this.getCol(), where(whereSel.fieldPath, whereSel.opStr, whereSel.value))
					}

					return query(this.getCol())
				},

				single(trackListId) {
					const trackLists = firestoreFunctions.trackLists()

					return {
						getRef() {
							return doc(trackLists.getCol(), trackListId)
						},

						async updateDoc(data) {
							if (trackListId) {

								// const trackSnap = await this.getSnap()

								// if (trackSnap.exists()) {
								const a = updateDoc<SetTrackList>(this.getRef(), {
									...data,
									lastUpdatedOn: Timestamp.fromDate(new Date()),
								})

								// console.log(Timestamp.fromDate(new Date()))
								// console.log(a)
								// }

							} else {
								addDoc<SetTrackList>(trackLists.getCol(), {
									name: "",
									description: "",
									cover: null,
									favorite: false,
									notes: [],
									tags: [],
									...data,
									createdOn: Timestamp.fromDate(new Date()),
									lastUpdatedOn: Timestamp.fromDate(new Date()),
								})
							}
						},

						deleteDoc() {
							if (trackListId) {
								deleteDoc(this.getRef())
							}
						},

						getSnap() {
							return getDoc(this.getRef())
						},
					}
				},
			}
		},

		shows(trackListId) {
			// console.log(trackListId)

			return {
				getCol() {
					const showsCol = createCollection<DBShow>("users", authState.data.uid, "trackLists", trackListId, "shows")
					return showsCol
				},

				getQuerySnap() {
					return getDocs(this.getCol())
				},

				getQuery(whereSel) {
					if (whereSel) {
						return query(this.getCol(), where(whereSel.fieldPath, whereSel.opStr, whereSel.value))
					}

					return query(this.getCol())
				},

				single(showId, tmdbId) {
					const shows = firestoreFunctions.shows(trackListId)

					// console.log(showId + " " + tmdbId)

					return {
						getRef() {
							return doc(shows.getCol(), showId)
						},

						async updateDoc(data) {
							if (showId) {

								// const trackSnap = await this.getSnap()

								// if (trackSnap.exists()) {
								updateDoc<DBSetShow>(this.getRef(), {
									...data,
									lastUpdatedOn: Timestamp.fromDate(new Date()),
								})

								// }

							} else if (tmdbId) {

								let watchthroughs = 0;

								(await shows.getQuerySnap()).forEach((r) => {
									if (r.data().tmdbId == tmdbId) {
										watchthroughs++
									}
								})

								firestoreFunctions.trackedShow(tmdbId).updateDoc({
									watchthroughs: increment(1)
								})

								addDoc<DBSetShow>(shows.getCol(), {
									localWatchthrough: watchthroughs + 1,
									notes: [],
									tmdbId: tmdbId,
									watchStatus: [],
									...data,
									addedOn: Timestamp.fromDate(new Date()),
									lastUpdatedOn: Timestamp.fromDate(new Date()),
								})
							}
						},

						deleteDoc() {
							if (showId && tmdbId) {
								firestoreFunctions.trackedShow(tmdbId).updateDoc({
									watchthroughs: increment(-1)
								})

								shows.getQuerySnap().then((v) => {
									const showToDeletion = v.docs.find((v) => v.id == showId) as QueryDocumentSnapshot<DBShow>

									v.forEach((r) => {
										if (r.data().localWatchthrough > showToDeletion?.data().localWatchthrough) {

											shows.single(r.id).updateDoc({
												localWatchthrough: increment(-1)
											})
										}
									})
								})

								deleteDoc(this.getRef())

							} else {
								console.warn("Missing showId or tmdbId for successful deletion")
							}
						},

						getSnap() {
							return getDoc(this.getRef())
						},
					}
				},
			}
		},

		seasons(trackListId, showId) {
			return {
				getCol() {
					const seasonTrackListCol = createCollection<SeasonTrackList>("users", authState.data.uid, "trackLists", trackListId, "shows", showId, "seasons")
					return seasonTrackListCol
				},

				getQuerySnap() {
					return getDocs(this.getCol())
				},

				getQuery(whereSel) {
					if (whereSel) {
						return query(this.getCol(), where(whereSel.fieldPath, whereSel.opStr, whereSel.value))
					}

					return query(this.getCol())
				},

				single(seasonNumber) {
					const seasons = firestoreFunctions.seasons(trackListId, showId)

					return {
						getRef() {
							return doc(seasons.getCol(), seasonNumber.toString())
						},

						getSnap() {
							return getDoc(this.getRef())
						},

						async updateDoc(data) {
							if ((await this.getSnap()).exists()) {
								updateDoc<SetSeasonTrackList>(this.getRef(), {
									...data,
									lastUpdatedOn: Timestamp.fromDate(new Date()),
								})

								return
							}

							setDoc<SetSeasonTrackList>(this.getRef(), {
								notes: [],
								...data,
								addedOn: Timestamp.fromDate(new Date()),
								lastUpdatedOn: Timestamp.fromDate(new Date()),
							})
						},

						deleteDoc() {
							deleteDoc(this.getRef())
						},
					}
				},
			}
		},

		episodes(trackListId, showId, seasonNumber) {
			return {
				getCol() {
					// console.log(trackListId, showId, seasonNumber)
					const episodesTrackListCol = createCollection<EpisodeTrackList>("users", authState.data.uid, "trackLists", trackListId, "shows", showId, "seasons", seasonNumber.toString(), "episodes")
					return episodesTrackListCol
				},

				getQuerySnap() {
					return getDocs(this.getCol())
				},

				getQuery(whereSel) {
					if (whereSel) {
						return query(this.getCol(), where(whereSel.fieldPath, whereSel.opStr, whereSel.value))
					}

					return query(this.getCol())
				},

				single(episodeNumber) {
					const episodes = firestoreFunctions.episodes(trackListId, showId, seasonNumber)

					return {
						getRef() {
							return doc(episodes.getCol(), episodeNumber.toString())
						},

						getSnap() {
							return getDoc(this.getRef())
						},

						async updateDoc(data) {
							if ((await this.getSnap()).exists()) {
								updateDoc<SetEpisodeTrackList>(this.getRef(), {
									...data,
									lastUpdatedOn: Timestamp.fromDate(new Date()),
								})

								return
							}

							if ((await firestoreFunctions.seasons(trackListId, showId).getQuerySnap()).empty) {
								firestoreFunctions.seasons(trackListId, showId).single(seasonNumber).updateDoc({})
							}

							setDoc<SetEpisodeTrackList>(this.getRef(), {
								status: "notWatched",
								notes: [],
								...data,
								// addedOn: Timestamp.fromDate(new Date()),
								lastUpdatedOn: Timestamp.fromDate(new Date()),
							})
						},

						deleteDoc() {
							deleteDoc(this.getRef())
						},
					}
				},
			}
		},

	}


	return (
		<FirestoreContext.Provider value={firestoreFunctions}>
			<Show when={!getLoading()}>
				{props.children}
			</Show>
		</FirestoreContext.Provider>
	)
}

export function useFirestore() {
	return useContext(FirestoreContext) as FirestoreContext
}