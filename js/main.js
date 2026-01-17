// ============================================
// Blockchain Network Background Animation
// ============================================
class NetworkAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.nodeCount = 50;
        this.maxDistance = 150;
        this.mouse = { x: null, y: null };

        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.nodes = [];
        for (let i = 0; i < this.nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }

    drawNode(node) {
        // Gradient for nodes
        const gradient = this.ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, node.radius * 2
        );
        gradient.addColorStop(0, 'rgba(0, 245, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');

        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        // Glow effect
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(0, 245, 255, 0.05)';
        this.ctx.fill();
    }

    drawConnection(node1, node2, distance) {
        const opacity = 1 - (distance / this.maxDistance);

        // Create gradient line
        const gradient = this.ctx.createLinearGradient(
            node1.x, node1.y, node2.x, node2.y
        );
        gradient.addColorStop(0, `rgba(0, 245, 255, ${opacity * 0.3})`);
        gradient.addColorStop(1, `rgba(168, 85, 247, ${opacity * 0.3})`);

        this.ctx.beginPath();
        this.ctx.moveTo(node1.x, node1.y);
        this.ctx.lineTo(node2.x, node2.y);
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 0.5;
        this.ctx.stroke();
    }

    update() {
        this.nodes.forEach(node => {
            // Move nodes
            node.x += node.vx;
            node.y += node.vy;

            // Bounce off walls
            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;

            // Mouse interaction - subtle attraction
            if (this.mouse.x && this.mouse.y) {
                const dx = this.mouse.x - node.x;
                const dy = this.mouse.y - node.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    node.x += dx * 0.001;
                    node.y += dy * 0.001;
                }
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[i].x - this.nodes[j].x;
                const dy = this.nodes[i].y - this.nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.maxDistance) {
                    this.drawConnection(this.nodes[i], this.nodes[j], distance);
                }
            }
        }

        // Draw nodes
        this.nodes.forEach(node => this.drawNode(node));
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// Initialize on DOM Load
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize network animation
    const canvas = document.getElementById('networkCanvas');
    if (canvas) {
        new NetworkAnimation(canvas);
    }

    // ============================================
    // Scroll Animations with Intersection Observer
    // ============================================
    const animatedElements = document.querySelectorAll(
        '.culture-card, .engine-card, .principle-card'
    );

    animatedElements.forEach(el => {
        el.classList.add('fade-in');
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // ============================================
    // Navbar scroll effect
    // ============================================
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.background = 'rgba(5, 5, 8, 0.95)';
            navbar.style.borderBottomColor = 'rgba(0, 245, 255, 0.2)';
        } else {
            navbar.style.background = 'rgba(5, 5, 8, 0.8)';
            navbar.style.borderBottomColor = 'rgba(0, 245, 255, 0.1)';
        }

        lastScroll = currentScroll;
    });

    // ============================================
    // Smooth scroll for navigation links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Hero logo glow animation on load
    // ============================================
    const heroLogo = document.querySelector('.hero-logo-svg');
    if (heroLogo) {
        heroLogo.style.opacity = '0';
        heroLogo.style.transform = 'scale(0.8)';
        setTimeout(() => {
            heroLogo.style.transition = 'opacity 1s ease, transform 1s ease';
            heroLogo.style.opacity = '1';
            heroLogo.style.transform = 'scale(1)';
        }, 300);
    }

    // ============================================
    // Subtitle fade in
    // ============================================
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        heroSubtitle.style.opacity = '0';
        setTimeout(() => {
            heroSubtitle.style.transition = 'opacity 1s ease';
            heroSubtitle.style.opacity = '1';
        }, 800);
    }
});
