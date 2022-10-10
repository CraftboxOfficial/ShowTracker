import { connectFunctionsEmulator, getFunctions, HttpsCallable, httpsCallable } from "firebase/functions";
import { tmdbGetConfigurationData, tmdbGetImages, tmdbGetImagesData, TMDBMultiSearchQuery } from "functions/src";
import { useFirebaseApp } from "solid-firebase";
import { Component, createContext, JSXElement, useContext, onMount, createSignal } from 'solid-js';
import { useCache } from "./CacheProvider";
import { base64 } from '@firebase/util';
import localforage from 'localforage';

const TmdbContext = createContext()

interface TmdbContext {
	tmdbMultiSearch: HttpsCallable<TMDBMultiSearchQuery, unknown>,
	tmdbGetConfiguration: HttpsCallable<tmdbGetConfigurationData, unknown>,
	tmdbGetImagesData: HttpsCallable<tmdbGetImagesData, unknown>,
	tmdbGetImages: (data: tmdbGetImages) => any
}
export const TmdbProvider: Component<{ children: JSXElement }> = (props) => {

	const app = useFirebaseApp()
	const cache = useCache()

	const functions = getFunctions(app)
	connectFunctionsEmulator(functions, "localhost", 5001)


	const cloudFunctions: TmdbContext = { //TODO convert all of these to be similar to the last one
		tmdbMultiSearch: httpsCallable<TMDBMultiSearchQuery>(functions, "tmdbMultiSearch"),
		tmdbGetConfiguration: httpsCallable<tmdbGetConfigurationData>(functions, "tmdbGetConfiguration"),
		tmdbGetImagesData: httpsCallable<tmdbGetImagesData>(functions, "tmdbGetImagesData"),
		
		/**
		 * Returns requested images as blobs;
		 * Prioritizes locally saved over fetching from api
		 * @param data tmdbGetImages
		 * @returns Blob[]
		 */
		tmdbGetImages: (data: tmdbGetImages) => {

			const imageStore = localforage.createInstance({
				name: "images"
			})

			function retriveImages(keys: string[]) {

				const images = keys.map(async (key) => {
					return await imageStore.getItem(key) as Blob | null
				})

				const mapped = new Map<string, (Blob | null)>()
				keys.forEach(async (key, index) => {
					mapped.set(key, await images[ index ])
				})

				return mapped
			}

			function saveImages(images: Map<string, Blob>) {

				images.forEach((value, key) => {
					localforage.setItem(key, value)
				})
			}

			async function fetchImage(image: { baseUrl: string, size: string, path: string }) {
				const url = `${image.baseUrl}${image.size}${image.path}`

				const blob = await (await fetch(url, { method: "GET" })).blob()
				return blob
			}

			function loadImage(image: { baseUrl: string, size: string, path: string }) {
				const imageKey = `${image.size}${image.path}`

				const imagesMap = retriveImages([ imageKey ])

				if (!imagesMap.get(imageKey)) {
					
					const fetched = fetchImage(image)
					
					return fetched.then((blob) => {
						saveImages(new Map([ [ imageKey, blob ] ]))
						return blob
					})
				}
			}

			const imagesBlobs = data.map((image) => {
				return loadImage(image)
			})

			return imagesBlobs
		}
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

const b = () => {

	const [ a1, setA1 ] = createSignal()

	async function a() {
		// const url = "https://image.tmdb.org/t/p/original/wwemzKWzjKYJFfCeiB57q3r4Bcm.svg"
		const url = "https://image.tmdb.org/t/p/original/dKFL1AOdKNoazqZDg1zq2z69Lx1.jpg"
		return await (await fetch(url, { method: "GET" })).blob()
	}

	a().then((v) => {
		// console.log(new Uint8Array(v))
		const a = v.arrayBuffer()

		a.then((r) => {
			setA1(URL.createObjectURL(new Blob([ r ])))

		})
	})

	return (
		<>
			<p>test</p>
			<img src={a1() as string}></img>
		</>
	)
}