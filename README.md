# CodingIntroJS - Your Super-Easy Guide to Interactive Website Tours

![Logo](https://i.imgur.com/YtdMwBN.png)

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

### Step 1: Define Your Tour Steps

Create an array of objects to define each tour step, including which elements to spotlight and the tooltip content.

```javascript
const tourSteps = [
  {
    selector: '#main-title', 
    title: 'Welcome!', 
    content: 'This is the main title of our website.'
  },
  {
    selector: '.nav-link', 
    title: 'Navigation Links',
    content: 'Use these links to navigate the site.',
    tooltipPosition: 'bottom'
  },
  {
    selector: '#cta-button', 
    title: 'Call to Action!',
    content: 'Click this button to get started!',
    tooltipPosition: 'top'
  }
];
```

### Step 2: Create and Initialize the Tour

After defining the tour steps, create a new instance of `CodingIntroJS` and start the tour:

```javascript
const tour = new CodingIntroJS(tourSteps);
tour.init();
```

Optionally, you can customize the look by passing an options object:

```javascript
const tour = new CodingIntroJS(tourSteps, {
  tooltipBackgroundColor: '#f0f0f0',
  tooltipTitleColor: '#333',
  tooltipContentColor: '#555',
  animationSpeed: 500, // Slower animations
  allowClose: false,   // Disable close button
  onFinish: function() {
    alert("Tour finished! You're now a website pro!");
  }
});
tour.init();
```

---

## Customization Options

You can tweak many aspects of the tour to match your style and preferences. Here are the available options:

| Option                   | Description                                                                 |
|--------------------------|-----------------------------------------------------------------------------|
| `spotlightPadding`        | Extra space around the spotlighted element (default: 20px).                 |
| `overlayOpacity`          | Transparency of the overlay (range: 0 to 1, default: 0.92).                |
| `tooltipBackgroundColor`  | Background color of the tooltip (default: dark gradient).                   |
| `tooltipTitleColor`       | Title text color in the tooltip (default: #4285f4).                         |
| `animationSpeed`          | Speed of animations (in milliseconds, default: 300).                        |
| `keyboardNavigation`      | Enable/disable keyboard navigation (default: true).                         |
| `onStart`, `onFinish`     | Functions to call when the tour starts/ends.                               |

Example of using options:

```javascript
const tour = new CodingIntroJS(tourSteps, {
  overlayOpacity: 0.8,
  tooltipBackgroundColor: '#f0f0f0',
  tooltipTitleColor: '#333',
  animationSpeed: 500,
  allowClose: false,
  onFinish: function() {
    alert("You're now a website pro!");
  }
});
tour.init();
```

---

## Example

Here’s a minimal example to help you get started quickly. Copy and paste the code into your `index.html` file, and open it in your browser!

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Demo Website</title>
  <style>
    body { font-family: sans-serif; }
    nav ul { list-style: none; padding: 0; }
    nav li { display: inline-block; margin-right: 20px; }
    nav a { text-decoration: none; color: #007bff; }
    button { padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
  </style>
</head>
<body>

  <h1 id="main-title">Welcome to My Demo Website!</h1>

  <nav>
    <ul>
      <li><a href="#" class="nav-link">Home</a></li>
      <li><a href="#" class="nav-link">Products</a></li>
      <li><a href="#" class="nav-link">Services</a></li>
      <li><a href="#" class="nav-link">Contact</a></li>
    </ul>
  </nav>

  <p>Here’s some content, we’ll guide you through it with a tour.</p>

  <button id="cta-button">Learn More</button>

  <script src="https://cdn.jsdelivr.net/npm/codingintrojs/dist/codingintrojs.min.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const tourSteps = [
        { selector: '#main-title', title: 'Hello!', content: 'This is our main title.' },
        { selector: 'nav', title: 'Navigation', content: 'Use these links to navigate the site.' },
        { selector: '#cta-button', title: 'Click Me!', content: 'Click this button to learn more!' }
      ];
      const tour = new CodingIntroJS(tourSteps);
      tour.init();
    });
  </script>
</body>
</html>
```

---

## Contributing

We welcome contributions! If you have ideas for improvements, bug fixes, or new features, feel free to open an issue or submit a pull request. Here's how you can contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

---

## License

This project is licensed under the MIT License. Feel free to use it in your personal and commercial projects.

---