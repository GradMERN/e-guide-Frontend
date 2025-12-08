import styled from "styled-components";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Switch = () => {
  const { i18n } = useTranslation();
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "dark";
    }
    return "dark";
  });

  const isArabic = i18n.language.startsWith("ar");

  useEffect(() => {
    // document.dir is handled globally in App.jsx
  }, [i18n.language]);

  const handleToggle = () => {
    const newLang = isArabic ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  return (
    <StyledWrapper $theme={theme} $isArabic={isArabic}>
      <label
        htmlFor="langSwitch"
        className="switch"
        aria-label="Toggle Language"
      >
        <input
          type="checkbox"
          id="langSwitch"
          checked={isArabic}
          onChange={handleToggle}
        />
        <span className={isArabic ? "label-inactive" : "label-active"}>
          English
        </span>
        <span className={isArabic ? "label-active" : "label-inactive"}>
          العربية
        </span>
        <span className="slider" />
      </label>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .switch {
    --_switch-padding: 2px;
    --_switch-easing: cubic-bezier(0.45, 1.64, 0.41, 0.8);

    display: grid;
    grid-template-columns: repeat(2, 1fr);
    position: relative;
    border-radius: 5px;
    cursor: pointer;
    width: 7em;
    height: 1.5em;
    font-weight: 600;
    user-select: none;
    background: var(--surface);
    border: 1px solid color-mix(in srgb, var(--primary) 40%, transparent);
  }

  .switch input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
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
    top: 0;
    bottom: 0;
    width: 50%;
    left: 0;
    background: linear-gradient(
      to right,
      var(--gradient-from),
      var(--gradient-via),
      var(--gradient-to)
    );
    border-radius: 3px;
    z-index: 1;
    transition: transform 0.4s var(--_switch-easing),
      background-color 0.4s ease-in-out;
  }

  .switch:has(input:checked)::before {
    transform: translateX(100%);
  }
`;

export default Switch;
