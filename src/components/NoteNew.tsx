import {useState} from "react";
import {NoteType} from "../Types";
import {Main} from './NoteStyles';

export default function NoteNew(props:any) {

	const [updateNote, setUpdateNote] = useState<NoteType>({ title:'', description:'', id:'' });

	function handleClick(e: { preventDefault: () => void; currentTarget: { title: string; }; }) {
		e.preventDefault();
		props.onAdd(updateNote);

	}

	function handleChange(e: { preventDefault: () => void; target: { name: string; value: string; }; }) {
		e.preventDefault();

		const { name, value } = e.target;

		setUpdateNote((prevNote:NoteType) => {
			return {
				...prevNote,
				//id:'',
				[name]: value
			};
		});
	}
	
	return (
		<Main>
			<form>
				<input
				autoFocus
				name="title"
				onChange={handleChange}
				value={updateNote.title}
				placeholder={"Title"}
				maxLength={50}
				/>
				<textarea
				name="description"
				onChange={handleChange}
				value={updateNote.description}
				placeholder={"Description"}
				rows={8}
				maxLength={200}
				/>
				<button onClick={handleClick}>
					ADD
				</button>
			</form>
		</Main>
	);
};