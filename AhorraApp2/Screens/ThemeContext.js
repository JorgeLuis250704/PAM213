import React, { createContext, useState } from "react";

export const ThemeContext = createContext();

const lightTheme = {
  fondo: "#f1f2f3",
  tarjeta: "#ffffff",
  texto: "#101010",
  textoSuave: "#666",
  verde: "#2f8a4f",
  naranja: "#ff8c00",
  rojo: "#ff3b30", // rojo para botón borrar
  statusBar: "dark-content",
};

const darkTheme = {
  fondo: "#121212",
  tarjeta: "#1e1e1e",
  texto: "#fff",
  textoSuave: "#aaa",
  verde: "#2f8a4f",
  naranja: "#ff8c00",
  rojo: "#ff3b30", // rojo para botón borrar
  statusBar: "light-content",
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <ThemeContext.Provider
      value={{ colors: isDarkMode ? darkTheme : lightTheme, isDarkMode, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
