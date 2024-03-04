import Map "mo:map/Map";
import JSON "mo:json/JSON";
import Buffer "mo:base/Buffer";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import List "mo:base/List";
import Option "mo:base/Option";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Bool "mo:base/Bool";
import {print} "mo:base/Debug";
import Error "mo:base/Error";

import Types "./modules/types";
import Constants "modules/constants";
import Notes "modules/notes";
import PubNotes "modules/userPubNotes";
import Utils "modules/utils";

shared ({caller}) actor class Dnote(){

	type State = Types.State;

	type Note = Types.Note;

	type User = Types.User;

	type PubUserNote = Types.PubUserNote;

	let owner = caller;

	let MAX_NOTES_PER_USER = Constants.MAX_NOTES_PER_USER;
	let MAX_CHARS_NOTE_TITLE = Constants.MAX_CHARS_NOTE_TITLE;
	let MIN_CHARS_NOTE_TITLE  = Constants.MIN_CHARS_NOTE_TITLE;
	let MAX_CHARS_NOTE_DESC = Constants.MAX_CHARS_NOTE_DESC;
	let MIN_CHARS_NOTE_DESC = Constants.MIN_CHARS_NOTE_DESC;

	let { phash } = Map;

	stable let state:State = object {
		public let users = Map.new<Principal, User>(phash);
		public let notes = Map.new<Principal, List.List<Note>>(phash);
	};



	public shared ({caller}) func isUserRegistred () : async Text {

		if (Principal.isAnonymous(caller)) throw Error.reject("Anonymous users cannot register");


		Utils.is_user_registered(caller, state.users);
	};




	public shared ({caller}) func updateUserPubNote (pubNoteUpdate:PubUserNote) : async Text {

		if (Principal.isAnonymous(caller)) throw Error.reject("Anonymous no");

  		PubNotes.updateUserPubNote(caller, state, pubNoteUpdate );
	};

	public shared query ({caller}) func userPubNotes () : async Text {

		if (Principal.isAnonymous(caller)) throw Error.reject("Anonymous no");

		PubNotes.userPubNotes(caller, state);
	};

	public shared ({caller}) func pubPriv (noteId:Text) : async Text {

		if (Principal.isAnonymous(caller)) throw Error.reject("Anonymous no");

		PubNotes.pubPriv(noteId, caller, state);
	};

	public shared func pubNotes () : async Text {

		PubNotes.pubNotes(state);
	};



	public shared ({ caller }) func createNote({ description : Text; title : Text }:Note) : async Text {

		assert not Principal.isAnonymous(caller);

		assert Text.size(title) < MAX_CHARS_NOTE_TITLE 
		and Text.size(title) > MIN_CHARS_NOTE_TITLE;

		assert Text.size(description) < MAX_CHARS_NOTE_DESC 
		and Text.size(description) > MIN_CHARS_NOTE_DESC;
		
		Notes.createNote(caller, state, {description; title; id="0"; pub=false});
	};


	public shared query ({ caller }) func readNotes() : async Text {

		assert not Principal.isAnonymous(caller);

  		Notes.readNotes(caller, state);
	};


	public shared ({ caller }) func updateNote({ title:Text; description:Text; id:Text }) : async Text {

		assert not Principal.isAnonymous(caller);

		assert Text.size(title) < MAX_CHARS_NOTE_TITLE 
		and Text.size(title) > MIN_CHARS_NOTE_TITLE;

		assert Text.size(description) < MAX_CHARS_NOTE_DESC 
		and Text.size(description) > MIN_CHARS_NOTE_DESC;

		Notes.updateNote(caller, {id; title; description}, state);
	};
	

	public shared ({ caller }) func deleteNote(id:Text) : async () {

		assert not Principal.isAnonymous(caller);

		let userNotes = Option.get(Map.get(state.notes, phash, caller), List.nil());

		ignore Map.put(state.notes, phash, caller, List.filter(userNotes, func(note:Note): Bool { note.id != id }));
	};

}
