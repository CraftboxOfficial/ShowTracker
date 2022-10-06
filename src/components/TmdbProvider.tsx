import { connectFunctionsEmulator, getFunctions, HttpsCallable, httpsCallable } from "firebase/functions";
import { tmdbGetConfigurationData, TMDBMultiSearchQuery } from "functions/src";
import { useFirebaseApp } from "solid-firebase";
import { Component, createContext, JSXElement, useContext } from "solid-js";

const TmdbContext = createContext()

interface TmdbContext {
	tmdbMultiSearch: HttpsCallable<TMDBMultiSearchQuery, unknown>,
	tmdbGetConfiguration: HttpsCallable<tmdbGetConfigurationData, unknown>
}
export const TmdbProvider: Component<{ children: JSXElement }> = (props) => {

	const app = useFirebaseApp()

	const functions = getFunctions(app)
	connectFunctionsEmulator(functions, "localhost", 5001)


	const cloudFunctions = {
		tmdbMultiSearch: httpsCallable<TMDBMultiSearchQuery>(functions, "tmdbMultiSearch"),
		tmdbGetConfiguration: httpsCallable<tmdbGetConfigurationData>(functions, "tmdbGetConfiguration")
	}

	return (
		<TmdbContext.Provider value={cloudFunctions}>
			{props.children}
		</TmdbContext.Provider>
	)
}

export function useTmdb() {
	return useContext(TmdbContext) as TmdbContext
}