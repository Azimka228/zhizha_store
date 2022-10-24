import React, {DetailedHTMLProps, HTMLAttributes, useCallback, useEffect, useState} from "react";
import {doc, onSnapshot} from "firebase/firestore";
import {db} from "../../Firebase";

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
	return (
		<div>
			{items ? Object.keys(items)?.map(key => (
					<div key={key}>
						(Вкусы) {key}
						{items[key].map((el: {}) => {
							let [count]: any = Object.values(el)
							let title = Object.keys(el)
							console.log(count)

							return(
									<div>{title} - ({count} штук)</div>
							)
						})}
					</div>
				)) : <div>loading...</div>}
		</div>
	);
};

export default MyItems;