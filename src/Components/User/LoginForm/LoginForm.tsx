import React from "react";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {Link, useNavigate} from "react-router-dom";
import {
	Avatar,
	Box,
	Button,
	Checkbox,
	Container, createTheme,
	CssBaseline,
	FormControlLabel,
	Grid,
	TextField,
	ThemeProvider
} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from "@mui/material/Typography";


const LoginForm = () => {
	let navigate = useNavigate();
	const auth = getAuth();
	const SignUpData = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const data = new FormData(e.currentTarget);
		let email = data.get("email")
		let password = data.get("password")
		console.log(email,password)
		if (typeof email === "string" && typeof password === "string") {
			signInWithEmailAndPassword(auth, email, password)
				.then((userCredential) => {
					return navigate("/");
				})
				.catch((error) => {
					alert("Ошибка")
				});
		}
	}

	const theme = createTheme();

	return (

		<ThemeProvider theme={theme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
						<LockOutlinedIcon/>
					</Avatar>
					<Typography component="h1" variant="h5">
						Логин
					</Typography>
					<Box component="form" onSubmit={SignUpData} noValidate sx={{ mt: 1 }}>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Почта"
							name="email"
							autoComplete="email"
							autoFocus
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Пароль"
							type="password"
							id="password"
							autoComplete="current-password"
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Войти
						</Button>
						<Grid container>
							<Grid item xs>
								<Link to="/" >
									Забыл пароль?
								</Link>
							</Grid>
							<Grid item>
								<Link to="/register">  Зарегестрироваться</Link >
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
};

export default LoginForm;