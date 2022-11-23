import React, {useCallback, useEffect, useState} from "react";
import {doc, onSnapshot} from "firebase/firestore";
import {db} from "../../Firebase";


type MyHistoryProps = {
	uid: string
}

const MyHistory:React.FC<MyHistoryProps> = ({uid}) => {
	let test = useCallback(() => {
		onSnapshot(doc(db, "users", uid), (doc) => {
			let obj = doc.data()
			// setBalance(obj?.Balance)
			setHistory(obj?.History)
		});
	},[])
	const [history,setHistory] = useState<any[]>([])
	useEffect(()=>{
		test()
	},[test])
	let currentDay:any = Object.keys(history)
	return (
		<div>
			<h1>История</h1>
			{currentDay.map((day:any) => {
				return(<div><p>{day}</p>
						{history[day].map((cell:any) => {
							return(
								<div>{cell}</div>
							)
						})}
						</div>

				)
			})}
			{history.length === 0 && <div>loading...</div>}
		</div>
	);
};

export default MyHistory;