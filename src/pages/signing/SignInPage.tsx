import { Component, onMount, Show } from 'solid-js';
import { styled } from 'solid-styled-components';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from 'solid-firebase';
import { useAuthProvider } from '../../components/AuthProvider';

export const SignInPage: Component = () => {

	const auth = getAuth()

	const state = useAuth(auth)

	const authProv = useAuthProvider()

	let pswElem: HTMLInputElement
	let emlElem: HTMLInputElement

	onMount(() => {
		pswElem = document.getElementById("password") as HTMLInputElement
		emlElem = document.getElementById("email") as HTMLInputElement

	})

	async function logInToAccount() {
		if (pswElem.value && emlElem.value) {
			authProv.signIn.withEmailAndPassword(emlElem.value, pswElem.value)

		}
	}

	return (
		<>
			<SignInStyle>
				<span>Sign In Page</span>
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
					logInToAccount()
				}}>Log in</button>
				<Show when={state.data}>
					<p>{state.data.email}</p>
				</Show>
			</SignInStyle>
		</>
	)
}

const SignInStyle = styled("div")((props) => {
	return {
		height: "100%",
		color: props.theme?.main.text,

		button: {
			height: "6em",
			width: "9em"
		}
	}
})