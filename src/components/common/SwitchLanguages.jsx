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
    <StyledWrapper theme={theme}>
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
        <span className="label-en">English</span>
        <span className="label-ar">العربية</span>
        <span className="slider" />
      </label>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .switch {
    width: 7em;
    height: 1.5em;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 6px;
    cursor: pointer;
    background: ${(props) =>
      props.theme === "dark"
        ? "linear-gradient(145deg, rgba(226,199,132,0.2), rgba(189,161,100,0.1))"
        : "linear-gradient(145deg, rgba(226,199,132,0.3), rgba(189,161,100,0.2))"};
    font-weight: 600;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .switch .label-en,
  .switch .label-ar {
    z-index: 2;
    font-size: 0.75rem;
    width: 50%;
    text-align: center;
    pointer-events: none;
    transition: color 0.3s ease;
  }

  .switch .slider {
    position: absolute;
    top: 2px;
    bottom: 2px;
    left: 2px;
    width: calc(50% - 4px);
    background: linear-gradient(to right, #b8941f, #d4b15b, #e2c784);
    border-radius: 4px;
    transition: transform 0.8s ease;
    z-index: 1;
  }

  .switch input:checked ~ .slider {
    transform: translateX(105%);
  }

  .switch input:not(:checked) ~ .slider {
    transform: translateX(0);
  }

  .switch input:not(:checked) ~ .label-en {
    color: black;
  }
  .switch input:not(:checked) ~ .label-ar {
    color: white;
  }

  .switch input:checked ~ .label-en {
    color: black;
  }
  .switch input:checked ~ .label-ar {
    color: white;
  }
`;

export default Switch;
