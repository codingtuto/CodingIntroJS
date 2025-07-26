/**
 * CodingIntroJS.js — Version 7 (Zenith Edition)
 * Focused on speed, clarity, and a cleaner experience.
 * This release prioritizes performance and straightforward behavior.
 *
 * ➤ What’s new in v7:
 * - Fixed an issue where tooltip content disappeared after initial position check.
 * - Animations are significantly faster for a smoother, snappier feel.
 * - Simplified design: reduced border radius, lighter shadows, no fancy transitions.
 * - Elements show/hide instantly — no bounce, no delay.
 * - Improved layout on small screens with better safe margins.
 * - Tooltip positions are now pre-calculated to avoid flickering.
 * - Better tooltip placement logic — avoids covering the target element.
 * - Core overlay and cutout logic kept as-is for reliability and consistency.
 *
 * @version 7.0.0
 * @author Coding Team
 */

class CodingIntroJS {
    constructor(steps, options = {}) {
        this.steps = steps;
        this.currentStep = -1;

        // Our sacred default options.
        const defaultOptions = {
            animationSpeed: 150,
            animationEasing: 'ease-out',
            backdropColor: "rgba(15, 22, 36, 0.9)",
            highlightPadding: 8,
            allowClose: true,
            keyboardNavigation: true,
            scrollPadding: 40,
            safeAreaPadding: 10,
            defaultTheme: 'dark', // 'dark' or 'light'.
            onStart: null,
            onFinish: null,
            onExit: null,
            onBeforeStep: null,
            onAfterStep: null
        };

        this.options = {
            ...defaultOptions,
            ...options
        };
        this.isActive = false;
        this.elements = {
            container: null,
            overlay: null,
            highlighter: null,
            tooltip: null
        };
        this.eventHandlers = {};
        this.originalElement = null;
        this.previousStepClassName = '';
        this.stepRects = new Map();
        this.tooltipDimensions = {
            width: 0,
            height: 0
        }; // Cache for tooltip dimensions
    }

    /**
     * Let the show begin! Kicks off the guided tour.
     */
    start() {
        if (this.isActive) {
            console.warn("CodingIntroJS is already running. You can't start it twice 🧐");
            return this;
        }
        this.isActive = true;

        this.createDOMElements();
        // The tooltip is now a child of this.elements.container.
        // It's crucial to measure it AFTER it's appended to the container
        // and its styles (like max-width) are applied via CSS.
        this.measureTooltipDimensions();
        this.setupEventListeners();

        document.body.classList.add('coding-intro-v7-active');
        this.elements.container.classList.add('visible');

        if (typeof this.options.onStart === "function") this.options.onStart();

        this.goTo(0);
        return this;
    }

    /**
     * Time travel to a specific step.
     * @param {number} stepIndex - The step number you want to warp to.
     */
    goTo(stepIndex) {
        if (!this.isActive) return;
        this.processStep(stepIndex);
    }

    /**
     * Changes the theme on the fly. How cool is that?
     * @param {'dark' | 'light'} themeName - The name of the theme to switch to.
     */
    setTheme(themeName) {
        if (this.elements.container) {
            this.elements.container.dataset.theme = themeName;
            this.options.defaultTheme = themeName;
        } else {
            console.warn(
                "%c[⚠️ CodingIntroJS]%c You can't set the theme before the tour starts.\n%c→ Set it in the options instead: %cstartTour({ theme: 'dark' });",
                "color: #e91e63; font-weight: bold; font-size: 13px;",
                "color: #fff; font-weight: normal;",
                "color: #90caf9; font-style: italic;",
                "color: #a5d6a7; font-family: monospace;"
            );
        }
    }

    getCurrentStep() {
        if (this.currentStep < 0) return null;
        return this.steps[this.currentStep];
    }

    /**
     * Conjures the necessary DOM elements out of thin air.
     */
    createDOMElements() {
        this.elements.container = document.createElement("div");
        this.elements.container.className = "coding-intro-v7-container";
        this.elements.container.dataset.theme = this.options.defaultTheme;

        this.elements.overlay = document.createElement("div");
        this.elements.overlay.className = "coding-intro-v7-overlay";

        this.elements.highlighter = document.createElement("div");
        this.elements.highlighter.className = "coding-intro-v7-highlighter";

        this.elements.tooltip = document.createElement("div");
        this.elements.tooltip.className = "coding-intro-v7-tooltip";
        this.elements.tooltip.setAttribute('role', 'dialog');
        this.elements.tooltip.setAttribute('aria-modal', 'true');

        // Append to container first, then container to body
        this.elements.container.append(this.elements.overlay, this.elements.highlighter, this.elements.tooltip);
        document.body.appendChild(this.elements.container);
        this.injectStyles();
    }

