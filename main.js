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
            msgDiv.textContent = text;
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
                    botResponse = "We offer residential, commercial, and renovation services. You can check our Services page for more details!";
                } else if (msg.includes('contact') || msg.includes('phone') || msg.includes('email')) {
                    botResponse = "You can reach us at info@goodnewsconstruction.com or call us at +1 (234) 567-890.";
                } else if (msg.includes('hello') || msg.includes('hi')) {
                    botResponse = "Hello! How can Good News Construction assist you with your project today?";
                } else if (msg.includes('project')) {
                    botResponse = "We have completed several high-end projects. Check out our Projects page!";
                }

                appendMessage(botResponse, 'bot');
            }, 800);
        };

        sendBtn.addEventListener('click', handleChat);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChat();
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
