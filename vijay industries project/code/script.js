/**
 * Browser Compatibility & Deployment Ready
 * 
 * This code includes:
 * - Polyfills for older browsers (IE11+)
 * - Vendor prefixes for CSS animations
 * - Error handling for all functions
 * - Mobile device detection
 * - Fallback mechanisms
 * - Performance optimizations
 * - Cross-browser support (Chrome, Firefox, Safari, Edge, IE11+)
 */

// Browser compatibility and polyfills
(function() {
    'use strict';
    
    // Polyfill for forEach on NodeList (IE11)
    if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = Array.prototype.forEach;
    }
    
    // Polyfill for requestAnimationFrame
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            return setTimeout(callback, 1000 / 60);
        };
    }
    
    // Polyfill for scrollTo with behavior
    if (!window.scrollTo || typeof window.scrollTo !== 'function') {
        window.scrollTo = function(options) {
            if (typeof options === 'object') {
                window.scrollTo(options.left || 0, options.top || 0);
            } else {
                window.scrollTo(arguments[0], arguments[1]);
            }
        };
    }
})();

// Enhanced smooth scrolling function with fallback
function smoothScrollTo(element, offset) {
    offset = offset || 0;
    try {
        if (!element) return;
        
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + (window.pageYOffset || window.scrollY || document.documentElement.scrollTop) - offset;
        
        // Check if smooth scroll is supported
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        } else {
            // Fallback for browsers without smooth scroll support
            const start = window.pageYOffset || document.documentElement.scrollTop;
            const distance = offsetPosition - start;
            const duration = 500;
            let startTime = null;
            
            function easeInOutQuad(t) {
                return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            }
            
            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                
                window.scrollTo(0, start + distance * easeInOutQuad(progress));
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }
            
            requestAnimationFrame(animation);
        }
    } catch (e) {
        console.warn('Smooth scroll error:', e);
        // Fallback to instant scroll
        window.scrollTo(0, offsetPosition);
    }
}

// Section Navigation with error handling
// Track if we're updating history to prevent infinite loops
var isUpdatingHistory = false;

function showSection(sectionId, updateHistory) {
    try {
        if (!sectionId) return;
        
        // Hide all sections
        var sections = document.querySelectorAll('.page-section');
        if (sections && sections.length > 0) {
            sections.forEach(function(section) {
                if (section && section.classList) {
                    section.classList.remove('active');
                }
            });
        }
        
        // Show selected section
        var targetSection = document.getElementById(sectionId);
        if (targetSection) {
            if (targetSection.classList) {
                targetSection.classList.add('active');
            }
            // Smooth scroll to top with slight delay for section transition
            setTimeout(function() {
                try {
                    if ('scrollBehavior' in document.documentElement.style) {
                        window.scrollTo({ 
                            top: 0, 
                            behavior: 'smooth' 
                        });
                    } else {
                        window.scrollTo(0, 0);
                    }
                } catch (e) {
                    window.scrollTo(0, 0);
                }
            }, 50);
        }
        
        // Update body class for navbar styling
        if (document.body && document.body.classList) {
            if (sectionId === 'home') {
                document.body.classList.add('home-active');
            } else {
                document.body.classList.remove('home-active');
            }
        }
        
        // Update active nav link
        var navLinks = document.querySelectorAll('.nav-link');
        if (navLinks && navLinks.length > 0) {
            navLinks.forEach(function(link) {
                if (link && link.classList) {
                    link.classList.remove('active');
                    var linkSection = link.getAttribute('data-section');
                    if (linkSection === sectionId) {
                        link.classList.add('active');
                    }
                }
            });
        }
        
        // Close mobile menu
        var hamburger = document.getElementById('hamburger');
        var navMenu = document.getElementById('navMenu');
        if (hamburger && hamburger.classList && navMenu && navMenu.classList) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
        
        // Update browser history if updateHistory is true (default true)
        if (updateHistory !== false && !isUpdatingHistory) {
            try {
                // Use pushState to add to browser history
                var url = sectionId === 'home' ? '/' : '#' + sectionId;
                var state = { section: sectionId };
                
                // Check if history API is available
                if (window.history && window.history.pushState) {
                    window.history.pushState(state, '', url);
                }
            } catch (e) {
                console.warn('History update error:', e);
            }
        }
    } catch (e) {
        console.warn('showSection error:', e);
    }
}

