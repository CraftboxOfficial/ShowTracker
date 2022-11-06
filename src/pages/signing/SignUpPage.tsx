import { Component, onMount } from 'solid-js';
import { styled } from 'solid-styled-components';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useFirebaseApp, useFirestore } from 'solid-firebase';
import { collection, doc, getFirestore, setDoc, Timestamp } from 'firebase/firestore';
import { DBUser } from 'src/db';
import { useAuthProvider } from '../../components/AuthProvider';

export const SignUpPage: Component = () => {

	const app = useFirebaseApp()
	const db = getFirestore(app)
	// const auth = getAuth()
	const auth = useAuthProvider()

	let pswElem: HTMLInputElement
	let emlElem: HTMLInputElement

	onMount(() => {
		pswElem = document.getElementById("password") as HTMLInputElement
		emlElem = document.getElementById("email") as HTMLInputElement

	})

	async function createAccount() {
		console.log("create")
		if (pswElem.value && emlElem.value) {
			auth.signUp.withEmailAndPassword(emlElem.value, pswElem.value)
		}
	}

	return (
		<>
			<SignUpStyle>
				<span>Sign Up Page</span>
				<br />
				<form>
					<label for="email">Email: </label>
					<input id="email" type="email"></input>
					<br />
					<label for="password">Password: </label>
					<input id="password" type="password"></input>
					{/* <input type="submit" /> */}
				</form>
				<button onClick={(e) => {
					// console.log("click")
					createAccount()
				}}>Create account</button>
			</SignUpStyle>
		</>
	)
}

const SignUpStyle = styled("div")((props) => {
	return {
		height: "100%",
		color: props.theme?.main.text,

		button: {
			height: "6em",
			width: "9em"
		}
	}
})