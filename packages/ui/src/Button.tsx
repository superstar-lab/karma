import React from 'react';

import styled from 'styled-components';

const Container = styled.button<Props>`
  background: ${props => (props.background ? props.theme[props.background] : 'none')};
  color: ${props => props.color || props.theme.white};
  padding: 5px 20px;
  border: ${props => (props.border ? '2px solid #fff' : 'none')};
  border-radius: ${props => (props.radius === 'default' ? '8px' : '26px')};
  opacity: ${props => (!props.disabled ? '1' : '0.2')};
  cursor: ${props => (!props.disabled ? 'pointer' : 'not-allowed')};
  transition: all 0.2s;
`;

interface Props {
  background?: 'green' | 'darkGradient' | 'lightGradient' | 'dark' | 'lightGreen';
  color?: string;
  radius?: 'default' | 'rounded';
  disabled?: boolean;
  loading?: boolean;
  border?: boolean;
  children: React.ReactChild;
  css?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<Props> = ({ children, radius = 'default', ...props }) => {
  return (
    <Container radius={radius} {...props}>
      {children}
    </Container>
  );
};

export default Button;