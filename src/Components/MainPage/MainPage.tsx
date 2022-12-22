import React, {ChangeEvent, ReactNode, useEffect, useState} from "react";
import {doc, onSnapshot, updateDoc} from "firebase/firestore";
import {db} from "../../Firebase";
import {Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";

type BalanceType = {
	History: Array<string>
	Balance: number
	Profit: number
	Items: { [key: string]: any }
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
					History: {...obj.History},
					Balance: obj.Balance,
					Profit: obj.Profit,
					Items: {...obj.Items},
				}
				setUserInfo(newObj)
			}

		});
	}

	const [userInfo, setUserInfo] = useState<BalanceType>({
		History: [],
		Balance: 0,
		Profit: 0,
		Items: {},
	})
	const [tasteItem, setTasteItem] = useState<string>("")
	const [titleItem, setTitleItem] = useState<string>("")
	const [priceItem, setPriceItem] = useState<number>(12.5)

	useEffect(() => {
		getBalanceUser()
	}, [])

	const HandleSubmit = async () => {
		const docRef = doc(db, "users", uid);
		let newObj = {
			...userInfo.Items,
			[titleItem]: [
				...userInfo.Items[titleItem]
					.filter((el: any) => el[tasteItem] !== 1).map((el: any) => {
						if (Object.keys(el)[0] === tasteItem && el[tasteItem] > 1) {
							console.log(el[tasteItem])
							return {
								[tasteItem]: el[tasteItem] - 1
							}
						} else {
							return {...el}
						}
					})
			]
		}
		if (newObj[titleItem].length === 0) {
			delete newObj[titleItem]
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
				Balance: userInfo.Balance + priceItem,
				Profit: userInfo.Profit + (priceItem - 12.5),
				History: {
					...userInfo.History,
					[formattedData]: [
						...userInfo.History[formattedData],
						`Продажа - ${tasteItem} ${titleItem}(1 штука)  ${currentData.toLocaleTimeString("en-US", {hour12: false})}`
					]
				},
				Items: {
					...newObj
				},
			}).then((value) => {
				console.log("Promise", value)
				let count = userInfo.Items[titleItem].find((el: { [x: string]: any; }) => el[tasteItem])[tasteItem]
				if (count === 1) {
					setTasteItem("")


				}
			})
		} else {
			updateDoc(docRef, {
				Balance: userInfo.Balance + priceItem,
				Profit: userInfo.Profit + (priceItem - 12.5),
				History: {
					...userInfo.History,
					[formattedData]: [
						`Продажа - ${tasteItem} ${titleItem}(1 штука)  ${currentData.toLocaleTimeString("en-US", {hour12: false})}`
					]
				},
				Items: {
					...newObj
				},
			}).then(() => {
				let count = userInfo.Items[titleItem].find((el: { [x: string]: any; }) => el[tasteItem])[tasteItem]
				if (count === 1) {
					setTasteItem("")
				}
			})
		}
		getBalanceUser()
	}
	const onSelectTasteItem = (event: SelectChangeEvent<string>, child: ReactNode) => {
		let value = event.target.value;
		setTasteItem(value)
	};
	const onChangeItemPrice = (e: ChangeEvent<HTMLInputElement>) => {
		setPriceItem(+e.currentTarget.value)
	}
	const onSelectTitleItem = (event: SelectChangeEvent<string>, child: ReactNode) => {
		let value = event.target.value;
		setTitleItem(value)
	};
	return (
		<>
			<div style={{
				display:"flex",
				flexDirection:"column",
				justifyContent:"center",
				alignItems:"center"
			}}>
				<div style={{marginTop:"20px",marginBottom:"20px"}}>
					<FormControl variant="filled"  sx={{ m: 1, minWidth: 160 }}>
						<InputLabel id="title">Производитель</InputLabel>
						<Select
							id="title"
							label="title"
							onChange={onSelectTitleItem}>
							<option selected disabled>Жидкости</option>
							{Object.keys(userInfo.Items).map(el => {
								return (
									<MenuItem value={el}>{el}</MenuItem>
								)
							})}
						</Select>
					</FormControl>
				</div>
				<div style={{marginBottom:"20px"}}>
					<FormControl variant="filled"  sx={{ m: 1, minWidth: 160 }}>
						<InputLabel id="taste">Вкус</InputLabel>
						<Select
							id="taste"
							label="taste"
							onChange={onSelectTasteItem}>
							<option selected disabled>Жидкости</option>
							{userInfo.Items[titleItem] && userInfo.Items[titleItem].map((el: any) => {
								let keys = Object.keys(el)[0]
								return (
									<MenuItem value={keys}>{keys}</MenuItem>
								)
							})}
						</Select>
					</FormControl>
				</div>
				<div>
					Количество -
					<input value={1} type="number" disabled/>
				</div>
				<div>Цена -
					<input type="number" value={priceItem} onChange={onChangeItemPrice} min={12.5} max={30} step="0.5"/>
				</div>
				<Button
					variant="contained"
					color="secondary"
					onClick={HandleSubmit}
					disabled={tasteItem === "" || titleItem === ""}
				>Подтвердить</Button>
			</div>
		</>
	);
};

export default MainPage;