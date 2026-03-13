document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navCta = document.querySelector('.nav-cta');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('ph-list');
                icon.classList.add('ph-x');
            } else {
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
            }
        });
    }

    // Close mobile menu when a link is clicked
    const closeMenu = () => {
        if(navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (mobileToggle) {
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
            }
        }
    };

    navLinks.forEach(link => link.addEventListener('click', closeMenu));
    if(navCta) navCta.addEventListener('click', closeMenu);

    // 2. Header Scroll State
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all
            faqItems.forEach(faq => {
                faq.classList.remove('active');
            });

            // If it wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 4. Scroll Reveal Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right, .reveal-scale');
    revealElements.forEach(el => observer.observe(el));
    
    // 5. Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 6. Number Counter Animation
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const speed = 100; // lower is faster
                const updateCount = () => {
                    const count = +counter.innerText;
                    const inc = target / speed;
                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 20);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // 7. Interactive Agent Flow Demo
    initAgentDemo();

    // 8. SaaS Platform Preview Logic
    initSaaSPreview();
});

function initAgentDemo() {
    const chatBody = document.getElementById('agent-chat-body');
    const visualBody = document.getElementById('agent-visual-body');
    const chatInputArea = document.getElementById('agent-chat-input-area');
    const userInput = document.getElementById('agent-user-input');
    const sendBtn = document.getElementById('agent-send-btn');
    
    if (!chatBody || !visualBody) return;

    let currentStep = 'company_type';
    let userAnswers = {};

    // Dynamic Flow Blueprints based on Process
    const flowBlueprints = {
        'atendimento': [
            { icon: 'ph-chat-circle', title: 'Mensagem Recebida', desc: 'Canal omnichanel' },
            { icon: 'ph-brain', title: 'Processamento NLU', desc: 'Análise de contexto da IA' },
            { icon: 'ph-database', title: 'Consulta de Dados', desc: 'Sistemas internos' },
            { icon: 'ph-paper-plane-tilt', title: 'Resposta Autônoma', desc: 'Interação instantânea' }
        ],
        'qualificacao': [
            { icon: 'ph-user-plus', title: 'Novo Lead', desc: 'Captura via site/ads' },
            { icon: 'ph-robot', title: 'IA Qualificadora', desc: 'Entendimento do perfil' },
            { icon: 'ph-star', title: 'Lead Scoring', desc: 'Classificação automática' },
            { icon: 'ph-calendar-plus', title: 'Agendamento B2B', desc: 'Envio pro CRM' }
        ],
        'vendas': [
            { icon: 'ph-shopping-cart', title: 'Carrinho Criado', desc: 'Início do checkout' },
            { icon: 'ph-robot', title: 'Nutrição Ativa', desc: 'Quebra de objeções' },
            { icon: 'ph-credit-card', title: 'Link de Pagamento', desc: 'Gerado via API' },
            { icon: 'ph-check-circle', title: 'Venda Concluída', desc: 'ERP Atualizado' }
        ],
        'internos': [
            { icon: 'ph-plugs', title: 'Gatilho Interno', desc: 'Webhook de sistema' },
            { icon: 'ph-lightning', title: 'Rotina de IA', desc: 'Tratamento de payload' },
            { icon: 'ph-files', title: 'Geração de Docs', desc: 'Criação de contratos' },
            { icon: 'ph-bell-ringing', title: 'Notificação', desc: 'Alerta na equipe' }
        ]
    };

    // Chat Controller
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('chat-btn')) {
            const value = e.target.getAttribute('data-value');
            const text = e.target.innerText;
            
            // Remove options
            const optionsGroup = chatBody.querySelectorAll('.chat-options');
            optionsGroup.forEach(group => group.style.display = 'none');
            
            addChatMessage(text, 'user');
            processStep(value);
        }
    });

    const handleSend = () => {
        const text = userInput.value.trim();
        if (!text) return;
        
        addChatMessage(text, 'user');
        userInput.value = '';
        
        if (currentStep === 'capture_name') {
            userAnswers.name = text;
            currentStep = 'capture_phone';
            showTyping();
            setTimeout(() => {
                removeTyping();
                addChatMessage(`Prazer, ${text}! Qual é o seu <b>Número de Telefone/WhatsApp</b>?`, 'bot');
            }, 800);
        } else if (currentStep === 'capture_phone') {
            userAnswers.phone = text;
            currentStep = 'capture_company';
            showTyping();
            setTimeout(() => {
                removeTyping();
                addChatMessage('Ótimo. E por fim, qual é o <b>Nome da sua Empresa</b>?', 'bot');
            }, 800);
        } else if (currentStep === 'capture_company') {
            userAnswers.company_name = text;
            finishFunnel();
        }
    };

    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    function processStep(value) {
        showTyping();
        setTimeout(() => {
            removeTyping();
            if(currentStep === 'company_type') {
                userAnswers.company = value;
                currentStep = 'process_type';
                
                addChatMessage('Entendido. Qual <b>processo você deseja automatizar primeiro?</b>', 'bot');
                
                const ops = document.createElement('div');
                ops.className = 'chat-options';
                ops.innerHTML = `
                    <button class="chat-btn" data-value="atendimento">Atendimento ao Cliente</button>
                    <button class="chat-btn" data-value="qualificacao">Qualificação de Leads</button>
                    <button class="chat-btn" data-value="vendas">Automação de Vendas</button>
                    <button class="chat-btn" data-value="internos">Processos e Integrações Internas</button>
                `;
                chatBody.appendChild(ops);
                scrollToBottom();
                
            } else if (currentStep === 'process_type') {
                userAnswers.process = value;
                currentStep = 'volume_type';
                
                addChatMessage('Perfeito. E qual é o <b>volume médio mensal</b> que essa área lida?', 'bot');
                
                const ops = document.createElement('div');
                ops.className = 'chat-options';
                ops.innerHTML = `
                    <button class="chat-btn" data-value="low">Até 100 interações/mês</button>
                    <button class="chat-btn" data-value="mid">100 a 500 interações</button>
                    <button class="chat-btn" data-value="high">Mais de 500 interações</button>
                `;
                chatBody.appendChild(ops);
                scrollToBottom();

            } else if (currentStep === 'volume_type') {
                userAnswers.volume = value;
                currentStep = 'generating_flow';
                
                addChatMessage('Excelente! Estou processando as variáveis do seu negócio...', 'bot');
                
                // Start drawing flow
                setTimeout(() => {
                    generateIntelligentFlow(userAnswers.process);
                }, 1000);
            }
        }, 1000);
    }
    
    // Engine functions
    function addChatMessage(text, type) {
        const msg = document.createElement('div');
        msg.className = `chat-message ${type}`;
        msg.innerHTML = `<div class="message-content"><p>${text}</p></div>`;
        chatBody.appendChild(msg);
        scrollToBottom();
    }

    function showTyping() {
        const typing = document.createElement('div');
        typing.className = 'typing-indicator';
        typing.id = 'agent-typing';
        typing.innerHTML = `<span></span><span></span><span></span>`;
        chatBody.appendChild(typing);
        scrollToBottom();
    }

    function removeTyping() {
        const typing = document.getElementById('agent-typing');
        if (typing) typing.remove();
    }

    function scrollToBottom() {
        chatBody.scrollTop = chatBody.scrollHeight;
    }
    function scrollToVisualBottom() {
        visualBody.scrollTop = visualBody.scrollHeight;
    }

    // Visual Workflow Renderer
    function generateIntelligentFlow(intent) {
        const flowSteps = flowBlueprints[intent] || flowBlueprints['internos'];
        
        visualBody.innerHTML = '';
        const container = document.createElement('div');
        container.className = 'fluxo-container';
        visualBody.appendChild(container);
        
        let stepIdx = 0;
        
        // Build empty nodes first
        flowSteps.forEach((step, i) => {
            if(i > 0) {
                const conn = document.createElement('div');
                conn.className = 'fluxo-connection';
                conn.id = `conn-${i}`;
                container.appendChild(conn);
            }
            
            const node = document.createElement('div');
            node.className = `fluxo-node status-pending`;
            node.id = `node-${i}`;
            node.innerHTML = `
                <div class="node-status-badge">Pendente</div>
                <i class="ph-fill ${step.icon}"></i>
                <div class="node-text">
                    <span class="node-title">${step.title}</span>
                    <span class="node-desc">${step.desc}</span>
                </div>
            `;
            container.appendChild(node);
        });

        // Animation Loop
        const delays = [800, 1200, 1000, 700];

        const executeNextNode = () => {
            if (stepIdx >= flowSteps.length) {
                setTimeout(() => finalizeSimulation(), 1000);
                return;
            }
            
            // 1. Activate Current Node Processing
            const currNode = document.getElementById(`node-${stepIdx}`);
            if (currNode) {
                currNode.classList.remove('status-pending');
                currNode.classList.add('status-processing', 'glow-path');
                currNode.querySelector('.node-status-badge').innerHTML = 'Processando<span class="processing-dots"><span>.</span><span>.</span><span>.</span></span>';
                scrollToVisualBottom();
            }

            // Chat Feedback for processing first step to set context
            if (stepIdx === 0) showTyping();

            // Wait processing time
            const processTime = delays[stepIdx] || 1000;
            setTimeout(() => {
                if (stepIdx === 0) removeTyping();
                
                // 2. Set Current Node to Done
                if (currNode) {
                    currNode.classList.remove('status-processing', 'glow-path');
                    currNode.classList.add('status-done');
                    currNode.querySelector('.node-status-badge').innerHTML = '<i class="ph-bold ph-check" style="color:white; font-size:10px; margin-right:4px;"></i> Concluído';
                }

                // 3. Connect to next node
                if (stepIdx + 1 < flowSteps.length) {
                    // Small pause to see 'Concluído' before drawing line
                    setTimeout(() => {
                        const nextConn = document.getElementById(`conn-${stepIdx + 1}`);
                        if (nextConn) nextConn.classList.add('active'); // Takes 600ms to animate
                        
                        setTimeout(() => {
                            stepIdx++;
                            executeNextNode();
                        }, 600); // 600ms for line travel
                    }, 400); // 400ms pause on 'Concluído'
                } else {
                    stepIdx++;
                    executeNextNode(); // finishes cycle
                }

            }, processTime);
        };

        addChatMessage(`Arquitetura do Fluxo ${intent.toUpperCase()} gerada. Iniciando teste de execução...`, 'bot');
        setTimeout(executeNextNode, 2000);
    }
    
    function finalizeSimulation() {
        showTyping();
        setTimeout(() => {
            removeTyping();
            
            addChatMessage('Pronto! Acabamos de ver seu fluxo agêntico operando na prática.', 'bot');
            
            // Impact 
            const impactHtml = `
                <p><b>Impacto Estimado:</b></p>
                <div class="impact-box">
                    <ul>
                        <li><i class="ph-fill ph-check-circle"></i> Redução de até 70% no trabalho braçal</li>
                        <li><i class="ph-fill ph-check-circle"></i> Tempo de resposta instantâneo</li>
                        <li><i class="ph-fill ph-check-circle"></i> Operação 24h sem pausas</li>
                    </ul>
                </div>
                <p class="mt-2">Se quiser que a engenharia da CodelabX crie ou tire dúvidas sobre uma solução como essa para você, me informe seu <b>Nome completo</b> abaixo.</p>
            `;
            
            setTimeout(() => {
                const msg = document.createElement('div');
                msg.className = `chat-message bot`;
                msg.innerHTML = `<div class="message-content">${impactHtml}</div>`;
                chatBody.appendChild(msg);
                scrollToBottom();
                
                chatInputArea.style.display = 'flex';
                userInput.focus();
                currentStep = 'capture_name';
                
            }, 1000);
            
        }, 1500);
    }

    function finishFunnel() {
        chatInputArea.style.display = 'none';
        showTyping();
        setTimeout(() => {
            removeTyping();
            addChatMessage('Informações recebidas e cadastradas! 🚀', 'bot');
            
            setTimeout(() => {
                const endMessage = document.createElement('div');
                endMessage.className = 'chat-message bot mt-2';
                endMessage.innerHTML = `
                    <div class="message-content" style="background: transparent; border: none; padding: 0;">
                        <p>Nossa equipe entrará em contato em breve. Se preferir acelerar, chame agora:</p>
                        <a href="https://wa.me/5511900000000" target="_blank" class="btn btn-primary btn-glow mt-2 flex-center" style="font-size: 0.85rem; width: 100%;">Agendar no WhatsApp <i class="ph-fill ph-whatsapp-logo"></i></a>
                    </div>
                `;
                chatBody.appendChild(endMessage);
                scrollToBottom();
            }, 500);
            
        }, 1200);
    }
}

