import { getAuth } from 'firebase/auth'
import { collection, CollectionReference, doc, DocumentData, DocumentReference, getFirestore } from 'firebase/firestore'
import { useFirebaseApp, useAuth } from 'solid-firebase';
import { Component, createContext, useContext, JSXElement } from 'solid-js'
import { TrackedShow, DBUser } from 'src/db';

const FirestoreContext = createContext()

interface FirestoreContext {
	getTrackedShowRef: (tmdbId: number) => DocumentReference<TrackedShow>
}

export const FirestoreProvider: Component<{ children: JSXElement }> = (props) => {

	const app = useFirebaseApp()
	const db = getFirestore(app)
	const auth = getAuth()
	const authState = useAuth(auth)

	function createCollection<T = DocumentData>(path: string, ...pathSegments: string[]) {
		return collection(db, path, ...pathSegments) as CollectionReference<T>
	}

	const firestoreFunctions: FirestoreContext = {
		getTrackedShowRef(tmdbId) {
			// const trackedShowsCol = collection(db, "users", authState.data.uid, "trackedShows") as CollectionReference<TrackedShow>
			const trackedShowsCol = createCollection<TrackedShow>("users", authState.data.uid, "trackedShows")
			return doc(trackedShowsCol, tmdbId.toString())
		},
	}


	return (
		<FirestoreContext.Provider value={firestoreFunctions}>
			{props.children}
		</FirestoreContext.Provider>
	)
}

export function useFirestore() {
	return useContext(FirestoreContext) as FirestoreContext
}