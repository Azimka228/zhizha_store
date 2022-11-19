import React, {useCallback, useEffect, useState} from "react";
import {doc, onSnapshot, updateDoc} from "firebase/firestore";
import {db} from "../../Firebase";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	styled,
	TextField
} from "@mui/material";
import AccordionItem from "./AccordionItem";
import CloseIcon from "@mui/icons-material/Close";

const BootstrapDialog = styled(Dialog)(({theme}) => ({
	"& .MuiDialogContent-root": {
		padding: theme.spacing(6),
	},
	"& .MuiDialogActions-root": {
		padding: theme.spacing(1),
	},
}));

export interface DialogTitleProps {
	id: string;
	children?: React.ReactNode;
	onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
	const {children, onClose, ...other} = props;

	return (
		<DialogTitle sx={{m: 0, p: 2}} {...other}>
			{children}
			{onClose ? (
				<IconButton
					aria-label="close"
					onClick={onClose}
					sx={{
						position: "absolute",
						right: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<CloseIcon/>
				</IconButton>
			) : null}
		</DialogTitle>
	);
}

type MyItemsProps = {
	uid: string
}

const MyItems: React.FC<MyItemsProps> = ({uid}) => {
	const [items, setItems] = useState<any>({})
	const [newTitle, setNewTitle] = useState<string>("")
	const [newTaste, setNewTaste] = useState<string>("")

	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const test = useCallback(() => {
		onSnapshot(doc(db, "users", uid), (doc) => {
			let obj = doc.data()
			setItems(obj?.Items)
		});
	}, [setItems])

	useEffect(() => {
		test()
	}, [])

	function isObjectEmpty(value: object) {
		return (
			Object.prototype.toString.call(value) === "[object Object]" && JSON.stringify(value) === "{}"
		);
	}

	const onDelete = (title: any, taste: any = {}) => {
		const docRef = doc(db, "users", uid);
		let obj
		if (isObjectEmpty(taste)) {
			obj = {
				...items
			}
			delete obj[title]
		} else {
			obj = {
				...items,
				[title]: [
					...items[title].filter((el: any) => el !== taste)
				]

			}
		}
		updateDoc(docRef, {
			Items: {
				...obj
			},
		})

	}

	const onChangeText = (value: any, currValue: any) => {
		const docRef = doc(db, "users", uid);
		let obj = {
			...items
		}
		obj[currValue] = obj[value].map((el: any) => ({...el}))
		delete obj[value]
		console.log(obj)
		updateDoc(docRef, {
			Items: {
				...obj
			},
		})
	}

	const onAddNewTasteItem = (title: any) => {

		console.log(title)

	}
	const onAddNewTitleItem = () => {
		const docRef = doc(db, "users", uid);
		let obj = {
			...items
		}
		updateDoc(docRef, {
			Items: {
				...obj,
				[newTitle]: []
			},
		})
		setNewTitle("")
		handleClose()
	}

	return (
		<div>
			<Button variant="contained" color="success" onClick={handleOpen}>Новая жидкость</Button>
			<BootstrapDialog
				onClose={handleClose}
				aria-labelledby="customized-dialog-title"
				open={open}
			>
				<BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
					Новая жидкость
				</BootstrapDialogTitle>
				<DialogContent dividers>
					<TextField
						id="outlined-basic"
						label="Текст"
						onChange={(e) => {
							setNewTitle(e.currentTarget.value)
						}}
						value={newTitle}
						variant="outlined"/>
				</DialogContent>
				<DialogActions>
					<Button autoFocus onClick={onAddNewTitleItem}>
						Подтвердить
					</Button>
				</DialogActions>
			</BootstrapDialog>
			<Box>
				{items ? Object.keys(items)?.map(key => (
					<AccordionItem
						title={key}
						taste={items[key]}
						onDelete={onDelete}
						onChangeText={onChangeText}
						onAddNewTasteItem={onAddNewTasteItem}

					/>
				)) : <div>loading...</div>}
			</Box>

		</div>
	);
};

export default MyItems;