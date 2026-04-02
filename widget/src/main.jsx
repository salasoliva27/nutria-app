import { createRoot } from 'react-dom/client'
import Widget from './Widget.jsx'

// Load Google Fonts into the host page
const fontLink = document.createElement('link')
fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Mono:wght@300;400;500&display=swap'
fontLink.rel = 'stylesheet'
document.head.appendChild(fontLink)

// Read optional host-page theme config: <script> sets window.NUTRIA_CONFIG before this script
const config = window.NUTRIA_CONFIG || {}

const container = document.createElement('div')
container.id = 'nutria-widget-root'
document.body.appendChild(container)

const shadow = container.attachShadow({ mode: 'open' })
const mountPoint = document.createElement('div')
shadow.appendChild(mountPoint)

createRoot(mountPoint).render(<Widget config={config} />)
