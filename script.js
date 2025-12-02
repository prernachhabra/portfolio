// Custom Cursor
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.cursor');
    const cursor2 = document.querySelector('.cursor2');
    
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursor2.style.left = e.clientX + 'px';
    cursor2.style.top = e.clientY + 'px';
});

// Hero Canvas Particles
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
for(let i = 0; i < 120; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2
    });
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if(p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(76, 175, 80, 0.4)';
        ctx.fill();
        ctx.restore();
    });
    
    requestAnimationFrame(animateParticles);
}
animateParticles();

// Scroll Observer for animating visible elements
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Optional, stops observing once visible
        }
    });
}, { 
    threshold: 0.1, 
    rootMargin: '0px 0px -10% 0px' 
});

// Load GitHub projects dynamically
async function loadGitHubProjects() {
    const grid = document.getElementById('projects-grid');
    const loading = document.querySelector('.loading');

    try {
        const response = await fetch('https://api.github.com/users/prernachhabra/repos?sort=updated&per_page=100');
        const repos = await response.json();

        if (loading) loading.remove();

        repos.forEach(repo => {
            if (!repo.fork) {
                const card = document.createElement('div');
                card.className = 'project-card';
                card.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'No description available.'}</p>
                    <a href="${repo.html_url}" class="project-link" target="_blank">
                        <i class="fab fa-github"></i> View on GitHub
                    </a>
                `;
                grid.appendChild(card);
                observer.observe(card);
            }
        });

        if (repos.length === 0) {
            grid.innerHTML = '<p>No GitHub projects to display.</p>';
        }
    } catch (error) {
        console.error('Failed to load GitHub projects:', error);
        // Fail silently, no UI error messages.
    }
}

// Smooth scroll for navbar links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Initialize observers and load projects on DOM load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.section-title, .bio-text p, .skill-tag, .contact-item').forEach(el => {
        observer.observe(el);
    });

    loadGitHubProjects();
});
