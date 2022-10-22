import React, {useEffect, useState} from "react";
import {doc, onSnapshot, updateDoc} from "firebase/firestore";
import {db} from "../../Firebase";

type BalanceType = {
	History: Array<string>
	Balance: number
	Items: object
}

type MyBalanceProps = {
	uid: string
}

const MyBalance:React.FC<MyBalanceProps> = ({uid}) => {
	const getBalanceUser = async () => {
		onSnapshot(doc(db, "users", uid), (doc) => {
			let obj = doc.data()
			if (obj) {
				let newObj = {
					History: [...obj.History],
					Balance: obj.Balance,
					Items: {...obj.Items},
				}
				setBalance(newObj)
			}

		});
	}

	const [balance, setBalance] = useState<BalanceType>({
		History: [],
		Balance: 0,
		Items: {},
	})
	useEffect(()=>{
			getBalanceUser()
		},[])

	const AddMoney = () => {
		let DataToday = new Date().toLocaleString().split(",")[1] + `, + 12.5 BYN`;
		let newObj = {

			Balance: balance.Balance+12.5,
			History: [DataToday,...balance.History],
			Items: {...balance.Items}
		}
		setBalance(newObj)
	}
	const RemoveMoney = () => {
		let DataToday = new Date().toLocaleString().split(",")[1] + `,  - 12.5 BYN`;
		let newObj = {

			Balance: balance.Balance-12.5,
			History: [DataToday,...balance.History],
			Items: {...balance.Items}
		}
		setBalance(newObj)
	}
	const HandleSubmit = async () => {
			const docRef = doc(db, "users", uid);
			updateDoc(docRef, {
				Balance: balance.Balance,
				History: balance.History,
				Items: balance.Items,
			});
			getBalanceUser()
	}
	const AddItem = () => {
		let copy = JSON.parse(JSON.stringify(balance.Items))
		let newObj = {
			Balance: balance.Balance,
			History: balance.History,
			Items:{
				...copy,
				// can be edited
				"rellds": [
					{"lemon": 1},
					{"candy": 4},
					{"great": 12},
				]
			}

		}


		// @ts-ignore
		setBalance(newObj)
	}
	console.log(balance)
	return (
		<>
			<div>{balance.Balance}</div>
			<button onClick={AddMoney}>ADD</button>
			<button onClick={RemoveMoney}>REMOVE</button>
			<button onClick={HandleSubmit}>SUBMIT</button>
			<div>
				<button onClick={AddItem}>ITEMS</button>
			</div>
		</>
	);
};

export default MyBalance;