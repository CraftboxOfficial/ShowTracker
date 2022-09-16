/* @refresh reload */
import { render } from 'solid-js/web';
import './index.css';
import App from './App';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
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

console.log(app)

render(() => <App />, document.getElementById('root') as HTMLElement);
