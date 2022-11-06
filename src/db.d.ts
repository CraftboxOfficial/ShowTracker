import { CollectionGroup, Timestamp } from "@google-cloud/firestore"

interface DBUser {
	displayName: string | null
	email: string
	photo: Blob | null
	photoURL: string | null
	createdOn: Timestamp
	search?: undefined // to implement
	trackLists?: undefined // to implement
	trackedShows?: CollectionGroup<TrackedShow>
}

interface TrackedShow {
	addedOn: Timestamp
	lastUpdatedOn: Timestamp
	tags: string[]
	notes?: CollectionGroup<Note>
	watchthroughs: number
	favorite: boolean
}

interface TrackList {

}

interface Note {
	title: string
	description: string
	createdOn: Timestamp
	lastUpdatedOn: Timestamp
}