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

interface SetTrackedShow {
	addedOn?: Timestamp
	lastUpdatedOn?: Timestamp
	tags?: string[]
	notes?: Note[]
	watchthroughs?: number
	favorite?: boolean
}

interface TrackedShow {
	addedOn: Timestamp
	lastUpdatedOn: Timestamp
	tags: string[]
	notes: Note[]
	watchthroughs: number
	favorite: boolean
}

interface SetTrackList {
	name?: string
	description?: string
	cover?: Blob | null
	createdOn?: Timestamp
	lastUpdatedOn?: Timestamp
	tags?: string[]
	notes?: Note[]
	favorite?: boolean
}

interface TrackList {
	name: string
	description: string
	cover: Blob | null
	createdOn: Timestamp
	lastUpdatedOn: Timestamp
	tags: string[]
	notes: Note[]
	favorite: boolean
}

interface DBSetShow {
	addedOn?: Timestamp
	lastUpdatedOn?: Timestamp
	tmdbId?: number
	watchStatus?: Status[]
	localWatchthrough?: number
	notes?: Note[]
}

interface DBShow {
	addedOn: Timestamp
	lastUpdatedOn: Timestamp
	tmdbId: number
	watchStatus: Status[]
	localWatchthrough: number
	notes: Note[]
}

interface Status {
	type: "toWatch" | "watching" | "completed" | "onHold" | "dropped"
	setOn: Timestamp
}
interface Note {
	title: string
	description: string
	createdOn: Timestamp
	lastUpdatedOn: Timestamp
}