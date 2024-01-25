import Map "mo:map/Map";
import JSON "mo:json/JSON";
import Buffer "mo:base/Buffer";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import {print} "mo:base/Debug";
import Array "mo:base/Array";
import List "mo:base/List";
import Option "mo:base/Option";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Bool "mo:base/Bool";
import Types "./modules/types";
import Constants "modules/constants";
import Notes "modules/notes";
import Utils "modules/utils";

shared ({caller}) actor class Dnote(){

	type UserData = Types.UserData;

	type Note = Types.Note;

	type User = Types.User;

	let owner = caller;

	let MAX_NOTES_PER_USER = Constants.MAX_NOTES_PER_USER;
	let MAX_CHARS_NOTE_TITLE = Constants.MAX_CHARS_NOTE_TITLE;
	let MIN_CHARS_NOTE_TITLE  = Constants.MIN_CHARS_NOTE_TITLE;
	let MAX_CHARS_NOTE_DESC = Constants.MAX_CHARS_NOTE_DESC;
	let MIN_CHARS_NOTE_DESC = Constants.MIN_CHARS_NOTE_DESC;

	let { phash } = Map;

	stable let users = Map.new<Principal, User>(phash);
	stable let notes = Map.new<Principal, List.List<Note>>(phash);


	public shared ({ caller }) func createNote({ description : Text; title : Text }:Note) : async Text {

		assert not Principal.isAnonymous(caller);

		assert Text.size(title) < MAX_CHARS_NOTE_TITLE 
		and Text.size(title) > MIN_CHARS_NOTE_TITLE;

		assert Text.size(description) < MAX_CHARS_NOTE_DESC 
		and Text.size(description) > MIN_CHARS_NOTE_DESC;
		
		Notes.createNote(caller, notes, {description; title; id="0"});
	};


	public shared query ({ caller }) func readNotes() : async Text {

		assert not Principal.isAnonymous(caller);

  		Notes.readNotes(caller, notes);
	};


	public shared ({ caller }) func updateNote({title:Text; description:Text; id:Text;  }) : async Text {

		assert not Principal.isAnonymous(caller);

		assert Text.size(title) < MAX_CHARS_NOTE_TITLE 
		and Text.size(title) > MIN_CHARS_NOTE_TITLE;

		assert Text.size(description) < MAX_CHARS_NOTE_DESC 
		and Text.size(description) > MIN_CHARS_NOTE_DESC;

		Notes.updateNote(caller, {id; title; description}, notes);
	};
	

	public shared ({ caller }) func deleteNote(id:Text) : async () {

		assert not Principal.isAnonymous(caller);

		let userNotes = Option.get(Map.get(notes, phash, caller), List.nil());

		ignore Map.put(notes, phash, caller, List.filter(userNotes, func(note:Note): Bool { note.id != id }));
	};

}
