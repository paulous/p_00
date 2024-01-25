import Option "mo:base/Option";
import Principal "mo:base/Principal";
import List "mo:base/List";
import Map "mo:map/Map";
import Types "types";

module {

	type Note = Types.Note;
	type User = Types.User;

	let { phash } = Map;

	public func is_user_registered(caller : Principal, users : Map.Map<Principal, User>) : Bool {
		Option.isSome(Map.get(users, phash, caller));
	};

	public func register_user(caller : Principal, users : Map.Map<Principal, User>) : User {

		var new : User = {
			principal = caller;
			userData = {
				uiPrefs = {
					theme = true;
					pinned = [0, 1];
					order = [0, 1];
				};
				points = [0];
			};
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
