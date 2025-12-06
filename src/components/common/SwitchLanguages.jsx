import styled from "styled-components";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Switch = () => {
  const { i18n } = useTranslation();
  const [isArabic, setIsArabic] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "dark";
    setTheme(storedTheme);
    setIsArabic(i18n.language === "ar");
  }, [i18n.language]);

  const handleToggle = () => {
    const newLang = isArabic ? "en" : "ar";
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    setIsArabic(!isArabic);
  };

  return (
    <StyledWrapper theme={theme} isArabic={isArabic}>
      <label htmlFor="langSwitch" className="switch" aria-label="Toggle Language">
        <input type="checkbox" id="langSwitch" checked={isArabic} onChange={handleToggle} />
        <span className="label-en">English</span>
        <span className="label-ar">العربية</span>
        <span className="slider" />
      </label>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .switch {
    --_switch-padding: 2px;
    --_switch-easing: cubic-bezier(0.47, 1.64, 0.41, 0.8);

    display: grid;
    grid-template-columns: repeat(2, 1fr);
    position: relative;
    border-radius: 5px;
    cursor: pointer;
    width: 7em;
    height: 1.5em;
    font-weight: 600;
    user-select: none;
    background: linear-gradient(145deg, rgba(226,199,132,0.2), rgba(189,161,100,0.1));
  }

  .switch input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    border: 0;
    white-space: nowrap;
  }

  .switch > span {
    display: grid;
    place-content: center;
    z-index: 2;
    transition: color 0.3s ease, opacity 0.3s ease;
    font-size: 0.75rem;
  }

  .switch::before {
    content: "";
    position: absolute;
    top: var(--_switch-padding);
    bottom: var(--_switch-padding);
    width: 50%;
    left: 0;
    background: linear-gradient(to right, #b8941f, #d4b15b, #e2c784);
    border-radius: 3px;
    z-index: 1;
    transition: transform 0.5s var(--_switch-easing), background-color 0.5s ease-in-out;
  }

  .switch:has(input:checked)::before {
    transform: translateX(100%);
  }

  .switch > span.label-en {
    color: ${props => (props.isArabic ? "white" : "black")};
  }
  .switch > span.label-ar {
    color: ${props => (props.isArabic ? "black" : "white")};
  }

  .switch > input:checked + span:first-of-type {
    opacity: 0.75;
  }

  .switch > input:checked ~ span:last-of-type {
    opacity: 1;
  }
`;

export default Switch;
