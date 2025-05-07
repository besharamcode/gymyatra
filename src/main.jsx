import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { ToastContainer } from 'react-toastify'
import App from './App'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'
import { ThemeProvider } from './providers/ThemeProvider'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="gymyatra-theme">
        <App />
        <ToastContainer 
          position="top-right" 
          autoClose={3000}
          theme="colored"
          className="text-sm" 
        />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
) 