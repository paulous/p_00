import Option "mo:base/Option";
import Principal "mo:base/Principal";
import List "mo:base/List";
import Time "mo:base/Time";
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

				let usr = {owner = caller; creation = Time.now()};
				ignore Map.put(users, phash, caller, usr);

				JSON.show(
					#Object([
						("owner", #String(Principal.toText(caller))),
						("creation", #Number(usr.creation)),
						("new", #Boolean(true))
					])
				);
				
			};

			case (?user) {
				JSON.show(
					#Object([
						("owner", #String(Principal.toText(user.owner))),
						("creation", #Number(user.creation)),
					])
				);
			};
		};
	};

	public func register_user(caller : Principal, users : Map.Map<Principal, User>) : User {

		var new : User = {
			owner = caller;
			creation = Time.now();
		};

		ignore Map.put(users, phash, caller, new);

		new;
	};

	public func users_invariant(notes:Map.Map<Principal, List.List<Note>>, users : Map.Map<Principal, User>) : Bool {
		Map.size(notes) == Map.size(users);
	};

	public func user_count(notes:Map.Map<Principal, List.List<Note>>) : Nat {
		Map.size(notes);
	};
};
