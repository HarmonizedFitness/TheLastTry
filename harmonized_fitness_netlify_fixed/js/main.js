/**
 * Main JavaScript file for Harmonized Fitness
 * Handles mobile menu, smooth scrolling, and form submission
 */

// Constants
const HEADER_HEIGHT = 80;
const MOBILE_BREAKPOINT = 768;

// DOM Elements
const elements = {
    mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
    navMenu: document.querySelector('nav ul'),
    emailForm: document.querySelector('.signup-form'),
    emailInput: document.querySelector('input[type="email"]'),
    anchorLinks: document.querySelectorAll('a[href^="#"]')
};

// Mobile Menu Toggle
function toggleMobileMenu() {
    if (!elements.navMenu || !elements.mobileMenuBtn) return;
    
    elements.navMenu.classList.toggle('show');
    const isExpanded = elements.navMenu.classList.contains('show');
    elements.mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
}

// Smooth Scroll to Element
function smoothScroll(targetId) {
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;
    
    window.scrollTo({
        top: targetElement.offsetTop - HEADER_HEIGHT,
        behavior: 'smooth'
    });
}

// Handle Form Submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    if (!elements.emailInput) return;
    
    const email = elements.emailInput.value.trim();
    
    if (!email) {
        showError('Please enter your email address.');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address.');
        return;
    }
    
    // For Netlify form handling
    // The form will be automatically processed by Netlify
    // This is just for user feedback
    elements.emailInput.value = '';
    showSuccess('Thank you for subscribing! You will receive updates soon.');
}

// Helper Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(message) {
    alert(message);
    elements.emailInput?.focus();
}

function showSuccess(message) {
    alert(message);
}

// Event Listeners
function initializeEventListeners() {
    // Mobile Menu Toggle
    elements.mobileMenuBtn?.addEventListener('click', toggleMobileMenu);
    
    // Smooth Scrolling
    elements.anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            smoothScroll(targetId);
            
            // Close mobile menu if open
            if (elements.navMenu?.classList.contains('show')) {
                toggleMobileMenu();
            }
        });
    });
    
    // Form Submission
    elements.emailForm?.addEventListener('submit', handleFormSubmit);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    try {
        initializeEventListeners();
    } catch (error) {
        console.error('Error initializing event listeners:', error);
    }
});

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('nav');

if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', nav.classList.contains('active'));
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update URL without scrolling
            history.pushState(null, '', targetId);
        }
    });
});

// Form submission handling
const form = document.querySelector('form[name="contact"]');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        try {
            // Disable submit button and show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Show success message
                form.innerHTML = `
                    <div class="form-success" role="alert">
                        <p>Thank you for subscribing! We'll be in touch soon.</p>
                    </div>
                `;
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'form-error';
            errorMessage.setAttribute('role', 'alert');
            errorMessage.textContent = 'Sorry, there was an error. Please try again later.';
            form.insertBefore(errorMessage, form.firstChild);
            
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}
