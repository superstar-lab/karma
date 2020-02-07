declare module 'styled-components' {
  export interface DefaultTheme {
    primary: string;
    white: string;
    green: string;
    lightGreen: string;
    darkGradient: string;
    lightGradient: string;
    dark: string;
    black: string;
    blue: string;
    gray: string;
    pink: string;
    warning: string;
  }
}

const theme = {
  primary: '#26CC8B',
  white: '#ffffff',
  green: '#26CC8B',
  lightGreen: 'rgba(38, 204, 139, 0.2)',
  darkGradient: 'linear-gradient(green, #333)',
  lightGradient: 'linear-gradient(green, #f4f4f4)',
  dark: '#20252E',
  black: '#191A19',
  blue: '#33375D',
  gray: '#757676',
  pink: '#f9c6ce',
  warning: '#EF3D52',
};

export default theme;