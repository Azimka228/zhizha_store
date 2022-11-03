import React, {useCallback, useEffect, useState} from "react";
import {doc, onSnapshot} from "firebase/firestore";
import {db} from "../../../Firebase";

type ProfileProps = {
	user: any
}

const Profile:React.FC<ProfileProps> = ({user}) => {
	const [money,setMoney] = useState({
		Profit: 0,
		Balance: 0,
	})

	let test = useCallback(() => {
		onSnapshot(doc(db, "users", user.uid), (doc) => {
			let obj = doc.data()
			// setBalance(obj?.Balance)
			setMoney({
				Profit: obj?.Profit,
				Balance: obj?.Balance,
			})
		});
	},[])
	useEffect(()=>{
		test()
	},[test])

	return (
		<div>

			Профиль
			<div>
				Почта - {user.email}
			</div>
			<div>
				Баланс: {money.Balance}
			</div>
			<div>
				Профит: {money.Profit}
			</div>
		</div>
	);
};

export default Profile;