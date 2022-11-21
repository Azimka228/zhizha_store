import React, {ChangeEvent, useState} from "react";

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
		<div style={{display: "flex"}}>
			{editable ?
				<>
					<input name="text" onChange={onInputChange} value={inputValues.text}/>
					<input name="count" type="number"  onChange={onInputChange} value={+inputValues.count}/>
						<button onClick={onsubmitHanlder}> + </button>
				</>
			 :
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