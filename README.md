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
| 🌍 **Localization & Custom Labels** | Customize all button texts and tour labels (e.g., "Next", "Previous", "Finish"). |
| 🎨 **Customizable Icons/Emojis** | Use your own emojis or text for navigation button "icons". |
| 🔄 **Dynamic Step Content** | Make step titles and content dynamic based on the highlighted element. |

---

## What’s new in version 7.2.0 — Zenith Edition?

*   **Text-based Navigation Buttons**: Replaced SVG icons with customizable text labels for "Previous", "Next", and "Finish".
*   **Localization Support**: Easily define custom text labels for all tour elements (buttons, progress, welcome screen). Defaults to English, but can be set to French or any custom text.
*   **Customizable Button Emojis/Icons**: Now you can specify your own emojis or short text as visual "icons" for the navigation buttons.
*   **Dynamic Step Content**: Step `title` and `content` can now be functions that receive the highlighted element, allowing for highly dynamic tour content.
*   Improved UI consistency and minor CSS adjustments for a modern look.
*   Enhanced performance and stability for spotlight and tooltip positioning.

---

## Installation

### CDN Installation

To quickly get started, you can use the CDN version of `CodingIntroJS`. Add the following lines to your HTML:

```html
<head>
  <script src="https://cdn.jsdelivr.net/gh/codingtuto/CodingIntroJS@latest/src/codingintrojs.min.js"></script>
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
<script src="https://cdn.jsdelivr.net/gh/codingtuto/CodingIntroJS@latest/src/codingintrojs.min.js"></script>
<script src="app.js"></script> <!-- Your custom JS -->
```

---

### Step 2: Define your tour steps in JavaScript

A step is an object describing what to highlight and what to say.

```js
const steps = [
  {
    isWelcome: true, // Special step: welcome screen, no highlight
    title: 'Welcome aboard! 🚀',
    content: "Let's take a quick tour of this app.",
    // Optional: add a welcome image
    welcomeImage: 'https://example.com/images/welcome.png',
    // Optional: customize welcome button text specifically for this step
    welcomeButtonText: "Dive In!" 
  },
  {
    selector: '#main-menu-btn', // Highlight element with ID 'main-menu-btn'
    title: 'Main Menu',
    content: 'Here you can navigate to different sections.',
    // Optional: dynamically set content based on the element
    // content: (element) => `This is the "${element.textContent}" button.`
  },
  {
    selector: '.action-btn', // Highlight first element with class 'action-btn'
    title: 'Action Button',
    content: 'This button triggers the magic.',
    // Optional: add a specific CSS class to the tooltip for this step
    className: 'custom-action-tooltip',
    // Optional: define a condition for this step to be shown
    condition: (element) => element.dataset.active === 'true'
  },
  {
    selector: '#footer-info',
    title: 'Footer',
    content: 'This is the footer where you can find legal info.',
    // Optional: customize the border radius of the highlight
    highlightBorderRadius: '50%' 
  }
];
```

### Notes on Step Objects:

*   **`selector` (string)**: The CSS selector for the element to highlight.
    *   Use `#id` to target by ID.
    *   Use `.class` to target by class (only the first matched element).
    *   Any valid CSS selector can be used.
    *   If a selector matches nothing, or the element is not visible, the step will be skipped with a warning.
*   **`isWelcome` (boolean, optional)**: If `true`, this step will display a full-screen welcome message instead of highlighting an element. No `selector` is needed for welcome steps.
*   **`title` (string | function, optional)**: The title of the tooltip. Can be a string or a function receiving the `highlightedElement` as argument for dynamic content.
*   **`content` (string | function, optional)**: The main content of the tooltip. Can be a string or a function receiving the `highlightedElement` as argument.
*   **`className` (string, optional)**: An additional CSS class to apply to the tooltip for specific styling of that step.
*   **`condition` (function, optional)**: A function that receives the `highlightedElement`. If it returns `false`, the step will be skipped. Useful for conditional tours.
*   **`welcomeImage` (string, optional)**: URL of an image to display on a `isWelcome` step.
*   **`welcomeButtonText` (string, optional)**: Custom text for the "Let's Go!" button on a `isWelcome` step.
*   **`welcomeButtonIcon` (string, optional)**: Custom emoji or text for the icon of the "Let's Go!" button on a `isWelcome` step. Overrides global `icons.next`.
*   **`highlightBorderRadius` (string, optional)**: Custom `border-radius` for the highlighter. By default, it tries to match the highlighted element's border-radius. Accepts any valid CSS `border-radius` value (e.g., `'10px'`, `'50%'`).

