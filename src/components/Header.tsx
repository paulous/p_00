import styled from "styled-components"

const Main = styled.div`
	background:rgb(105, 68, 80);
	font-size:1.5rem;
	padding:12px;
`
export default function Header({identity}:any) {

  return (
	<Main><span>dNote</span></Main>
  )
}
