import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import './i18n/i18n.js'
import LanguageBoundary from './i18n/LanguageBoundary.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageBoundary>
      <App />
    </LanguageBoundary>
  </React.StrictMode>
)
