document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       1. Mobile Menu Functionality
       ========================================= */
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-list a');

    // Toggle Menu on Hamburger Click
    hamburger.addEventListener('click', () => {
        navList.classList.toggle('active');
        hamburger.classList.toggle('active'); // Optional: for burger animation
    });

    // Close Menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Close Menu when clicking outside of it
    document.addEventListener('click', (e) => {
        if (!navList.contains(e.target) && !hamburger.contains(e.target) && navList.classList.contains('active')) {
            navList.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    /* =========================================
       2. Sticky Header Effect (On Scroll)
       ========================================= */
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
            header.style.padding = "0 20px"; // Optional: shrink header slightly
        } else {
            header.style.boxShadow = "0 2px 15px rgba(0,0,0,0.05)";
            header.style.padding = "0 20px"; // Reset padding
        }
    });

    /* =========================================
       3. Contact Form Handling
       ========================================= */
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Stop the page from reloading
            
            // Get values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const button = contactForm.querySelector('button');
            const originalText = button.innerText;

            // Simulate sending (Loading state)
            button.innerText = 'Sending...';
            button.style.backgroundColor = '#ccc';

            setTimeout(() => {
                // Success Message
                alert(`Thank you, ${name}! We have received your message regarding: \n"${document.getElementById('message').value}"\n\nWe will contact you at ${email} shortly.`);
                
                // Reset Form
                contactForm.reset();
                button.innerText = originalText;
                button.style.backgroundColor = ''; // Reset color
            }, 1500);
        });
    }

    /* =========================================
       4. Active Navigation Highlighting
       ========================================= */
    // This highlights the "Home" or "Menu" link when you scroll to that section
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // 150px offset to trigger highlight slightly before reaching the section
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href').includes(current)) {
                // Add a specific class for highlighting (needs CSS)
                link.style.color = 'var(--primary-color)'; 
            } else {
                link.style.color = ''; // Reset
            }
        });
    });
});