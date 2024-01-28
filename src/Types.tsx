import { ActorSubclass, AnonymousIdentity, Identity } from "@dfinity/agent";
import { _SERVICE } from "./declarations/backend/backend.did";

export type User = {
	owner: String;
	creation: Number;
};

export type NoteType = {
	id: string;
	title: string;
	description: string;
};

export type State = {
	user:User | {};
	identity:Identity | AnonymousIdentity;
	backend:ActorSubclass<_SERVICE>;
	notes:[NoteType] | [];
	isAuth:Boolean;

}