import React from "react";
import styled from 'styled-components'

const Button = styled.button`
    background-color: #55bb77;
    color: #fff;
    border: none;
    padding: 10px;
    margin: 4px;
    border-radius: 4px;

    &:hover {
        cursor: pointer;
    }
  `

function SuccessButton(props: any) {
  return <Button onClick={props.onClick}>{props.children}</Button>
}

export default SuccessButton;
