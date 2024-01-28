import Map "mo:map/Map";
import List "mo:base/List";
import Result "mo:base/Result";
import JSON "mo:json/JSON";

module BaseTypes {

	public type Users = Map.Map<Principal, User>;
	public type Notes = Map.Map<Principal, List.List<Note>>;

	public type State = object {
		users:Users;
		notes:Notes;
	};

	public type User = {
		owner: Principal;
		creation:Int;
	};

	public type Note = {
		id:Text;
		title:Text;
		description:Text
	};

	type Error = {
        # TimeRemaining : Int;
        # AnonNotAllowed;
        # UserNotFound;
    };

	public type PostResult = Result.Result<(), PostError>;
    type PostError = Error or { # InvalidNote };

	public type UserResult = Result.Result<JSON.JSON , User>;
    type UserError = Error or { # InvalidUser };

};
