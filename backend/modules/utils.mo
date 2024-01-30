import Option "mo:base/Option";
import Principal "mo:base/Principal";
import List "mo:base/List";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Buffer "mo:base/Buffer";
import Map "mo:map/Map";
import JSON "mo:json/JSON";

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

				let usr = {owner = caller; creation; log};
				ignore Map.put(users, phash, caller, usr);

				JSON.show(
					#Object([
						("owner", #String(Principal.toText(caller))),
						("creation", #Number(usr.creation)),
						("log", #Array([#Number(creation)])) 
					])
				);
			};

			case (?user) {
				let now = Time.now();
				let log = user.log;
				let newLog = List.push(now, user.log);

				let updateUsr = {owner = caller; creation = user.creation; log = newLog};
				ignore Map.put(users, phash, caller, updateUsr);

				var entries = Buffer.fromArray<JSON.JSON>([]);

				List.iterate(newLog, func (log:Int) {

					entries.add(
						#Number(log)
					);
				});
				
				JSON.show(
					#Object([
						("owner", #String(Principal.toText(user.owner))),
						("creation", #Number(user.creation)),
						("log", #Array(Buffer.toArray(entries)))
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
