# LMN Pro – QuickBooks Sync Page Prototype

A frontend prototype of the QuickBooks Export page, built with vanilla HTML, CSS, and JavaScript using PrimeNG-style component class names to match the LMN Pro Angular app aesthetic.

## Features

- Hover-expand sidebar (collapsed to icons, expands to full nav on hover)
- **Estimate Search** tab — search bar, filter row, and data table with export actions
- **Export Queue** tab — queued estimates ready to sync
- Dark outer frame with rounded corners and light grey panel separators

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (any recent version)

### Run Locally

```bash
# Install a static file server if you don't have one
npm install -g serve

# Serve the prototype
npx serve -p 3400 quickbooks-export
```

Then open [http://localhost:3400](http://localhost:3400) in your browser.

### Alternative (Python)

```bash
cd quickbooks-export
python3 -m http.server 3400
```

## Project Structure

```
quickbooks-export/
├── index.html   # App shell, sidebar, panels, tab content
├── styles.css   # All styles (PrimeNG class names, layout, components)
└── app.js       # Tab switching, radio button interactions
```
