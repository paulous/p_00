import styled, { keyframes } from 'styled-components';

const blink = keyframes`
    from {
        background-color: rgb(214, 0, 0);
    }
    to {
        background-color: rgb(0, 255, 0);
    }
`;

export const EditBtn = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;

  span {
    position: absolute;
    left: 20px;
    bottom: 15px;
  }

  &:hover {
    background: rgba(22, 25, 37, 0.1);
  }
`;
export const Main = styled.div<{pub:Boolean}>`
  position: relative;
  width: 300px;
  height: max-content;
  min-height: 350px;
  border-radius: 6px;
  padding: 12px;
  cursor: pointer;
  background: rgba(41, 45, 62, 1);
  display: flex;

  .note-front {
    h2 {
      line-height: 1;
    }
    p {
      white-space: pre-line;
      hyphens: auto;
      word-wrap: balance;
      font-size: 1.2rem;
      margin: 0.8em 0;
    }

	.align-public {
		position: absolute;
		left: 5px;
		bottom: 5px;
		display: flex;
		align-items: center;
		font-size: 0.8rem;
		gap: 3px;
		color:${props => props.pub ? "rgba(68, 255, 68, 0.5);" : "rgb(214, 0, 0);"};
        background: ${props => props.pub ? "rgba(0, 255, 0, 0.1);" : "rgba(255, 0, 0, 0.1);"};
		border-radius: 3px;
		padding:2px 5px;
		
		.pub-on {
			width: 2px;
			height: 2px;
			background: ${props => props.pub ? "rgb(0, 255, 0);" : "rgb(255, 0, 0);"} 
			padding: 3px;
			border-radius: 50%;
      	}
	}

    .align-date {
      position: absolute;
      right: 10px;
      bottom: 7px;
      display: flex;
      align-items: center;
      font-size: 0.8rem;
      gap: 6px;

      .updated-on {
        width: 2px;
        height: 2px;
        background: rgb(0, 255, 0);
        padding: 3px;
        border-radius: 50%;
      }
    }
  }
  .pub-off {
    position: absolute;
    left: 10px;
    bottom: 13px;
    width: 2px;
    height: 2px;
    background: rgb(255, 0, 0);
    padding: 3px;
    border-radius: 50%;
    animation: ${blink} 0.1s infinite alternate;
  }
  .updated-off {
    position: absolute;
    right: 10px;
    bottom: 13px;
    width: 2px;
    height: 2px;
    background: rgb(255, 0, 0);
    padding: 3px;
    border-radius: 50%;
    animation: ${blink} 0.1s infinite alternate;
  }
  .delete {
    position: absolute;
    right: 0px;
    top: 0px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(22, 25, 37, 0.5);
    border-radius: 12px;
  }

  form {
    position: absolute;
    left: 0;
    right: 0;
    pointer-events: none;

    input,
    textarea {
      &:focus-visible {
        outline: 2px solid rgba(46, 95, 212, 1);
        border-radius: 3px;
      }
    }
    input,
    textarea {
      pointer-events: auto;
    }

    button {
      pointer-events: auto;
      align-self: flex-end;
      background: rgba(22, 25, 37, 1);
      padding: 5px 10px;
      border: 3px solid rgba(22, 25, 37, 0.3);
      border-radius: 3px;
    }
  }
`;
