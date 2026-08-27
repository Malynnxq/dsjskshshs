# Meal Counter

A small browser-based meal counter. Create named meals, add a value from 0 to 1 or a positive whole number up to 12 to each meal's running total, and delete meals when they are no longer needed.

## Features

- Accepts decimal points and decimal commas (`0.25` or `0,25`)
- Accepts values from 0 to 1 and whole numbers from 2 to 12
- Rejects negative values, fractions above 1, and numbers above 12
- Keeps an independent running total for every meal
- Saves meals and totals in the browser with `localStorage`
- Responsive, accessible interface with no build step

## Run locally

Open `index.html` in a browser, or serve the directory with any static file server.