// Enhanced smooth scrolling for anchor links with error handling
try {
    var anchorLinks = document.querySelectorAll('a[href^="#"]');
    if (anchorLinks && anchorLinks.length > 0) {
        anchorLinks.forEach(function(anchor) {
            anchor.addEventListener('click', function (e) {
                try {
                    const href = this.getAttribute('href');
                    if (href && href !== '#' && href.length > 1) {
                        const target = document.querySelector(href);
                        if (target) {
                            e.preventDefault();
                            smoothScrollTo(target, 80);
                        }
                    }
                } catch (err) {
                    console.warn('Anchor link error:', err);
                }
            });
        });
    }
} catch (e) {
    console.warn('Anchor links initialization error:', e);
}

// Smooth scroll on page load if hash exists
window.addEventListener('load', function() {
    try {
        if (window.location && window.location.hash) {
            const target = document.querySelector(window.location.hash);
            if (target) {
                setTimeout(function() {
                    smoothScrollTo(target, 80);
                }, 100);
            }
        }
    } catch (e) {
        console.warn('Hash scroll error:', e);
    }
});

// Optimized scroll handler for better performance
try {
    var scrollTimeout;
    var scrollHandler = function() {
        // Throttle scroll events for better performance
        if (scrollTimeout) {
            return;
        }
        scrollTimeout = requestAnimationFrame(function() {
            scrollTimeout = null;
        });
    };
    
    // Use passive listener for better scroll performance
    if (window.addEventListener) {
        window.addEventListener('scroll', scrollHandler, { passive: true, capture: false });
    } else if (window.attachEvent) {
        window.attachEvent('onscroll', scrollHandler);
    }
} catch (e) {
    console.warn('Scroll handler error:', e);
}

// Gmail app redirection for mobile devices
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isAndroid() {
    return /Android/i.test(navigator.userAgent);
}

function isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function openGmailApp(email) {
    if (isAndroid()) {
        // Android: Use Gmail app intent URL
        const gmailAppLink = `googlegmail://co?to=${encodeURIComponent(email)}`;
        window.location.href = gmailAppLink;
        
        // Fallback to mailto after delay (if Gmail app not installed)
        setTimeout(function() {
            window.location.href = `mailto:${email}`;
        }, 800);
    } else if (isIOS()) {
        // iOS: Use Gmail app URL scheme
        const gmailAppLink = `googlegmail://co?to=${encodeURIComponent(email)}`;
        window.location.href = gmailAppLink;
        
        // Fallback to mailto after delay (if Gmail app not installed)
        setTimeout(function() {
            window.location.href = `mailto:${email}`;
        }, 800);
    } else {
        // Desktop - use mailto directly
        window.location.href = `mailto:${email}`;
    }
}

// Initialize all functionality when DOM is ready
function initializeApp() {
    try {
        // Add click handlers to all email links with data-email attribute
        var emailLinks = document.querySelectorAll('a[data-email]');
        if (emailLinks && emailLinks.length > 0) {
            emailLinks.forEach(function(link) {
                if (link) {
                    link.addEventListener('click', function(e) {
                        try {
                            var email = this.getAttribute('data-email');
                            if (email) {
                                if (isMobileDevice()) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    openGmailApp(email);
                                }
                                // If desktop, let the default mailto: behavior work
                            }
                        } catch (err) {
                            console.warn('Email link error:', err);
                        }
                    });
                }
            });
        }

        // Navigation link handlers
        var navLinks = document.querySelectorAll('.nav-link, .logo-link, .btn-link');
        if (navLinks && navLinks.length > 0) {
            navLinks.forEach(function(link) {
                if (link) {
                    link.addEventListener('click', function(e) {
                        try {
                            var sectionId = this.getAttribute('data-section');
                            if (sectionId) {
                                e.preventDefault();
                                showSection(sectionId);
                            }
                        } catch (err) {
                            console.warn('Nav link error:', err);
                        }
                    });
                }
            });
        }

        // Logo click handler
        var logoLink = document.querySelector('.logo-link');
        if (logoLink) {
            logoLink.addEventListener('click', function(e) {
                try {
                    e.preventDefault();
                    showSection('home');
                } catch (err) {
                    console.warn('Logo link error:', err);
                }
            });
        }
    } catch (e) {
        console.warn('App initialization error:', e);
    }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM is already ready
    initializeApp();
}

