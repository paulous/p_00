module BaseTypes {

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
};
