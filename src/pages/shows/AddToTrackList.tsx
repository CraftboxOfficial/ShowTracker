import { onSnapshot, QueryDocumentSnapshot } from 'firebase/firestore'
import { Component, createSignal, For, onMount } from 'solid-js'
import { styled } from 'solid-styled-components'
import { useFirestore } from '../../components/FirestoreProvider'
import { TrackList } from 'src/db'
import { useLocation } from '@solidjs/router';

export const AddToTrackList: Component<{}> = (props) => {

	const db = useFirestore()

	const location = useLocation<{ tmdbId: number }>()

	const tmdbId = location.state?.tmdbId
	console.log(tmdbId)

	const [ getTrackLists, setTrackLists ] = createSignal<QueryDocumentSnapshot<TrackList>[]>([])

	onMount(async () => {
		const q = db.trackLists().getQuery()

		const unsub = onSnapshot(q, (snapshot) => {
			snapshot.forEach((r) => {
				setTrackLists((prev) => [ ...prev, r ])
			})
		})
	})

	return (
		<AddToTrackListStyle>
			<span>Add to track list</span>
			<form id="select-list" onSubmit={(e) => {
				e.preventDefault()
				const form = document.querySelector("#select-list") as HTMLFormElement
				const selectedTrackListId = ((new FormData(form)).get("select-list"))?.toString()
				// console.log(data)
				// for (const entry of data) {
				// 	console.log(entry)
				// }
				// console.log(selectedTrackListId)
				if (selectedTrackListId) {
					// console.log(selectedTrackListId)
					db.shows(selectedTrackListId).single(undefined, tmdbId).updateDoc({
						tmdbId: tmdbId
					})
				}

				console.log(e.currentTarget)
			}}>
				<For each={getTrackLists()}>
					{(trackList) => (
						<>
							<input value={`${trackList.id}`} name="select-list" type="radio"></input>
							<label>{trackList.data().name}</label>
						</>
					)}
				</For>
				<button type="submit">Add</button>
			</form>
		</AddToTrackListStyle>
	)
}

const AddToTrackListStyle = styled('div')((props) => {

	return ({
		height: "inherit",
		color: "white",
		display: "flex",
		flexDirection: "column"
	})
})