import { ActorSubclass, AnonymousIdentity, Identity } from "@dfinity/agent";
import { _SERVICE } from "./declarations/backend/backend.did";

export type User = {
	owner: String;
	creation: Number;
	log:[Number];
	public:{notes:[Text]};
};

export type NoteType = {
	id: String;
	title: string;
	description: string;
	pub:Boolean;
	principal ? : String;
};

export type State = {
	user:User | {log:[]};
	identity:Identity | AnonymousIdentity;
	backend:ActorSubclass<_SERVICE>;
	notes:[NoteType] | [];
	userPubNotes?:[NoteType] | [];
	isAuth:Boolean;
};