import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

const CustomDropdown = ({ label, icon: Icon, value, options, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);


    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedLabel = options.find((opt) => opt.value === value)?.label || value;

    return (

        <div className="mb-6 relative" ref={dropdownRef}>
            <label className="flex items-center gap-2 text-sm font-semibold text-text-secondary mb-3">

                <Icon className="text-xs text-[#c7a15c]" /> {label}
            </label>


            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-3 bg-surface rounded-xl text-text text-sm cursor-pointer transition-all border flex justify-between items-center select-none
          ${isOpen
                        ? "border-[#c7a15c] ring-1 ring-[#c7a15c]"
                        : "border-border hover:border-[#c7a15c]"
                    }
        `}>
                <span className="capitalize">{selectedLabel}</span>
                <FaChevronDown
                    className={`text-xs transition-transform duration-200 ${isOpen ? "rotate-180 text-[#c7a15c]" : "text-text-muted"
                        }`}
                />
            </div>



            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-surface border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="py-1">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`px-4 py-3 cursor-pointer text-sm transition-colors capitalize flex items-center justify-between
                  ${value === option.value
                                        ? "bg-[#c7a15c]/10 text-[#c7a15c] font-bold"
                                        : "text-text hover:bg-[#c7a15c] hover:text-white"
                                    }
                `}>
                                {option.label}
                                {value === option.value && <span className="text-xs">✓</span>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;