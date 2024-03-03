import { useState } from "react";
import { NoteType } from "../Types";
import styled from 'styled-components';


const Main = styled.div`
  position: relative;
  width: 300px;
  height: max-content;
  min-height: 350px;
  border-radius: 6px;
  padding: 12px;
  cursor: pointer;
  background: rgba(41, 45, 62, 1);
  display: flex;

  @media (max-width: 600px) {
    width: 195px;
	padding: 1px;

  }

  form {
    position: absolute;
    left: 0;
    right: 0;
    pointer-events: none;

    input,
    textarea {
      &:focus-visible {
        outline: 2px solid rgba(46, 95, 212, 1);
        border-radius: 3px;
      }
    }
    input,
    textarea {
      pointer-events: auto;
    	}
	}

    button {
      pointer-events: auto;
      align-self: flex-end;
      background: rgba(22, 25, 37, 1);
      padding: 5px 10px;
      border: 3px solid rgba(22, 25, 37, 0.3);
      border-radius: 3px;
    }
`;

export default function NoteNew(props: any) {

	const [updateNote, setUpdateNote] = useState<NoteType>({ title: "", description: "", id: "", pub: false });


	function handleClick(e: { preventDefault: () => void; currentTarget: { title: String; }; }) {
		e.preventDefault();
		props.onAdd(updateNote);

	}

	function handleChange(e: { preventDefault: () => void; target: { name: string; value: string; }; }) {
		e.preventDefault();

		const { name, value } = e.target;

		setUpdateNote((prevNote: NoteType) => {
			return {
				...prevNote,
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