import { useState } from 'react';
import styled from 'styled-components';
import Note from './Note';
import NoteNew from './NoteNew';
//import { backend } from '../declarations/backend';
//import Loader from "./Loader";
import { NoteType, State } from '../Types';

const NotesCont = styled.div`
  display: flex;
  flex-direction: row;
  flex-flow: wrap;
  justify-content: center;
  gap: 5px;
  //padding: 5px;
  flex-grow: 1;


  .add-new-title {
    h2 {
      padding: 1em 0;
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
`;

function CreateArea({ actor, setActor }: any) {

	let { backend, notes, isAuth, userPubNotes, identity } = actor;

	const [toggleAddNote, setToggleAddNote] = useState(false);
	const [updating, setUpdating] = useState<String>('');

	const toggle = () => setToggleAddNote(!toggleAddNote);

	async function addNote(newNote: NoteType) {
		let { title, description, pub } = newNote;

		if (
			!title ||
			!description ||
			title.length < 3 ||
			title.length > 50 ||
			description.length < 3 ||
			description.length > 250
		)
			return;

		//setNote({ title: '', description: '', id: '' });
		setToggleAddNote(!toggleAddNote);
		setActor((state: State) => ({
			...state,
			notes: [{ title, description, id: '', pub }, ...state.notes],
		}));

		let descRetainFormatting = JSON.stringify(description)
			.replace(/\\"/g, '"')
			.replace(/"/g, '');

		try {
			let datetime = await backend.createNote({
				title,
				description: descRetainFormatting,
				id: '',
				pub: false,
			});

			setActor((state: State) => ({
				...state,
				notes: state.notes.map((note, i, a) => {
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

	async function updateNote({ title, description, id, pub, principal }: NoteType) {

		let isPubNotes = pub && principal ? userPubNotes  : notes;

		let oldnote = isPubNotes[isPubNotes.findIndex((n: NoteType) => n.id === id)] || "";
		
		if (title === oldnote.title && description === oldnote.description) return;

		if (
			!title ||
			!description ||
			title.length < 3 ||
			title.length > 50 ||
			description.length < 3 ||
			description.length > 250
		)
			return;

		setUpdating(id);
		setActor((state: State) => {
			let indx = isPubNotes?.findIndex((note: NoteType) => note.id === id);

			let s = isPubNotes?.slice(0);

			pub && principal ? s[indx] = { title, description, id, pub, principal} : s[indx] = { title, description, id, pub};

			return { ...state, [pub && principal ? "userPubNotes" : "notes"]: s };
		});

		let descRetainFormatting = JSON.stringify(description)
			.replace(/\\"/g, '"')
			.replace(/"/g, '');

		try {
			pub && principal
			?	await backend.updateUserPubNote({
					title,
					description: descRetainFormatting,
					id,
					pub,
					principal
				}) 
			: 	await backend.updateNote({
					title,
					description: descRetainFormatting,
					id,
					pub,
				});
			setUpdating('');
			//setNote({ title: '', description: '', id: '' });
			setActor((state: State) => ({
				...state,
				[pub ? userPubNotes : notes]: [pub ? userPubNotes : notes]?.map((note: NoteType, i, a: NoteType[]) => {
					if (note.id === id) {
						a[i] = { title, description, id, pub, principal };
					}
					return note;
				}),
			}));
		} catch (error) { }
	}

	async function deleteNote(id: string, pub:boolean) {
		setUpdating(id);
		try {
			await actor.backend.deleteNote(id);
			setUpdating('');
			setActor((state: State) => {

				let isPubNotes = pub ? userPubNotes  : notes;
				let s = isPubNotes?.slice(0);

				return({
					...state,
					[pub ? "userPubNotes" : "notes"]: s.filter((note: NoteType) => note.id !== id),
				})
			});
		} catch (error) {
			console.log('error on delete.');
		}
	}

	const pubSwitch = (pub:boolean, id:string) => {
		//pub hasn't changed yet
		let pubToPriv =!pub ? userPubNotes  : notes;
		let privToPub = pub ? userPubNotes  : notes;
		let a = pubToPriv?.slice(0);
		let b = privToPub?.slice(0);

		let putin = a.find((note: NoteType) => note.id === id );

		if(pub){

			let n = { ...putin, pub, principal:identity.getPrincipal().toString() };
			
			putin = [...b, n]

		}else{
			
			let {principal, ...noPrince} = putin;
			let noP = noPrince;
			let n = { ...noP, pub };
			
			putin = [...b, n]
		};


		let takeout = a.filter((note: NoteType) => note.id !== id);

		setActor((state: State) => {
			return({
				...state,
				[!pub ? "userPubNotes" : "notes"]: takeout,
				[pub ? "userPubNotes" : "notes"]: putin
			})
		});
	};
	

	return (
		<>
			<NotesCont>
				{isAuth && notes.length > 0 
				? <h3 style={{ width: '100%' }}>My private notes:</h3>
				:<h3 style={{ width: '100%' }}>Public user notes:</h3>
					}
				{toggleAddNote && (
					<div className="add-new-title">
						<h2>Add a new note.</h2>
						<NoteNew onAdd={addNote} />
					</div>
				)}
				{!toggleAddNote &&
					notes.map((note: NoteType, index: number) => {
						return (
							<Note
								key={`${index}_note`}
								note={note}
								onUpdate={updateNote}
								onDelete={deleteNote}
								updating={updating}
								setUpdating={setUpdating}
								backend={backend}
								isAuth={isAuth}
								identity={identity}
								pubSwitch={pubSwitch}
							/>
						);
					})}
				{isAuth && (
					<AddNoteBtn title="Create note" onClick={toggle}>
						{toggleAddNote ? '-' : '+'}
					</AddNoteBtn>
				)}
			</NotesCont>
			{isAuth && (
				<NotesCont>
					{userPubNotes.length > 0 && (
						<h3 style={{ width: '100%' }}>All users public notes:</h3>
					)}
					{userPubNotes.length > 0 &&
						userPubNotes.map((note: NoteType, index: number) => {
							return (
								<Note
									key={`${index}_pubnote`}
									note={note}
									onUpdate={updateNote}
									onDelete={deleteNote}
									updating={updating}
									setUpdating={setUpdating}
									backend={backend}
									isAuth={isAuth}
									identity={identity}
									pubSwitch={pubSwitch}
								/>
							);
						})}
				</NotesCont>
			)}
		</>
	);
}

export default CreateArea;
