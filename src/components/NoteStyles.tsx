import styled,{  keyframes } from "styled-components";

const blink = keyframes `
    from {
        background-color: rgb(214, 0, 0);
    }
    to {
        background-color: rgb(0, 255, 0);
    }
`

export const EditBtn = styled.div`
	position:absolute;
	top:0;
	left:0;
	right:0;
	bottom:0;
	border-radius:12px;

	span{
		position:absolute;
		left:20px;
		bottom:15px;
	}

	&:hover{
		background:rgba(22, 25, 37, 0.1);
	}
`
export const Main = styled.div`
	position:relative;
	width:300px;
	height:max-content;
	min-height:350px;
	border-radius:12px;
	padding:12px;
	cursor:pointer;
	background:rgba(41, 45, 62, 1);
	display:flex;

	.note-front{
		h2{line-height:1;}
		p{
			white-space: pre-line; 
			hyphens: auto;   
			word-wrap: break-word;
			font-size:1.2rem;
			margin:0.8em 0;
		}

		.align-date{
			position:absolute;
			right:10px;
			bottom:10px;
			display:flex;
			align-items:center;
			font-size:0.8rem;
			gap:6px;

			.updated-on{
				width:2px;
				height:2px;
				background:rgb(0,255, 0);
				padding:3px;
				border-radius:50%;
			}
		}
	}
	.updated-off{
		position:absolute;
		right:10px;
		bottom:10px;
		width:2px;
		height:2px;
		background:rgb(255,0,0);
		padding:3px;
		border-radius:50%;
		animation: ${blink} 0.1s infinite alternate;
	}
	.delete{
		position:absolute;
		right:0px;
		top:0px;
		width:30px;
		height:30px;
		display:flex;
		align-items:center;
		justify-content:center;
		background:rgba(22, 25, 37, 0.5);
		border-radius:12px;
	}


	form{
		position:absolute;
		left:0;
		right:0;
		pointer-events:none;
		
		input, textarea{pointer-events:auto;}

		button{
			pointer-events:auto;
			align-self:flex-end;
			background:rgba(22, 25, 37, 1);
			padding:5px 10px;
			border:3px solid rgba(22, 25, 37, 0.3);
			border-radius:3px;
		};
	};
`