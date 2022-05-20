import React from "react";
import styled from 'styled-components'

const Button = styled.button`
    background-color: #5097fa;
    color: #fff;
    border: none;
    padding: 10px;
    margin: 4px;
    border-radius: 4px;

    &:hover {
        cursor: pointer;
    }
  `

function PrimaryButton(props: any) {
  return <Button onClick={props.onClick}>{props.children}</Button>
}

export default PrimaryButton;
