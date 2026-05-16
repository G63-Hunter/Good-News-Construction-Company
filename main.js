async function loadComponent(elementId, path) {
    try {
        const response = await fetch(path);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (err) {
        console.error(`Failed to load component: ${path}`, err);
    }
}

async function init() {
    // Load Components
    await loadComponent('navbar-placeholder', 'components/navbar/navbar.html');
    await loadComponent('footer-placeholder', 'components/footer/footer.html');

    // Highlight Active Link
    const currentPath = window.location.pathname.split("/").pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });

    // Mobile Menu Toggle
    const menuBtn = document.getElementById('menu-btn');
    const navLinksList = document.getElementById('nav-links');

    if (menuBtn && navLinksList) {
        menuBtn.addEventListener('click', () => {
            navLinksList.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksList.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            });
        });
    }

    // Header Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Chatbot Toggle
    const chatbotToggler = document.getElementById('chatbot-toggler');
    const chatbotContainer = document.getElementById('chatbot-container');
    
    if (chatbotToggler && chatbotContainer) {
        chatbotToggler.addEventListener('click', () => {
            chatbotContainer.classList.toggle('active');
            const icon = chatbotToggler.querySelector('i');
            icon.classList.toggle('fa-comments');
            icon.classList.toggle('fa-times');
        });
    }

    // Chatbot Logic
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatBody = document.getElementById('chat-body');

    if (chatInput && sendBtn && chatBody) {
        const appendMessage = (text, sender) => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${sender}`;
            if (sender === 'bot') {
                msgDiv.innerHTML = text;
            } else {
                msgDiv.textContent = text;
            }
            chatBody.appendChild(msgDiv);
            chatBody.scrollTop = chatBody.scrollHeight;
        };

        const handleChat = () => {
            const userMsg = chatInput.value.trim();
            if (!userMsg) return;

            appendMessage(userMsg, 'user');
            chatInput.value = '';

            setTimeout(() => {
                let botResponse = "I'm not sure I understand. Could you please clarify your inquiry?";
                const msg = userMsg.toLowerCase();

                if (msg.includes('service') || msg.includes('do you do')) {
                    botResponse = "We offer residential, commercial, and renovation services. You can check our <a href='services.html' style='color: var(--primary);'>Services</a> page for more details!";
                } else if (msg.includes('contact') || msg.includes('phone') || msg.includes('email')) {
                    botResponse = "You can reach us at <a href='mailto:nyongahannington@gmail.com' style='color: var(--primary);'>nyongahannington@gmail.com</a> or call us at +(256) 703044653 or +(256) 783332503.";
                } else if (msg.includes('hello') || msg.includes('hi')) {
                    botResponse = "Hello! How can Good News Construction assist you with your project today?";
                } else if (msg.includes('project')) {
                    botResponse = "We have completed several high-end projects. Check out our <a href='projects.html' style='color: var(--primary);'>Projects</a> page!";
                }

                appendMessage(botResponse, 'bot');
            }, 800);
        };

        sendBtn.addEventListener('click', handleChat);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChat();
        });
    }

    // --- Slideshow Initialization ---
    const injectSlideshow = () => {
        if (document.getElementById('slideshow-modal')) return;
        const modalHtml = `
            <div id="slideshow-modal" class="slideshow-modal">
                <div class="slideshow-content">
                    <span class="close-slideshow">&times;</span>
                    <div class="slideshow-nav prev-btn"><i class="fas fa-chevron-left"></i></div>
                    <img id="slideshow-img" src="" alt="Slideshow Image">
                    <div class="slideshow-nav next-btn"><i class="fas fa-chevron-right"></i></div>
                    <div class="image-counter"><span id="current-index">1</span> / <span id="total-images">1</span></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    };

    injectSlideshow();

    const slideshowModal = document.getElementById('slideshow-modal');
    const slideshowImg = document.getElementById('slideshow-img');
    const closeBtn = document.querySelector('.close-slideshow');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const currentIndexSpan = document.getElementById('current-index');
    const totalImagesSpan = document.getElementById('total-images');

    let currentIdx = 0;
    // Get all images that should be in the slideshow (project cards and service images)
    const galleryImages = Array.from(document.querySelectorAll('.project-card img, .service-image img'));

    if (galleryImages.length > 0 && slideshowModal) {
        totalImagesSpan.textContent = galleryImages.length;

        const updateSlideshow = () => {
            slideshowImg.src = galleryImages[currentIdx].src;
            currentIndexSpan.textContent = currentIdx + 1;
        };

        const openSlideshow = (index) => {
            currentIdx = index;
            updateSlideshow();
            slideshowModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        };

        const closeSlideshow = () => {
            slideshowModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };

        const nextImage = () => {
            currentIdx = (currentIdx + 1) % galleryImages.length;
            updateSlideshow();
        };

        const prevImage = () => {
            currentIdx = (currentIdx - 1 + galleryImages.length) % galleryImages.length;
            updateSlideshow();
        };

        galleryImages.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => openSlideshow(index));
        });

        nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
        prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });
        closeBtn.addEventListener('click', closeSlideshow);
        slideshowModal.addEventListener('click', (e) => { if (e.target === slideshowModal) closeSlideshow(); });

        document.addEventListener('keydown', (e) => {
            if (slideshowModal.style.display === 'flex') {
                if (e.key === 'ArrowRight') nextImage();
                if (e.key === 'ArrowLeft') prevImage();
                if (e.key === 'Escape') closeSlideshow();
            }
        });
    }

    // Intersection Observer for Scroll Animations
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .project-card, .section-title, .service-detail').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

document.addEventListener('DOMContentLoaded', init);