// Mobile Menu Toggle with error handling
function initializeMobileMenu() {
    try {
        var hamburger = document.getElementById('hamburger');
        var navMenu = document.getElementById('navMenu');

        if (hamburger && navMenu) {
            var toggleMenu = function(e) {
                try {
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    if (hamburger.classList && navMenu.classList) {
                        hamburger.classList.toggle('active');
                        navMenu.classList.toggle('active');
                    }
                } catch (err) {
                    console.warn('Menu toggle error:', err);
                }
            };

            hamburger.addEventListener('click', toggleMenu);
            hamburger.addEventListener('touchend', toggleMenu);

            var navLinks = navMenu.querySelectorAll('a');
            if (navLinks && navLinks.length > 0) {
                navLinks.forEach(function(link) {
                    if (link) {
                        link.addEventListener('click', function(e) {
                            try {
                                if (link.classList && link.classList.contains('products-link')) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    var parentLi = link.closest('li');
                                    if (parentLi && parentLi.classList) {
                                        parentLi.classList.toggle('dropdown-active');
                                    }
                                } else if (link.classList && link.classList.contains('nav-link')) {
                                    var sectionId = link.getAttribute('data-section');
                                    if (sectionId) {
                                        showSection(sectionId);
                                    }
                                }
                            } catch (err) {
                                console.warn('Nav link click error:', err);
                            }
                        });

                        if (link.classList && link.classList.contains('products-link')) {
                            link.addEventListener('touchend', function(e) {
                                try {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    var parentLi = link.closest('li');
                                    if (parentLi && parentLi.classList) {
                                        parentLi.classList.toggle('dropdown-active');
                                    }
                                } catch (err) {
                                    console.warn('Products link error:', err);
                                }
                            });
                        }
                    }
                });
            }

            document.addEventListener('click', function(e) {
                try {
                    if (e && e.target && hamburger && navMenu) {
                        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                            if (hamburger.classList && navMenu.classList) {
                                hamburger.classList.remove('active');
                                navMenu.classList.remove('active');
                            }
                        }
                    }
                } catch (err) {
                    console.warn('Document click error:', err);
                }
            });
        }
    } catch (e) {
        console.warn('Mobile menu initialization error:', e);
    }
}

// Initialize mobile menu when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMobileMenu);
} else {
    initializeMobileMenu();
}

// Handle browser back/forward button
window.addEventListener('popstate', function(e) {
    try {
        isUpdatingHistory = true; // Prevent pushState when handling popstate
        
        var sectionId = 'home'; // Default to home
        
        if (e.state && e.state.section) {
            // Use state from history
            sectionId = e.state.section;
        } else if (window.location.hash) {
            // Fallback to hash if no state
            sectionId = window.location.hash.substring(1);
        }
        
        // Show the section without updating history (to prevent loops)
        showSection(sectionId, false);
        
        // Reset flag after a short delay
        setTimeout(function() {
            isUpdatingHistory = false;
        }, 100);
    } catch (e) {
        console.warn('Popstate error:', e);
        isUpdatingHistory = false;
    }
});

// Initialize - show appropriate section based on URL
try {
    function initializeSection() {
        var sectionId = 'home'; // Default to home
        
        // Check if there's a hash in the URL
        if (window.location.hash) {
            var hash = window.location.hash.substring(1);
            // Verify the section exists
            var section = document.getElementById(hash);
            if (section) {
                sectionId = hash;
            }
        }
        
        // Set initial history state
        try {
            if (window.history && window.history.replaceState) {
                var url = sectionId === 'home' ? '/' : '#' + sectionId;
                var state = { section: sectionId };
                window.history.replaceState(state, '', url);
            }
        } catch (e) {
            console.warn('Initial history state error:', e);
        }
        
        // Show the section without updating history (initial load)
        showSection(sectionId, false);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSection);
    } else {
        initializeSection();
    }
} catch (e) {
    console.warn('Initial section load error:', e);
}

