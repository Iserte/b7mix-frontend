import React from "react";
import styled from 'styled-components'

const Card = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 120px;
  height: 120px;
  border-radius: 4px;
  background-color: rgb(15,30,55);
  /* box-shadow: 0 0 4px rgb(35,40,40); */
  margin: 15px;
  text-decoration: none;
  color: #fff;
`
const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border: 1px solid rgb(50,50,80);
  border-radius: 50%;
`
const Name = styled.p`
  font-size: 14px;
  font-weight: bold;
`

function ProfileCard(props: any) {
  return props.selfUser ? (
    <Card href={props.profileurl} target="_blank" rel="noreferrer" className='self-user'>
      <Avatar src={props.src} alt="" />
      <Name>{props.personaname}</Name>
    </Card>
  ) : (
    <Card href={props.profileurl} target="_blank" rel="noreferrer" className='accountData'>
      <Avatar src={props.src} alt="" />
      <Name>{props.personaname}</Name>
    </Card>
  )
}

export default ProfileCard;
