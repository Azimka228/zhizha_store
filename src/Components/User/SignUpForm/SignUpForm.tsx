import React from "react";
import {createUserWithEmailAndPassword, getAuth} from "firebase/auth";
import {doc, setDoc} from "firebase/firestore";
import {db} from "../../../Firebase";

type SignUpFormData = {
	email: HTMLFormElement
	password: HTMLFormElement
}

const SignUpForm = () => {
	const SignUpData: React.FormEventHandler<HTMLFormElement & SignUpFormData> = (e) => {
		e.preventDefault()
		const form = e.currentTarget
		let {email, password} = form
		console.log(email.value)
		const auth = getAuth();
		createUserWithEmailAndPassword(auth, email.value, password.value)
			.then((userCredential) => {
				// Creating options for the user
				setDoc(doc(db, "users", userCredential.user.uid), {
					History: [],
					Balance: 0,
					Items: {
						"rell": [
							{"lemon": 1},
							{"candy": 4},
							{"great": 12},
						],
						"husky": [
							{"lime": 3},
							{"candy": 2},
							{"great": 3},
						],
					}
				});

				// ...
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				// ..
			});
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
			<button type="submit">SIGN UP</button>

		</form>
	);
};

export default SignUpForm;