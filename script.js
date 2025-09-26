// Particle Animation System
class ParticleSystem {
    constructor() {
        this.container = document.getElementById('particle-container');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
        this.bindEvents();
        this.animate();
    }
    
    init() {
        // Create initial particles
        for (let i = 0; i < 50; i++) {
            this.createParticle();
        }
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size and color
        const size = Math.random() * 6 + 2;
        const opacity = Math.random() * 0.7 + 0.3;
        const colors = ['#FF4500', '#FF6B00', '#CC3700'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Random position
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        // Random velocity
        const vx = (Math.random() - 0.5) * 2;
        const vy = (Math.random() - 0.5) * 2;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            opacity: ${opacity};
            left: ${x}px;
            top: ${y}px;
            box-shadow: 0 0 ${size * 2}px ${color};
        `;
        
        // Store particle data
        particle.data = { x, y, vx, vy, size, opacity, baseOpacity: opacity };
        
        this.container.appendChild(particle);
        this.particles.push(particle);
    }
    
    bindEvents() {
        // Mouse tracking for interactive particles
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        // Resize handler
        window.addEventListener('resize', () => {
            this.particles.forEach(particle => {
                if (particle.data.x > window.innerWidth) {
                    particle.data.x = 0;
                }
                if (particle.data.y > window.innerHeight) {
                    particle.data.y = 0;
                }
            });
        });
    }
    
    animate() {
        this.particles.forEach(particle => {
            const data = particle.data;
            
            // Update position
            data.x += data.vx;
            data.y += data.vy;
            
            // Mouse interaction
            const dx = this.mouseX - data.x;
            const dy = this.mouseY - data.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                data.vx += (dx / distance) * force * 0.1;
                data.vy += (dy / distance) * force * 0.1;
                data.opacity = Math.min(1, data.baseOpacity + force);
            } else {
                data.opacity = data.baseOpacity;
                data.vx *= 0.99; // Damping
                data.vy *= 0.99;
            }
            
            // Boundary wrap
            if (data.x > window.innerWidth) data.x = 0;
            if (data.x < 0) data.x = window.innerWidth;
            if (data.y > window.innerHeight) data.y = 0;
            if (data.y < 0) data.y = window.innerHeight;
            
            // Apply changes
            particle.style.left = data.x + 'px';
            particle.style.top = data.y + 'px';
            particle.style.opacity = data.opacity;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Animated Counter
class AnimatedCounter {
    constructor(element, target, duration = 2000) {
        this.element = element;
        this.target = parseInt(target);
        this.duration = duration;
        this.start = 0;
        this.current = 0;
        this.increment = this.target / (this.duration / 16);
        this.animate();
    }
    
    animate() {
        if (this.current < this.target) {
            this.current += this.increment;
            if (this.current > this.target) this.current = this.target;
            
            this.element.textContent = Math.floor(this.current);
            requestAnimationFrame(() => this.animate());
        }
    }
}

// 3D Card Effect
class Card3D {
    constructor(element) {
        this.element = element;
        this.bindEvents();
    }
    
    bindEvents() {
        this.element.addEventListener('mouseenter', (e) => {
            this.element.style.transition = 'transform 0.1s';
        });
        
        this.element.addEventListener('mousemove', (e) => {
            const rect = this.element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.element.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateZ(10px)
            `;
        });
        
        this.element.addEventListener('mouseleave', () => {
            this.element.style.transition = 'transform 0.3s';
            this.element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    }
}

// Smooth Scroll and Section Animation
class ScrollAnimations {
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.init();
    }
    
    init() {
        // Intersection Observer for section animations
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        
                        // Animate counters when impact section comes into view
                        if (entry.target.id === 'impact') {
                            this.animateCounters();
                        }
                        
                        // Animate hero stats when home section comes into view
                        if (entry.target.id === 'home') {
                            this.animateHeroStats();
                        }
                    }
                });
            },
            { threshold: 0.3 }
        );
        
        this.sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    animateCounters() {
        const counters = document.querySelectorAll('.impact-number');
        counters.forEach(counter => {
            const target = counter.getAttribute('data-target');
            new AnimatedCounter(counter, target);
        });
    }
    
    animateHeroStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach((stat, index) => {
            setTimeout(() => {
                const target = stat.getAttribute('data-target');
                new AnimatedCounter(stat, target);
            }, index * 300);
        });
    }
}