    /**
     * Measures the tooltip's default dimensions once for performance.
     * This ensures the tooltip's max-width and padding are taken into account.
     */
    measureTooltipDimensions() {
        const tooltip = this.elements.tooltip;

        // Temporarily set minimal content if it's currently empty, to get a realistic size
        const originalContent = tooltip.innerHTML;
        if (!originalContent) {
            tooltip.innerHTML = `
                <div class="ci-tooltip-header">Placeholder</div>
                <div class="ci-tooltip-content">Small content</div>
                <div class="ci-tooltip-footer">
                    <div class="ci-progress">1/1</div>
                    <div class="ci-nav-buttons"><button class="ci-button">A</button></div>
                </div>`;
        }

        // Temporarily make it visible to measure, but off-screen to avoid flicker
        tooltip.style.visibility = 'hidden';
        tooltip.style.position = 'absolute';
        tooltip.style.top = '-9999px';
        tooltip.style.left = '-9999px';
        tooltip.style.opacity = '1';
        tooltip.classList.add('visible');

        const rect = tooltip.getBoundingClientRect();
        this.tooltipDimensions = {
            width: rect.width,
            height: rect.height
        };

        tooltip.style.visibility = '';
        tooltip.style.position = '';
        tooltip.style.top = '';
        tooltip.style.left = '';
        tooltip.style.opacity = '';
        tooltip.classList.remove('visible');
        tooltip.innerHTML = originalContent;
    }


