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

	type User = Types.User;

	let MAX_NOTES_PER_USER = Constants.MAX_NOTES_PER_USER;
	let MAX_PUBLIC_NOTES = Constants.MAX_PUBLIC_NOTES;

	let { phash } = Map;

	
	public func createNote(
		caller : Principal,
		state : State,
		{
			description : Text;
			title : Text;
			id : Text;
			pub : Bool;
		} : Note,
	) : Text {

		switch (Map.get(state.notes, phash, caller)) {

			case (null) {
				var time = Time.now(); // 2023-07-19 05:45:44.873008989 UTC: [Canister bkyz2-fmaaa-aaaaa-qaaaq-cai] +1_689_745_544_873_008_989
				let withNewId = Int.toText(time);

				let newList = List.nil<Note>();

				let newNote = {
					id = withNewId;
					title = title;
					description = description;
					pub = false;
				};

				ignore Map.put(state.notes, phash, caller, List.push(newNote, newList));

				withNewId;
			};

			case (?notes) {

				var time = Time.now(); // 2023-07-19 05:45:44.873008989 UTC: [Canister bkyz2-fmaaa-aaaaa-qaaaq-cai] +1_689_745_544_873_008_989
				let withNewId = Int.toText(time);

				assert List.size(notes) <= MAX_NOTES_PER_USER;

				let newNote = {
					id = withNewId;
					title = title;
					description = description;
					pub = false;
				};

				ignore Map.put(state.notes, phash, caller, List.push(newNote, notes));

				withNewId;
			};
		};
	};

	public func readNotes(
		caller : Principal,
		state : State,
	) : Text {

		let userNotes = Option.get(Map.get(state.notes, phash, caller), List.nil());

		var entries = Buffer.fromArray<JSON.JSON>([]);

		List.iterate(
			userNotes,
			func(note : Note) {
				if (note.pub == false) entries.add(
					#Object([
						("id", #String(note.id)),
						("title", #String(note.title)),
						("description", #String(note.description)),
						("pub", #Boolean(note.pub))
					])
				);
			},
		);

		JSON.show(#Array(Buffer.toArray(entries)));
	};

	public func updateNote(
		caller : Principal,
		{
			title : Text;
			description : Text;
			id : Text;
		},
		state : State,
	) : Text {

		switch (Map.get(state.users, phash, caller)) {
			case (null) {
				var time = Time.now(); // 2023-07-19 05:45:44.873008989 UTC: [Canister bkyz2-fmaaa-aaaaa-qaaaq-cai] +1_689_745_544_873_008_989
				let withNewId = Int.toText(time);
				withNewId;
			};
			case (?usr) {
				let userNotes = Option.get(Map.get(state.notes, phash, caller), List.nil<Note>());
				let time = Time.now();
				let withNewId = Int.toText(time);

				var updatedNotes = List.map(
					userNotes,
					func(note : Note) : Note {
						if (note.id == id) {
							{ title; description; id = withNewId; pub = note.pub };
						} else {
							note;
						};
					},
				);

				ignore Map.put(state.notes, phash, caller, updatedNotes);

				withNewId;
			};
		};
	};
};
