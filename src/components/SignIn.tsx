import { useState } from "react"
import { createActor, backend } from "../declarations/backend"
import { canisterId } from "../declarations/internet_identity"
import { AuthClient } from "@dfinity/auth-client"
import { HttpAgent, AnonymousIdentity } from "@dfinity/agent"
//import { Principal } from '@dfinity/principal'

export default function SignIn({setActor, fetchData}:any){

	let [authC, authCset] =  useState<{logout:any, isAuthenticated:any}>();
	
	let actor = backend;

	let handle = async (authClient:AuthClient) => {

		const configValue:string = (process.env.CANISTER_ID_BACKEND as string)
		const identity = authClient.getIdentity();
		const agent = new HttpAgent({ identity });

		actor = createActor(configValue, {
			agent,
		});

		setActor((state:any) => (
			{...state, 
				identity, 
				backend:actor, 
				logout:authClient.logout, 
				isAuth:authClient.isAuthenticated
			}
		))

		let isAuthenticated:boolean = await authClient?.isAuthenticated()
		authCset({logout:authClient.logout, isAuthenticated});
		fetchData(actor)

		//let isUser = await actor.setUser()
	}

	let signin = async (e: { preventDefault: () => void }) => {
		e.preventDefault();

		//console.log(await authC?.isAuthenticated)
		if(await authC?.isAuthenticated){
			authC?.logout();
			setActor(
				{
					identity:new AnonymousIdentity(),
					backend,
					notes: []
				}
			);
			authCset((state:any) => ({...state, isAuthenticated:false}));
			//fetchData(backend)
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

		// Chrome, Firefox: http://<canister_id>.localhost:4943
		// Safari: http://localhost:4943?canisterId=<canister_id>


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