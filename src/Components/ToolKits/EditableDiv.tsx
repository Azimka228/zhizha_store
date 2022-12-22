import React, {ChangeEvent, useState} from "react";
import {Button, TextField} from "@mui/material";
import DoneOutlineTwoToneIcon from "@mui/icons-material/DoneOutlineTwoTone";
import BorderColorTwoToneIcon from "@mui/icons-material/BorderColorTwoTone";

type EditableDivType = {
	Name?: object
	callbackSubmit: (e: any) => void
}

const EditableDiv: React.FC<EditableDivType> = ({Name, callbackSubmit}) => {

	const [editable, setEditable] = useState(false)
	const [textFieldValue, setTextFieldValue] = useState<any>({
		...Name
	})
	const objNameKey: string = Object.keys(textFieldValue)[0]

	const onsubmitHanlder = () => {
		callbackSubmit(textFieldValue)
		setEditable(false)
	}
	const onClickEditHandler = () => {
		setEditable(true)
	}

	const onChangeTextFieldValue = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const newObj = {
			[objNameKey]: e.currentTarget.value
		}
		console.log(newObj)
		setTextFieldValue({
			...newObj
		})
	}

	return (
		<div style={{display: "flex"}}>
			{editable ?
				<>
					<TextField label="Name" name="text" value={textFieldValue[objNameKey]} onChange={onChangeTextFieldValue}/>
					<Button onClick={onsubmitHanlder}>
						<DoneOutlineTwoToneIcon/>
					</Button>
				</>
				:
				<>
					<p>{textFieldValue[objNameKey]} </p>
					<Button onClick={onClickEditHandler}>
						<BorderColorTwoToneIcon color="primary"/>
					</Button>

				</>
			}
		</div>
	);
};

export default EditableDiv;