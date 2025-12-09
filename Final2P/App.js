import React, { useState, useEffect } from 'react';
import MenuScreen from './Screens/MenuScreen';
import WeatherUPQ from './Screens/WeatherUPQ';
import GalleryScreen from './Screens/GalleryScreen';

export default function App() {

const [currentScreen, setCurrentScreen] = useState('menu');

  useEffect(() => {
    if (currentScreen === 'loading') {
      const timer = setTimeout(() => {
        setCurrentScreen('gallery');
      }, 3000); // Wait 3 seconds
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleStart = () => {
    setCurrentScreen('loading');
  };

  if (currentScreen === 'menu') {
    return <MenuScreen onStart={handleStart} />;
  }

  if (currentScreen === 'loading') {
    return <WeatherUPQ />;
  }

  if (currentScreen === 'gallery') {
    return <GalleryScreen />;
  }

  return null;
}