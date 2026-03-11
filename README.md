# LMN Pro – QuickBooks Sync Page Prototype

A frontend prototype of the QuickBooks Export page, built with vanilla HTML, CSS, and JavaScript using PrimeNG-style component class names to match the LMN Pro Angular app aesthetic.

## What Changed in `updated-qb-sync-page`

### Export → Queue Flow
- Clicking **↑ Export to QB** animates the button — it flashes and morphs into a dark **✓ Queued** pill
- The estimate row is simultaneously added to the **Export Queue** tab with a green slide-in entry animation
- Clicking **↩ Cancel Export** removes the queue row with a slide-out animation and restores the original button in the estimate table

### Export Queue Tab Badge
- A live count badge on the **Export Queue** tab increments/decrements as items are queued or cancelled
- Badge animates with a spring bounce on each new addition

### Filter Chip Dropdowns
- Filter chips (By Type, Status, By Date, Previously Exported) open a flyout dropdown with a slide+fade animation
- Selecting an item triggers a radial ripple animation from the click point, then updates the chip value

### Status Pills
- Status column values are rendered as colored badge pills:
  - **Red** — Lost statuses (Estimate Lost - Price, Estimate Lost - No Response)
  - **Yellow** — Pending statuses (Estimate In Progress, Review + Approve, Work In Progress)
  - **Green** — Sold statuses (Sold, Approved, Contract)

### Data Table Polish
- **Sticky column headers** — headers remain visible while scrolling through rows
- **Edit button** restyled to a small bordered white pill button; edit column narrowed
- Search input placeholder updated to "Type to search"

### Paginator
- PrimeNG-style paginator: **Items per page** dropdown (10 / 25 / 50 / 100, default 25), row range counter, and |< < > >| navigation buttons, right-aligned
- 200 seeded dummy rows for realistic pagination testing (213 total rows)

### Layout
- Table scrolls within a fixed viewport-fit container — headers and paginator stay anchored
- Paginator and queue action footer stay at the bottom of their respective panels

---

## Original Features

- Hover-expand sidebar (collapsed to icons, expands to full nav on hover)
- **Estimate Search** tab — search bar, filter row, and data table with export actions
- **Export Queue** tab — queued estimates with Publish to QB Online / Desktop Sync actions
- Dark outer frame with rounded corners and light grey panel separators

---

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
└── app.js       # Seeded data, tab switching, pagination, filter dropdowns, export flow
```