    /**
     * Injects our CSS stylesheet into the document's head.
     */
    injectStyles() {
        if (document.getElementById("coding-intro-styles-v7")) return;
        const styleElement = document.createElement("style");
        styleElement.id = "coding-intro-styles-v7";
        const o = this.options;

        styleElement.textContent = `
            .coding-intro-v7-container {
                --ci-anim-speed: ${o.animationSpeed}ms;
                --ci-anim-ease: ${o.animationEasing};
                --ci-safe-area: ${o.safeAreaPadding}px;
                
                /* --- DARK THEME (DEFAULT) --- */
                --ci-aura-rgb: 80, 220, 255;
                --ci-tooltip-bg: #222c3f; /* Solid background, no transparency */
                --ci-tooltip-title: #ffffff;
                --ci-tooltip-content: rgba(255, 255, 255, 0.9);
                --ci-tooltip-border: rgba(255, 255, 255, 0.1); /* Minimal border */
                --ci-tooltip-shadow: rgba(0, 0, 0, 0.3); /* Subtle shadow */
                --ci-button-bg: rgba(255, 255, 255, 0.1);
                --ci-button-hover-bg: rgba(255, 255, 255, 0.2);
                --ci-progress-color: rgba(255, 255, 255, 0.6);
                --ci-welcome-button-bg-rgb: var(--ci-aura-rgb);
                --ci-welcome-button-text: #000;
            }

            /* --- LIGHT THEME --- */
            .coding-intro-v7-container[data-theme="light"] {
                --ci-aura-rgb: 0, 122, 255;
                --ci-tooltip-bg: #ffffff; /* Solid background */
                --ci-tooltip-title: #000000;
                --ci-tooltip-content: rgba(0, 0, 0, 0.85);
                --ci-tooltip-border: rgba(0, 0, 0, 0.1);
                --ci-tooltip-shadow: rgba(60, 60, 60, 0.15);
                --ci-button-bg: rgba(0, 0, 0, 0.08);
                --ci-button-hover-bg: rgba(0, 0, 0, 0.15);
                --ci-progress-color: rgba(0, 0, 0, 0.5);
                --ci-welcome-button-text: #fff;
            }

            body.coding-intro-v7-active { overflow: hidden; }

            .coding-intro-v7-container {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                z-index: 99998; pointer-events: none;
                opacity: 0; transition: opacity var(--ci-anim-speed) ease-in-out;
            }
            .coding-intro-v7-container.visible { opacity: 1; }

            .coding-intro-v7-overlay {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background-color: ${o.backdropColor};
                pointer-events: all;
                opacity: 0;
                transition: opacity var(--ci-anim-speed) var(--ci-anim-ease);
            }
            .coding-intro-v7-overlay.visible { opacity: 1; }

            .coding-intro-v7-highlighter {
                position: absolute; pointer-events: none;
                border-radius: 8px; /* Sharper corners */
                box-shadow: 0 0 0 3px rgba(var(--ci-aura-rgb), 0.7), 0 0 0 9999px ${o.backdropColor}; /* Cleaner aura, no inner glow */
                transition: all var(--ci-anim-speed) var(--ci-anim-ease);
                opacity: 0;
            }
            .coding-intro-v7-highlighter.visible { opacity: 1; }

            .coding-intro-v7-tooltip {
                position: absolute;
                z-index: 1;
                border-radius: 12px; 
                padding: clamp(0.8rem, 3vw, 1.2rem); 
                max-width: min(380px, calc(100vw - (var(--ci-safe-area) * 2)));
                width: 100%;
                pointer-events: all;
                opacity: 0;
                /* Direct appearance, no complex transform */
                transform: none; 
                transition: all var(--ci-anim-speed) var(--ci-anim-ease);
                border: 1px solid var(--ci-tooltip-border);
                box-shadow: 0 5px 15px var(--ci-tooltip-shadow); 
                background-color: var(--ci-tooltip-bg);
            }
            
            .coding-intro-v7-tooltip.visible {
                opacity: 1;
                transform: none; 
            }

            /* Welcome Screen Specifics (Responsive) */
            .coding-intro-v7-tooltip.is-welcome {
                top: 50%; left: 50%;
                width: calc(100% - (var(--ci-safe-area) * 2)); 
                /* Center, taking into account the dynamic width */
                transform: translate(-50%, -50%); 
                max-width: 450px; text-align: center;
                padding: clamp(1rem, 4vw, 2rem); 
            }
            .coding-intro-v7-tooltip.is-welcome.visible { transform: translate(-50%, -50%); } 
            
            .ci-welcome-image { max-width: 100px; margin: 0 auto 1rem; border-radius: 8px; } 
            .ci-welcome-button {
                display: inline-block; padding: 12px 28px; margin-top: 0.8rem; /* Smaller padding */
                background-color: rgba(var(--ci-welcome-button-bg-rgb), 0.9);
                color: var(--ci-welcome-button-text);
                border: none; border-radius: 40px; font-weight: bold; cursor: pointer;
                transition: all 0.15s ease; 
            }
            .ci-welcome-button:hover { transform: translateY(-2px); box-shadow: 0 2px 10px rgba(var(--ci-welcome-button-bg-rgb), 0.3); }

            /* Tooltip Internals */
            .ci-tooltip-header {
                font-size: clamp(1.1rem, 4vw, 1.3rem); 
                font-weight: 600; color: var(--ci-tooltip-title); margin-bottom: 0.6rem;
            }
            .ci-tooltip-content {
                font-size: clamp(0.85rem, 3.5vw, 0.95rem); 
                line-height: 1.5; color: var(--ci-tooltip-content); margin-bottom: 1rem;
            }
            .ci-tooltip-footer { display: flex; justify-content: space-between; align-items: center; }
            .ci-progress { font-size: 0.85rem; color: var(--ci-progress-color); }
            .ci-nav-buttons { display: flex; gap: 0.4rem; }
            .ci-button {
                width: 36px; height: 36px; border-radius: 50%; border: none; 
                background: var(--ci-button-bg);
                color: var(--ci-tooltip-title);
                cursor: pointer; transition: all 0.15s ease; 
                display: flex; align-items: center; justify-content: center;
            }
            .ci-button:hover:not(:disabled) { background: var(--ci-button-hover-bg); transform: scale(1.05); } 
            .ci-button:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }
            .ci-button svg { width: 22px; height: 22px; fill: currentColor; } 
        `;
        document.head.appendChild(styleElement);
    }

