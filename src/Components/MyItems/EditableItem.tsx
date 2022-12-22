import React, {ChangeEvent, useState} from "react";
import {Button, IconButton, TextField} from "@mui/material";
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import DeleteIcon from "@mui/icons-material/Delete";
import DoneOutlineTwoToneIcon from '@mui/icons-material/DoneOutlineTwoTone';

type EdEditableItemType = {
	title: string
	startValue: object
	onClickDeleteBTN: (title: any, taste: any) => void
	index:number
	onChangeTasteItemHandler: (index: any, currValue:any) => void
}

const EditableItem:React.FC<EdEditableItemType> = ({title,startValue,onClickDeleteBTN,index,onChangeTasteItemHandler}) => {

	const [editable, setEditable] = useState(false)
	const [inputValues, setInputValues] = useState({
		text:Object.keys(startValue)[0],
		count:Object.values(startValue)[0]
	})



	const onClickChangeStateEditable = () => {
		console.log(index)
		setEditable(true)
	}

	const onInputChange = (e:ChangeEvent<HTMLInputElement>) => {
		setInputValues({
			...inputValues,
			[e.target.name]: e.currentTarget.value
		})
		console.log(inputValues)
	}

	const onClickDeleteBTNHandler = (title: any, taste: any) => {
		onClickDeleteBTN(title,taste)
	}

	const onsubmitHanlder = () => {
		onChangeTasteItemHandler(index,inputValues)
		setEditable(false)
	}

	return (
		<div style={{display: "flex", borderBottom:"2px solid grey"}}>
			{editable ?
				<>
					<TextField name="text" onChange={onInputChange} value={inputValues.text}/>
					<TextField name="count" type="number"  onChange={onInputChange} value={+inputValues.count}/>
						<Button onClick={onsubmitHanlder}>
						<DoneOutlineTwoToneIcon/>
						</Button>
				</>
			 :
				<>
					<p>{Object.keys(startValue)[0]} -  {Object.values(startValue)[0]} штук</p>
					<Button onClick={onClickChangeStateEditable}>
						<BorderColorTwoToneIcon color="primary"/>
					</Button>
					<IconButton aria-label="delete"onClick={() => onClickDeleteBTNHandler(title,startValue)}>
						<DeleteIcon/>
					</IconButton>
				</>
			}
		</div>
	);
};

export default EditableItem;