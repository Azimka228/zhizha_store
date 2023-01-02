import React from "react";
import {createUserWithEmailAndPassword, getAuth} from "firebase/auth";
import {doc, setDoc} from "firebase/firestore";
import {db} from "../../../Firebase";
import {Link, useNavigate} from "react-router-dom";
import {
	Avatar,
	Box,
	Button,
	Checkbox,
	Container,
	createTheme,
	CssBaseline,
	FormControlLabel,
	Grid,
	TextField,
	ThemeProvider
} from "@mui/material";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const SignUpForm = () => {
	let navigate = useNavigate();
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const form = e.currentTarget
		let {email, password} = form
		console.log(form)
		console.log(email.value)
		const auth = getAuth();
		createUserWithEmailAndPassword(auth, email.value, password.value)
			.then((userCredential) => {
				setDoc(doc(db, "users", userCredential.user.uid), {
					History: [],
					Balance: {
						labelCard: 0,
						labelCash: 0
					},
					Profit:0,
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
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Регистрация
					</Typography>
					<Box component="form"  noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									id="email"
									label="Почта"
									name="email"
									autoComplete="off"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									name="password"
									label="Пароль"
									type="password"
									id="password"
									autoComplete="off"
								/>
							</Grid>
						</Grid>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Зарегестрироваться
						</Button>
						<Grid container justifyContent="flex-end">
							<Grid item>
								<Link to="/login">Уже есть аккаунт?</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
};

export default SignUpForm;