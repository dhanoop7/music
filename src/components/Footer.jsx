import React from 'react'
import styled from 'styled-components'
import CurrentTrack from './Currenttrack'
import Playercontrols from './Playercontrols'
import Volume from './Volume'

const Container = styled.div`
background-color: #181818;
height: 100%;
width: 100%;
border-top: 1px solid #282828;
display: flex;
grid-template-columns: 1fr 2fr 3fr;
align-items: center;
justify-content: space-evenly;
padding: 0 1rem;

`

export default function Footer() {
  return (
    <Container>
      <CurrentTrack/>
      <Playercontrols/>
      <Volume/>
      </Container>
  )
}
