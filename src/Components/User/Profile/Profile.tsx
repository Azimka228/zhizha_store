import React, {useCallback, useEffect, useState} from "react";
import {doc, onSnapshot, updateDoc} from "firebase/firestore";
import {db} from "../../../Firebase";

type ProfileProps = {
	user: any
}

const Profile: React.FC<ProfileProps> = ({user}) => {
	const [profile, setProfile] = useState({
		Profit: 0,
		Balance: 0,
		History: []
	})

	let test = useCallback(() => {
		onSnapshot(doc(db, "users", user.uid), (doc) => {
			let obj = doc.data()
			// setBalance(obj?.Balance)
			setProfile({
				Profit: obj?.Profit,
				Balance: obj?.Balance,
				History: obj?.History,
			})
		});
	}, [])
	useEffect(() => {
		test()
	}, [test])

	const onClickTakeProfit = () => {
		const docRef = doc(db, "users", user.uid);
		let currentData = new Date
		function formatData(date: number | Date | undefined) {
			return ['year', 'month', 'day'].map(e => new Intl.DateTimeFormat('en', {
				[e]: 'numeric',
			}).format(date).padStart(2, '0')).join(" ");
		}
		let formattedData:any = formatData(currentData)

		if (profile.History[formattedData] !== undefined) {
			updateDoc(docRef, {
				Profit: 0,
				History: {
					...profile.History,
					[formattedData]:[
						...profile.History[formattedData],
						`Профит - ${profile.Profit} ${currentData.toLocaleTimeString('en-US', { hour12: false })}`
					]
				}
			})
		} else {
			updateDoc(docRef, {
				Profit: 0,
				History: {
					...profile.History,
					[formattedData]:[
						`Профит - ${profile.Profit} ${currentData.toLocaleTimeString('en-US', { hour12: false })}`
					]
				}
			})
		}




	}
	return (
		<div>
			<h1>Профиль</h1>
			<div>
				Почта - {user.email}
			</div>
			<div>
				Баланс: {profile.Balance} BYN
			</div>
			<div>
				Профит: {profile.Profit} BYN
				<button
					disabled={profile.Profit === 0}
					onClick={onClickTakeProfit}>Забрать профит</button>
			</div>
		</div>
	);
};

export default Profile;