    /**
     * Listens for user shenanigans like resizing, scrolling, and keyboard mashing.
     */
    setupEventListeners() {
        // Debounce resize and scroll for performance
        let resizeTimeout;
        this.eventHandlers.resize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (this.isActive) {
                    this.stepRects.clear();
                    this.measureTooltipDimensions(); // Re-measure tooltip as viewport width changes
                    this.updatePositions();
                }
            }, 100);
        };
        window.addEventListener("resize", this.eventHandlers.resize);

        let scrollTimeout;
        this.eventHandlers.scroll = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (this.isActive && !this.steps[this.currentStep].isWelcome) { // No need to update if welcome screen
                    this.updatePositions();
                }
            }, 50);
        };
        window.addEventListener("scroll", this.eventHandlers.scroll, true);

        if (this.options.keyboardNavigation) {
            this.eventHandlers.keydown = (e) => {
                if (!this.isActive || e.target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
                    return; // Don't hijack user input!
                }
                if (e.key === 'ArrowRight' || e.key === 'Enter') {
                    e.preventDefault();
                    this.next();
                }
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prev();
                }
                if (e.key === 'Escape' && this.options.allowClose) {
                    e.preventDefault();
                    this.exit();
                }
            };
            document.addEventListener("keydown", this.eventHandlers.keydown);
        }

        this.elements.tooltip.addEventListener("click", (e) => {
            const target = e.target.closest('button');
            if (!target) return;
            if (target.classList.contains("ci-next")) this.next();
            if (target.classList.contains("ci-prev")) this.prev();
        });
    }

    async processStep(stepIndex) {
        if (!this.isActive || stepIndex < 0 || stepIndex >= this.steps.length) {
            return this.finish(); // Mission accomplished
        }

        const step = this.steps[stepIndex];
        if (typeof this.options.onBeforeStep === 'function') {
            await this.options.onBeforeStep(stepIndex, step); // The "Are you sure?"
        }

        this.elements.tooltip.classList.remove('visible');
        this.elements.highlighter.classList.remove('visible');

        await new Promise(r => setTimeout(r, this.options.animationSpeed / 5));

        if (this.previousStepClassName) this.elements.tooltip.classList.remove(this.previousStepClassName);
        this.currentStep = stepIndex;

        if (step.isWelcome) {
            await this.showWelcomeStep(step);
        } else {
            const targetElement = document.querySelector(step.selector);
            if (!targetElement || (typeof step.condition === 'function' && !step.condition(targetElement))) {
                console.warn(
                    `%c[⚠️ CodingIntroJS]%c Step ${stepIndex} skipped — target %c"${step.selector}"%c is a ghost 👻 (missing or not in DOM).`,
                    "color: #e91e63; font-weight: bold;",
                    "color: #fff;",
                    "color: #ffeb3b; font-weight: bold;",
                    "color: #fff;"
                );

                return this.processStep(stepIndex + 1);
            }
            await this.showSelectorStep(step, targetElement);
        }

        if (typeof this.options.onAfterStep === 'function') {
            this.options.onAfterStep(this.currentStep, step, this.originalElement); // The "Tada!"
        }
    }

    async showWelcomeStep(step) {
        this.originalElement = null;
        this.elements.overlay.classList.add('visible');

        this.elements.tooltip.innerHTML = `
            ${step.welcomeImage ? `<img src="${step.welcomeImage}" class="ci-welcome-image" alt="Welcome">` : ''}
            <div class="ci-tooltip-header">${step.title || "Welcome!"}</div>
            <div class="ci-tooltip-content">${step.content || "Ready to take a tour?"}</div>
            <button class="ci-welcome-button ci-next">${step.welcomeButtonText || "Let's Go!"}</button>
        `;

        this.elements.tooltip.classList.add('is-welcome');
        if (step.className) this.elements.tooltip.classList.add(step.className);
        this.previousStepClassName = step.className || '';

        this.elements.tooltip.classList.add('visible');
    }

    async showSelectorStep(step, targetElement) {
        this.originalElement = targetElement;

        this.originalElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        });

        // This little magic trick waits for the user's screen to stop its seismic scrolling activity.
        await new Promise(resolve => {
            let lastPos = window.scrollY;
            let consecutiveChecks = 0;
            const check = () => {
                if (!this.isActive) {
                    resolve();
                    return;
                }
                if (Math.abs(window.scrollY - lastPos) < 2) {
                    consecutiveChecks++;
                } else {
                    consecutiveChecks = 0;
                }
                lastPos = window.scrollY;
                if (consecutiveChecks > 3) resolve();
                else requestAnimationFrame(check);
            };
            check();
        });

        this.elements.overlay.classList.remove('visible');

        this.updateTooltipContent(step);
        if (step.className) this.elements.tooltip.classList.add(step.className);
        this.previousStepClassName = step.className || '';

        this.updatePositions();
        this.elements.tooltip.classList.add('visible');
    }

    /**
     * Retrieves or caches the bounding client rect for a target element.
     * @param {string} selector - The CSS selector of the element.
     * @returns {DOMRect | null} The bounding client rect of the element.
     */
    getRectForSelector(selector) {
        // Here we re-calculate current rect on demand for the target.
        // The cache is cleared on resize, but during a step, we need precise current position.
        const element = document.querySelector(selector);
        if (element) {
            const rect = element.getBoundingClientRect();
            // We can still cache if we want to, but for active step, real-time is best.
            // For now, let's ensure it's always fresh for the current element.
            return rect;
        }
        return null;
    }

    /**
     * Calculates where to put the highlight and the tooltip, hard to do but i think it's work now ... so I planned to make it better , can you contribute ?
     */
    updatePositions() {
        if (!this.originalElement) {
            this.elements.highlighter.classList.remove('visible');
            return;
        }

        const rect = this.getRectForSelector(this.steps[this.currentStep].selector);
        if (!rect) {
            this.elements.highlighter.classList.remove('visible');
            return;
        }

        const highlighter = this.elements.highlighter;
        const p = this.options.highlightPadding;

        highlighter.style.top = `${rect.top - p}px`;
        highlighter.style.left = `${rect.left - p}px`;
        highlighter.style.width = `${rect.width + 2 * p}px`;
        highlighter.style.height = `${rect.height + 2 * p}px`;

        const step = this.steps[this.currentStep];
        const br = step.highlightBorderRadius ?? window.getComputedStyle(this.originalElement).borderRadius;
        // We make our highlighter's border-radius match the element, plus our padding. Clever, eh?
        highlighter.style.borderRadius = `calc(${br} + ${p}px)`;

        highlighter.classList.add('visible');
        this.positionTooltip(rect); // Pass the target element's rect
    }

    updateTooltipContent(step) {
        const title = typeof step.title === 'function' ? step.title(this.originalElement) : step.title;
        const content = typeof step.content === 'function' ? step.content(this.originalElement) : step.content;

        this.elements.tooltip.innerHTML = `
            ${title ? `<div class="ci-tooltip-header">${title}</div>` : ""}
            <div class="ci-tooltip-content">${content || ""}</div>
            <div class="ci-tooltip-footer">
                <div class="ci-progress">${this.currentStep + 1} / ${this.steps.length}</div>
                <div class="ci-nav-buttons">
                    <button class="ci-button ci-prev" title="Previous" ${this.currentStep === 0 ? "disabled" : ""}>
                        <svg viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
                    </button>
                    <button class="ci-button ci-next" title="${this.currentStep === this.steps.length - 1 ? 'Finish' : 'Next'}">
                        ${this.currentStep === this.steps.length - 1 
                            ? `<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>`
                            : `<svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>`
                        }
                    </button>
                </div>
            </div>`;
        this.elements.tooltip.classList.remove('is-welcome');
        // Re-measure tooltip dimensions ONLY IF content size might change (e.g., dynamic content)
        // For static content, the initial measureTooltipDimensions() is enough.
        // If your 'content' or 'title' can result in vastly different heights/widths,
        // uncomment the line below. Otherwise, keep it commented for performance.
        // this.measureTooltipDimensions(); 
    }

    /**
     * Finds the best spot for the tooltip so it doesn't fly off-screen and doesn't obscure target.
     */
    positionTooltip(targetRect) {
        const tooltip = this.elements.tooltip;
        const tooltipWidth = this.tooltipDimensions.width;
        const tooltipHeight = this.tooltipDimensions.height;

        const safe = this.options.safeAreaPadding;
        const vpW = window.innerWidth;
        const vpH = window.innerHeight;
        const gap = 12;

        // Define potential positions and their scores
        // Score is based on available space and avoiding overlap with target
        const positions = [
            // Bottom
            {
                name: 'bottom',
                top: targetRect.bottom + gap,
                left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
                score: vpH - (targetRect.bottom + gap + tooltipHeight)
            },
            // Top
            {
                name: 'top',
                top: targetRect.top - tooltipHeight - gap,
                left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
                score: targetRect.top - tooltipHeight - gap
            },
            // Right
            {
                name: 'right',
                top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
                left: targetRect.right + gap,
                score: vpW - (targetRect.right + gap + tooltipWidth)
            },
            // Left
            {
                name: 'left',
                top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
                left: targetRect.left - tooltipWidth - gap,
                score: targetRect.left - tooltipWidth - gap
            }
        ];

        let bestPosition = null;
        let maxScore = -Infinity;

        // Iterate through positions to find the one that best fits and doesn't overlap the target
        for (const pos of positions) {
            // Calculate potential tooltip rectangle
            const currentTooltipRect = {
                top: pos.top,
                left: pos.left,
                right: pos.left + tooltipWidth,
                bottom: pos.top + tooltipHeight
            };

            // we check if tooltip overlaps the target element
            const overlapsTarget = !(
                currentTooltipRect.right < targetRect.left ||
                currentTooltipRect.left > targetRect.right ||
                currentTooltipRect.bottom < targetRect.top ||
                currentTooltipRect.top > targetRect.bottom
            );

            // Check if position fits within viewport boundaries with safe area
            const fitsX = (pos.left >= safe) && (pos.left + tooltipWidth <= vpW - safe);
            const fitsY = (pos.top >= safe) && (pos.top + tooltipHeight <= vpH - safe);

            if (fitsX && fitsY && !overlapsTarget) {
                // If it fits and doesn't overlap, consider its score
                const currentScore = pos.score;
                if (currentScore > maxScore) {
                    maxScore = currentScore;
                    bestPosition = pos;
                }
            }
        }

        // Fallback: If no ideal position found (e.g., target is too big or screen too small),
        // try to force it into the most spacious direction and clamp.
        // Prioritize top/bottom, then left/right if screen is wide.
        if (!bestPosition) {
            // Find the position with the most space, regardless of overlap for fallback
            let maxAvailableSpace = -Infinity;
            let fallbackPosition = null;
            for (const pos of positions) {
                const space = pos.score;
                if (space > maxAvailableSpace) {
                    maxAvailableSpace = space;
                    fallbackPosition = pos;
                }
            }
            bestPosition = fallbackPosition || positions[0]; // Default to first position if all else fails
        }

        let {
            top,
            left
        } = bestPosition;

        // Clamp the final position to ensure it stays within viewport
        left = Math.max(safe, Math.min(left, vpW - tooltipWidth - safe));
        top = Math.max(safe, Math.min(top, vpH - tooltipHeight - safe));

        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
        // No need to toggle 'visible' here, it's managed in showSelectorStep
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'none';
    }

    next() {
        return this.goTo(this.currentStep + 1);
    }
    prev() {
        return this.goTo(this.currentStep - 1);
    }

    /**
     * The "I'm outta here" function. Gracefully exits the tour.
     */
    exit() {
        if (!this.isActive) return;
        this.isActive = false;

        this.elements.container.classList.remove('visible');
        document.body.classList.remove('coding-intro-v7-active');

        // Let the fade-out animation finish before we vaporize the DOM elements.
        setTimeout(() => {
            if (this.elements.container) this.elements.container.remove();
            const styleSheet = document.getElementById("coding-intro-styles-v7");
            if (styleSheet) styleSheet.remove();

            // Clean up our event listeners. No memory leaks on our watch!
            window.removeEventListener("resize", this.eventHandlers.resize);
            window.removeEventListener("scroll", this.eventHandlers.scroll, true);
            if (this.eventHandlers.keydown) document.removeEventListener("keydown", this.eventHandlers.keydown);

            // Clear cached rects on exit
            this.stepRects.clear();
        }, this.options.animationSpeed);

        if (typeof this.options.onExit === "function") this.options.onExit();
    }

    /**
     * Called when the tour is successfully completed.
     */
    finish() {
        if (!this.isActive) return;
        if (typeof this.options.onFinish === "function") this.options.onFinish();
        this.exit();
    }
}