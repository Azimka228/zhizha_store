import React, {useCallback, useEffect, useState} from "react";
import {doc, onSnapshot, updateDoc} from "firebase/firestore";
import {db} from "../../../Firebase";
import {updateProfile, updateEmail} from "firebase/auth";
import EditableDiv from "../../ToolKits/EditableDiv";

type ProfileProps = {
	user: any
}

export type UserPropertyChangeType = {
	displayName?: string | null | undefined;
	photoURL?: string | null | undefined
	email?: string | null | undefined
}

const Profile: React.FC<ProfileProps> = ({user}) => {

	const [userInfo, setUserInfo] = useState(user)



	const [profile, setProfile] = useState({
		Profit: 0,
		Balance: {
			labelCard: 0,
			labelCash: 0
		},
		History: []
	})
	console.log(profile)
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
	}, [])

	const updateUserProperty = (User: UserPropertyChangeType) => {
		if (User.email) {
			updateEmail(user, User.email).then(() => {
				let newUserInfo = {
					...userInfo,
					User
				}
				setUserInfo(newUserInfo)
			}).catch((error) => {
				throw new Error(error)
			});
		} else {
			updateProfile(user, {
				...User
			}).then(() => {
				let newUserInfo = {
					...userInfo,
					User
				}
				setUserInfo(newUserInfo)
			}).catch((error) => {
				throw new Error(error)
			})
		}
	}

	const onClickTakeProfit = () => {
		const docRef = doc(db, "users", user.uid);
		let currentData = new Date

		function formatData(date: number | Date | undefined) {
			return ["year", "month", "day"].map(e => new Intl.DateTimeFormat("en", {
				[e]: "numeric",
			}).format(date).padStart(2, "0")).join(" ");
		}

		let formattedData: any = formatData(currentData)

		if (profile.History[formattedData] !== undefined) {
			updateDoc(docRef, {
				Profit: 0,
				History: {
					...profile.History,
					[formattedData]: [
						...profile.History[formattedData],
						`???????????? - ${profile.Profit} ${currentData.toLocaleTimeString("en-US", {hour12: false})}`
					]
				}
			})
		} else {
			updateDoc(docRef, {
				Profit: 0,
				History: {
					...profile.History,
					[formattedData]: [
						`???????????? - ${profile.Profit} ${currentData.toLocaleTimeString("en-US", {hour12: false})}`
					]
				}
			})
		}

	}

	const AllBalance = Object.values(profile.Balance).reduce((acc, cur) => acc + cur, 0)

	return (
		<div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
			<h1>??????????????</h1>
			<div>
				<div>??????:</div>
				<EditableDiv Name={{displayName: userInfo.displayName}} callbackSubmit={updateUserProperty}/>
				<div>??????????:</div>
				<EditableDiv Name={{email: userInfo.email}} callbackSubmit={updateUserProperty}/>
			</div>
			<div>
				<button>?????????????? ????????????</button>
				<button>?????????? ???????? ??????</button>
			</div>
			<div>
				<p>?????????? ????????????: {AllBalance} BYN</p>
				<p>???????????? ???? ??????????: {profile.Balance.labelCard} BYN</p>
				<p>???????????? ????????????????: {profile.Balance.labelCash} BYN</p>
			</div>
			<div>
				????????????: {profile.Profit} BYN
				<button
					disabled={profile.Profit === 0}
					onClick={onClickTakeProfit}>?????????????? ??????????</button>
			</div>
		</div>
	);
};

export default Profile;