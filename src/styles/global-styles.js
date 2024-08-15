import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Goorm Sans', sans-serif;
        background-color: #ffffff;
        font-style: normal;
    }

    a {
        text-decoration: none;
        color: inherit;
    }

    * {
        font-family: 'Goorm Sans', sans-serif;
        box-sizing: inherit;
    }

    .logo img {
        width: 150px;
        height: 150px;
    }

    @media (max-width: 600px) {
        .logo img {
            width: 100px;
            height: 100px;
        }
    }
`;
