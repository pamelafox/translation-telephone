import { css } from "lit";

export const inputStyles = css`
  input,
  button,
  select {
    font-size: 18px;
  }

  input[type="text"] {
    padding: 6px 5px;
  }
`;

export const censoredStyle = css`
  .censored {
    text-rendering: optimizeLegibility;
    -webkit-font-variant-ligatures: discretionary-ligatures;
    font-variant-ligatures: discretionary-ligatures;
    font-family: "scunthorpeSansWeb", sans-serif;
  }
`;