// Navigation
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.bindEvents();
    }
    
    bindEvents() {
        // Mobile menu toggle
        this.hamburger.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.hamburger.classList.toggle('active');
        });
        
        // Close mobile menu on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('active');
                this.hamburger.classList.remove('active');
            });
        });
        
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });
        
        // Smooth scroll for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Authentication Tabs
class AuthTabs {
    constructor() {
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        this.bindEvents();
    }
    
    bindEvents() {
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Remove active class from all tabs
                this.tabButtons.forEach(btn => btn.classList.remove('active'));
                this.tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab
                button.classList.add('active');
                document.getElementById(targetTab + '-tab').classList.add('active');
            });
        });
    }
}

// Form Interactions
class FormInteractions {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.uploadArea = document.querySelector('.upload-area');
        this.fileInput = document.querySelector('.upload-area input[type="file"]');
        
        this.bindEvents();
    }
    
    bindEvents() {
        // File upload drag and drop
        if (this.uploadArea && this.fileInput) {
            this.uploadArea.addEventListener('click', () => {
                this.fileInput.click();
            });
            
            this.uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                this.uploadArea.classList.add('drag-over');
            });
            
            this.uploadArea.addEventListener('dragleave', () => {
                this.uploadArea.classList.remove('drag-over');
            });
            
            this.uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                this.uploadArea.classList.remove('drag-over');
                const files = e.dataTransfer.files;
                this.handleFiles(files);
            });
            
            this.fileInput.addEventListener('change', (e) => {
                this.handleFiles(e.target.files);
            });
        }
        
        // Form submissions
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(form);
            });
        });
    }
    
    handleFiles(files) {
        const fileNames = Array.from(files).map(file => file.name);
        const uploadText = this.uploadArea.querySelector('p');
        if (fileNames.length > 0) {
            uploadText.textContent = `Selected: ${fileNames.join(', ')}`;
        }
    }
    
    handleFormSubmit(form) {
        // Add loading animation
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;
        
        // Simulate form processing
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            this.showNotification('Success! Your request has been processed.', 'success');
        }, 2000);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--gradient-primary);
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: var(--box-shadow);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Slide in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Slide out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Filter System
class FilterSystem {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.items = document.querySelectorAll('.item-card');
        this.searchInput = document.querySelector('.search-box input');
        
        this.bindEvents();
    }
    
    bindEvents() {
        // Filter button clicks
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Update active button
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter items
                this.filterItems(filter);
            });
        });
        
        // Search functionality
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.searchItems(e.target.value);
            });
        }
    }
    
    filterItems(filter) {
        this.items.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                item.style.animation = 'slideInUp 0.5s ease-out';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    searchItems(query) {
        const searchTerm = query.toLowerCase();
        
        this.items.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const category = item.querySelector('.item-category').textContent.toLowerCase();
            const tags = Array.from(item.querySelectorAll('.tag')).map(tag => 
                tag.textContent.toLowerCase()
            ).join(' ');
            
            const searchContent = `${title} ${category} ${tags}`;
            
            if (searchContent.includes(searchTerm)) {
                item.style.display = 'block';
                item.style.animation = 'slideInUp 0.5s ease-out';
            } else {
                item.style.display = 'none';
            }
        });
    }
}

// Chat System
class ChatSystem {
    constructor() {
        this.chatInput = document.querySelector('.chat-input input');
        this.sendButton = document.querySelector('.btn-send');
        this.messagesContainer = document.querySelector('.chat-messages');
        
        this.bindEvents();
    }
    
    bindEvents() {
        if (this.sendButton && this.chatInput) {
            this.sendButton.addEventListener('click', () => {
                this.sendMessage();
            });
            
            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    }
    
    sendMessage() {
        const message = this.chatInput.value.trim();
        if (message === '') return;
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = 'message outgoing';
        messageElement.innerHTML = `
            <p>${message}</p>
            <span class="message-time">${this.getCurrentTime()}</span>
        `;
        
        this.messagesContainer.appendChild(messageElement);
        this.chatInput.value = '';
        
        // Scroll to bottom
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        
        // Simulate response
        setTimeout(() => {
            this.addIncomingMessage("Thanks for your message! I'll get back to you soon.");
        }, 1000);
    }
    
    addIncomingMessage(text) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message incoming';
        messageElement.innerHTML = `
            <p>${text}</p>
            <span class="message-time">${this.getCurrentTime()}</span>
        `;
        
        this.messagesContainer.appendChild(messageElement);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}

// Request Item Functionality
class RequestSystem {
    constructor() {
        this.requestButtons = document.querySelectorAll('.btn-request');
        this.bindEvents();
    }
    
