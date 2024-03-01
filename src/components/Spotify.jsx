// Spotify.jsx

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Body from './Body';
import Footer from './Footer';
import axios from 'axios';
import { useStateProvider } from '../utils/StateProvider';
import { reducerCases } from '../utils/Constants';

const Container = styled.div`
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-rows: 85vh 15vh;

  .spotify_body {
    display: grid;
    grid-template-columns: 15vw 85vw;
    height: 100%;
    width: 100%;
    background: linear-gradient(transparent, rgba(0, 0, 0, 1));
    background-color: rgb(117, 14, 33);

    .body {
      height: 100%;
      width: 100%;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0.7rem;
        &-thumb {
          background-color: rgba(255, 255, 255, 0.6);
        }
      }
    }
  }
`;

export default function Spotify() {
  const [{ token }, dispatch] = useStateProvider();
  const bodyRef = useRef();
  const [navBackground, setNavBackground] = useState(false);
  const [headerBackground, setHeaderBackground] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const bodyScroll = () => {
    bodyRef.current.scrollTop >= 30 ? setNavBackground(true) : setNavBackground(false);

    bodyRef.current.scrollTop >= 268 ? setHeaderBackground(true) : setHeaderBackground(false);
  };

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const { data } = response;

        const userInfo = {
          userID: data.id,
          userName: data.display_name,
        };

        dispatch({ type: reducerCases.SET_USER, userInfo });
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    getUserInfo();
  }, [dispatch, token]);

  useEffect(() => {
    const searchTracks = async () => {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/search?q=${searchTerm}&type=track`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const tracks = response.data.tracks.items.map(({ id, name, artists, album, duration_ms }) => ({
          id,
          name,
          artists: artists.map((artist) => artist.name),
          image: album.images[0].url,
          duration: duration_ms,
        }));

        setSearchResults(tracks);
      } catch (error) {
        console.error('Error searching tracks:', error);
      }
    };

    if (searchTerm.trim() !== '') {
      searchTracks();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, token]);

  return (
    <Container>
      <div className='spotify_body'>
        <Sidebar />
        <div className='body' ref={bodyRef} onScroll={bodyScroll}>
          <Navbar navBackground={navBackground} onSearchChange={setSearchTerm} />
          <div className='body_contents'>
            <Body headerBackground={headerBackground} searchResults={searchResults} />
          </div>
        </div>
      </div>
      <div className='spotify_footer'>
        <Footer />
      </div>
    </Container>
  );
}
