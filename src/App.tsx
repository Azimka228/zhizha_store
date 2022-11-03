import React, {useEffect, useState} from "react";
import "./App.css";
import "./Firebase";
import MyBalance from "./Components/MyBalance/MyBalance";
import MyHistory from "./Components/MyHistory/MyHistory";
import {Link, Route, Routes, useNavigate} from "react-router-dom";
import LoginForm from "./Components/User/LoginForm/LoginForm";
import SignUpForm from "./Components/User/SignUpForm/SignUpForm";
import {getAuth, onAuthStateChanged, signOut} from "firebase/auth";
import MyItems from "./Components/MyItems/MyItems";
import AddItems from "./Components/AddItems/AddItems";
import {AppBar, Box, Drawer, IconButton, MenuItem, Paper, Toolbar} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Profile from "./Components/User/Profile/Profile";

function App() {
	let navigate = useNavigate();

	const [user, setUser] = useState<any>()
	const [error, setError] = useState()
	console.log(user)
	useEffect(() => {
		// @ts-ignore
		const unsubscribe = onAuthStateChanged(getAuth(), setUser, setError)
		return () => unsubscribe()
	}, )

	const LogOut = async () => {
		await signOut(getAuth())
		setAnchorEl(null);
		return navigate("/");
	}
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	return (
		<div className="App">
			<AppBar position="static" sx={{backgroundColor: "#8A2BE2"}}>
				<Toolbar>
					<IconButton
						id="basic-button"
						aria-controls={open ? "basic-menu" : undefined}
						aria-haspopup="true"
						aria-expanded={open ? "true" : undefined}
						onClick={handleClick}
					>
						<MenuIcon>
						</MenuIcon>
					</IconButton>
					<Typography
						variant="h5"
						noWrap
						component="a"
						href="/"
						sx={{
							mr: "40px",
							fontFamily: "monospace",
							fontWeight: 700,
							letterSpacing: ".3rem",
						}}
					>
						ZHIZHA-STORE
					</Typography>
				</Toolbar>
			</AppBar>

			<Drawer
				id="basic-menu"
				open={open}
				onClose={handleClose}

			>
				{user ?
					<Box
										sx={{
											p: 4,
											backgroundColor: "#8A2BE2",
											height: "100%",
											color: "white",
											textDecoration: "none"
										}}
					>
						<Paper sx={{borderRadius: 3, backgroundColor: "#7B68EE"}}>
							<MenuItem onClick={handleClose}><Link to="/profile">Профиль</Link></MenuItem>
							<MenuItem onClick={handleClose}><Link to="/">Главная</Link></MenuItem>
							<MenuItem onClick={handleClose}><Link to="/history">История</Link></MenuItem>
							<MenuItem onClick={handleClose}><Link to="/items">Жидкости</Link></MenuItem>
							<MenuItem onClick={handleClose}><Link to="/add-items">Добавить новую жидкость</Link></MenuItem>
						</Paper>
						<Paper sx={{borderRadius: 3, mt: 6, color: "#FF4500" , backgroundColor: "#7B68EE",}}>
							<MenuItem  onClick={LogOut}>ВЫЙТИ</MenuItem>
						</Paper>

					</Box>
					:
					<Box
						sx={{
							p: 4,
							backgroundColor: "#8A2BE2",
							height: "100%",
							color: "white",
							textDecoration: "none"
						}}
					>
						<Paper  sx={{borderRadius: 3, backgroundColor: "#7B68EE"}}>
							<MenuItem onClick={handleClose}><Link to="/">Главная</Link></MenuItem>
							<MenuItem onClick={handleClose}><Link to="/register">Регистрация</Link></MenuItem>
							<MenuItem onClick={handleClose}><Link to="/login">Логин</Link></MenuItem>
						</Paper>

					</Box>

				}

			</Drawer>


			{user ?
				(<>
					<Routes>
						<Route path="/profile" element={<Profile user={user}/>}/>
						<Route path="/" element={<MyBalance uid={user.uid}/>}/>
						<Route path="/history" element={<MyHistory uid={user.uid}/>}/>
						<Route path="/items" element={<MyItems uid={user.uid}/>}/>
						<Route path="/add-items" element={<AddItems uid={user.uid}/>}/>
					</Routes>
				</>) :
				(<>
					<Routes>
						<Route path="/" element={<div> HI! </div>}/>
						<Route path="/login" element={<LoginForm/>}/>
						<Route path="/register" element={<SignUpForm/>}/>
					</Routes>
				</>)
			}
		</div>
	);
}

export default App;
