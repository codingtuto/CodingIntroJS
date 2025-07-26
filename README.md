# CodingIntroJS - Your Super-Easy Guide to Interactive Website Tours

![Logo](https://i.ibb.co/d8gtfNP/image.png)

👋 **Welcome to CodingIntroJS!** Want to guide your users through your website in a fun and interactive way? This lightweight JavaScript library lets you create guided tours with smooth spotlight effects, making your site more engaging and user-friendly.

---

## Features

| Feature               | Description                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| 🎯 **Spotlight Magic** | Highlight important elements with a smooth blur effect to focus user attention.|
| ✨ **Customizable Tooltips** | Customize tooltip colors, titles, and content to fit your website’s style.  |
| 🚀 **Simple Setup**    | Easy to implement by just including the script and defining your tour steps.|
| ⌨️ **Keyboard Navigation** | Allows users to navigate using the keyboard for better accessibility.      |
| 📱 **Responsive Design**  | Works seamlessly across all screen sizes (desktop, tablet, mobile).        |
| ⚡ **Lightweight & Fast** | No extra bloat—keep your site fast and lean.                                |

---

## What’s new in version 7 — Zenith Edition?

* Fixed tooltip content disappearing after positioning
* Much faster, snappier animations (less waiting)
* Minimalist design with fewer rounded corners and lighter shadows
* Instant element appearance—no slow fade-ins or bounces
* Better layout on small screens with safe margins
* Pre-calculated element positions to avoid flicker and jumps
* Improved tooltip placement to avoid covering targets
* Rock-solid overlay and cutout method for stability

---

## Installation

### CDN Installation

To quickly get started, you can use the CDN version of `CodingIntroJS`. Add the following lines to your HTML:

```html
<head>
  <script src="https://cdn.jsdelivr.net/npm/codingintrojs/dist/codingintrojs.min.js"></script>
</head>
```

---

## Usage

### Step 1: Your HTML setup

Make sure your page has elements with IDs or classes you want to highlight. For example:

```html
<nav>
  <button id="main-menu-btn">Menu</button>
</nav>
<main>
  <h1 id="welcome-header">Welcome to My App!</h1>
  <p>Some cool content here...</p>
  <button class="action-btn">Click me!</button>
</main>
<footer>
  <p id="footer-info">© 2024 Your Company</p>
</footer>

<!-- Include CodingIntroJS just before closing body -->
<script src="https://cdn.jsdelivr.net/npm/codingintrojs/dist/codingintrojs.min.js"></script>
<script src="app.js"></script> <!-- Your custom JS -->
```

---

### Step 2: Define your tour steps in JavaScript

A step is an object describing what to highlight and what to say.

```js
const steps = [
  {
    isWelcome: true, // New step: welcome screen, no highlight
    title: 'Welcome aboard! 🚀',
    content: "Let's take a quick tour of this app."
  },
  {
    selector: '#main-menu-btn', // Highlight element with ID 'main-menu-btn'
    title: 'Main Menu',
    content: 'Here you can navigate to different sections.'
  },
  {
    selector: '.action-btn', // Highlight first element with class 'action-btn'
    title: 'Action Button',
    content: 'This button triggers the magic.'
  },
  {
    selector: '#footer-info',
    title: 'Footer',
    content: 'This is the footer where you can find legal info.'
  }
];
```

### Notes on selectors:

* Use `#id` to target by ID.
* Use `.class` to target by class (only the first matched element).
* You can use any valid CSS selector.
* If you omit `#` or `.`, it will look for elements by tag name (rarely what you want).
* If a selector matches nothing, the step will be skipped with a warning.

---

### Step 3: Initialize and start the tour

Create an instance and call `.start()`:

```js
const tour = new CodingIntroJS(steps);
tour.start();
```

---

### Step 4: Customize with options

You can pass a second argument to tweak behavior:

```js
const tour = new CodingIntroJS(steps, {
  defaultTheme: 'light',      // 'dark' (default) or 'light'
  allowClose: false,          // Disable closing with ESC key
  animationSpeed: 300,        // Animation duration in ms
  backdropColor: 'rgba(0,0,0,0.7)', // Color of the overlay
  keyboardNavigation: true,   // Allow arrows + Enter navigation
  onStart: () => console.log('Tour started'),
  onFinish: () => alert('Tour finished!'),
  onExit: () => console.log('Tour exited early'),
  onBeforeStep: (index, step) => console.log(`About to show step ${index}`),
  onAfterStep: (index, step) => console.log(`Just showed step ${index}`)
});
```

---

### Step 5: Change theme on the fly

CodingIntroJS supports two built-in themes:

* **dark** (default): dark backgrounds, subtle shadows
* **light**: brighter backgrounds, cleaner look

Change the theme anytime:

```js
tour.setTheme('light'); // Switch to light theme
tour.setTheme('dark');  // Switch back to dark theme
```

---

## Step 6: Useful API methods

```js
tour.start();    // Start or restart the tour
tour.next();     // Go to next step
tour.prev();     // Go to previous step
tour.goTo(2);    // Jump to step index 2 (third step)
tour.exit();     // Exit the tour immediately
```

---


## Troubleshooting & Tips

* Always double-check your selectors (`#id` or `.class`) — miss one and the step gets skipped.
* Make sure elements exist *and are visible* when the tour starts.
* Use `onBeforeStep` to prepare the UI if needed (like enabling disabled buttons).
* For multi-page apps or SPAs, you can recreate or update steps dynamically before starting the tour.

---

## How to contribute

Love it? Want to make it better? Great! Fork, create a feature branch, commit, push, and open a pull request.

---

## License

MIT — do what you want. Just don’t blame us if your app becomes way too popular! 😉
