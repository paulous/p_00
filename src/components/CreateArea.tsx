import { useState } from 'react';
import styled from 'styled-components';
import Note from './Note';
import NoteNew from './NoteNew';
//import { backend } from '../declarations/backend';
//import Loader from "./Loader";
import { NoteType, Identity } from '../Types';

const NotesCont = styled.div`
  display: flex;
  flex-direction: row;
  flex-flow: wrap;
  justify-content: center;
  gap: 5px;
  padding: 5px;

  .add-new-title{
	  h2{
		padding:1em 0;
	}
  }

  form {
    display: flex;
    flex-flow: column;
    padding: 12px;
    gap: 6px;
  }

  input {
    background: black;
    padding: 6px;
    max-width: 500px;
  }
  textarea {
    background: black;
    padding: 6px;
    max-width: 500px;
  }
`;

const AddNoteBtn = styled.a`
  position: fixed;
  right: clamp(30px, 5vw, 100px);
  bottom: clamp(20px, 6vw, 300px);
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(50px, 10vw, 75px);
  height: clamp(50px, 10vw, 75px);
  background: rgba(46, 95, 212, 1);
  font-size: clamp(2rem, 10vw, 5rem);
  border-radius: 50%;
  color: rgba(22, 25, 37, 1);
  z-index: 1;
`

function CreateArea({ actor, setActor }: any) {
	let { backend, notes } = actor;

	const [toggleAddNote, setToggleAddNote] = useState(false);
	const [updating, setUpdating] = useState('');

	const toggle = () => setToggleAddNote(!toggleAddNote);

	async function addNote(newNote: NoteType) {
		let { title, description } = newNote;
		if (!newNote.title || !newNote.description) return;

		//setNote({ title: '', description: '', id: '' });
		setToggleAddNote(!toggleAddNote);
		setActor((state: Identity) => ({
			...state,
			notes: [{ title, description, id: '' }, ...state.notes],
		}));

		let descRetainFormatting = JSON.stringify(description)
			.replace(/\\"/g, '"')
			.replace(/"/g, '');

		try {
			let datetime = await backend.createNote({
				title,
				description: descRetainFormatting,
				id: '',
			});

			setActor((state: Identity) => ({
				...state,
				notes: state.notes.map((note: NoteType, i, a: NoteType[]) => {
					if (note.id === '') {
						a[i].id = datetime;
					}
					return note;
				}),
			}));
		} catch (error) {
			console.log(error);
		}
	}

	async function updateNote({ title, description, id }: NoteType) {
		let oldnote = notes[notes.findIndex((n: NoteType) => n.id === id)];
		if (title === oldnote.title && description === oldnote.description) return;

		setUpdating(id)
		setActor((state: Identity) => {
			let indx = state.notes.findIndex((note: NoteType) => note.id === id);
			let s: Array<NoteType> = state.notes.slice(0);
			s[indx] = { title, description, id };
			return { ...state, notes: s };
		});

		let descRetainFormatting = JSON.stringify(description)
			.replace(/\\"/g, '"')
			.replace(/"/g, '');

		try {
			let datetime = await backend.updateNote({
				title,
				description: descRetainFormatting,
				id,
			});
			setUpdating('')
			//setNote({ title: '', description: '', id: '' });
			setActor((state: Identity) => ({
				...state,
				notes: state.notes.map((note: NoteType, i, a: NoteType[]) => {
					if (note.id === id) {
						a[i].id = datetime;
					}
					return note;
				}),
			}));
		} catch (error) { }
	}

	async function deleteNote(id: string) {
		setUpdating(id)
		try {
			await actor.backend.deleteNote(id);
			setUpdating('')
			setActor((state: Identity) => ({
				...state,
				notes: state.notes.filter((note: NoteType) => note.id !== id),
			}));
		} catch (error) {
			console.log('error on delete.');
		}
	}

	return (
		<>
			<NotesCont>
				{toggleAddNote && (
					<div className='add-new-title'>
						<h2>Add a new note.</h2>
						<NoteNew onAdd={addNote} />
					</div>
				)}
				{notes && !toggleAddNote &&
					notes.map((note: NoteType, index: number) => {
						return (
							<Note
								key={`${index}_note`}
								note={note}
								onUpdate={updateNote}
								onDelete={deleteNote}
								updating={updating}
							/>
						);
					})}
				<AddNoteBtn title="Create note" onClick={toggle}>
					{toggleAddNote ? '-' : '+'}
				</AddNoteBtn>
			</NotesCont>
		</>
	);
}

export default CreateArea;
