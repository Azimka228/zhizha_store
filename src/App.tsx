import React, {useEffect, useState} from "react";
import "./App.css";
import "./Firebase";
import MyBalance from "./Components/MyBalance/MyBalance";
import MyHistory from "./Components/MyHistory/MyHistory";
import {Link, Route, Routes} from "react-router-dom";
import LoginForm from "./Components/User/LoginForm/LoginForm";
import SignUpForm from "./Components/User/SignUpForm/SignUpForm";
import {getAuth, onAuthStateChanged, signOut} from "firebase/auth";
import MyItems from "./Components/MyItems/MyItems";
import AddItems from "./Components/AddItems/AddItems";

function App() {
	const [user, setUser] = useState<any>()
	const [error, setError] = useState()

	useEffect(() => {
		// @ts-ignore
		const unsubscribe = onAuthStateChanged(getAuth(), setUser, setError)
		return () => unsubscribe()
	}, [])

	const LogOut = async () => {
		await signOut(getAuth())
	}

	return (
		<div className="App">
			{user ?
				(<>
					<button onClick={LogOut}>LogOut</button>
					<div><Link to="/">Главная</Link></div>
					<div><Link to="/history">История</Link></div>
					<div><Link to="/items">Жидкости</Link></div>
					<div><Link to="/add-items">Добавить новую жидкость</Link></div>
					<Routes>
						<Route path="/" element={<MyBalance uid={user.uid}/>}/>
						<Route path="/history" element={<MyHistory uid={user.uid}/>}/>
						<Route path="/items" element={<MyItems uid={user.uid}/>}/>
						<Route path="/add-items" element={<AddItems uid={user.uid}/>}/>
					</Routes>
				</>) :
				(<>
					<LoginForm/>
					<SignUpForm></SignUpForm>
				</>)
			}
		</div>
	);
}

export default App;
