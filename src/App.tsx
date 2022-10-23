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

	console.log("app", user)
	return (
		<div className="App">
			{user ?
				(<>
					<div><Link to="/">HOME</Link></div>
					<div><Link to="/history">HISTORY</Link></div>
					<div><Link to="/items">ITEMS</Link></div>
					<Routes>
						<Route path="/" element={<MyBalance uid={user.uid}/>}/>
						<Route path="/history" element={<MyHistory uid={user.uid}/>}/>
						<Route path="/items" element={<MyItems uid={user.uid}/>}/>
					</Routes>
					<button onClick={LogOut}>LogOut</button>
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
