/**
 * CodingIntroJS.js
 * A lightweight library for interactive guided tours with a stylish spotlight effect.
 *
 * Internal Documentation:
 *  - Manages guided tours by highlighting target DOM elements with an advanced iOS-like blur effect.
 *  - Uses a dynamic overlay with a mask to spotlight elements.
 *  - Developers can customize tooltip background, title, and content colors via options.
 *  - Note: The spotlight border feature is deprecated and has been removed.
 *
 * Usage:
 *   const tour = new CodingIntroJS(steps, {
 *     tooltipBackgroundColor: 'linear-gradient(135deg, #333, #111)',
 *     tooltipTitleColor: '#0af',
 *     tooltipContentColor: '#ddd'
 *   });
 *   tour.init();
 *
 * @version 1.0.0
 */

class CodingIntroJS {
  constructor(steps, options = {}) {
    // **** Options & Initialization ****
    this.steps = steps;
    this.currentStep = 0;
    this.options = {
      spotlightPadding: 20,
      overlayOpacity: 0.92,
      overlayColor: 'rgba(0, 0, 0, $opacity)',
      spotlightColor: 'rgba(66, 133, 244, 0.1)',
      buttonIconColor: '#ffffff',
      tooltipPosition: 'auto',
      animationSpeed: 300,
      keyboardNavigation: true,
      scrollPadding: 50,
      allowClose: true,
      tooltipBackgroundColor: 'linear-gradient(135deg, #2a2a2e, #1a1a1e)',
      tooltipTitleColor: '#4285f4',
      tooltipContentColor: '#fff',
      onStart: null,
      onFinish: null,
      onExit: null,
      ...options
    };

    // **** Element References & State ****
    this.elements = {
      container: null,
      overlay: null,
      glow: null,
      tooltip: null
    };
    this.isActive = false;
    this.eventHandlers = {};
    this.currentElement = null;
    this.originalZIndex = null;
  }

  // **** Initialize Tour ****
  init() {
    if (this.isActive) return this;
    this.createElements();
    this.setupEvents();
    this.showStep(this.currentStep);
    this.isActive = true;
    if (typeof this.options.onStart === 'function') this.options.onStart();
    return this;
  }

  // **** Create DOM Elements ****
  createElements() {
    this.elements.container = document.createElement('div');
    this.elements.container.className = 'coding-intro-container';

    // Overlay with dynamic mask and advanced iOS-style blur
    this.elements.overlay = document.createElement('div');
    this.elements.overlay.className = 'coding-overlay';
    this.elements.overlay.style.backgroundColor = this.options.overlayColor.replace('$opacity', this.options.overlayOpacity);

    // Glow effect element
    this.elements.glow = document.createElement('div');
    this.elements.glow.className = 'coding-spotlight-glow';
    this.elements.glow.style.background = `radial-gradient(circle at 50% 50%, ${this.options.spotlightColor} 0%, transparent 70%)`;

    // Tooltip element for guided instructions
    this.elements.tooltip = document.createElement('div');
    this.elements.tooltip.className = 'coding-tooltip';

    this.elements.container.append(this.elements.overlay, this.elements.glow, this.elements.tooltip);
    document.body.appendChild(this.elements.container);
    this.injectStyles();
  }

  // **** Setup Event Listeners ****
  setupEvents() {
    this.eventHandlers.resize = () => { if (this.isActive) this.updateSpotlightPosition(); };
    window.addEventListener('resize', this.eventHandlers.resize);

    this.eventHandlers.scroll = () => { if (this.isActive) this.updateSpotlightPosition(); };
    window.addEventListener('scroll', this.eventHandlers.scroll, true);

    if (this.options.keyboardNavigation) {
      this.eventHandlers.keydown = (e) => {
        if (!this.isActive) return;
        if (e.key === 'ArrowRight' || e.key === 'Enter') this.next();
        else if (e.key === 'ArrowLeft') this.prev();
        else if (e.key === 'Escape' && this.options.allowClose) this.exit();
      };
      document.addEventListener('keydown', this.eventHandlers.keydown);
    }

    this.eventHandlers.tooltipClick = (e) => {
      if (e.target.closest('.coding-next')) this.next();
      else if (e.target.closest('.coding-prev')) this.prev();
      else if (e.target.closest('.coding-close') && this.options.allowClose) this.exit();
    };
    this.elements.tooltip.addEventListener('click', this.eventHandlers.tooltipClick);
  }

