import { css } from "lit";

export const aStyles = css`
    a {
        color: #C20A0A;
        text-decoration: none;
        font-weight: bold;
    }

    a:visited {
        color: #9e0101;
    }

    a:hover {
        text-shadow: 1px 1px 2px #9C9C9C;
        text-decoration: none;
    }
}`;

export const buttonStyles = css`
  button {
    background: #ed9111;
    font-size: 20px;
    cursor: pointer;
    vertical-align: middle;
    border-radius: 3px;
    border-color: #ed2311;
  }
`;

export const inputStyles = css`
  input[type="text"] {
    background: white;
    border: 1px solid #ed6511;
    padding: 6px 5px;
    font-size: 1em;
    font-family: Helvetica, sans-serif;
    box-shadow: inset -1px 1px 1px rgba(255, 255, 255, 0.65);
  }

  input[type="text"]:hover,
  input[type="text"]:focus {
    text-shadow: 1px 1px 0 #eae7e7;
  }
`;