    bindEvents() {
        this.requestButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const itemCard = e.target.closest('.item-card');
                const itemName = itemCard.querySelector('h3').textContent;
                
                // Animation effect
                button.style.transform = 'scale(0.95)';
                button.textContent = 'Requesting...';
                
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                    button.textContent = 'Requested!';
                    button.style.background = '#28a745';
                    button.disabled = true;
                    
                    // Show notification
                    this.showRequestNotification(itemName);
                }, 500);
            });
        });
    }
    
    showRequestNotification(itemName) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--gradient-primary);
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: var(--box-shadow);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.innerHTML = `
            <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
            Request sent for "${itemName}"!
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Page Loading Animation
class PageLoader {
    constructor() {
        this.createLoader();
    }
    
    createLoader() {
        const loader = document.createElement('div');
        loader.id = 'page-loader';
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--pure-black);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            transition: opacity 0.5s ease;
        `;
        
        loader.innerHTML = `
            <div style="text-align: center;">
                <div style="
                    width: 60px;
                    height: 60px;
                    border: 4px solid var(--medium-gray);
                    border-top: 4px solid var(--primary-orange);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                "></div>
                <h2 style="color: var(--primary-orange); font-size: 1.5rem;">Unishare</h2>
                <p style="color: var(--light-gray);">Loading amazing experience...</p>
            </div>
        `;
        
        document.body.appendChild(loader);
        
        // Add spin animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        // Remove loader after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(loader);
                }, 500);
            }, 1000);
        });
    }
}

// Intersection Observer for Scroll Animations
class ScrollReveal {
    constructor() {
        this.observeElements();
    }
    
    observeElements() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = 'fadeInUp 1s ease-out forwards';
                        entry.target.style.opacity = '1';
                    }
                });
            },
            { threshold: 0.1 }
        );
        
        // Observe all cards and elements
        const elements = document.querySelectorAll('.item-card, .impact-card, .story-card, .leader-item, .auth-card, .donate-form-card');
        elements.forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize page loader first
    new PageLoader();
    
    // Initialize all systems
    new ParticleSystem();
    new Navigation();
    new AuthTabs();
    new FormInteractions();
    new FilterSystem();
    new ChatSystem();
    new RequestSystem();
    new ScrollAnimations();
    new ScrollReveal();
    
    // Initialize 3D effects for cards
    const cards = document.querySelectorAll('.item-card, .stat-card, .impact-card, .story-card');
    cards.forEach(card => new Card3D(card));
    
    // Add some extra interactive elements
    initializeExtraAnimations();
});

// Extra animations and effects
function initializeExtraAnimations() {
    // Floating animation for hero elements
    const floatingElements = document.querySelectorAll('.floating-icon');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 2}s`;
    });
    
    // Glowing effect for buttons on hover
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.boxShadow = '0 0 20px rgba(255, 69, 0, 0.6)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.boxShadow = '';
        });
    });
    
    // Parallax effect for sections
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-elements');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // Dynamic background gradient based on scroll
    window.addEventListener('scroll', () => {
        const scrollPercent = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
        const hue = 20 + (scrollPercent * 40); // Transition from orange to red-orange
        
        document.body.style.background = `
            linear-gradient(135deg, 
                hsl(${hue}, 100%, 20%) 0%, 
                hsl(0, 0%, 0%) 50%, 
                hsl(${hue}, 100%, 10%) 100%
            )
        `;
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance optimization
window.addEventListener('scroll', throttle(() => {
    // Optimized scroll handlers here
}, 16)); // ~60fps

document.addEventListener('DOMContentLoaded', () => {
  try { new ParticleSystem(); } catch(e){}
  try { new Navigation(); } catch(e){}
  try { new ScrollAnimations(); } catch(e){}
  try { new AuthTabs(); } catch(e){}
  try { new FormInteractions(); } catch(e){}
  try { new FilterSystem(); } catch(e){}
  try { new ChatSystem(); } catch(e){}
  try { new RequestSystem(); } catch(e){}
  try { new PageLoader(); } catch(e){}
});

