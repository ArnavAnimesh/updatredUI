import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext({
    theme: 'default',
    setTheme: () => {},
    cycleTheme: () => {}
});

const THEME_KEY = 'startupnest_theme';
const VALID_THEMES = ['default', 'osmo', 'gravity'];

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        try {
            const saved = localStorage.getItem(THEME_KEY);
            return VALID_THEMES.includes(saved) ? saved : 'default';
        } catch (e) {
            return 'default';
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (e) {}
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const cycleTheme = () => {
        setTheme((previous) => {
            const currentIndex = VALID_THEMES.indexOf(previous);
            const nextIndex = (currentIndex + 1) % VALID_THEMES.length;
            return VALID_THEMES[nextIndex];
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
