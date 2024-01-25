import Types "./types";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Option "mo:base/Option";
import List "mo:base/List";
import Buffer "mo:base/Buffer";
import Map "mo:map/Map";
import Constants "constants";
import JSON "mo:json/JSON";
import Utils "utils";

module {

	type UserData = Types.UserData;

	type Note = Types.Note;

	type User = Types.User;

	let MAX_NOTES_PER_USER = Constants.MAX_NOTES_PER_USER;

	let { phash } = Map;

	public func createNote(
		caller : Principal,
		notes : Map.Map<Principal, List.List<Note>>,
		{ description : Text; title : Text } : Note,
	) : Text {

		var time = Time.now(); // 2023-07-19 05:45:44.873008989 UTC: [Canister bkyz2-fmaaa-aaaaa-qaaaq-cai] +1_689_745_544_873_008_989
		let withNewId = Int.toText(time);

		let userNotes = Option.get(Map.get(notes, phash, caller), List.nil<Note>());

		assert List.size(userNotes) <= MAX_NOTES_PER_USER;

		let newNote = {
			id = withNewId;
			title = title;
			description = description;
		};

		ignore Map.put(notes, phash, caller, List.push(newNote, userNotes));

		withNewId;
	};

	public func readNotes(
		caller : Principal,
		notes : Map.Map<Principal, List.List<Note>>,
	) : Text {

		let userNotes = Option.get(Map.get(notes, phash, caller), List.nil());

		//assert List.size(userNotes) < MAX_NOTES_PER_USER;

		var entries = Buffer.fromArray<JSON.JSON>([]);

		List.iterate(
			userNotes,
			func(note : Note) {
				entries.add(
					#Object([
						("id", #String(note.id)),
						("title", #String(note.title)),
						("description", #String(note.description)),
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
		notes : Map.Map<Principal, List.List<Note>>,
	) : Text {

		let userNotes = Option.get(Map.get(notes, phash, caller), List.nil<Note>());
		let time = Time.now();
		let withNewId = Int.toText(time);

		var updatedNotes = List.map(
			userNotes,
			func(note : Note) : Note {
				if (note.id == id) { { title; description; id = withNewId } } else {
					note;
				};
			},
		);

		ignore Map.put(notes, phash, caller, updatedNotes);

		withNewId;
	};
};
