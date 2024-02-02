import { useState } from "react"
import { createActor, backend } from "../declarations/backend"
import { canisterId } from "../declarations/internet_identity"
import { AuthClient } from "@dfinity/auth-client"
import { HttpAgent, AnonymousIdentity, ActorSubclass } from "@dfinity/agent"
import { _SERVICE } from "../declarations/backend/backend.did"

import { State } from '../Types';

export default function SignIn({setActor}:any){

	type AuthC = {
		client:AuthClient,
		isAuthenticated:Boolean,
		actor:ActorSubclass<_SERVICE>
	}

	let [authC, authCset] =  useState<AuthC>();
	
	let actor = backend;

	let handle = async (authClient:AuthClient) => {

		const configValue:string = (process.env.CANISTER_ID_BACKEND as string);
		const identity = authClient.getIdentity();
		const agent = new HttpAgent({ identity });

		actor = createActor(configValue, {
			agent,
		});

		let user = JSON.parse( await actor.isUserRegistred() )

		setActor((state:State) => (
			{...state,
				user,
				identity, 
				backend:actor,
				isAuth:true
			}
		));

		let isAuthenticated:boolean = await authClient.isAuthenticated();

		authCset({client:authClient, isAuthenticated, actor});
		
		const notesArray = await actor.readNotes();
		let notes = JSON.parse(notesArray);

		console.log(notes)
		
		setActor((state:State) => ({ ...state, notes }));
	};

	let signin = async (e: { preventDefault: () => void }) => {
		e.preventDefault();

		if(authC && authC.isAuthenticated){

			//const client: AuthClient = await AuthClient.create();

			await authC.client.logout();

			const notesArray = await authC.actor.pubNotes();
			let notes = JSON.parse(notesArray);

			setActor(
				{
					user:{},
					identity:new AnonymousIdentity(),
					backend,
					notes,
					isAuth:false
				}
			);
			authCset((state:any) => ({...state, isAuthenticated:false}));
			
			return
		}
		
		let authClient = await AuthClient.create(
			{
				idleOptions: {
				  	idleTimeout: 1000 * 60 * 30, // set to 30 minutes
				  	disableDefaultIdleCallback: true // disable the default reload behavior
				}
			}
		);
		
		// start the login process and wait for it to finish
		// To access Internet Identity or configure it for your dapp, use one of the following URLs:

		await new Promise((resolve) => {
			authClient.login({
				identityProvider:
				process.env.DFX_NETWORK === "ic"
				? "https://identity.ic0.app"
				: `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`,
				maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),// 7 days
				onSuccess: async () => handle(authClient),
				windowOpenerFeatures:'"toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100"'
			});
		});
	}

	return (
		<a onClick={signin}>{authC?.isAuthenticated ? <h3>Sign Out</h3> : <h3>Sign In</h3> }</a>
	)
}