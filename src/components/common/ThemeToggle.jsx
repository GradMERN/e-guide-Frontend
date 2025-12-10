import { useEffect, useState } from "react";
import styled from "styled-components";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <StyledWrapper>
      <input type="checkbox" className="input" checked={theme === "light"} onChange={toggleTheme} aria-label="Toggle Theme"/>

      <svg className="icon icon-sun" fill="none" height={24} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" width={24}>
        <circle cx={12} cy={12} r={5} />
        <line x1={12} y1={1} x2={12} y2={3} />
        <line x1={12} y1={21} x2={12} y2={23} />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1={1} y1={12} x2={3} y2={12} />
        <line x1={21} y1={12} x2={23} y2={12} />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>

      <svg className="icon icon-moon" viewBox="0 0 24 24">
        <path d="m12.3 4.9c.4-.2.6-.7.5-1.1s-.6-.8-1.1-.8c-4.9.1-8.7 4.1-8.7 9 0 5 4 9 9 9 3.8 0 7.1-2.4 8.4-5.9.2-.4 0-.9-.4-1.2s-.9-.2-1.2.1c-1 .9-2.3 1.4-3.7 1.4-3.1 0-5.7-2.5-5.7-5.7 0-1.9 1.1-3.8 2.9-4.8zm2.8 12.5c.5 0 1 0 1.4-.1-1.2 1.1-2.8 1.7-4.5 1.7-3.9 0-7-3.1-7-7 0-2.5 1.4-4.8 3.5-6-.7 1.1-1 2.4-1 3.8-.1 4.2 3.4 7.6 7.6 7.6z" />
      </svg>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.label`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.4s ease;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  .input {
    cursor: pointer;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10;
    opacity: 0;
  }

  .icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1.5rem;
    transition: all 0.5s ease;
  }

  .icon-moon {
    fill: var(--tertiary);
    display: block;
    transform-origin: center center; 
    transition: transform 0.5s ease, opacity 0.5s ease;
    opacity: 1;
  }

  .input:checked ~ .icon-moon {
    transform: translate(-50%, -50%) scaleX(-1);
    opacity: 0;
    pointer-events: none;
  }

  .icon-sun {
    stroke: var(--primary);
    display: block; /* keep block for animation */
    opacity: 0;     /* start hidden */
    transition: opacity 0.5s ease;
  }

  .input:checked ~ .icon-sun {
    opacity: 1;
    animation: rotate 0.5s ease-in-out;
  }

  @keyframes rotate {
    0% {
      transform: translate(-50%, -50%) rotate(0deg) scale(0);
    }
    50% {
      transform: translate(-50%, -50%) rotate(180deg) scale(1.2);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg) scale(1);
    }
  }
`;