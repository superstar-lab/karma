import React from 'react';
import styled from 'styled-components';

import karma from '../assets/logo.png';
import Avatar from '../Avatar';

import { SendMoneyFormProps } from './Form';

import { withoutAvatar } from '..';

const Container = styled.div<{ hasProfile: boolean }>`
  background: rgba(255, 255, 255, 0.2);
  padding: 20px;
  border-radius: 200px;
  box-shadow: 0px 3px 6px #0000001a;

  display: flex;
  justify-content: space-between;
  align-items: center;

  > section {
    display: flex;
    flex-direction: column;
    align-items: ${props => (props.hasProfile ? 'center' : 'flex-start')};

    strong {
      color: #fff;
      font-size: 16px;
      font-weight: 900;
      margin-bottom: 3px;
    }

    input {
      background: none;
      border: none;

      font-size: 16px;
      font-weight: 900;
      color: #fff;

      &::placeholder {
        color: rgba(255, 255, 255, 0.6);
      }
    }

    span {
      font-size: 16px;
      font-weight: 900;
      color: #fff;
    }
  }
`;

const Logo = styled.div`
  width: 45px;
  height: 45px;
  background: #1d0b45;
  border-radius: 50%;
  box-shadow: 0px 3px 20px #00000066;

  display: flex;
  justify-content: center;
  align-items: center;

  img {
    height: 30px;
  }
`;

const SendTo: React.FC<SendMoneyFormProps> = ({ profile, onChangeTo, to }) => {
  if (profile) {
    return (
      <Container hasProfile>
        <Avatar path={profile.avatar || withoutAvatar} alt={profile.username} />

        <section>
          <strong>Sending To </strong>
          <span>{profile.name}</span>
        </section>

        <Logo>
          <img src={karma} alt="KARMA" />
        </Logo>
      </Container>
    );
  }

  return (
    <Container hasProfile={false}>
      <section>
        <strong>Send To: </strong>

        <input type="text" placeholder="WAX account name" value={to} onChange={e => onChangeTo(e.target.value)} />
      </section>

      <Logo>
        <img src={karma} alt="KARMA" />
      </Logo>
    </Container>
  );
};

export default SendTo;
