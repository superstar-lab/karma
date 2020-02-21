import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

import activity from '../assets/activity-white.svg';
import plus from '../assets/plus.svg';

const Container = styled.div`
  display: flex;
  flex-direction: row;

  button:first-child {
    background: none;
    margin-right: 40px;

    position: relative;

    img {
      width: 38px;
      height: 38px;
    }

    &:after {
      content: '';
      width: 8px;
      height: 8px;
      background: ${props => props.theme.warning};
      border-radius: 50%;

      position: absolute;
      top: 2px;
      right: -10px;
    }
  }

  button:last-child {
    width: 200px;
    background: linear-gradient(270deg, #26cc8b 0%, #2adce8 100%) 0% 0%;
    color: #fff;
    padding: 10px 15px;
    font-size: 22px;
    font-weight: 900;
    box-shadow: 0px 3px 25px #26cc8b80;
    border-radius: 90px;

    display: flex;
    align-items: center;

    img {
      width: 29px;
      height: 29px;
      margin-right: 10px;
    }
  }
`;

const Actions: React.FC = () => {
  const router = useRouter();

  return (
    <Container>
      <button onClick={() => router.push('/activity')}>
        <img src={activity} alt="Activity" />
      </button>

      <button>
        <img src={plus} alt="create post" />
        Create Post
      </button>
    </Container>
  );
};

export default Actions;
