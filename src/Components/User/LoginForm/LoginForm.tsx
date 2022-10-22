import React from "react";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {db} from "../../../Firebase";
import {doc, setDoc} from "firebase/firestore";

type SignUpFormData = {
	email: HTMLFormElement
	password: HTMLFormElement
}

const LoginForm = () => {
	const auth = getAuth();
	const SignUpData: React.FormEventHandler<HTMLFormElement & SignUpFormData> = (e) => {
		e.preventDefault()
		const form = e.currentTarget
		let {email, password} = form
		// const email = Email.value
		// const password = Password.value
		console.log(auth)
		signInWithEmailAndPassword(auth, email.value, password.value)
			.then((userCredential) => {
				// Signed in
				const user = userCredential.user;
				console.log(user)
				// ...
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
			});
		const user = auth.currentUser;
		if (user) {
			console.log(user.uid)
		} else {
			// No user is signed in.
		}
	}
	return (
		<form onSubmit={SignUpData}>
			<label>
				<span>Email</span>
				<input name="email" type="email"/>
			</label>
			<label>
				<span>Password</span>
				<input name="password" type="password"/>
			</label>
			<button type="submit">LOGIN</button>
		</form>
	);
};

export default LoginForm;