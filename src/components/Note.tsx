import {useState, useEffect, useRef} from "react";
import {NoteType} from "../Types";
import {Main, EditBtn} from './noteStyles';

export default function Note(props: any) {

	const [update, setUpdate] = useState<Boolean>(false);
	const [updateNote, setUpdateNote] = useState<NoteType>(props.note);
	const [pub, setPub] = useState<Boolean>(props.note.pub);
	const [pubUpdating, setPubUpdating] = useState<Boolean>(false);

	let p = useRef(props.note.principal);
	let up = useRef(props.identity.getPrincipal().toString());
	let principal = p.current;
	let userPrince = up.current;

	function handleClick(e: { preventDefault: () => void; currentTarget: { title: string; }; }) {
		e.preventDefault();

		if (e.currentTarget.title === 'edit') {
			setUpdate(!update);
			setUpdateNote(props.note);

		}else if (e.currentTarget.title === 'update') {
			
			setUpdate(false);
			props.onUpdate(updateNote);
		} 
		else if(e.currentTarget.title === 'delete'){
			props.onDelete(props.note.id, pub);
		}
	};

	function handleChange(e: { preventDefault: () => void; target: { name: string; value: string; }; }) {
		e.preventDefault();

		const { name, value } = e.target;

		setUpdateNote((prevNote:NoteType) => {
			return {
				...prevNote,
				id:props.note.id,
				[name]: value
			};
		});
	}

	let pubToPriv = async () => {
		try {
			setPubUpdating(true);
			let response = await props.backend.pubPriv(props.note.id);
			setPubUpdating(false);
			
			if(response === "MAX_PUBLIC_NOTES") {alert("Max public notes is 3. "); return;}
			
			props.pubSwitch(!props.note.pub, props.note.id);
			
		} catch (error) {
			console.log(error)
		}
	}


	useEffect(() => {setPub(props.note.pub)}, [props.note]) //update needed for refresh
	
	/*let noteRowHeight = () => {//get breaks in string, set default. Hidden textarea +5
		//console.log(updateNote.description.replace(/\s\n/g," ").split(" ").length -1)
		//console.log(updateNote.description.split("\n").length)
		//return updateNote.description.replace(/\s\n/g," ").split(" ").length
		//return updateNote.description.length < 15 ? 30 : updateNote.description.length < 30 ? 15 :  Math.round(updateNote.description.length / 10)
		return 0
	}*/
	return (
		<Main $pub={pub}>
			{props.note.id && props.isAuth && <EditBtn title={'edit'} onClick={handleClick}><span>{update ? "< back" : ""}</span></EditBtn>}
			{((!update && props.isAuth && !principal) || (principal && principal === userPrince)) && <button title={'delete'} className="delete" onClick={handleClick}>
				X
			</button>}
			{update && props.isAuth
			?	<>
					<form>
						<input
						autoFocus
						name="title"
						onChange={handleChange}
						value={updateNote.title}
						placeholder={'Title'}
						maxLength={50}
						/>
						<textarea
						name="description"
						onChange={handleChange}
						value={updateNote.description}
						placeholder={'Description'}
						rows={8}
						maxLength={200}
						/>
						<button title={'update'} onClick={handleClick}>
							UPDATE
						</button>
					</form>
				</>
			:	<div className="note-front">
					{principal && <h6>{principal}</h6>}
					<h2>{props.note.title.toUpperCase()}</h2>
					<p>{props.note.description}</p>
					{	
						!pubUpdating
						?	<button className="align-public" onClick={pubToPriv} disabled={(principal && principal !== userPrince )|| !props.isAuth ? true : false}>
								<span className="pub-on" />
								<span>
									{pub ? "public" : "private"}
								</span>
							</button>
						:	<span className="pub-off" />
					}
					{
						props.note.id && props.updating !== props.note.id
						? 	<div className="align-date">
								<span>
									{new Date(Number(props.note.id.slice(0,13))).toDateString()}
								</span>
								<span className="updated-on" />
							</div> 
						: 	<span className="updated-off" />
					}
				</div>
			}
		</Main>
	);
};
