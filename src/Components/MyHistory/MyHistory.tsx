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

	return (
		<div>

			{history.map(el => {
					const [time, money] = el.split(",")
				return(<div>
					<div>{time}</div>
					<div>{money}</div>
				</div>)

			})}
			{history.length === 0 && <div>loading...</div>}
			{/*<button onClick={test}>History</button>*/}
		</div>
	);
};

export default MyHistory;