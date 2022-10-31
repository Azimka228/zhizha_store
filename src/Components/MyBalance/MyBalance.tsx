import React, {ChangeEvent, useEffect, useState} from "react";
import {doc, onSnapshot, updateDoc} from "firebase/firestore";
import {db} from "../../Firebase";
import {Button} from "@mui/material";

type BalanceType = {
	History: Array<string>
	Balance: number
	Items: { [key: string]: any }
}

type MyBalanceProps = {
	uid: string
}

const MyBalance: React.FC<MyBalanceProps> = ({uid}) => {
	const getBalanceUser = async () => {
		onSnapshot(doc(db, "users", uid), (doc) => {
			let obj = doc.data()
			if (obj) {
				let newObj = {
					History: [...obj.History],
					Balance: obj.Balance,
					Items: {...obj.Items},
				}
				setUserInfo(newObj)
			}

		});
	}

	const [userInfo, setUserInfo] = useState<BalanceType>({
		History: [],
		Balance: 0,
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
		updateDoc(docRef, {
			Balance: userInfo.Balance + priceItem,
			History: userInfo.History,
			Items: {
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
			},
		});
		getBalanceUser()
	}
	const onSelectTasteItem = (event: React.ChangeEvent<HTMLSelectElement>) => {
		let value = event.target.value;
		setTasteItem(value)
	};
	const onChangeItemPrice = (e: ChangeEvent<HTMLInputElement>) => {
		setPriceItem(+e.currentTarget.value)
	}
	const onSelectTitleItem = (event: React.ChangeEvent<HTMLSelectElement>) => {
		let value = event.target.value;
		setTitleItem(value)
	};
	return (
		<>
			<div>Баланс - {userInfo.Balance}</div>
			<div>
					<select
						id="title"
						onChange={onSelectTitleItem}>
						<option selected disabled>Жидкости</option>
						{Object.keys(userInfo.Items).map(el => {
							return (
								<option value={el}>{el}</option>
							)
						})}
					</select>
				<div>

						<select
							onChange={onSelectTasteItem}>
       <option selected disabled>Жидкости</option>
							{userInfo.Items[titleItem]?.map((el: {}) => {
								let keys = Object.keys(el)
								return (
									<option value={keys}>{keys}</option>
								)
							})}
						</select>

				</div>

				<div>
					Количество -
					<input value={1} type="number" disabled/>
				</div>
				<div>Цена -
					<input type="number" value={priceItem} onChange={onChangeItemPrice} min={12.5} max={30} step="0.5"/>
				</div>
				<Button
					variant="outlined"
					onClick={HandleSubmit}
					disabled={tasteItem === "" || titleItem === ""}
				>Подтвердить</Button>
			</div>
		</>
	);
};

export default MyBalance;