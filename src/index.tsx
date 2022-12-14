/* @refresh reload */
import { render } from 'solid-js/web';
import './index.css';
import App from './App';

// Import the functions you need from the SDKs you need
import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Router } from '@solidjs/router';
import { createResource, onMount } from 'solid-js';
import { connectFunctionsEmulator, Functions, getFunctions, httpsCallable } from 'firebase/functions';
import { TMDBMultiSearchQuery } from 'functions/src';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig: FirebaseOptions = {
	apiKey: "AIzaSyBQysz-zYofHUFiN1cJWxC2LtkbNKhMUXM",
	authDomain: "showtracker-dev.firebaseapp.com",
	projectId: "showtracker-dev",
	storageBucket: "showtracker-dev.appspot.com",
	messagingSenderId: "618962731937",
	appId: "1:618962731937:web:fd650b88c35afcc49101e0",
	measurementId: "G-H6Q86GJ6QY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const functions = getFunctions(app)
connectFunctionsEmulator(functions, "localhost", 5001)

const a = httpsCallable<TMDBMultiSearchQuery>(functions, "tmdbMultiSearch")

render(() => {
	a({ query: "star vs" }).then((r) => {
		console.log(r.data)
	})
	// const [data, {mutate, refetch}] = createResource(a({text: "test"}))

	return (<><Router><App /></Router></>)
}, document.getElementById('root') as HTMLElement);
