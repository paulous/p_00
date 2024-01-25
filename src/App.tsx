import { useState, useEffect } from 'react';
import { AnonymousIdentity } from '@dfinity/agent';
import { backend } from './declarations/backend';
import styled from 'styled-components';
import { GlobalStyle } from './GlobalStyle';
import SignIn from './components/SignIn';
import CreateArea from './components/CreateArea';
import { Identity } from './Types';

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

  .sdiv {
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
  justify-content: space-evenly;
  align-items: flex-start;
  flex-grow: 1;
`;

export default function App() {
  const [actor, setActor] = useState<Identity>({
    identity: new AnonymousIdentity(),
    backend,
    notes: [],
  });

  const fetchData = async (signedin: any) => {
    const notesArray = await signedin.readNotes();
    let notes = JSON.parse(notesArray);
    notes && setActor((state) => ({ ...state, notes }));
  };

  //useEffect(() => { fetchData(actor.backend) }, [])

  return (
    <>
      <GlobalStyle $darkColor />
      <AppMain>
        <Nav>
          <h2>dNote</h2>
          <div className="sdiv">
            <h4>{actor.identity.getPrincipal().toString()}</h4>
            <SignIn {...{ setActor, fetchData }} />
          </div>
        </Nav>
        <Main>
          <CreateArea {...{ actor, setActor }} />
        </Main>
      </AppMain>
    </>
  );
}
