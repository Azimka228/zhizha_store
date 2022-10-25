import React from "react";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {Button} from "@mui/material";

type SignUpFormData = {
	email: HTMLFormElement
	password: HTMLFormElement
}

const LoginForm = () => {
	let navigate = useNavigate();
	const auth = getAuth();
	const SignUpData: React.FormEventHandler<HTMLFormElement & SignUpFormData> = (e) => {
		e.preventDefault()
		const form = e.currentTarget
		let {email, password} = form
		signInWithEmailAndPassword(auth, email.value, password.value)
			.then((userCredential) => {
				return navigate("/");
			})
			.catch((error) => {
				alert("Ошибка")
			});
	}
	return (
		<form onSubmit={SignUpData}>
			<label>
				<span>Почта: </span>
				<input name="email" type="email"/>
			</label>
			<label>
				<span>Пароль: </span>
				<input name="password" type="password"/>
			</label>
			<Button type="submit">Логин</Button>
		</form>
	);
};

export default LoginForm;