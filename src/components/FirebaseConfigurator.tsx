import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { useAuth, useFirebaseApp } from "solid-firebase";
import { Component } from "solid-js";

export const FirebaseConfigurator: Component = () => {

	const app = useFirebaseApp()
	const db = getFirestore(app)

	const appCheck = initializeAppCheck(app, {
		provider: new ReCaptchaV3Provider('6LcjqssiAAAAAJ_WfitKFNtkGnB0jD2eMKyknYh4'),

		isTokenAutoRefreshEnabled: true
	});

	const auth = getAuth(app)
	const state = useAuth(auth)

	connectAuthEmulator(auth, "http://localhost:9099")
	connectFirestoreEmulator(db, 'localhost', 8080)

	return (
		<>
		</>
	)
}