import Types "./types";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Option "mo:base/Option";
import List "mo:base/List";
import Buffer "mo:base/Buffer";
import { print } "mo:base/Debug";
import Map "mo:map/Map";
import Constants "constants";
import JSON "mo:json/JSON";
import Utils "utils";

module {

	type State = Types.State;

	type Note = Types.Note;
	type PubUserNote = Types.PubUserNote;

	type User = Types.User;

	let MAX_NOTES_PER_USER = Constants.MAX_NOTES_PER_USER;
	let MAX_PUBLIC_NOTES = Constants.MAX_PUBLIC_NOTES;

	let { phash } = Map;



	public func updateUserPubNote (
		caller:Principal, 
		state : State,
		{
			title : Text;
			description : Text;
			id : Text;
			principal : Text;
			pub:Bool;
		},
	) : Text {

		let pubNoteUser = Principal.fromText(principal);

		switch (Map.get(state.notes, phash, pubNoteUser)) {
			case (null) {
				var time = Time.now(); // 2023-07-19 05:45:44.873008989 UTC: [Canister bkyz2-fmaaa-aaaaa-qaaaq-cai] +1_689_745_544_873_008_989
				let withNewId = Int.toText(time);
				withNewId;
			};
			case (?notes) {
				//let userNotes = Option.get(Map.get(state.notes, phash, pubNoteUser), List.nil<Note>());
				//let time = Time.now();
				//let withNewId = Int.toText(time);

				var updatedNotes = List.map(
					notes,
					func(note : Note) : Note {
						if (note.id == id) {
							{ title; description; id; pub = true };
						} else {
							note;
						};
					},
				);

				Map.set(state.notes, phash, pubNoteUser, updatedNotes);

				id;
			};
		};
	};

	public func pubNotes(state : State) : Text {
		
		var pubnotes = Buffer.fromArray<JSON.JSON>([]);

		Map.forEach<Principal, List.List<Note>>(state.notes, func (key, notesList) {
			

			List.iterate(notesList, func (note:Note) { 
				if(note.pub){
					pubnotes.add( #Object([
						("id", #String(note.id)),
						("title", #String(note.title)),
						("description", #String(note.description)),
						("pub", #Boolean(note.pub)),
					]) );
				}
			});
		});

		JSON.show(#Array(Buffer.toArray(pubnotes)));
	};


	public func userPubNotes(caller : Principal, state : State) : Text {
		
		var pubnotes = Buffer.fromArray<JSON.JSON>([]);

		Map.forEach<Principal, List.List<Note>>(state.notes, func (key, notesList) {
			

			List.iterate(notesList, func (note:Note) { 
				if(note.pub){
					pubnotes.add( #Object([
						("id", #String(note.id)),
						("title", #String(note.title)),
						("description", #String(note.description)),
						("pub", #Boolean(note.pub)),
						("principal", #String(Principal.toText(key))),
					]) );
				}
			});
		});

		JSON.show(#Array(Buffer.toArray(pubnotes)));
	};

	public func pubPriv(id : Text, caller : Principal, state : State) : Text {

		var time = Time.now();
		let withNewId = Int.toText(time);

		let notes = Option.get(Map.get(state.notes, phash, caller), List.nil());// get notes

		assert not List.isNil(notes);// are there 0 notes?

		let pubSize = List.filter<Note>(notes, func (note) {note.pub == true});// how many

		if (not List.isNil(pubSize)){// if there are pub = true notes

			let getNote:Note or {pub:Bool} = switch (List.find<Note>(pubSize, func (note) {note.id == id})){
				case (null) {{pub = false}};// no current note exists
				case (?note) {note};// get current note
			};
			//if current note pub = true, then check how many notes are public
			if(getNote.pub == false and List.size(pubSize) > MAX_PUBLIC_NOTES) return "MAX_PUBLIC_NOTES";
		};

		let result = switch (List.find<Note>(notes, func(note) { note.id == id })) {
			case (null) {"";};
			case (?note) {

				let newNote:Note = {
					id = note.id;
					title = note.title;
					description = note.description;
					pub = if (note.pub) false else true;
				};

				let updatedNotes:List.List<Note> = List.map(
					notes,
					func(note : Note) : Note { if (note.id == id) newNote else note },
				);

				ignore Map.put(state.notes, phash, caller, updatedNotes);

				//print(debug_show(updatedNotes));
				//print(debug_show(Option.get(Map.get(state.notes, phash, caller), List.nil())));

				newNote.id;
			};
		};
	};
};

