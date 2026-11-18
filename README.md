# TechGear – Front-End Electronics Store

A student front-end demonstration built with HTML5, CSS3 and vanilla JavaScript.

## Run locally
1. Extract the project folder.
2. Open `index.html` in a browser, or use VS Code Live Server.
3. Search products, filter by category, sort by price, open Quick View and add products to the cart.
4. Open Cart to change quantities, remove items and see the total.

## Main concepts
- HTML page structure and navigation
- CSS Grid, Flexbox and responsive styling
- JavaScript arrays and objects for sample product data
- DOM rendering and event delegation
- Search, category filtering and sorting
- Cart state and browser Local Storage
- A small hash-based view switch for Catalog, Cart, About and Contact

## Important limitation
This is a front-end demonstration. It has no server-side backend, database, user authentication, payment gateway or real order processing. Product information is sample data stored in `app.js`. The cart is saved in the same browser using Local Storage.

## Publish the latest version with GitHub Pages
1. Open the `ecommerce-capstone` repository on GitHub.
2. Replace the files at the repository root with the contents of this project folder:
   `index.html`, `style.css`, `app.js` and `README.md`.
3. Make sure `index.html` stays at the repository root (not inside an extra nested folder).
4. Commit the changes to the `main` branch.
5. Open Settings → Pages and check that the source remains `main` and `/(root)`.
6. Visit the published page and test product search, category filter, Quick View and cart persistence.
