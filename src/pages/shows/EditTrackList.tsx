import { DocumentReference, DocumentSnapshot, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore'
import { Component, createEffect, createSignal, Show } from 'solid-js'
import { styled } from 'solid-styled-components'
import { useFirestore } from '../../components/FirestoreProvider'
import { SetTrackList, TrackList } from 'src/db'
import { useLocation } from '@solidjs/router';

export const EditTrackList: Component<{}> = (props) => {

	const db = useFirestore()
	const location = useLocation<{ docId: string }>()

	const [ getDoc, setDoc ] = createSignal<DocumentSnapshot<TrackList>>();

	// @ts-expect-error
	const [ getTrackList, setTrackList ] = createSignal<SetTrackList>(getDoc() ? getDoc()?.data() : {
		description: "",
		name: "",
	});

	// const doc = location.state ? JSON.parse(location.state) as QueryDocumentSnapshot<TrackList> : undefined
	(async () => {
		const doc = await db.trackLists().single(location.state?.docId).getSnap()
		// console.log(doc)
		setDoc(doc)
		// @ts-expect-error
		setTrackList(doc?.data())
	})()



	createEffect(() => {
		// console.log(getTrackList())
	})

	return (
		<AddTrackListStyle>
			<span>Add Track List</span>
			<br />
			<span>Name: </span>
			<input value={getTrackList().name} onInput={(e) => {
				setTrackList((prev: SetTrackList) => {
					return {
						...prev,
						name: e.currentTarget.value
					}
				})
			}}></input>
			<br />
			<span>Desc: </span>
			<textarea value={getTrackList().description} onInput={(e) => {
				setTrackList((prev: SetTrackList) => {
					return {
						...prev,
						description: e.currentTarget.value
					}
				})
			}}></textarea>
			<button onClick={(e) => {
				if (getDoc() && getDoc()?.id) {
					db.trackLists().single(getDoc()?.id).updateDoc(getTrackList())
				} else {
					db.trackLists().single().updateDoc(getTrackList())
					e.currentTarget.disabled = true
				}
			}}>Save</button>
			<Show when={getDoc()}>
				<button onClick={(e) => {
					db.trackLists().single(getDoc()?.id).deleteDoc()
					window.history.back()
				}}>Delete</button>
			</Show>
		</AddTrackListStyle>
	)
}

const AddTrackListStyle = styled('div')((props) => {

	return ({
		height: "inherit",
		color: "white"
	})
})