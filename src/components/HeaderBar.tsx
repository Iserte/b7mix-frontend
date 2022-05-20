import React from "react";
import styled from 'styled-components'

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  background-color: rgb(10, 15, 22);
  color: #fff;
  border: none;
  padding: 10px;
`

function HeaderBar(props: any) {
  return <Header>{props.children}</Header>
}

export default HeaderBar;
