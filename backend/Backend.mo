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

//import UserManagement "UserManagement";
//import NoteManagement "NoteManagement";
//import JSONHandling "JSONHandling";
//import Validation "Validation";

shared ({caller}) actor class Dnote(){


	public type UserData = {
		uiPrefs:{
			theme:Bool;
			pinned:[Nat];
			order:[Nat];
		};
		points:[Nat];
	};

	public type Note = {
		id:Text;
		title:Text;
		description:Text
	};

	public type User = {
		principal : Principal;
		userData:UserData;
	};

	//public type NotesMap = Map.Principal<List.List<Note>>;

	let owner = caller;


	let { phash } = Map;
	stable let users = Map.new<Principal, User>(phash);
	stable let notes = Map.new<Principal, List.List<Note>>(phash);


	private stable var nextNoteId: Nat = 1;
	private let MAX_NOTES_PER_USER = 50;
    private let MAX_DEVICES_PER_USER = 3;

    private func users_invariant(): Bool {
        Map.size(notes) == Map.size(users)
    };

    private func user_count(): Nat {
        Map.size(notes)
    };

	private func register_user(principal: Principal): User {
		
		var new:User = {
			principal;
			userData = {
				uiPrefs = {
					theme = true;
					pinned = [0, 1];
					order = [0,1];
				}; 
				points = [0];
			};
		};

		Map.set(users, phash, caller, new);

		new;
    };

	private func is_user_registered(principal: Principal): Bool {
        Option.isSome(Map.get(users, phash, principal));
    };

	private func setUserProps(new:User) : async () {
		Map.set(users, phash, caller, new);
		print(debug_show(caller));
	};

	public shared query ({ caller }) func getUser() : async ?User {
		let t = Map.get(users, phash, caller);
		print(debug_show(caller));
		t;
	};

	public shared ({ caller }) func createNote({ description : Text; title : Text }:Note) : async Text {
		var titleSize = Text.size(title);
		var descriptionSize = Text.size(description);

		/*assert titleSize < 50 
		and titleSize > 2 
		and descriptionSize < 250 
		and descriptionSize > 5
		and not Principal.isAnonymous(caller)
		and is_user_registered(caller);*/
		

		var time = Time.now(); // 2023-07-19 05:45:44.873008989 UTC: [Canister bkyz2-fmaaa-aaaaa-qaaaq-cai] +1_689_745_544_873_008_989 
		let withNewId =  Int.toText(time);
		
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

	public shared query ({ caller }) func readNotes() : async Text {
		var newuser = {};
		if(is_user_registered(caller) == false ){
				newuser := register_user(caller);	
			
		};

  		let userNotes = Option.get(Map.get(notes, phash, caller), List.nil());

		//assert List.size(userNotes) < MAX_NOTES_PER_USER;
		
		var entries = Buffer.fromArray<JSON.JSON>([]);

		List.iterate(userNotes, func(note:Note){
			entries.add(
				#Object([
					("id", #String(note.id)),
					("title", #String(note.title)),
					("description", #String(note.description)),
				])
			);
		});

		JSON.show(#Array(Buffer.toArray(entries)));
	};

	public shared ({ caller }) func updateNote({title:Text; description:Text; id:Text;  }) : async Text {
		var titleSize = Text.size(title);
		var descriptionSize = Text.size(description);

		assert titleSize < 50 and titleSize > 2 and descriptionSize < 250 and descriptionSize > 5;

		let userNotes = Option.get(Map.get(notes, phash, caller), List.nil<Note>());
		let time = Time.now();
		let withNewId =  Int.toText(time);

		var updatedNotes = List.map(userNotes, func (note: Note): Note {
            if (note.id == id) {
                {title; description; id = withNewId;}
            } else {
                note
            }
        });

		ignore Map.put(notes, phash, caller, updatedNotes);

		withNewId

	};
	
	public shared ({ caller }) func deleteNote(id:Text) : async () {
		let userNotes:List.List<Note> = Option.get(Map.get(notes, phash, caller), List.nil());

		ignore Map.put(notes, phash, caller, List.filter(userNotes, func(note:Note): Bool { note.id != id }));
	};

}
