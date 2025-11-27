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
        ? "linear-gradient(145deg, rgba(100,100,100,0.3), rgba(50,50,50,0.2))"
        : "linear-gradient(145deg, rgba(200,200,200,0.4), rgba(150,150,150,0.3))"};
    --_slider-bg-clr-on: ${(props) =>
      props.theme === "dark"
        ? "linear-gradient(to right, #666, #888, #999)"
        : "linear-gradient(to right, #888, #aaa, #bbb)"};
    --_text-color: ${(props) =>
      props.theme === "dark" ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)"};
    --_text-color-active: ${(props) =>
      props.theme === "dark" ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.9)"};
    --_label-padding: 0;
    --_switch-easing: cubic-bezier(0.47, 1.64, 0.41, 0.8);

    width: 6em;
    height: 2em;
    color: var(--_text-color);
    font-weight: 600;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: center;
    position: relative;
    border-radius: 9999px;
    cursor: pointer;
    isolation: isolate;
    backdrop-filter: blur(10px);
    border: 1px solid
      ${(props) =>
        props.theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"};
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06),
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
    padding: 0.2rem 1rem;
    font-size: 0.875rem;
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

  /* switch slider */
  .switch::before {
    background: var(--_slider-bg-clr-on);
    inset: 3px 50% 3px 3px;
    transition: inset 500ms var(--_switch-easing), background 500ms ease-in-out;
    z-index: -1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2),
      inset 0 1px 1px
        ${(props) =>
          props.theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"};
    backdrop-filter: blur(5px);
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
    inset: 3px 3px 3px 50%;
  }

  /* label opacity */
  .switch > span:last-of-type,
  .switch > input:checked + span:first-of-type {
    opacity: 0.6;
    padding: 0.2rem 0.5rem;
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
    border-color: ${(props) =>
      props.theme === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"};
    box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.15),
      0 4px 6px -2px rgba(0, 0, 0, 0.1),
      inset 0 1px 1px
        ${(props) =>
          props.theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"};
  }
`;

export default Switch;
