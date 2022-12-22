import React, {ChangeEvent, useState} from "react";
import EditableItem from "./EditableItem";
import {Button, DialogActions, DialogContent, IconButton, List, TextField} from "@mui/material";
import {BootstrapDialog, BootstrapDialogTitle} from "./MyItems";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorTwoToneIcon from "@mui/icons-material/BorderColorTwoTone";
import DoneOutlineTwoToneIcon from "@mui/icons-material/DoneOutlineTwoTone";
import ExpandMoreTwoToneIcon from "@mui/icons-material/ExpandMoreTwoTone";
import ExpandLessTwoToneIcon from "@mui/icons-material/ExpandLessTwoTone";

type AccrodionType = {
	title: string
	taste: Array<object>
	onDelete: (title: any, taste: any) => void
	onChangeText: (value: any, currValue: any) => void
	onAddNewTasteItem: (title: any, taste: any) => void
	onChangeTasteItem: (index: any, currValue: any, title: any) => void
}

type ModalWindowValues = {
	taste: string
	count: number
}

const AccordionItem: React.FC<AccrodionType> = ({
																																																	title,
																																																	taste,
																																																	onDelete,
																																																	onChangeText,
																																																	onAddNewTasteItem,
																																																	onChangeTasteItem
																																																}) => {
	const [open, setOpen] = React.useState(false);
	const [modalValues, setModalValues] = useState<ModalWindowValues>({
		taste: "",
		count: 1
	})
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const [collapsed, setCollapsed] = useState(false)
	const [editable, setEditable] = useState(false)
	const [titleValue, setTitleValue] = useState<string>(title)

	const changeStateCollapsed = () => {
		setCollapsed(!collapsed)
	}
	const onClickChangeStateEditable = () => {
		setEditable(true)
	}
	const onSubmitHandler = () => {
		onChangeText(title, titleValue)
		setEditable(false)
	}
	const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setTitleValue(e.currentTarget.value)
	}

	const onClickDeleteBTN = (title: any, taste: any = {}) => {
		onDelete(title, taste)
	}

	const onClickSubmit = () => {
		handleClose()
		setModalValues({
			taste: "",
			count: 1
		})
		onAddNewTasteItem(title, modalValues)
	}

	const onChangeTasteItemHandler = (index: any, currValue: any) => {
		onChangeTasteItem(index, currValue, title)
	}
	return (
		<List
			sx={{
				mt: 2,
				mb: 2,
				width: "80%",
				p: 2,
				maxWidth: 400,
				bgcolor: "background.paper",
				borderRadius: "4px",
				boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
			}}
		>
			<div>
				{editable ?
					<>
						<TextField
							onBlur={onSubmitHandler}
							onChange={onInputChange}
							value={titleValue}
						/>
						<Button onClick={onSubmitHandler}>
							<DoneOutlineTwoToneIcon/>
						</Button>
					</>
					:
					<>
						<div>
							<b>Производитель</b>
						</div>
						<div style={{
							display: "flex",
							justifyContent: "space-between",
							backgroundColor: "grey",
							borderRadius: "4px",
						}}>
							<p style={{
								wordBreak: "break-word",
								padding: "8px",
								margin: "0",
								color: "white",
							}}>{title}</p>
							<div style={{display: "flex"}}>
								<Button onClick={onClickChangeStateEditable}>
									<BorderColorTwoToneIcon color="primary"/>
								</Button>
								<IconButton aria-label="delete" onClick={() => onClickDeleteBTN(title)}>
									<DeleteIcon/>
								</IconButton>
								<Button onClick={changeStateCollapsed} color="inherit" variant="contained">
									{collapsed ?
										<ExpandLessTwoToneIcon/>
										:
										<ExpandMoreTwoToneIcon/>
									}
								</Button>
							</div>
						</div>
					</>

				}

			</div>
			{collapsed &&
    <div>
     <div>
      <b>Вкус</b>
     </div>
					{taste.map((el: any, index) => {
						return <EditableItem
							onChangeTasteItemHandler={onChangeTasteItemHandler}
							index={index}
							title={title}
							startValue={el}
							onClickDeleteBTN={onClickDeleteBTN}

						/>
					})
					}
     <div style={{display: "flex", justifyContent: "center", marginTop: "10px"}}>
      <Button variant="contained" color="inherit" onClick={handleOpen}>+</Button>
     </div>


     <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
     >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
       Новый вкус
      </BootstrapDialogTitle>
      <DialogContent dividers sx={{display: "flex", flexDirection: "column", jusifyContent: "center"}}>
       <TextField
        id="outlined-basic"
        label="Название"
        name="taste"
        onChange={(e) => {
									setModalValues({
										...modalValues,
										[e.target.name]: e.target.value,
									})
								}}
        value={modalValues.taste}
        sx={{mb: 2}}
        variant="outlined"/>
       <TextField
        type="number"
        id="outlined-basic"
        label="Количество"
        name="count"
        onChange={(e) => {
									if (typeof +(e.currentTarget.value) === "number") {
										setModalValues({
											...modalValues,
											[e.target.name]: +e.currentTarget.value,
										})
									}

								}}
        value={modalValues.count}
        variant="outlined"/>
      </DialogContent>
      <DialogActions>
       <Button autoFocus onClick={onClickSubmit}>
        Подтвердить
       </Button>
      </DialogActions>
     </BootstrapDialog>
    </div>
			}
		</List>
	);
};

export default AccordionItem;