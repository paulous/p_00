import styled from "styled-components";

const Main = styled.main`
	position:relative;
	display: flex;
	flex-flow:wrap;
	//align-items:center;
	//justify-content:center;
	background:rgba(214, 108, 83, 1);
	//height:100%;
	//padding:2%;
	padding:2%;
	//gap:15px;
	//flex-grow:2;
	
	section{
		padding:30px; 
		min-width:300px;
		max-width:300px;
		flex-grow:1;

		p{font-size:1.1rem; line-height:2;}
	}
	section:first-child{}
	section:nth-child(2){}
	section:last-child{}
`

export default function Footer() {
  return (
	<Main>
			<section><h3>HOME</h3><p>Idium of paradox</p><p>Ways of seeing</p><p>The selfish meme</p><p>Time scale</p></section>
			<section><h3>ABOUT</h3><p>Why?</p><p>Who cares?</p><p>FAQ</p></section>
			<section><h3>SUPPORT</h3><p>Help</p><p>Open source</p><p>Decentralised</p><p>Free to use</p><p>Self govern</p></section>
	</Main>
  )
}