function initSaaSPreview() {
    // Elements
    const modal = document.getElementById('saas-modal');
    const openBtns = [document.getElementById('nav-login-btn'), document.getElementById('explore-platform-btn')];
    const closeBtns = document.querySelectorAll('.saas-close-btn');
    
    const loginView = document.getElementById('saas-login-view');
    const dashboardView = document.getElementById('saas-dashboard-view');
    
    const loginForm = document.getElementById('saas-login-form');
    const loginBtnText = loginForm?.querySelector('.btn-text');
    const loginBtnLoader = loginForm?.querySelector('.btn-loader');
    
    // Trigger opening modal
    openBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Reset views
                loginView.classList.add('active');
                dashboardView.classList.remove('active');
                if (loginBtnText) loginBtnText.style.display = 'block';
                if (loginBtnLoader) loginBtnLoader.style.display = 'none';
                
                // Show modal
                modal.classList.add('show');
                document.body.style.overflow = 'hidden'; // prevent bg scroll
            });
        }
    });
    
    // Trigger closing modal
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.remove('show');
            document.body.style.overflow = ''; // restore scroll
        });
    });

    // Simulated Login
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show loading state
            if (loginBtnText) loginBtnText.style.display = 'none';
            if (loginBtnLoader) loginBtnLoader.style.display = 'block';
            
            // Wait simulated time
            setTimeout(() => {
                loginView.classList.remove('active');
                setTimeout(() => {
                    dashboardView.classList.add('active');
                }, 400); // Wait for fade out
            }, 1200);
        });
    }

    // Dashboard Tab Navigation
    const navBtns = document.querySelectorAll('.saas-nav-btn');
    const panels = document.querySelectorAll('.saas-panel');
    const saasSidebar = document.querySelector('.saas-sidebar');
    const mobileMenuBtn = document.querySelector('.saas-mobile-menu-btn');
    const breadcrumbActive = document.querySelector('.active-crumb');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = 'panel-' + btn.getAttribute('data-target');
            
            // Update buttons active class
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Hide all panels, show target
            panels.forEach(p => p.classList.remove('active'));
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
            
            // Update breadcrumb text loosely
            if(breadcrumbActive) {
                breadcrumbActive.innerText = btn.innerText.trim();
            }

            // If mobile, close sidebar after tap
            if (window.innerWidth <= 992 && saasSidebar) {
                saasSidebar.classList.remove('open');
            }
        });
    });

    // Mobile specific sidebar toggle inside the modal
    if (mobileMenuBtn && saasSidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            saasSidebar.classList.add('open');
        });
    }
}
