export type NewUser = {
	name: String;
	birthday: Number;
};

export type NoteType = {
	id: string;
	title: string;
	description: string;
};

export type Identity = {
	identity:{getPrincipal:Function;};
	backend:{readNotes:Function};
	notes:[];
}