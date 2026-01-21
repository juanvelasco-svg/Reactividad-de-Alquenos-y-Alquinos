// Mapa Mental Interactivo - Química Orgánica
// Script principal para funcionalidad interactiva

document.addEventListener('DOMContentLoaded', function() {
    // Estado de la aplicación
    const appState = {
        progress: 0,
        completedSections: new Set(),
        bookmarkedCards: new Set(),
        reviewedCards: 0,
        currentSection: 'fundamentos'
    };

    // Inicialización
    init();

    function init() {
        // Cargar estado desde localStorage
        loadState();
        
        // Configurar event listeners
        setupNavigation();
        setupSectionControls();
        setupCardInteractions();
        setupFooterTools();
        setupQuizSystem();
        
        // Actualizar UI inicial
        updateProgress();
        updateStats();
        
        // Inicializar animaciones
        setTimeout(addAnimations, 500);
    }

    // NAVEGACIÓN - CORREGIDA
    function setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Obtener el ID de la sección desde el href (sin el #)
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    // Remover clase active de todos los enlaces
                    navLinks.forEach(l => l.classList.remove('active'));
                    
                    // Agregar clase active al enlace clickeado
                    this.classList.add('active');
                    
                    // Ocultar todas las secciones
                    document.querySelectorAll('.content-section').forEach(section => {
                        section.classList.remove('active');
                    });
                    
                    // Mostrar sección destino
                    targetSection.classList.add('active');
                    
                    // Scroll suave a la sección
                    targetSection.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                    
                    // Actualizar sección actual
                    const sectionId = this.getAttribute('data-section');
                    appState.currentSection = sectionId;
                    
                    // Actualizar progreso de lectura
                    if (!appState.completedSections.has(sectionId)) {
                        appState.reviewedCards++;
                        updateStats();
                    }
                } else {
                    console.warn(`Sección no encontrada: ${targetId}`);
                }
            });
        });
    }

    // CONTROLES DE SECCIÓN
    function setupSectionControls() {
        // Botones de expandir/contraer
        document.querySelectorAll('.btn-toggle').forEach(button => {
            button.addEventListener('click', function() {
                const section = this.closest('.content-section');
                const cardsContainer = section.querySelector('.cards-container');
                const icon = this.querySelector('i');
                
                if (cardsContainer) {
                    cardsContainer.classList.toggle('collapsed');
                    
                    // Cambiar icono
                    if (cardsContainer.classList.contains('collapsed')) {
                        cardsContainer.style.display = 'none';
                        icon.classList.remove('fa-expand');
                        icon.classList.add('fa-compress');
                    } else {
                        cardsContainer.style.display = 'grid';
                        icon.classList.remove('fa-compress');
                        icon.classList.add('fa-expand');
                    }
                }
            });
        });

        // Botones de marcar como completado
        document.querySelectorAll('.btn-mark-complete').forEach(button => {
            button.addEventListener('click', function() {
                const sectionId = this.getAttribute('data-section');
                const icon = this.querySelector('i');
                
                if (appState.completedSections.has(sectionId)) {
                    // Desmarcar
                    appState.completedSections.delete(sectionId);
                    icon.className = 'far fa-check-circle';
                    this.style.opacity = '0.8';
                    this.style.background = '';
                } else {
                    // Marcar
                    appState.completedSections.add(sectionId);
                    icon.className = 'fas fa-check-circle';
                    this.style.opacity = '1';
                    this.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
                    
                    // Animación de confirmación
                    this.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 300);
                }
                
                updateProgress();
                updateStats();
                saveState();
            });
        });
    }

    // INTERACCIONES CON TARJETAS
    function setupCardInteractions() {
        // Marcadores de tarjetas
        document.querySelectorAll('.btn-bookmark').forEach(button => {
            button.addEventListener('click', function() {
                const cardId = this.getAttribute('data-card');
                const icon = this.querySelector('i');
                
                if (appState.bookmarkedCards.has(cardId)) {
                    // Remover marcador
                    appState.bookmarkedCards.delete(cardId);
                    icon.className = 'far fa-bookmark';
                    this.style.color = '';
                } else {
                    // Agregar marcador
                    appState.bookmarkedCards.add(cardId);
                    icon.className = 'fas fa-bookmark';
                    this.style.color = '#f39c12';
                    
                    // Animación
                    this.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 300);
                }
                
                saveState();
            });
        });

        // Tests rápidos
        document.querySelectorAll('.btn-quiz').forEach(button => {
            button.addEventListener('click', function() {
                const quizId = this.getAttribute('data-quiz');
                showQuiz(quizId);
            });
        });
    }

    // SISTEMA DE QUIZ
    function setupQuizSystem() {
        const quizModal = document.getElementById('quizModal');
        const closeModal = document.querySelector('.close-modal');
        const quizContent = document.getElementById('quizContent');

        // Base de datos de preguntas - AMPLIADA
        const quizDatabase = {
            '1.1': {
                title: 'Test: Enlace doble C=C',
                questions: [
                    {
                        question: '¿Cuál es la principal característica del enlace π en los alquenos?',
                        options: [
                            'Es más fuerte que el enlace σ',
                            'Los electrones están deslocalizados por encima y debajo del plano molecular',
                            'Solo existe en moléculas lineales',
                            'Es polar por naturaleza'
                        ],
                        correct: 1,
                        explanation: 'El enlace π tiene electrones deslocalizados que están expuestos a ataques electrófilos.'
                    },
                    {
                        question: '¿Cómo se comporta el enlace doble en reacciones químicas?',
                        options: [
                            'Como un electrófilo',
                            'Como un nucleófilo',
                            'Como un radical libre',
                            'Como una base débil'
                        ],
                        correct: 1,
                        explanation: 'El enlace π actúa como nucleófilo, donando electrones a especies electrófilas.'
                    }
                ]
            },
            '1.3': {
                title: 'Test: Regla de Markovnikov',
                questions: [
                    {
                        question: 'Según la regla de Markovnikov original, ¿a qué carbono se une el protón?',
                        options: [
                            'Al carbono más sustituido',
                            'Al carbono menos sustituido',
                            'Al carbono con más hidrógenos',
                            'Al carbono con menos hidrógenos'
                        ],
                        correct: 2,
                        explanation: 'Markovnikov observó que el protón se une al carbono que ya tiene más hidrógenos.'
                    },
                    {
                        question: '¿Cuál es el orden de estabilidad de carbocationes?',
                        options: [
                            'Primario > Secundario > Terciario',
                            'Terciario > Secundario > Primario',
                            'Secundario > Terciario > Primario',
                            'Todos son igualmente estables'
                        ],
                        correct: 1,
                        explanation: 'Los carbocationes terciarios son más estables por efecto inductivo de los grupos alquilo.'
                    }
                ]
            },
            '3.1': {
                title: 'Test: Halogenación y Halohidrinas',
                questions: [
                    {
                        question: '¿Qué tipo de estereoquímica resulta de la halogenación de alquenos?',
                        options: [
                            'Adición sin',
                            'Adición anti',
                            'Racémica sin preferencia',
                            'No hay estereoselectividad'
                        ],
                        correct: 1,
                        explanation: 'El ion halonio cíclico fuerza un ataque anti del segundo haluro.'
                    }
                ]
            },
            '3.3': {
                title: 'Test: Ruptura Oxidativa',
                questions: [
                    {
                        question: '¿Qué productos se forman en la ozonólisis seguida de reducción?',
                        options: [
                            'Alcoholes',
                            'Cetonas y/o aldehídos',
                            'Ácidos carboxílicos',
                            'Ésteres'
                        ],
                        correct: 1,
                        explanation: 'La ozonólisis con reducción produce cetonas y/o aldehídos según la sustitución.'
                    }
                ]
            },
            '4.1': {
                title: 'Test: Polimerización',
                questions: [
                    {
                        question: '¿Qué tipo de catalizador se usa en polimerización catiónica?',
                        options: [
                            'BuLi (butil-litio)',
                            'BF₃ (trifluoruro de boro)',
                            'Peróxidos',
                            'NaNH₂'
                        ],
                        correct: 1,
                        explanation: 'BF₃ es un ácido de Lewis que inicia la polimerización catiónica.'
                    }
                ]
            },
            '5.1': {
                title: 'Test: Alquinos - Estructura',
                questions: [
                    {
                        question: '¿Qué geometría tienen los alquinos?',
                        options: [
                            'Tetraédrica',
                            'Trigonal plana',
                            'Lineal (180°)',
                            'Angular'
                        ],
                        correct: 2,
                        explanation: 'La hibridación sp da una geometría lineal con ángulo de 180°.'
                    }
                ]
            },
            '5.3': {
                title: 'Test: Síntesis de Alquinos',
                questions: [
                    {
                        question: '¿Qué catalizador se usa para reducir alquinos a alquenos cis?',
                        options: [
                            'Pt',
                            'Pd/C',
                            'Lindlar (Pd/CaCO₃/Pb)',
                            'Na/NH₃'
                        ],
                        correct: 2,
                        explanation: 'El catalizador de Lindlar es envenenado para dar hidrogenación selectiva cis.'
                    }
                ]
            },
            '6.1': {
                title: 'Test: Análisis Retrosintético',
                questions: [
                    {
                        question: '¿Qué símbolo se usa en análisis retrosintético?',
                        options: [
                            '→ (flecha simple)',
                            '⇒ (flecha hueca)',
                            '⇄ (equilibrio)',
                            '↔ (resonancia)'
                        ],
                        correct: 1,
                        explanation: 'La flecha hueca (⇒) indica "puede obtenerse de" en retrosíntesis.'
                    }
                ]
            },
            '6.2': {
                title: 'Test: Síntesis Multi-paso',
                questions: [
                    {
                        question: '¿Cuándo se introduce un grupo funcional reactivo en una síntesis?',
                        options: [
                            'Al principio',
                            'En medio',
                            'Al final (lo más tarde posible)',
                            'No importa el orden'
                        ],
                        correct: 2,
                        explanation: 'Los grupos reactivos se introducen tarde para evitar reacciones no deseadas.'
                    }
                ]
            }
        };

        // Cerrar modal
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                quizModal.style.display = 'none';
            });
        }

        // Cerrar al hacer clic fuera del modal
        window.addEventListener('click', (e) => {
            if (e.target === quizModal) {
                quizModal.style.display = 'none';
            }
        });

        // Función para mostrar quiz
        window.showQuiz = function(quizId) {
            const quiz = quizDatabase[quizId];
            if (!quiz) {
                quizContent.innerHTML = '<p style="text-align: center; padding: 40px;">Quiz no disponible para esta sección.</p>';
                quizModal.style.display = 'flex';
                return;
            }

            let html = `
                <h2>${quiz.title}</h2>
                <div class="quiz-container">
            `;

            quiz.questions.forEach((q, index) => {
                html += `
                    <div class="quiz-question" data-question="${index}">
                        <h3>Pregunta ${index + 1}</h3>
                        <p style="font-size: 1.1em; margin: 15px 0;">${q.question}</p>
                        <div class="quiz-options">
                `;

                q.options.forEach((option, optIndex) => {
                    html += `
                        <div class="quiz-option" style="margin: 10px 0;">
                            <input type="radio" id="q${index}_opt${optIndex}" 
                                   name="question_${index}" value="${optIndex}"
                                   style="margin-right: 10px;">
                            <label for="q${index}_opt${optIndex}" style="cursor: pointer;">${option}</label>
                        </div>
                    `;
                });

                html += `
                        </div>
                        <div class="quiz-explanation" id="explanation_${index}" 
                             style="display: none; margin-top: 15px; padding: 15px; border-radius: 8px;">
                        </div>
                    </div>
                `;
            });

            html += `
                    <div class="quiz-controls" style="margin-top: 30px; text-align: center;">
                        <button id="submitQuiz" class="btn-quiz" 
                                style="padding: 12px 30px; margin: 0 10px; cursor: pointer;">
                            Verificar Respuestas
                        </button>
                        <button id="resetQuiz" class="btn-bookmark" 
                                style="padding: 12px 30px; margin: 0 10px; cursor: pointer;">
                            Reiniciar Quiz
                        </button>
                    </div>
                    <div id="quizResult" style="margin-top: 20px; text-align: center;"></div>
                </div>
            `;

            quizContent.innerHTML = html;
            quizModal.style.display = 'flex';

            // Configurar botones del quiz
            document.getElementById('submitQuiz').addEventListener('click', function() {
                checkQuizAnswers(quiz, quizId);
            });
            document.getElementById('resetQuiz').addEventListener('click', () => showQuiz(quizId));
        };

        function checkQuizAnswers(quiz, quizId) {
            let score = 0;
            const totalQuestions = quiz.questions.length;

            quiz.questions.forEach((q, index) => {
                const selected = document.querySelector(`input[name="question_${index}"]:checked`);
                const explanation = document.getElementById(`explanation_${index}`);
                
                if (selected) {
                    const selectedValue = parseInt(selected.value);
                    if (selectedValue === q.correct) {
                        score++;
                        explanation.innerHTML = `<strong>✓ Correcto!</strong><br>${q.explanation}`;
                        explanation.style.background = '#d4edda';
                        explanation.style.color = '#155724';
                        explanation.style.border = '2px solid #27ae60';
                    } else {
                        explanation.innerHTML = `<strong>✗ Incorrecto.</strong><br>${q.explanation}`;
                        explanation.style.background = '#f8d7da';
                        explanation.style.color = '#721c24';
                        explanation.style.border = '2px solid #e74c3c';
                    }
                    explanation.style.display = 'block';
                } else {
                    explanation.innerHTML = '<strong>⚠ No seleccionaste una opción.</strong>';
                    explanation.style.display = 'block';
                    explanation.style.background = '#fff3cd';
                    explanation.style.color = '#856404';
                    explanation.style.border = '2px solid #f39c12';
                }
            });

            // Mostrar resultado general
            const resultDiv = document.getElementById('quizResult');
            const percentage = Math.round((score / totalQuestions) * 100);
            let emoji = '📚';
            let message = 'Sigue practicando';
            
            if (percentage === 100) {
                emoji = '🎯';
                message = '¡Perfecto!';
            } else if (percentage >= 70) {
                emoji = '👍';
                message = '¡Muy bien!';
            }
            
            resultDiv.innerHTML = `
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                            color: white; padding: 20px; border-radius: 12px; margin-top: 20px;">
                    <h3 style="margin: 0; font-size: 1.5em;">${emoji} ${message}</h3>
                    <p style="margin: 10px 0 0 0; font-size: 1.8em; font-weight: bold;">
                        ${score} / ${totalQuestions} (${percentage}%)
                    </p>
                </div>
            `;
            
            // Actualizar estadísticas si aprobó
            if (percentage >= 70) {
                appState.reviewedCards++;
                updateStats();
                saveState();
            }
        }
    }

    // HERRAMIENTAS DEL FOOTER
    function setupFooterTools() {
        // Reiniciar progreso
        const resetBtn = document.getElementById('resetProgress');
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                if (confirm('¿Estás seguro de que quieres reiniciar todo tu progreso?')) {
                    appState.progress = 0;
                    appState.completedSections.clear();
                    appState.bookmarkedCards.clear();
                    appState.reviewedCards = 0;
                    
                    // Reset UI
                    document.querySelectorAll('.btn-mark-complete').forEach(btn => {
                        const icon = btn.querySelector('i');
                        if (icon) icon.className = 'far fa-check-circle';
                        btn.style.background = '';
                        btn.style.opacity = '0.8';
                    });
                    
                    document.querySelectorAll('.btn-bookmark').forEach(btn => {
                        const icon = btn.querySelector('i');
                        if (icon) icon.className = 'far fa-bookmark';
                        btn.style.color = '';
                    });
                    
                    updateProgress();
                    updateStats();
                    saveState();
                    
                    // Animación de confirmación
                    this.innerHTML = '<i class="fas fa-check"></i> ¡Reiniciado!';
                    setTimeout(() => {
                        this.innerHTML = '<i class="fas fa-redo"></i> Reiniciar Progreso';
                    }, 2000);
                }
            });
        }

        // Generar quiz personalizado
        const generateQuizBtn = document.getElementById('generateQuiz');
        if (generateQuizBtn) {
            generateQuizBtn.addEventListener('click', function(e) {
                e.preventDefault();
                alert('Próximamente: Generador de quizzes personalizados basado en tu progreso.');
            });
        }

        // Tarjetas de estudio
        const flashcardsBtn = document.getElementById('flashcards');
        if (flashcardsBtn) {
            flashcardsBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (appState.bookmarkedCards.size > 0) {
                    alert(`Tienes ${appState.bookmarkedCards.size} tarjetas guardadas para estudio.`);
                } else {
                    alert('Guarda algunas tarjetas primero usando el botón de marcador.');
                }
            });
        }

        // Imprimir resumen
        const printBtn = document.getElementById('printSummary');
        if (printBtn) {
            printBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.print();
            });
        }

        // Herramientas adicionales
        ['mechanismSimulator', 'reactionPredictor', 'synthesisPlanner'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    alert('Herramienta en desarrollo - Próximamente disponible.');
                });
            }
        });
    }

    // ACTUALIZACIÓN DE PROGRESO
    function updateProgress() {
        const totalSections = 6;
        const completed = appState.completedSections.size;
        appState.progress = Math.round((completed / totalSections) * 100);
        
        const progressBar = document.getElementById('progressBar');
        const progressPercent = document.getElementById('progressPercent');
        
        if (progressBar && progressPercent) {
            progressBar.style.width = `${appState.progress}%`;
            progressPercent.textContent = `${appState.progress}%`;
            
            // Cambiar color según progreso
            if (appState.progress < 30) {
                progressBar.style.background = 'linear-gradient(90deg, #e74c3c, #f39c12)';
            } else if (appState.progress < 70) {
                progressBar.style.background = 'linear-gradient(90deg, #f39c12, #f1c40f)';
            } else {
                progressBar.style.background = 'linear-gradient(90deg, #27ae60, #2ecc71)';
            }
        }
    }

    function updateStats() {
        const completedEl = document.getElementById('completedSections');
        const reviewedEl = document.getElementById('reviewedCards');
        
        if (completedEl) {
            completedEl.textContent = `${appState.completedSections.size}/6`;
        }
        if (reviewedEl) {
            reviewedEl.textContent = `${appState.reviewedCards}`;
        }
    }

    // PERSISTENCIA
    function saveState() {
        const state = {
            progress: appState.progress,
            completedSections: Array.from(appState.completedSections),
            bookmarkedCards: Array.from(appState.bookmarkedCards),
            reviewedCards: appState.reviewedCards
        };
        localStorage.setItem('organicChemistryMindmap', JSON.stringify(state));
    }

    function loadState() {
        const saved = localStorage.getItem('organicChemistryMindmap');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                
                appState.progress = state.progress || 0;
                appState.completedSections = new Set(state.completedSections || []);
                appState.bookmarkedCards = new Set(state.bookmarkedCards || []);
                appState.reviewedCards = state.reviewedCards || 0;
                
                // Aplicar estado guardado a la UI
                state.completedSections?.forEach(sectionId => {
                    const button = document.querySelector(`.btn-mark-complete[data-section="${sectionId}"]`);
                    if (button) {
                        const icon = button.querySelector('i');
                        if (icon) {
                            icon.className = 'fas fa-check-circle';
                            button.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
                            button.style.opacity = '1';
                        }
                    }
                });
                
                state.bookmarkedCards?.forEach(cardId => {
                    const button = document.querySelector(`.btn-bookmark[data-card="${cardId}"]`);
                    if (button) {
                        const icon = button.querySelector('i');
                        if (icon) {
                            icon.className = 'fas fa-bookmark';
                            button.style.color = '#f39c12';
                        }
                    }
                });
            } catch (e) {
                console.error('Error loading saved state:', e);
            }
        }
    }

    // ANIMACIONES
    function addAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(card);
        });
    }
});
