import styled from "styled-components";

const Switch = () => {
  return (
    <StyledWrapper>
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
    --_switch-bg-clr: linear-gradient(to right, #c7a15c, #ffe6a0, #ffd27f); 
    --_slider-bg-clr-on: linear-gradient(to right,#c7a15c, #ffe6a0, #ffd27f); 
    --_slider-txt-clr: #ffffff;
    --_label-padding: 0;
    --_switch-easing: cubic-bezier(0.47, 1.64, 0.41, 0.8);
    width: 6em;
    height: 2em;
    color: black;
    font-weight: bold;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: center;
    position: relative;
    border-radius: 9999px;
    cursor: pointer;
    isolation: isolate;
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
    transition: opacity 300ms ease-in-out 150ms;
    height: 100%;
    padding: 0.2rem 1rem;
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
    background: var(--_switch-bg-clr); 
    inset: 4px 50% 4px 4px;
    transition: inset 500ms var(--_switch-easing), background 500ms ease-in-out;
    z-index: -1;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.3),0 1px rgba(255, 255, 255, 0.3);
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
    inset: 4px 4px 4px 50%;
  }

  /* label opacity */
  .switch > span:last-of-type,
  .switch > input:checked + span:first-of-type {
    opacity: 0.75;
    padding: 0.2rem 0.5rem;
  }

  .switch > input:checked ~ span:last-of-type {
    opacity: 1;
  }
`;

export default Switch;