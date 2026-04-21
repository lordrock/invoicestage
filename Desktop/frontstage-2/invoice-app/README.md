# Invoice Management App

A responsive invoice management application built with React and LocalStorage persistence. Users can create, view, edit, delete, filter, and manage invoice statuses with support for draft saving, paid status updates, and light/dark theme switching.

## Live Demo

https://invoicestage.vercel.app/

## GitHub Repository

https://github.com/lordrock/invoicestage/tree/main/Desktop/frontstage-2/invoice-app

## Features

- Create invoices
- View invoice list and invoice details
- Edit invoices
- Delete invoices with confirmation modal
- Save invoices as draft
- Mark pending invoices as paid
- Filter invoices by status
- Toggle light and dark mode
- Persist invoices and theme with LocalStorage
- Responsive layout for mobile, tablet, and desktop
- Hover, focus, and interactive states
- Validation for required form fields

## Tech Stack

- React
- Vite
- React Router
- CSS
- LocalStorage

## Setup Instructions

Run `npm install` for React packages to install
Run `npm run dev` to run it on Local host

## Architecture Explanation

The application is split into reusable components and utility helpers.

### Pages
- `InvoicesPage` for displaying and filtering all invoices
- `InvoiceDetailsPage` for viewing, editing, deleting, and updating a single invoice

### Components
- `Sidebar`
- `InvoiceList`
- `InvoiceCard`
- `StatusBadge`
- `InvoiceForm`
- `DeleteModal`

### Utilities
- `useInvoices` for persistent invoice state
- `useTheme` for theme persistence
- `invoiceHelpers` for totals, invoice ID generation, and due-date calculation
- `validateInvoice` for client-side validation
- `formatters` for date and currency formatting
- `storage` for LocalStorage helpers

## Trade-offs

- Used LocalStorage instead of a backend to keep the app lightweight and frontend-focused
- Used a reusable invoice form for both create and edit flows to avoid duplication
- Added modal keyboard focus entry and ESC close, but not a full focus-trap system
- Focused first on working CRUD logic, then applied design and accessibility polish

## Accessibility Notes

- Semantic HTML used throughout the app
- Inputs are paired with labels
- Buttons use real button elements
- Focus styles are visible for keyboard users
- Delete modal supports keyboard focus entry and ESC closing
- Invalid form fields include `aria-invalid`
- Theme colors were adjusted for readable contrast in both light and dark modes

## Improvements Beyond Requirements

- Shared reusable helpers for invoice formatting and calculations
- Persistent theme and invoice state
- Improved empty state handling
- Responsive panel and detail layout refinements

## Author

**Oyewumi Isaac**

Frontend Developer & Designer  
Based in Nigeria 🇳🇬

- GitHub: https://github.com/lordrock