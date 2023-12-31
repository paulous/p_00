import { createGlobalStyle } from 'styled-components'


export const GlobalStyle = createGlobalStyle<{ $whiteColor?: boolean; $darkColor?: boolean; }>`
  body {
	margin:0;
    background: ${props => (props.$whiteColor ? 'rgba(153, 218, 229, 1)' : 'rgba(22, 25, 37, 1)')};	
  }
`