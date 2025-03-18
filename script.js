document.addEventListener('DOMContentLoaded', function() {
    let topics = JSON.parse(localStorage.getItem('topics')) || [];
    let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
    let notes = localStorage.getItem('notes') || '';
    let challenges = JSON.parse(localStorage.getItem('challenges')) || [];
    let darkMode = localStorage.getItem('darkMode') === 'true';

    const pages = document.querySelectorAll('.page');
    const menuLinks = document.querySelectorAll('.sidebar-menu a');
    const themeToggle = document.getElementById('theme-toggle');
    const topicsTable = document.getElementById('allTopics');
    const recentTopicsTable = document.getElementById('recentTopics');
    const topicSearch = document.getElementById('topicSearch');
    const addTopicModal = document.getElementById('addTopicModal');
    const addTopicBtn = document.getElementById('addTopicBtn');
    const addTopicBtnDash = document.getElementById('addTopicBtnDash');
    const closeTopicModal = document.getElementById('closeTopicModal');
    const saveTopicBtn = document.getElementById('saveTopicBtn');
    const cancelTopicBtn = document.getElementById('cancelTopicBtn');
    const notesInput = document.getElementById('notesInput');
    const saveNotesBtn = document.getElementById('saveNotesBtn');
    const flashcardsContainer = document.getElementById('flashcardsContainer');
    const addFlashcardBtn = document.getElementById('addFlashcardBtn');
    const addFlashcardModal = document.getElementById('addFlashcardModal');
    const closeFlashcardModal = document.getElementById('closeFlashcardModal');
    const saveFlashcardBtn = document.getElementById('saveFlashcardBtn');
    const cancelFlashcardBtn = document.getElementById('cancelFlashcardBtn');
    const todayChallenge = document.getElementById('todayChallenge');
    const challengeHistory = document.getElementById('challengeHistory');
    const dashboardChallenge = document.getElementById('dashboardChallenge');
    const dashboardDifficulty = document.getElementById('dashboardDifficulty');

    if (darkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
        themeToggle.querySelector('span').textContent = 'Light Mode';
    }

    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            pages.forEach(page => page.style.display = 'none');
            document.getElementById(pageId).style.display = 'block';
            menuLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
        
        if (isDark) {
            themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
            themeToggle.querySelector('span').textContent = 'Light Mode';
        } else {
            themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
            themeToggle.querySelector('span').textContent = 'Dark Mode';
        }
    });

    notesInput.value = notes;

    saveNotesBtn.addEventListener('click', function() {
        localStorage.setItem('notes', notesInput.value);
        alert('Notes saved successfully!');
    });

    addTopicBtn.addEventListener('click', openTopicModal);
    addTopicBtnDash.addEventListener('click', openTopicModal);
    closeTopicModal.addEventListener('click', closeModal);
    cancelTopicBtn.addEventListener('click', closeModal);

    function openTopicModal() {
        addTopicModal.classList.add('active');
        document.getElementById('topicName').value = '';
        document.getElementById('topicCategory').value = 'JavaScript';
    }

    function closeModal() {
        addTopicModal.classList.remove('active');
        addFlashcardModal.classList.remove('active');
    }

    saveTopicBtn.addEventListener('click', function() {
        const topicName = document.getElementById('topicName').value.trim();
        const topicCategory = document.getElementById('topicCategory').value;
        
        if (!topicName) {
            alert('Please enter a topic name');
            return;
        }
        
        const newTopic = {
            id: Date.now(),
            name: topicName,
            category: topicCategory,
            progress: 0,
            status: 'Not Started',
            dateAdded: new Date().toISOString()
        };
        
        topics.unshift(newTopic);
        localStorage.setItem('topics', JSON.stringify(topics));
        renderTopics();
        closeModal();
    });

    topicSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        renderTopics(searchTerm);
    });

    function renderTopics(searchTerm = '') {
        topicsTable.innerHTML = '';
        recentTopicsTable.innerHTML = '';
        
        const filteredTopics = searchTerm ? 
            topics.filter(topic => 
                topic.name.toLowerCase().includes(searchTerm) || 
                topic.category.toLowerCase().includes(searchTerm)
            ) : topics;
        
        filteredTopics.forEach(topic => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${topic.name}</td>
                <td>${topic.category}</td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${topic.progress}%"></div>
                    </div>
                    <span style="font-size: 12px; color: var(--text-light);">${topic.progress}%</span>
                </td>
                <td>${topic.status}</td>
                <td class="actions-cell">
                    <button class="action-btn edit-topic" data-id="${topic.id}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-topic delete" data-id="${topic.id}"><i class="fas fa-trash"></i></button>
                    <button class="action-btn progress-topic" data-id="${topic.id}"><i class="fas fa-arrow-up"></i></button>
                </td>
            `;
            topicsTable.appendChild(row);
        });
        
        const recentTopics = topics.slice(0, 5);
        recentTopics.forEach(topic => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${topic.name}</td>
                <td>${topic.category}</td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${topic.progress}%"></div>
                    </div>
                </td>
                <td>${topic.status}</td>
            `;
            recentTopicsTable.appendChild(row);
        });
        
        document.querySelectorAll('.edit-topic').forEach(btn => {
            btn.addEventListener('click', function() {
                const topicId = parseInt(this.getAttribute('data-id'));
                editTopic(topicId);
            });
        });
        
        document.querySelectorAll('.delete-topic').forEach(btn => {
            btn.addEventListener('click', function() {
                const topicId = parseInt(this.getAttribute('data-id'));
                deleteTopic(topicId);
            });
        });
        
        document.querySelectorAll('.progress-topic').forEach(btn => {
            btn.addEventListener('click', function() {
                const topicId = parseInt(this.getAttribute('data-id'));
                progressTopic(topicId);
            });
        });
        
        updateCharts();
    }

    function editTopic(topicId) {
        const topic = topics.find(t => t.id === topicId);
        if (!topic) return;
        
        document.getElementById('topicName').value = topic.name;
        document.getElementById('topicCategory').value = topic.category;
        
        addTopicModal.classList.add('active');
        
        saveTopicBtn.onclick = function() {
            const topicName = document.getElementById('topicName').value.trim();
            const topicCategory = document.getElementById('topicCategory').value;
            
            if (!topicName) {
                alert('Please enter a topic name');
                return;
            }
            
            topic.name = topicName;
            topic.category = topicCategory;
            
            localStorage.setItem('topics', JSON.stringify(topics));
            renderTopics();
            closeModal();
            
            saveTopicBtn.onclick = null;
        };
    }

    function deleteTopic(topicId) {
        if (confirm('Are you sure you want to delete this topic?')) {
            topics = topics.filter(t => t.id !== topicId);
            localStorage.setItem('topics', JSON.stringify(topics));
            renderTopics();
        }
    }

    function progressTopic(topicId) {
        const topic = topics.find(t => t.id === topicId);
        if (!topic) return;
        
        if (topic.progress < 100) {
            topic.progress += 25;
            if (topic.progress > 100) topic.progress = 100;
            
            updateTopicStatus(topic);
            
            localStorage.setItem('topics', JSON.stringify(topics));
            renderTopics();
        }
    }

    function updateTopicStatus(topic) {
        if (topic.progress === 0) {
            topic.status = 'Not Started';
        } else if (topic.progress < 50) {
            topic.status = 'In Progress';
        } else if (topic.progress < 100) {
            topic.status = 'Almost Done';
        } else {
            topic.status = 'Completed';
        }
    }
   
    function updateCharts() {
        const categories = {};
        topics.forEach(topic => {
            if (!categories[topic.category]) {
                categories[topic.category] = 0;
            }
            categories[topic.category]++;
        });
        
        const categoryLabels = Object.keys(categories);
        const categoryData = Object.values(categories);
        const categoryColors = generateColors(categoryLabels.length);
        
        const topicsChartCtx = document.getElementById('topicsChart').getContext('2d');
        if (window.topicsChart) {
            window.topicsChart.destroy();
        }
        window.topicsChart = new Chart(topicsChartCtx, {
            type: 'doughnut',
            data: {
                labels: categoryLabels,
                datasets: [{
                    data: categoryData,
                    backgroundColor: categoryColors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: getComputedStyle(document.body).getPropertyValue('--text-color')
                        }
                    },
                    title: {
                        display: true,
                        text: 'Topics by Category',
                        color: getComputedStyle(document.body).getPropertyValue('--text-color')
                    }
                }
            }
        });
        
        // Progress chart
        const statusCounts = {
            'Not Started': 0,
            'In Progress': 0,
            'Almost Done': 0,
            'Completed': 0
        };
        
        topics.forEach(topic => {
            statusCounts[topic.status]++;
        });
        
        const progressChartCtx = document.getElementById('progressChart').getContext('2d');
        if (window.progressChart) {
            window.progressChart.destroy();
        }
        window.progressChart = new Chart(progressChartCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(statusCounts),
                datasets: [{
                    label: 'Topics',
                    data: Object.values(statusCounts),
                    backgroundColor: [
                        '#ef4444',
                        '#f59e0b',
                        '#3b82f6',
                        '#10b981'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            color: getComputedStyle(document.body).getPropertyValue('--text-color')
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        ticks: {
                            color: getComputedStyle(document.body).getPropertyValue('--text-color')
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Topic Progress',
                        color: getComputedStyle(document.body).getPropertyValue('--text-color')
                    },
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    function generateColors(count) {
        const colors = [];
        const baseHues = [0, 120, 240, 60, 180, 300];
        
        for (let i = 0; i < count; i++) {
            const hue = baseHues[i % baseHues.length];
            const sat = 70 + Math.random() * 30;
            const light = 50 + Math.random() * 10;
            colors.push(`hsl(${hue}, ${sat}%, ${light}%)`);
        }
        
        return colors;
    }

    // Flashcards
    function renderFlashcards() {
        flashcardsContainer.innerHTML = '';
        
        flashcards.forEach((card, index) => {
            const flashcard = document.createElement('div');
            flashcard.className = 'flashcard';
            flashcard.innerHTML = `
                <div class="flashcard-inner">
                    <div class="flashcard-front">
                        <span class="flashcard-label">Question</span>
                        <p class="flashcard-content">${card.question}</p>
                        <div class="flashcard-actions">
                            <button class="delete-flashcard" data-index="${index}"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                    <div class="flashcard-back">
                        <span class="flashcard-label">Answer</span>
                        <p class="flashcard-content">${card.answer}</p>
                    </div>
                </div>
            `;
            flashcardsContainer.appendChild(flashcard);
            
            flashcard.addEventListener('click', function(e) {
                if (!e.target.closest('.delete-flashcard')) {
                    this.classList.toggle('flipped');
                }
            });
        });
        
        document.querySelectorAll('.delete-flashcard').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const index = parseInt(this.getAttribute('data-index'));
                deleteFlashcard(index);
            });
        });
        
        const addCardBtn = document.createElement('button');
        addCardBtn.className = 'add-flashcard-btn';
        addCardBtn.innerHTML = `
            <i class="fas fa-plus"></i>
            <span>Add New Flashcard</span>
        `;
        addCardBtn.addEventListener('click', function() {
            addFlashcardModal.classList.add('active');
            document.getElementById('flashcardQuestion').value = '';
            document.getElementById('flashcardAnswer').value = '';
        });
        flashcardsContainer.appendChild(addCardBtn);
    }

    addFlashcardBtn.addEventListener('click', function() {
        addFlashcardModal.classList.add('active');
        document.getElementById('flashcardQuestion').value = '';
        document.getElementById('flashcardAnswer').value = '';
    });
    
    closeFlashcardModal.addEventListener('click', closeModal);
    cancelFlashcardBtn.addEventListener('click', closeModal);

    saveFlashcardBtn.addEventListener('click', function() {
        const question = document.getElementById('flashcardQuestion').value.trim();
        const answer = document.getElementById('flashcardAnswer').value.trim();
        
        if (!question || !answer) {
            alert('Please enter both question and answer');
            return;
        }
        
        flashcards.push({ question, answer });
        localStorage.setItem('flashcards', JSON.stringify(flashcards));
        renderFlashcards();
        closeModal();
    });
    
    function deleteFlashcard(index) {
        if (confirm('Are you sure you want to delete this flashcard?')) {
            flashcards.splice(index, 1);
            localStorage.setItem('flashcards', JSON.stringify(flashcards));
            renderFlashcards();
        }
    }

    function fetchDailyChallenge() {
        const today = new Date().toISOString().split('T')[0];
        const existingChallenge = challenges.find(c => c.date === today);
        
        if (existingChallenge) {
            renderChallenge(existingChallenge);
        } else {
            const newChallenge = generateChallenge();
            newChallenge.date = today;
            challenges.unshift(newChallenge);
            
            if (challenges.length > 30) {
                challenges = challenges.slice(0, 30);
            }
            
            localStorage.setItem('challenges', JSON.stringify(challenges));
            renderChallenge(newChallenge);
        }
        
        renderChallengeHistory();
    }
    
    function generateChallenge() {
        const difficulties = ['Easy', 'Medium', 'Hard'];
        const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
        
        const challenges = [
            {
                name: 'Two Sum',
                description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
                difficulty: 'Easy'
            },
            {
                name: 'Add Two Numbers',
                description: 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.',
                difficulty: 'Medium'
            },
            {
                name: 'Median of Two Sorted Arrays',
                description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.',
                difficulty: 'Hard'
            },
            {
                name: 'Valid Parentheses',
                description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
                difficulty: 'Easy'
            },
            {
                name: 'Merge K Sorted Lists',
                description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
                difficulty: 'Hard'
            },
            {
                name: 'LRU Cache',
                description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
                difficulty: 'Medium'
            }
        ];
        
        const filteredChallenges = challenges.filter(c => c.difficulty === difficulty);
        const randomChallenge = filteredChallenges[Math.floor(Math.random() * filteredChallenges.length)];
        
        return {
            name: randomChallenge.name,
            description: randomChallenge.description,
            difficulty: randomChallenge.difficulty,
            status: 'Pending'
        };
    }
    
    function renderChallenge(challenge) {
        const todayChallengeHTML = `
            <div class="challenge-header">
                <h4>${challenge.name}</h4>
                <span class="challenge-difficulty ${challenge.difficulty.toLowerCase()}">${challenge.difficulty}</span>
            </div>
            <div class="challenge-content">
                <p>${challenge.description}</p>
            </div>
            <div class="challenge-actions">
                <button class="btn btn-outline skip-challenge">Skip</button>
                <button class="btn solve-challenge">Solve Challenge</button>
            </div>
        `;
        
        todayChallenge.innerHTML = todayChallengeHTML;
        
        dashboardChallenge.innerHTML = `
            <h4>${challenge.name}</h4>
            <p>${challenge.description}</p>
        `;
        
        dashboardDifficulty.textContent = challenge.difficulty;
        dashboardDifficulty.className = `challenge-difficulty ${challenge.difficulty.toLowerCase()}`;
        
        document.querySelectorAll('.skip-challenge').forEach(btn => {
            btn.addEventListener('click', function() {
                const today = new Date().toISOString().split('T')[0];
                const challenge = challenges.find(c => c.date === today);
                if (challenge) {
                    challenge.status = 'Skipped';
                    localStorage.setItem('challenges', JSON.stringify(challenges));
                    renderChallengeHistory();
                }
            });
        });
        
        document.querySelectorAll('.solve-challenge').forEach(btn => {
            btn.addEventListener('click', function() {
                const today = new Date().toISOString().split('T')[0];
                const challenge = challenges.find(c => c.date === today);
                if (challenge) {
                    challenge.status = 'Completed';
                    localStorage.setItem('challenges', JSON.stringify(challenges));
                    renderChallengeHistory();
                }
            });
        });
    }
    
    function renderChallengeHistory() {
        challengeHistory.innerHTML = '';
        
        challenges.forEach(challenge => {
            const date = new Date(challenge.date).toLocaleDateString();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${date}</td>
                <td>${challenge.name}</td>
                <td><span class="challenge-difficulty ${challenge.difficulty.toLowerCase()}">${challenge.difficulty}</span></td>
                <td>${challenge.status}</td>
            `;
            challengeHistory.appendChild(row);
        });
    }

    renderTopics();
    renderFlashcards();
    fetchDailyChallenge();
});