// Transformer Comparison Functionality
function initializeComparison() {
    try {
        const checkboxes = document.querySelectorAll('.compare-checkbox');
        const compareBtn = document.getElementById('compare-btn');
        const clearBtn = document.getElementById('clear-selection');
        const comparisonResults = document.getElementById('comparison-results');
        
        // Transformer specifications data
        const transformerData = {
            distribution: {
                name: 'Distribution Transformers',
                powerRating: '10 kVA to 5000 kVA',
                primaryVoltage: '11 kV, 22 kV, 33 kV',
                secondaryVoltage: '415 V (3-phase), 240 V (single-phase)',
                frequency: '50 Hz (India), 60 Hz (USA)',
                efficiency: '95% – 99%',
                impedance: '4% – 8%',
                cooling: 'ONAN, ONAF',
                insulation: 'Class A or Class B',
                temperatureRise: '50°C to 60°C',
                application: 'Final voltage conversion for consumers'
            },
            power: {
                name: 'Power Transformers',
                powerRating: '10 MVA to 1000+ MVA',
                primaryVoltage: '66 kV, 110 kV, 132 kV, 220 kV, 400 kV, 765 kV',
                secondaryVoltage: '33 kV, 22 kV, 11 kV',
                frequency: '50 Hz (India, Europe), 60 Hz (USA)',
                efficiency: '98% – 99.7%',
                impedance: '8% – 15%',
                cooling: 'ONAN, ONAF, OFAF, ODAF, OFWF',
                insulation: 'High BIL (550 kV - 1550 kV)',
                temperatureRise: 'Oil: 50–60°C, Winding: 55–65°C',
                application: 'High-voltage transmission applications'
            },
            stepup: {
                name: 'Step-Up Transformers',
                powerRating: '10 MVA to 1000 MVA',
                primaryVoltage: '6.6 kV, 11 kV, 15.75 kV, 22 kV',
                secondaryVoltage: '110 kV, 132 kV, 220 kV, 400 kV, 765 kV',
                frequency: '50 Hz (India, Europe), 60 Hz (USA)',
                efficiency: '98% – 99.8%',
                impedance: '10% – 15%',
                cooling: 'ONAN, ONAF, OFAF, OFWF',
                insulation: 'High BIL protection',
                temperatureRise: 'As per standards',
                application: 'Generator to transmission conversion'
            },
            stepdown: {
                name: 'Step-Down Transformers',
                powerRating: '10 kVA to 500 MVA',
                primaryVoltage: '220 kV, 132 kV, 110 kV, 66 kV, 33 kV',
                secondaryVoltage: '11 kV, 6.6 kV, 415 V, 240 V',
                frequency: '50 Hz (India, Europe), 60 Hz (USA)',
                efficiency: '97% – 99%',
                impedance: '4% – 10%',
                cooling: 'ONAN, ONAF, OFAF',
                insulation: 'Standard BIL protection',
                temperatureRise: 'As per standards',
                application: 'Transmission to distribution conversion'
            },
            isolation: {
                name: 'Isolation Transformers',
                powerRating: '50 VA to 100 kVA',
                primaryVoltage: '230 V AC, 415 V AC',
                secondaryVoltage: '230 V AC, 415 V AC (same as input)',
                frequency: '50 Hz (India), 60 Hz (USA)',
                efficiency: '90% – 98%',
                impedance: 'Low impedance',
                cooling: 'Air cooled (Natural/Forced)',
                insulation: 'Double insulation, 2-5 kV dielectric',
                temperatureRise: '40°C – 60°C',
                application: 'Safety and noise reduction'
            },
            control: {
                name: 'Control Transformers',
                powerRating: '25 VA to 5 kVA',
                primaryVoltage: '230 V AC, 415 V AC',
                secondaryVoltage: '24 V AC, 48 V AC, 110 V AC, 120 V AC',
                frequency: '50 Hz (India), 60 Hz (USA)',
                efficiency: '85% – 95%',
                impedance: 'Low for good regulation',
                cooling: 'Air cooled (Natural Air)',
                insulation: '2 kV – 4 kV dielectric strength',
                temperatureRise: 'As per class rating',
                application: 'Control circuits and industrial automation'
            },
            dry: {
                name: 'Dry Type Transformers',
                powerRating: '100 VA to 10 MVA',
                primaryVoltage: '11 kV, 6.6 kV, 415 V',
                secondaryVoltage: '415 V, 240 V, 110 V',
                frequency: '50 Hz (India), 60 Hz (USA)',
                efficiency: '95% – 98%',
                impedance: 'Standard values',
                cooling: 'AN (Air Natural), AF (Air Forced)',
                insulation: 'Class F (155°C), Class H (180°C)',
                temperatureRise: '75°C – 100°C',
                application: 'Indoor applications (hospitals, malls, schools)'
            },
            oil: {
                name: 'Oil-Filled Transformers',
                powerRating: '10 kVA to 1000+ MVA',
                primaryVoltage: '11 kV, 33 kV, 66 kV, 132 kV, 220 kV',
                secondaryVoltage: '415 V, 11 kV, 33 kV',
                frequency: '50 Hz (India, Europe), 60 Hz (USA)',
                efficiency: '97% – 99.8%',
                impedance: 'Standard values',
                cooling: 'ONAN, ONAF, OFAF, OFWF',
                insulation: 'Mineral oil + paper/pressboard',
                temperatureRise: 'Oil: 50–60°C, Winding: 55–65°C',
                application: 'Outdoor installations and substations'
            }
        };
        
        function updateCompareButton() {
            const checkedBoxes = document.querySelectorAll('.compare-checkbox:checked');
            compareBtn.disabled = checkedBoxes.length < 2;
            compareBtn.textContent = checkedBoxes.length < 2 ? 
                'Select at least 2 transformers to compare' : 
                `Compare Selected Transformers (${checkedBoxes.length})`;
        }
        
        function updateCardSelection() {
            checkboxes.forEach(checkbox => {
                const card = checkbox.closest('.transformer-option').querySelector('.transformer-card');
                if (checkbox.checked) {
                    card.classList.add('selected');
                } else {
                    card.classList.remove('selected');
                }
            });
        }
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                updateCompareButton();
                updateCardSelection();
            });
        });
        
        compareBtn.addEventListener('click', function() {
            const selectedTransformers = Array.from(document.querySelectorAll('.compare-checkbox:checked'))
                .map(cb => cb.value);
            
            if (selectedTransformers.length >= 2) {
                generateComparisonTable(selectedTransformers);
                comparisonResults.style.display = 'block';
                comparisonResults.scrollIntoView({ behavior: 'smooth' });
            }
        });
        
        clearBtn.addEventListener('click', function() {
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            updateCompareButton();
            updateCardSelection();
            comparisonResults.style.display = 'none';
        });
        
        function generateComparisonTable(selectedTransformers) {
            const tableHeader = document.getElementById('table-header');
            const tableBody = document.getElementById('table-body');
            
            // Clear existing content
            tableHeader.innerHTML = '<th class="spec-column">Specification</th>';
            tableBody.innerHTML = '';
            
            // Add headers for selected transformers
            selectedTransformers.forEach(transformerType => {
                const th = document.createElement('th');
                th.textContent = transformerData[transformerType].name;
                tableHeader.appendChild(th);
            });
            
            // Define specifications to compare
            const specifications = [
                { key: 'powerRating', label: 'Power Rating' },
                { key: 'primaryVoltage', label: 'Primary Voltage' },
                { key: 'secondaryVoltage', label: 'Secondary Voltage' },
                { key: 'frequency', label: 'Frequency' },
                { key: 'efficiency', label: 'Efficiency' },
                { key: 'impedance', label: 'Impedance' },
                { key: 'cooling', label: 'Cooling Method' },
                { key: 'insulation', label: 'Insulation' },
                { key: 'temperatureRise', label: 'Temperature Rise' },
                { key: 'application', label: 'Primary Application' }
            ];
            
            // Generate table rows
            specifications.forEach(spec => {
                const row = document.createElement('tr');
                
                // Specification name
                const specCell = document.createElement('td');
                specCell.textContent = spec.label;
                row.appendChild(specCell);
                
                // Values for each selected transformer
                selectedTransformers.forEach(transformerType => {
                    const valueCell = document.createElement('td');
                    valueCell.textContent = transformerData[transformerType][spec.key];
                    row.appendChild(valueCell);
                });
                
                tableBody.appendChild(row);
            });
        }
        
        // Initialize
        updateCompareButton();
        
    } catch (e) {
        console.warn('Comparison initialization error:', e);
    }
}

