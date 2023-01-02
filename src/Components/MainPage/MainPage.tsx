import React, {ChangeEvent, ReactNode, useEffect, useState} from "react";
import {doc, onSnapshot, updateDoc} from "firebase/firestore";
import {db} from "../../Firebase";
import {
	Button,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormGroup, FormLabel,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent, TextField
} from "@mui/material";

type ProfileType = {
	History: Array<string>
	Balance: object
	Profit: number
	Items: { [key: string]: any }
}

type CheckedType = {
	labelCard: boolean
	labelCash: boolean
}

type MyBalanceProps = {
	uid: string
}

const MainPage: React.FC<MyBalanceProps> = ({uid}) => {
	const getBalanceUser = async () => {
		onSnapshot(doc(db, "users", uid), (doc) => {
			let obj = doc.data()
			if (obj) {
				let newObj = {
					History: obj.History,
					Balance: obj.Balance,
					Profit: obj.Profit,
					Items: obj.Items,
				}
				setUserInfo(newObj)
			}

		});
	}

	const [userInfo, setUserInfo] = useState<ProfileType>({
		History: [],
		Balance: {
			labelCard: 0,
			labelCash: 0
		},
		Profit: 0,
		Items: {},
	})

	const [formData, setFormData] = useState({
		itemTitle: "",
		itemTaste: "",
		payment: {
			labelCard: false,
			labelCash: true
		},
		pricePurchase: 0,
		priceSell: 0,
	})

	useEffect(() => {
		getBalanceUser()
	}, [])

	const HandleSubmit = async () => {
		const newlabelCardValue = formData.payment.labelCard ? formData.priceSell : 0
		const newlabelCashValue = formData.payment.labelCash ? formData.priceSell : 0

		const docRef = doc(db, "users", uid);
		let newObj = {
			...userInfo.Items,
			[formData["itemTitle"]]: [
				...userInfo.Items[formData["itemTitle"]]
					.filter((el: any) => el[formData["itemTaste"]] !== 1).map((el: any) => {
						if (Object.keys(el)[0] === formData["itemTaste"] && el[formData["itemTaste"]] > 1) {
							console.log(el[formData["itemTaste"]])
							return {
								[formData["itemTaste"]]: el[formData["itemTaste"]] - 1
							}
						} else {
							return {...el}
						}
					})
			]
		}
		if (newObj[formData["itemTitle"]].length === 0) {
			delete newObj[formData["itemTitle"]]
		}

		let currentData = new Date

		function formatData(date: number | Date | undefined) {
			return ["year", "month", "day"].map(e => new Intl.DateTimeFormat("en", {
				[e]: "numeric",
			}).format(date).padStart(2, "0")).join(" ");
		}

		let formattedData: any = formatData(currentData)
		if (userInfo.History[formattedData] !== undefined) {
			updateDoc(docRef, {
				Balance: {
					labelCard: newlabelCardValue,
					labelCash: newlabelCashValue
				},
				Profit: userInfo.Profit + (formData.priceSell - formData.pricePurchase),
				History: {
					...userInfo.History,
					[formattedData]: [
						...userInfo.History[formattedData],
						`Продажа - ${formData["itemTaste"]} ${formData["itemTitle"]}(1 штука)
						   Продан за - ${formData.priceSell} 
						   ${currentData.toLocaleTimeString("en-US", {hour12: false})}`
					]
				},
				Items: {
					...newObj
				},
			})
		} else {
			updateDoc(docRef, {
				Balance: {
					labelCard: newlabelCardValue,
					labelCash: newlabelCashValue
				},
				Profit: userInfo.Profit + (formData.priceSell - formData.pricePurchase),
				History: {
					...userInfo.History,
					[formattedData]: [
						`Продажа - ${formData["itemTaste"]} ${formData["itemTitle"]}(1 штука) 
						 Продан за - ${formData.priceSell} 
						 ${currentData.toLocaleTimeString("en-US", {hour12: false})}`
					]
				},
				Items: {
					...newObj
				},
			})
		}
		getBalanceUser()
	}

	console.log(formData)
	const onChangeFormDataCheckedValueLabel = (event: ChangeEvent<HTMLInputElement>, currentCheckedStatus: boolean) => {
		// @ts-ignore
		const currentTargetName = formData.payment[event.currentTarget.name]
		if (!currentTargetName) {
			const newObj = {
				...formData,
				payment: {
					labelCard: false,
					labelCash: false,
					[event.currentTarget.name]: currentCheckedStatus
				}

			}
			setFormData(newObj)
		}
	}

	const onChangeFormDataTextfield = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const newObj = {
			...formData,
			[e.currentTarget.name]: +e.currentTarget.value
		}
		setFormData(newObj)
		console.log(e.currentTarget.name)
	}
	const onChangeFormDataSelect = (e: SelectChangeEvent<string>, child: ReactNode) => {
		const newObj = {
			...formData,
			[e.target.name]: e.target.value
		}
		setFormData(newObj)
		console.log(e.target.name)

	}

	return (
		<>
			<div style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center"
			}}>
				<div style={{marginTop: "20px", marginBottom: "20px"}}>
					<FormControl variant="filled" sx={{m: 1, minWidth: 160}}>
						<InputLabel id="title">Производитель</InputLabel>
						<Select
							id="title"
							label="title"
							name="itemTitle"
							defaultValue=""
							onChange={onChangeFormDataSelect}>
							<option selected disabled>Жидкости</option>
							{Object.keys(userInfo.Items).map(el => {
								return (
									<MenuItem value={el}>{el}</MenuItem>
								)
							})}
						</Select>
					</FormControl>
				</div>
				<div style={{marginBottom: "20px"}}>
					<FormControl variant="filled" sx={{m: 1, minWidth: 160}}>
						<InputLabel id="taste">Вкус</InputLabel>
						<Select
							id="taste"
							label="taste"
							name="itemTaste"
							defaultValue=""
							onChange={onChangeFormDataSelect}>
							<option selected disabled>Жидкости</option>
							{userInfo.Items[formData["itemTitle"]] && userInfo.Items[formData["itemTitle"]].map((el: any) => {
								let keys = Object.keys(el)[0]
								return (
									<MenuItem value={keys}>{keys}</MenuItem>
								)
							})}
						</Select>
					</FormControl>
				</div>
				<div>
					<FormLabel component="legend">Выбор оплаты</FormLabel>
					<FormGroup>
						<FormControlLabel
							control={
								<Checkbox checked={formData.payment.labelCard} onChange={onChangeFormDataCheckedValueLabel} name="labelCard"/>
							}
							label="Карта"
						/>
						<FormControlLabel
							control={
								<Checkbox checked={formData.payment.labelCash} onChange={onChangeFormDataCheckedValueLabel} name="labelCash"/>
							}
							label="Наличные"
						/>
					</FormGroup>
				</div>
				<div>
					<TextField type="number"
																name="pricePurchase"
																value={formData.pricePurchase}
																onChange={onChangeFormDataTextfield}
																id="filled-basic"
																label="Цена закупа" variant="filled"
					/>
				</div>
				<div>
					<TextField type="number"
																name="priceSell"
																value={formData.priceSell}
																onChange={onChangeFormDataTextfield}
																id="filled-basic"
																label="Цена продажи"
																variant="filled"
					/>
				</div>
				<Button
					variant="contained"
					color="secondary"
					onClick={HandleSubmit}
					disabled={formData["itemTitle"] === "" || formData["itemTaste"] === ""}
				>Подтвердить
				</Button>
			</div>
		</>
	);
};

export default MainPage;