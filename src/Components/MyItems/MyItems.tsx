import React, {DetailedHTMLProps, HTMLAttributes, useCallback, useEffect, useState} from "react";
import {doc, onSnapshot} from "firebase/firestore";
import {db} from "../../Firebase";

type MyItemsProps = {
	uid: string
}

const MyItems: React.FC<MyItemsProps> = ({uid}) => {
	let test = useCallback(() => {
		onSnapshot(doc(db, "users", uid), (doc) => {
			let obj = doc.data()
			// setBalance(obj?.Balance)
			setItems(obj?.Items)
			setNameItems(Object.getOwnPropertyNames(obj?.Items))
		});
	}, [])
	const [items, setItems] = useState<any>({})
	const [nameItems, setNameItems] = useState<string[]>([])
	useEffect(() => {
		test()
	}, [test])
	return (
		<div>
			{items && Object.keys(items)?.map(key => {
				// let title
				// let count
				// (items[key].map((item: string) => {
				// 	let splitedItems =  item.split(',')
				// 	title = splitedItems[0]
				// 	count = splitedItems[1]
				// }))
				return (
					<div key={key}>
						(Вкусы) {key}
						{items[key].map((el: {}) => {
							// @ts-ignore

							let [count]:DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, any> = Object.values(el)
							let title = Object.keys(el)
							console.log(count)

							return(
								<>
									<div>{title} - ({count} штук)</div>

								</>
							)

						})}
					</div>
				)
			})}

			{Object.keys(items).length == 0 && <div>loading...</div>}
		</div>
	);
};

export default MyItems;