import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useStateProvider } from '../utils/StateProvider';
import axios from 'axios';
import { reducerCases } from '../utils/Constants';

const Container = styled.div`
.track{
    display: flex;
    
    /* align-items: center; */
    gap: 1rem;
    &_info{
        /* display: flex;
        flex-direction: column; */
        gap: 0.3rem;
        h4{
            color: white;
            font-weight:lighter ;
        }
        h6{
            color: #b3b3b3;
        }

    }
}
`;

export default function CurrentTrack() {
  const [{ token, currentlyPlaying }, dispatch] = useStateProvider();

  useEffect(() => {
    const getCurrentTrack = async () => {
      try {
        const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (response.data && response.data.item) {
          const { item } = response.data;
          const currentlyPlaying = {
            id: item.id,
            name: item.name,
            artists: item.artists.map((artist) => artist.name),
            image: item.album.images[2].url,
          };
  
          dispatch({ type: reducerCases.SET_PLAYING, currentlyPlaying });
        } else {
          // Handle the case when no track is currently playing
          dispatch({ type: reducerCases.SET_PLAYING, currentlyPlaying: null });
        }
      } catch (error) {
        console.error('Error fetching currently playing track:', error);
        console.log(error.response); // Log the detailed error response
      }
    };
  
    getCurrentTrack();
  }, [token, dispatch]);

  return <Container>
    {
        currentlyPlaying && (
            <div className="track">
                <div className="track_image">
                    <img src={currentlyPlaying.image} alt='currentplaying' />
                </div>
                <div className="track_info">
                    <h4>{currentlyPlaying.name}</h4>
                    <h6>{currentlyPlaying.artists.join(", ")}</h6>
                </div>
            </div>
        )
    }
  </Container>;
}

