import { useEffect, useState } from 'react';
import { AnonymousIdentity } from '@dfinity/agent';
import { backend } from './declarations/backend';
import styled from 'styled-components';
import { GlobalStyle } from './GlobalStyle';
import SignIn from './components/SignIn';
import CreateArea from './components/CreateArea';
import { State } from './Types';

const AppMain = styled.div`
  display: flex;
  flex-flow: column;
  height: 100vh;
`;
const Nav = styled.nav`
  background: rgba(46, 95, 212, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;

  div {
    container-type: normal;
    display: flex;
    align-items: center;
    cursor: pointer;

    h4 {
      margin: 0 15px;
      @media (max-width: 700px) {
        margin: 0 5px;
        font-size: small;
      }
    }
  }
`;
const Main = styled.main`
  display: flex;
`;

export default function App() {

  const [actor, setActor] = useState<State>({
    user: { log: [] },
    identity: new AnonymousIdentity(),
    backend,
    notes: [],
    isAuth: false,
  });

  const pubNotes = async () => {
	  const notesArray = await actor.backend.pubNotes();
	  let notes = JSON.parse(notesArray);
	  setActor((state:State) => ({...state, notes}))
  }
  
  useEffect(() => { pubNotes() }, [])
  

  return (
    <>
      <GlobalStyle $darkColor />
      <AppMain>
        <Nav>
          <h2>dNote</h2>
          <div>
            <h4>{actor?.identity?.getPrincipal().toString()}</h4>
            <h4>
              {actor?.user?.log?.length > 0 &&
                new Date(
                  Number(String(actor?.user?.log[0]).slice(0, 13))).toDateString()}
            </h4>
            <SignIn {...{ setActor }} />
          </div>
        </Nav>
        <Main>
          <CreateArea {...{ actor, setActor }} />
        </Main>
      </AppMain>
    </>
  );
}
