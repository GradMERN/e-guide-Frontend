import styled from "styled-components";
import { useEffect, useState } from "react";

const Switch = () => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "dark";
    setTheme(storedTheme);
  }, []);

  return (
    <StyledWrapper theme={theme}>
      <label htmlFor="filter" className="switch" aria-label="Toggle Filter">
        <input type="checkbox" id="filter" />
        <span>EN</span>
        <span>AR</span>
      </label>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .switch {
    --_switch-bg-clr: ${(props) =>
      props.theme === "dark"
        ? "linear-gradient(145deg, rgba(226, 199, 132, 0.2), rgba(189, 161, 100, 0.1))"
        : "linear-gradient(145deg, rgba(226, 199, 132, 0.3), rgba(189, 161, 100, 0.2))"};
    --_slider-bg-clr-on: ${(props) =>
      props.theme === "dark"
        ? "linear-gradient(to right, #b8941f, #d4b15b, #e2c784)"
        : "linear-gradient(to right, #b8941f, #d4b15b, #e2c784)"};
    --_text-color: ${(props) =>
      props.theme === "dark" ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)"};
    --_text-color-active: ${(props) =>
      props.theme === "dark" ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.9)"};
    --_label-padding: 0;
    --_switch-easing: cubic-bezier(0.47, 1.64, 0.41, 0.8);

    /* Even smaller dimensions */
    width: 4em;
    height: 1.4em;
    color: var(--_text-color);
    font-weight: 600;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: center;
    position: relative;
    border-radius: 9999px;
    cursor: pointer;
    isolation: isolate;
    backdrop-filter: blur(8px);
    box-shadow: 0 1px 3px -1px rgba(0, 0, 0, 0.1),
      0 1px 2px -1px rgba(0, 0, 0, 0.06),
      inset 0 1px 1px
        ${(props) =>
          props.theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
  }

  .switch input[type="checkbox"] {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .switch > span {
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 300ms ease-in-out 150ms;
    height: 100%;
    padding: 0.1rem 0.6rem;
    /* Even smaller font */
    font-size: 0.7rem;
    text-shadow: ${(props) =>
      props.theme === "dark"
        ? "0 1px 1px rgba(0, 0, 0, 0.2)"
        : "0 1px 1px rgba(255, 255, 255, 0.3)"};
  }

  .switch::before,
  .switch::after {
    content: "";
    position: absolute;
    border-radius: inherit;
    transition: inset 150ms ease-in-out;
  }

  /* switch slider - even smaller */
  .switch::before {
    background: var(--_slider-bg-clr-on);
    inset: 1.5px 50% 1.5px 1.5px;
    transition: inset 500ms var(--_switch-easing), background 500ms ease-in-out;
    z-index: -1;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2),
      inset 0 1px 1px
        ${(props) =>
          props.theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"};
    backdrop-filter: blur(4px);
  }

  /* switch background (behind slider) */
  .switch::after {
    background: var(--_switch-bg-clr);
    inset: 0;
    z-index: -2;
  }

  /* checked - move slider to right */
  .switch:has(input:checked)::before {
    background: var(--_slider-bg-clr-on);
    inset: 1.5px 1.5px 1.5px 50%;
  }

  /* label opacity */
  .switch > span:last-of-type,
  .switch > input:checked + span:first-of-type {
    opacity: 0.6;
    padding: 0.1rem 0.3rem;
  }

  .switch > input:checked ~ span:last-of-type {
    opacity: 1;
    color: var(--_text-color-active);
    text-shadow: ${(props) =>
      props.theme === "dark"
        ? "0 1px 1px rgba(255, 255, 255, 0.3)"
        : "0 1px 1px rgba(0, 0, 0, 0.2)"};
  }

  /* Hover effects */
  .switch:hover {
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.15),
      0 1px 3px -1px rgba(0, 0, 0, 0.1),
      inset 0 1px 1px
        ${(props) =>
          props.theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"};
  }
`;

export default Switch;
