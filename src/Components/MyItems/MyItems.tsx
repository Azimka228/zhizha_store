import React, {DetailedHTMLProps, HTMLAttributes, useCallback, useEffect, useState} from "react";
import {doc, onSnapshot} from "firebase/firestore";
import {db} from "../../Firebase";
import {Paper} from "@mui/material";

type MyItemsProps = {
	uid: string
}

const MyItems: React.FC<MyItemsProps> = ({uid}) => {
	const [items, setItems] = useState<any>({})
	const test = useCallback(() => {
		onSnapshot(doc(db, "users", uid), (doc) => {
			let obj = doc.data()
			setItems(obj?.Items)
		});
	}, [setItems])
	useEffect(() => {
		test()
	}, [test])
	const [editableTaste,setEditableTaste] = useState(false)
	const [editableTitle,setEditableTitle] = useState(false)

	return (
		<div>
			{items ? Object.keys(items)?.map(key => (
				<Paper>
					<h1><b>{key}</b></h1>
					<div key={key}>
						{items[key].map((el: {}) => {
							let [count]: any = Object.values(el)
							let title = Object.keys(el)
							console.log(count)

							const HadleDoubleClick = () => {
								setEditableTaste(true)
							}
							return(
								<>
									{editableTaste? <input/>:
										<div onDoubleClick={HadleDoubleClick}>{title} - ({count} штук)</div>
									}</>
							)
						})}
					</div>

				</Paper>

				)) : <div>loading...</div>}
		</div>
	);
};

export default MyItems;