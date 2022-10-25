import React from "react";
import {createUserWithEmailAndPassword, getAuth} from "firebase/auth";
import {doc, setDoc} from "firebase/firestore";
import {db} from "../../../Firebase";
import {useNavigate} from "react-router-dom";
import {Button, Paper} from "@mui/material";

type SignUpFormData = {
	email: HTMLFormElement
	password: HTMLFormElement
}

const SignUpForm = () => {
	let navigate = useNavigate();
	const SignUpData: React.FormEventHandler<HTMLFormElement & SignUpFormData> = (e) => {
		e.preventDefault()
		const form = e.currentTarget
		let {email, password} = form
		console.log(email.value)
		const auth = getAuth();
		createUserWithEmailAndPassword(auth, email.value, password.value)
			.then((userCredential) => {
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
				return navigate("/");
			})
			.catch((error) => {
				alert("Ошибка")
			});
	}
	return (
		<Paper elevation={3} >
	<form onSubmit={SignUpData}>
		<label>
			<span>Почта: </span>
			<input name="email" type="email"/>
		</label>
		<label>
			<span>Пароль: </span>
			<input name="password" type="password"/>
		</label>
		<Button type="submit">Регистрация</Button>
	</form>
</Paper>

	);
};

export default SignUpForm;