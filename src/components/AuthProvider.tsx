import { EmailAuthProvider, getAuth, linkWithCredential, signInAnonymously, signInWithEmailAndPassword, User } from 'firebase/auth'
import { doc, getFirestore, setDoc, Timestamp } from 'firebase/firestore';
import { useAuth, useFirebaseApp } from 'solid-firebase'
import { Component, createContext, useContext, JSXElement, onMount, createEffect } from 'solid-js';
import { DBUser } from 'src/db';

const AuthContext = createContext()

interface AuthContext {
	signUp: {
		withEmailAndPassword: (email: string, password: string) => void
	},

	signIn: {
		withEmailAndPassword: (email: string, password: string) => void
	}
}

export const AuthProvider: Component<{ children: JSXElement }> = (props) => {

	const app = useFirebaseApp()
	const db = getFirestore(app)
	const auth = getAuth()
	const authState = useAuth(auth)

	createEffect(() => {
		if (!authState.loading) {
			if (!auth.currentUser) {
				signInAnonymously(auth)
					.then((userCred) => {
						console.log("signed in anonymously")
						console.log(userCred)
					})
					.catch((err) => {
						console.warn("Error when signing in anonymously" + err)
					})
			} else {
				console.log("already signed in")
				console.log(auth.currentUser)
			}
		}
	})

	const authFunctions: AuthContext = {
		signUp: {
			withEmailAndPassword(email, password) {
				const credentials = EmailAuthProvider.credential(email, password)

				linkWithCredential(auth.currentUser as User, credentials)
					.then((UserCredentials) => {
						setDoc(doc(db, "users", UserCredentials.user.uid), {
							displayName: UserCredentials.user.displayName,
							email: UserCredentials.user.email,
							photo: null,
							photoURL: UserCredentials.user.photoURL,
							createdOn: Timestamp.fromDate(new Date()),
						} as DBUser)

						authFunctions.signIn.withEmailAndPassword(email, password)
					})
					.catch((err) => {
						console.warn("Error when upgrading anonymous account" + err)
					})
			},
		},

		signIn: {
			withEmailAndPassword(email, password) {
				signInWithEmailAndPassword(auth, email, password)
					.then((UserCredentials) => {
						console.log(UserCredentials)
					})
					.catch((err) => {
						console.warn("Error when signing in with email and password" + err)
					})
			},
		}
	}

	return (
		<AuthContext.Provider value={authFunctions}>
			{props.children}
		</AuthContext.Provider>
	)
}

export function useAuthProvider() {
	return useContext(AuthContext) as AuthContext
}