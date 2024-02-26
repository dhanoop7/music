import React, { useEffect } from 'react';
import styled from 'styled-components';
import { AiFillClockCircle } from 'react-icons/ai';
import { useStateProvider } from '../utils/StateProvider';
import axios from 'axios';

const Container = styled.div``;

export default function Body() {
  const [{ token, selectedPlaylistsId }, dispatch] = useStateProvider();

  useEffect(() => {
    const getInitialPlaylists = async () => {
      try {
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${selectedPlaylistsId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data); // Log the playlist data
      } catch (error) {
        console.error('Error fetching initial playlists:', error);
      }
    };

    getInitialPlaylists();
  }, [token, selectedPlaylistsId, dispatch]);

  return <Container></Container>;
}
