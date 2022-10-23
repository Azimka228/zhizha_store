import React, {ChangeEvent, useEffect, useState} from "react";
import {doc, onSnapshot, updateDoc} from "firebase/firestore";
import {db} from "../../Firebase";

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

	const AddMoney = () => {
		let DataToday = new Date().toLocaleString().split(",")[1] + `, + 12.5 BYN`;
		let newObj = {

			Balance: userInfo.Balance + 12.5,
			History: [DataToday, ...userInfo.History],
			Items: {...userInfo.Items}
		}
		setUserInfo(newObj)
	}
	const RemoveMoney = () => {
		let DataToday = new Date().toLocaleString().split(",")[1] + `,  - 12.5 BYN`;
		let newObj = {

			Balance: userInfo.Balance - 12.5,
			History: [DataToday, ...userInfo.History],
			Items: {...userInfo.Items}
		}
		setUserInfo(newObj)
	}
	const HandleSubmit = async () => {
		const docRef = doc(db, "users", uid);
		updateDoc(docRef, {
			Balance: userInfo.Balance + priceItem,
			History: userInfo.History,
			Items: {...userInfo.Items,
				[titleItem]: [
					...userInfo.Items[titleItem].map((el: any) => {
						console.log(Object.keys(el)[0])
						if (Object.keys(el)[0] === tasteItem) {
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

	console.log("titleItem:", titleItem)
	console.log("tasteItem:", tasteItem)
	console.log("priceItem:", priceItem)
	console.log("userInfo", userInfo)
	return (
		<>
			<div>Баланс - {userInfo.Balance}</div>
			<div>
				<div>Название
					<select name="titleItem" onChange={onSelectTitleItem}>
						<option selected disabled>Жидкости</option>
						{Object.keys(userInfo.Items).map(el => {
							return (
								<option value={el}>{el}</option>
							)
						})}
					</select>
				</div>
				<div>Вкус
					<select name="tasteItem" onChange={onSelectTasteItem}>
						<option selected disabled>Жидкости</option>
						{userInfo.Items[titleItem] && userInfo.Items[titleItem].map((el: {}) => {
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
					<input type="number"  value={priceItem} onChange={onChangeItemPrice} min={12.5} max={30} step="0.5"/>
				</div>
				<button onClick={HandleSubmit}>Подтвердить</button>
			</div>
		</>
	);
};

export default MyBalance;