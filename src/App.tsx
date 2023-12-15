// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components

import ScrollToTop from './components/ScrollToTop';
import { ProgressBarStyle } from './components/ProgressBar';
import NotistackProvider from './components/NotistackProvider';
import ThemeColorPresets from './components/ThemeColorPresets';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
// import MotionLazyContainer from './components/animate/MotionLazyContainer';
import React, { useEffect } from 'react';
// ----------------------------------------------------------------------

declare global {
  interface Window {
    Pusher: any;
    echo: Echo;
  }
}

export default function App() {

  return (
    <ThemeProvider>
      <ThemeColorPresets>
        <NotistackProvider>
          {/* <MotionLazyContainer> */}
          <ProgressBarStyle />
          <ScrollToTop />
          <Router />
          {/* </MotionLazyContainer> */}
        </NotistackProvider>
      </ThemeColorPresets>
    </ThemeProvider>
  );
}