---

### Step 3: Initialize and start the tour

Create an instance and call `.start()`:

```js
const tour = new CodingIntroJS(steps);
tour.start();
```

---

### Step 4: Customize with options (Hidden APIs & Configuration)

The second argument to the `CodingIntroJS` constructor is a powerful configuration object.

```js
const tour = new CodingIntroJS(steps, {
  defaultTheme: 'light',      // 'dark' (default) or 'light'
  allowClose: false,          // Disable closing with ESC key
  animationSpeed: 300,        // Animation duration in ms (default: 150)
  animationEasing: 'ease-in-out', // CSS easing for animations (default: 'ease-out')
  backdropColor: 'rgba(0,0,0,0.7)', // Color of the overlay (default: 'rgba(15, 22, 36, 0.9)')
  highlightPadding: 10,       // Padding around the highlighted element in px (default: 8)
  keyboardNavigation: true,   // Allow arrows + Enter/Escape navigation (default: true)
  scrollPadding: 60,          // Additional padding when scrolling elements into view (default: 40)
  safeAreaPadding: 20,        // Minimum distance between tooltip and screen edge in px (default: 10)

  // --- Localization & Button Labels ---
  labels: {
    prev: 'Précédent',    // Text for "Previous" button
    next: 'Suivant',      // Text for "Next" button
    finish: 'Terminer',   // Text for "Finish" button (on the last step)
    of: 'sur',            // For progress display, e.g., "1 sur 5"
    welcomeTitle: 'Bienvenue !', // Default title for welcome screens
    welcomeContent: 'Prêt pour la visite ?', // Default content for welcome screens
    welcomeButton: 'C\'est parti !' // Default text for welcome screen button
  },

  // --- Navigation Icons/Emojis ---
  // These will appear before the button text. Can be any string (emoji, char, short text).
  icons: {
    prev: '👈', // Icon for "Previous" button
    next: '👉', // Icon for "Next" button
    finish: '🎉' // Icon for "Finish" button
  },

  // --- Callbacks (Hooks) ---
  onStart: () => {
    console.log('Tour started!');
    // Example: Disable other UI elements
  },
  onFinish: () => {
    alert('Tour finished! Hope you enjoyed it.');
    // Example: Redirect or show a completion message
  },
  onExit: () => {
    console.log('Tour exited early.');
    // Example: Log user exit
  },
  onBeforeStep: (index, step) => {
    console.log(`About to show step ${index}:`, step.selector || 'Welcome Screen');
    // Example: Scroll specific containers, show hidden elements
  },
  onAfterStep: (index, step, highlightedElement) => {
    console.log(`Just showed step ${index}. Highlighted:`, highlightedElement);
    // Example: Trigger an analytics event
  }
});
```

---

### Step 5: Change theme on the fly

CodingIntroJS supports two built-in themes:

*   **dark** (default): dark backgrounds, subtle shadows, vibrant aura.
*   **light**: brighter backgrounds, cleaner look, blue aura.

Change the theme anytime after the tour has started:

```js
tour.setTheme('light'); // Switch to light theme
tour.setTheme('dark');  // Switch back to dark theme
```

---

### Step 6: Useful API methods

```js
tour.start();    // Start or restart the tour.
tour.next();     // Advance to the next step.
tour.prev();     // Go back to the previous step.
tour.goTo(2);    // Jump to a specific step by index (e.g., index 2 is the third step).
tour.exit();     // Exit the tour immediately, cleaning up all elements.
tour.finish();   // Mark the tour as completed and exit (triggers onFinish callback).
tour.setTheme('dark'); // Change the visual theme of the tour.
tour.getCurrentStep(); // Get the object of the currently active step.
```

---


## Troubleshooting & Tips

*   Always double-check your selectors (`#id` or `.class`) — if an element isn't found or visible, the step will be skipped with a warning.
*   Ensure target elements exist *and are visible* in the DOM when the tour attempts to highlight them.
*   Use `onBeforeStep` to dynamically prepare the UI if needed (e.g., opening a menu, enabling disabled buttons, waiting for async content).
*   For multi-page applications or Single-Page Applications (SPAs), you can recreate or update steps dynamically before starting the tour on a new view.
*   **Emojis/Icons**: If using emojis, ensure your page's character encoding is set to UTF-8 (`<meta charset="UTF-8">`) for proper display across browsers.

---

## How to contribute

Found something off or have an idea? Open an issue before forking — let’s chat first! 💬

---

## License

MIT — do what you want. Just don’t blame us if your app becomes way too popular! 😉