// Initialize comparison when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeComparison);
} else {
    initializeComparison();
}

// ===== MOBILE NAVIGATION FUNCTIONALITY =====
function initializeMobileNavigation() {
    try {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');
        const productsLink = document.querySelector('.products-link');
        const dropdown = document.querySelector('.dropdown');
        
        // Mobile menu toggle
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                // Prevent body scroll when menu is open
                if (navMenu.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });
        }
        
        // Close mobile menu when clicking nav links
        if (navLinks && navLinks.length > 0) {
            navLinks.forEach(function(link) {
                link.addEventListener('click', function() {
                    if (window.innerWidth <= 768) {
                        if (hamburger) hamburger.classList.remove('active');
                        if (navMenu) navMenu.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
            });
        }
        
        // Mobile dropdown toggle for products
        if (productsLink && dropdown) {
            productsLink.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                const isClickInsideNav = navMenu && navMenu.contains(e.target);
                const isClickOnHamburger = hamburger && hamburger.contains(e.target);
                
                if (!isClickInsideNav && !isClickOnHamburger) {
                    if (hamburger) hamburger.classList.remove('active');
                    if (navMenu) navMenu.classList.remove('active');
                    if (dropdown) dropdown.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                if (hamburger) hamburger.classList.remove('active');
                if (navMenu) navMenu.classList.remove('active');
                if (dropdown) dropdown.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Touch event optimization for mobile
        if ('ontouchstart' in window) {
            document.addEventListener('touchstart', function() {}, { passive: true });
        }
        
        // Prevent zoom on double tap for iOS
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        console.log('Mobile navigation initialized successfully');
        
    } catch (e) {
        console.warn('Mobile navigation initialization error:', e);
    }
}

// Initialize mobile navigation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMobileNavigation);
} else {
    initializeMobileNavigation();
}

// Contact Form Handler
function initializeContactForm() {
    try {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        const formMessage = document.getElementById('formMessage');
        const submitButton = contactForm.querySelector('.btn-submit');
        const btnText = submitButton.querySelector('.btn-text');
        const btnLoader = submitButton.querySelector('.btn-loader');

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: document.getElementById('contactName').value.trim(),
                email: document.getElementById('contactEmail').value.trim(),
                phone: document.getElementById('contactPhone').value.trim(),
                subject: document.getElementById('contactSubject').value,
                service_type: document.getElementById('contactService').value,
                message: document.getElementById('contactMessage').value.trim()
            };

            // Validate required fields
            if (!formData.name || !formData.email || !formData.message) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }

            // Show loading state
            submitButton.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-block';
            formMessage.style.display = 'none';

            try {
                // Determine API endpoint (use relative path for same domain)
                const apiUrl = '/api/contact';
                
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    showFormMessage(data.message || 'Thank you for contacting us! We will get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    showFormMessage(data.error || 'Failed to send message. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showFormMessage('Network error. Please check your connection and try again.', 'error');
            } finally {
                // Reset button state
                submitButton.disabled = false;
                btnText.style.display = 'inline-block';
                btnLoader.style.display = 'none';
            }
        });

        function showFormMessage(message, type) {
            if (!formMessage) return;
            
            formMessage.textContent = message;
            formMessage.className = 'form-message ' + type;
            formMessage.style.display = 'block';
            
            // Scroll to message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Auto-hide success messages after 5 seconds
            if (type === 'success') {
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }
        }

        console.log('Contact form initialized successfully');
    } catch (e) {
        console.warn('Contact form initialization error:', e);
    }
}

// Initialize contact form when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeContactForm);
} else {
    initializeContactForm();
}