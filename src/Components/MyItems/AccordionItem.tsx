import React, {ChangeEvent, useState} from "react";
import EditableItem from "./EditableItem";

type AccrodionType = {
	title: string
	taste: Array<object>
	onDelete: (title: any, taste: any) => void
	onChangeText: (value: any, currValue: any) => void
	onAddNewTasteItem: (title: any) => void
}

const AccordionItem: React.FC<AccrodionType> = ({
																																																	title,
																																																	taste,
																																																	onDelete,
																																																	onChangeText
																																																}) => {
	const [collapsed, setCollapsed] = useState(false)
	const [editable, setEditable] = useState(false)
	const [text, setText] = useState(title)

	const changeStateCollapsed = () => {
		setCollapsed(!collapsed)
	}
	const onClickChangeStateEditable = () => {
		setEditable(true)
	}
	const onBlurChangeStateEditable = () => {
		setEditable(false)
	}
	const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		onChangeText(title,e.currentTarget.value)
		setText(e.currentTarget.value)
	}

	const onClickDeleteBTN = (title: any, taste: any = {}) => {
		onDelete(title, taste)
	}

	return (
		<div>
			<div style={{display: "flex"}}>
				{editable ?
					<input
						onBlur={onBlurChangeStateEditable}
						onChange={onInputChange}
						value={text}
					/> :
					<>
						<b onClick={changeStateCollapsed}>{title} </b>
						<button onClick={onClickChangeStateEditable}>✍</button>
						<button onClick={() => onClickDeleteBTN(title)}>X</button>
					</>
				}
				{collapsed ? "^" : "˅"}
			</div>
			{collapsed &&
    <div>
					{taste.map((el: any) => {
						return <EditableItem title={title} startValue={el} onClickDeleteBTN={onClickDeleteBTN}/>
					})
					}
     <button onClick={() => console.log(title)}>+</button>
    </div>
			}
		</div>
	);
};

export default AccordionItem;