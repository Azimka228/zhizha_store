import React, {ChangeEvent, useState} from "react";

type EdEditableItemType = {
	title: string
	startValue: object
	onClickDeleteBTN: (title: any, taste: any) => void
}

const EditableItem:React.FC<EdEditableItemType> = ({title,startValue,onClickDeleteBTN}) => {

	const [editable, setEditable] = useState(false)
	const [text,setText] = useState(Object.keys(startValue)[0])


	const onClickChangeStateEditable = () => {
		setEditable(true)
	}
	const onBlurChangeStateEditable = () => {
		setEditable(false)
	}

	const onInputChange = (e:ChangeEvent<HTMLInputElement>) => {
		setText(e.currentTarget.value)
	}

	const onClickDeleteBTNHandler = (title: any, taste: any) => {
		onClickDeleteBTN(title,taste)
	}

	return (
		<div style={{display: "flex"}}>
			{editable ?
				<input onBlur={onBlurChangeStateEditable} onChange={onInputChange} value={text}/> :
				<>
					<p>{Object.keys(startValue)[0]} -  {Object.values(startValue)[0]} штук</p>
					<button onClick={onClickChangeStateEditable}>✍</button>
					<button onClick={() => onClickDeleteBTNHandler(title,startValue)}>X</button>
				</>
			}
		</div>
	);
};

export default EditableItem;