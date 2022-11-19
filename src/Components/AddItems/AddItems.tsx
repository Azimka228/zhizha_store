import React, {useCallback, useEffect, useState} from "react";
import {doc, onSnapshot, updateDoc} from "firebase/firestore";
import {db} from "../../Firebase";
import {useNavigate} from "react-router-dom";
import {Button} from "@mui/material";

type AddItemProps = {
	uid: string
}

const AddItems: React.FC<AddItemProps> = ({uid}) => {

		const navigate = useNavigate();
		let test = useCallback(() => {
			onSnapshot(doc(db, "users", uid), (doc) => {
				let obj = doc.data()
				// setBalance(obj?.Balance)
				setItemCollection(obj?.Items)
			});
		}, [])

		const [itemCollection, setItemCollection] = useState<any>({})

		useEffect(() => {
			test()
		}, [test])



		const [selectedItemTitle, setSelectedItemTitle] = useState<string>("")
		const [selectedItemTaste, setSelectedItemTaste] = useState<string>("")

		const [newItemTitle, setItemTitle] = useState<string>("")
		const [newItemTaste, setItemTaste] = useState<string>("")


		useEffect(() => {
			if (selectedItemTaste) {
				if (selectedItemTaste === "new") {
					return
				}
				let amountSelectedTaste = itemCollection[selectedItemTitle]?.find((el: { [x: string]: any; }) => el[selectedItemTaste])
				setTasteAmount(amountSelectedTaste[selectedItemTaste])

			}
		}, [selectedItemTaste])

		const [tasteAmount, setTasteAmount] = useState<number>(0)

		const onSelectTitle = (e: React.ChangeEvent<HTMLSelectElement> | undefined) => {
			let selectedValue = e?.currentTarget?.value
			if (selectedValue) {
				setSelectedItemTitle(selectedValue)
			}
		}

		const onSelectTaste = (e: React.ChangeEvent<HTMLSelectElement> | undefined) => {
			let selectedValue = e?.currentTarget?.value
			if (selectedValue) {
				setSelectedItemTaste(selectedValue)
			}
		}

		const onInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			if (isNaN((+e.currentTarget.value))) {
				return
			}
			setTasteAmount((+e.currentTarget.value))

		}

		const onNewItemTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			setItemTitle(e.currentTarget.value)
		}
		const onNewItemTasteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			setItemTaste(e.currentTarget.value)
		}

		const HandleSubmit = () => {
			console.log(itemCollection)
			const docRef = doc(db, "users", uid);


			if (selectedItemTitle === "new" && selectedItemTaste === "new") {
				updateDoc(docRef, {
					Items: {
						...itemCollection,
						[newItemTitle]: [
							{[newItemTaste]: tasteAmount}
						],
					}
				}).then(() => { window.location.reload()})
			}
			// TODO !!!!!!!
			if (selectedItemTitle !== "new" && selectedItemTaste === "new") {
				updateDoc(docRef, {
					Items: {
						...itemCollection,
						[selectedItemTitle]: [
							...itemCollection?.[selectedItemTitle]
								?.map((el: any) => {
									return {...el}
								}),
							{[newItemTaste]: tasteAmount}
						],
					}
				}).then(() => { window.location.reload()})

			}
			if (selectedItemTitle !== "new" && selectedItemTaste !== "new") {
				updateDoc(docRef, {
					Items: {
						...itemCollection,
						[selectedItemTitle]: [
							...itemCollection[selectedItemTitle]
								.map((el: any) => {
									if (Object.keys(el)[0] === selectedItemTaste) {
										return {
											[selectedItemTaste]: tasteAmount
										}
									} else {
										return {...el}
									}
								})

						]
					}
				}).then(() => { window.location.reload()})
			}

		}
		return (
			<div>
				<div>
					<select onChange={onSelectTitle}>
						<option selected disabled>Жидкости</option>
						{Object.keys(itemCollection).map(el => {
							return (
								<option value={el}>{el}</option>
							)
						})}
						<option value="new">Добавить</option>
					</select>
				</div>

				{selectedItemTitle === "new" &&
     <div>Название жидкости - <input value={newItemTitle} onChange={onNewItemTitleChange} type="text"/></div>}
				<div>
					<select onChange={onSelectTaste} disabled={selectedItemTitle === ""}>
						<option selected disabled>Жидкости</option>
						{itemCollection[selectedItemTitle]?.map((el: {}) => {
							let keys = Object.keys(el)
							return (
								<option value={keys}>{keys}</option>
							)
						})}
						<option value="new">Добавить</option>
					</select>
				</div>
				{selectedItemTaste === "new" &&
     <div>Название вкуса жидкости - <input value={newItemTaste} onChange={onNewItemTasteChange} type="text"/></div>}
				<div>Количество товара - <input value={tasteAmount} onChange={onInputValueChange}/></div>

				<Button
					disabled={selectedItemTitle === "" || selectedItemTaste === ""}
					variant="contained"
					color="secondary"
					onClick={HandleSubmit}>Подтвердить</Button>
			</div>
		);
	}
;

export default AddItems;