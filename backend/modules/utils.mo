import Option "mo:base/Option";
import Principal "mo:base/Principal";
import List "mo:base/List";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Buffer "mo:base/Buffer";
import Map "mo:map/Map";
import JSON "mo:json/JSON";
import {print} "mo:base/Debug";
import None "mo:base/None";

import Types "types";

module {

	type Note = Types.Note;
	type User = Types.User;

	let { phash } = Map;

	public func is_user_registered(caller : Principal, users : Map.Map<Principal, User>) : Text {

		
		switch (Map.get(users, phash, caller)){

			case (null) {
				let creation = Time.now();
				let log = List.make<Int>(creation);
				print(debug_show(log));
				let usr:User = {owner = caller; creation; log; pub = {notes = List.nil()}};
				ignore Map.put(users, phash, caller, usr);

				JSON.show(
					#Object([
						("owner", #String(Principal.toText(caller))),
						("creation", #Number(usr.creation)),
						("log", #Array([#Number(creation)])),
						("pub", #Object([("notes", #Array([]))])) 
					])
				);

			};

			case (?user) {
				let now = Time.now();
				let log = user.log;
				let newLog = List.push(now, log);

				let notes = user.pub.notes;
				//let pubNotes = Option.get(Map.get(user.pub.notes, phash, caller), List.nil());

				let updateUsr = {owner = caller; creation = user.creation; log = newLog; pub = user.pub};
				ignore Map.put(users, phash, caller, updateUsr);

				var logEntries = Buffer.fromArray<JSON.JSON>([]);
				var pubEntries = Buffer.fromArray<JSON.JSON>([]);

				List.iterate(newLog, func (log:Int) { logEntries.add( #Number(log) ) });
				List.iterate(notes, func (pub:Text) { pubEntries.add( #String(pub) ) });
				
				JSON.show(
					#Object([
						("owner", #String(Principal.toText(user.owner))),
						("creation", #Number(user.creation)),
						("log", #Array(Buffer.toArray(logEntries))),
						("pub", #Object([("notes", #Array(Buffer.toArray(pubEntries)))])) 
					])
				);
			};
		};
	};

	public func users_invariant(notes:Map.Map<Principal, List.List<Note>>, users : Map.Map<Principal, User>) : Bool {
		Map.size(notes) == Map.size(users);
	};

	public func user_count(notes:Map.Map<Principal, List.List<Note>>) : Nat {
		Map.size(notes);
	};
};