  // **** Inject CSS Styles ****
  injectStyles() {
    if (document.getElementById('coding-intro-styles')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'coding-intro-styles';
    styleEl.textContent = `
      .coding-intro-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9997;
        pointer-events: none;
      }
      .coding-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9998;
        transition: opacity ${this.options.animationSpeed}ms ease;
        pointer-events: all;
        /* iOS-style advanced blur with mask */
        backdrop-filter: saturate(180%) blur(20px);
        -webkit-backdrop-filter: saturate(180%) blur(20px);
        mask-image: radial-gradient(circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), 
                                      transparent var(--spotlight-inner, 15px), 
                                      black var(--spotlight-outer, 16px), 
                                      black 100%);
        -webkit-mask-image: radial-gradient(circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), 
                                      transparent var(--spotlight-inner, 15px), 
                                      black var(--spotlight-outer, 16px), 
                                      black 100%);
      }
      .coding-spotlight-glow {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9997;
        pointer-events: none;
        filter: blur(15px);
        transition: all ${this.options.animationSpeed}ms ease;
      }
      .coding-tooltip {
        position: fixed;
        background: ${this.options.tooltipBackgroundColor};
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        max-width: 90%;
        width: 400px;
        z-index: 10000;
        text-align: center;
        animation: coding-tooltip-appear ${this.options.animationSpeed}ms ease-out;
        backdrop-filter: blur(5px);
        pointer-events: all;
        transition: top ${this.options.animationSpeed}ms ease, left ${this.options.animationSpeed}ms ease;
      }
      @keyframes coding-tooltip-appear {
        from { opacity: 0; transform: translateY(20px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      .coding-tooltip-header {
        font-size: 1.3rem;
        font-weight: 600;
        color: ${this.options.tooltipTitleColor};
        margin-bottom: 1rem;
      }
      .coding-tooltip-content {
        margin-bottom: 1.5rem;
        line-height: 1.5;
        color: ${this.options.tooltipContentColor};
      }
      .coding-tooltip-footer {
        display: flex;
        justify-content: center;
        gap: 1.5rem;
        margin-top: 1.5rem;
      }
      .coding-button {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        background: #4285f4;
        cursor: pointer;
        transition: all 0.2s ease-out;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .coding-button:hover {
        background: #5c9eff;
        transform: scale(1.1);
        box-shadow: 0 0 15px rgba(66, 133, 244, 0.6);
      }
      .coding-button:active { transform: scale(0.95); }
      .coding-button:disabled {
        background: #b0b0b0;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
      .coding-button svg {
        width: 24px;
        height: 24px;
        fill: ${this.options.buttonIconColor};
      }
      .coding-close {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .coding-close:hover { background: rgba(255, 255, 255, 0.2); }
      .coding-close svg { width: 16px; height: 16px; fill: white; }
      @media (max-width: 600px) {
        .coding-tooltip { padding: 1rem; width: 85%; }
        .coding-tooltip-header { font-size: 1.1rem; }
        .coding-button { width: 35px; height: 35px; }
        .coding-button svg { width: 20px; height: 20px; }
      }
    `;
    document.head.appendChild(styleEl);
  }

  // **** Display Step ****
  async showStep(index) {
    if (index < 0 || index >= this.steps.length) return;
    const step = this.steps[index];
    const element = document.querySelector(step.selector);
    if (!element) {
      if (index < this.steps.length - 1) return this.showStep(index + 1);
      return this.exit();
    }
    // Bring target element to front
    this.currentElement = element;
    this.originalZIndex = element.style.zIndex;
    element.style.zIndex = '10000';
    this.currentStep = index;
    this.scrollToElement(element);
    await new Promise(resolve => setTimeout(resolve, 400));
    this.positionSpotlightOnElement(element);
    this.updateTooltip(step);
    this.positionTooltip(element, step.tooltipPosition || this.options.tooltipPosition);
    return Promise.resolve();
  }

  // **** Complex Spotlight Positioning ****
  positionSpotlightOnElement(element) {
    const rect = element.getBoundingClientRect();
    // Calculate the center coordinates of the target element
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Determine the radius needed to encompass the element with added padding
    const radius = Math.max(rect.width, rect.height) / 2 + this.options.spotlightPadding;
    // Set CSS variables for the mask effect to create the spotlight
    document.documentElement.style.setProperty('--spotlight-x', `${centerX}px`);
    document.documentElement.style.setProperty('--spotlight-y', `${centerY}px`);
    document.documentElement.style.setProperty('--spotlight-inner', `${radius}px`);
    document.documentElement.style.setProperty('--spotlight-outer', `${radius + 2}px`);
  }

  // **** Update Spotlight on Resize/Scroll ****
  updateSpotlightPosition() {
    if (!this.isActive || this.currentStep >= this.steps.length) return;
    const step = this.steps[this.currentStep];
    const element = document.querySelector(step.selector);
    if (!element) return;
    this.positionSpotlightOnElement(element);
    this.positionTooltip(element, step.tooltipPosition || this.options.tooltipPosition);
  }

  // **** Smooth Scroll to Target Element ****
  scrollToElement(element) {
    const rect = element.getBoundingClientRect();
    if (!(rect.top >= 0 && rect.bottom <= window.innerHeight)) {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      window.scrollTo({ top: scrollTop + rect.top - this.options.scrollPadding, behavior: 'smooth' });
    }
  }

  // **** Update Tooltip Content ****
  updateTooltip(step) {
    let tooltipHTML = `
      <div class="coding-tooltip-header">${step.title || ''}</div>
      <div class="coding-tooltip-content">${step.content || ''}</div>
      <div class="coding-tooltip-footer">
        <button class="coding-button coding-prev" ${this.currentStep === 0 ? 'disabled' : ''}>
          <svg viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
        </button>
        <button class="coding-button coding-next">
          <svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
        </button>
      </div>
    `;
    if (this.options.allowClose) {
      tooltipHTML = `<div class="coding-close">
                       <svg viewBox="0 0 24 24">
                         <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                       </svg>
                     </div>` + tooltipHTML;
    }
    this.elements.tooltip.innerHTML = tooltipHTML;
    const nextButton = this.elements.tooltip.querySelector('.coding-next');
    if (nextButton && this.currentStep === this.steps.length - 1) {
      nextButton.innerHTML = `<svg viewBox="0 0 24 24">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                              </svg>`;
    }
  }

  // **** Intelligent Tooltip Positioning ****
  positionTooltip(element, position) {
    const tooltipRect = this.elements.tooltip.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const margin = 20;
    const positions = {
      bottom: { top: elementRect.bottom + 20, left: elementRect.left + elementRect.width / 2 - tooltipRect.width / 2 },
      top: { top: elementRect.top - tooltipRect.height - 20, left: elementRect.left + elementRect.width / 2 - tooltipRect.width / 2 },
      left: { top: elementRect.top + elementRect.height / 2 - tooltipRect.height / 2, left: elementRect.left - tooltipRect.width - 20 },
      right: { top: elementRect.top + elementRect.height / 2 - tooltipRect.height / 2, left: elementRect.right + 20 }
    };
    const isValidPosition = pos => {
      const { top, left } = positions[pos];
      return (top >= margin && left >= margin && (top + tooltipRect.height) <= windowHeight - margin && (left + tooltipRect.width) <= windowWidth - margin);
    };
    let finalPosition = position === 'auto'
      ? ['bottom', 'top', 'right', 'left'].find(isValidPosition) || 'bottom'
      : isValidPosition(position) ? position : ['bottom', 'top', 'right', 'left'].filter(p => p !== position).find(isValidPosition) || 'bottom';
    let { top, left } = positions[finalPosition];
    if (left < margin) left = margin;
    if (left + tooltipRect.width > windowWidth - margin) left = windowWidth - tooltipRect.width - margin;
    if (top < margin) top = margin;
    if (top + tooltipRect.height > windowHeight - margin) top = windowHeight - tooltipRect.height - margin;
    this.elements.tooltip.style.top = `${top}px`;
    this.elements.tooltip.style.left = `${left}px`;
    this.elements.tooltip.className = `coding-tooltip coding-position-${finalPosition}`;
  }

  // **** Navigation: Next & Previous Steps ****
  next() {
    if (this.currentStep < this.steps.length - 1) this.showStep(this.currentStep + 1);
    else this.finish();
    return this;
  }
  prev() {
    if (this.currentStep > 0) this.showStep(this.currentStep - 1);
    return this;
  }

  // **** Finish or Exit Tour ****
  finish() {
    this.cleanUp();
    if (typeof this.options.onFinish === 'function') this.options.onFinish();
    return this;
  }
  exit() {
    this.cleanUp();
    if (typeof this.options.onExit === 'function') this.options.onExit();
    return this;
  }

  // **** Cleanup & Restore Original State ****
  cleanUp() {
    if (this.elements.container) {
      this.elements.container.style.opacity = '0';
      setTimeout(() => this.elements.container.remove(), this.options.animationSpeed);
    }
    window.removeEventListener('resize', this.eventHandlers.resize);
    window.removeEventListener('scroll', this.eventHandlers.scroll, true);
    if (this.options.keyboardNavigation) document.removeEventListener('keydown', this.eventHandlers.keydown);
    if (this.currentElement) {
      this.currentElement.style.zIndex = this.originalZIndex;
      this.currentElement = null;
      this.originalZIndex = null;
    }
    this.isActive = false;
  }
}
