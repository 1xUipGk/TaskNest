// Focus Mode Toggle
const focusModeBtn = document.querySelector('.focus-mode-btn');
focusModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('focus-mode');
    focusModeBtn.classList.toggle('active');
    
    // تحديث نص الزر
    if (document.body.classList.contains('focus-mode')) {
        focusModeBtn.innerHTML = '<i class="fas fa-focus"></i>Exit Focus Mode';
    } else {
        focusModeBtn.innerHTML = '<i class="fas fa-focus"></i>Focus Mode';
    }
});

// Priority Filter
const priorityFilter = document.getElementById('priorityFilter');
priorityFilter.addEventListener('change', () => {
    const selectedPriority = priorityFilter.value;
    const tasks = document.querySelectorAll('.task-item');
    
    tasks.forEach(task => {
        if (selectedPriority === 'all') {
            task.style.display = 'flex';
        } else {
            const taskPriority = task.getAttribute('data-priority');
            task.style.display = taskPriority === selectedPriority ? 'flex' : 'none';
        }
    });
});

// Task Categories and Tags Management
let selectedTags = new Set();

// Initialize Filters
function initializeFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const tagSearch = document.getElementById('tagSearch');
    const selectedTagsContainer = document.querySelector('.selected-tags');

    // Category Filter
    categoryFilter.addEventListener('change', filterTasks);

    // Tags Search
    tagSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        if (searchTerm && e.key === 'Enter') {
            addTag(searchTerm);
            tagSearch.value = '';
        }
    });

    // Remove Tag
    selectedTagsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-tag')) {
            const tag = e.target.parentElement;
            const tagText = tag.textContent.slice(0, -1); // Remove × symbol
            selectedTags.delete(tagText);
            tag.remove();
            filterTasks();
        }
    });
}

// Add Tag
function addTag(tag) {
    if (!selectedTags.has(tag)) {
        selectedTags.add(tag);
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.innerHTML = `${tag}<span class="remove-tag">×</span>`;
        document.querySelector('.selected-tags').appendChild(tagElement);
        filterTasks();
    }
}

// Filter Tasks
function filterTasks() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const tasks = document.querySelectorAll('.task-item');

    tasks.forEach(task => {
        const taskCategory = task.getAttribute('data-category');
        const taskTags = task.getAttribute('data-tags').split(',');
        const matchesCategory = categoryFilter === 'all' || taskCategory === categoryFilter;
        const matchesTags = selectedTags.size === 0 || 
            [...selectedTags].every(tag => taskTags.includes(tag));

        task.style.display = matchesCategory && matchesTags ? 'flex' : 'none';
    });
}

// Add Task with Categories and Tags
function addTask(taskData) {
    const tasksList = document.querySelector('.tasks-list');
    const taskElement = document.createElement('div');
    taskElement.className = `task-item ${taskData.priority}-priority`;
    taskElement.setAttribute('data-priority', taskData.priority);
    taskElement.setAttribute('data-category', taskData.category);
    taskElement.setAttribute('data-tags', taskData.tags.join(','));
    
    taskElement.innerHTML = `
        <div class="task-content">
            <span class="task-category ${taskData.category}">
                ${taskData.category.charAt(0).toUpperCase() + taskData.category.slice(1)}
            </span>
            <h4>${taskData.title}</h4>
            <p>${taskData.description}</p>
            <div class="task-meta">
                <span class="due-date">
                    <i class="fas fa-clock"></i>
                    ${formatDate(taskData.dueDate)}
                </span>
                <span class="priority-badge ${taskData.priority}">
                    ${taskData.priority.charAt(0).toUpperCase() + taskData.priority.slice(1)}
                </span>
            </div>
            <div class="task-tags">
                ${taskData.tags.map(tag => `
                    <span class="task-tag">${tag}</span>
                `).join('')}
            </div>
        </div>
        <div class="task-actions">
            <button class="complete-btn" title="Mark as Complete">
                <i class="fas fa-check"></i>
            </button>
            <button class="edit-btn" title="Edit Task">
                <i class="fas fa-edit"></i>
            </button>
            <button class="delete-btn" title="Delete Task">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    tasksList.appendChild(taskElement);
}

// Initialize when document loads
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
});

// Import Chart.js
import Chart from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/+esm';

// Initialize Analytics
function initializeAnalytics() {
    // Completion Rate Chart
    const completionCtx = document.getElementById('completionRateChart').getContext('2d');
    new Chart(completionCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Completion Rate',
                data: [65, 70, 75, 80, 75, 85, 75],
                borderColor: '#1a73e8',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(26, 115, 232, 0.1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: value => value + '%'
                    }
                }
            }
        }
    });

    // Priority Distribution Chart
    const priorityCtx = document.getElementById('priorityDistributionChart').getContext('2d');
    new Chart(priorityCtx, {
        type: 'doughnut',
        data: {
            labels: ['High', 'Medium', 'Low'],
            datasets: [{
                data: [30, 45, 25],
                backgroundColor: ['#dc3545', '#ffc107', '#28a745']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Category Distribution Chart
    const categoryCtx = document.getElementById('categoryDistributionChart').getContext('2d');
    new Chart(categoryCtx, {
        type: 'bar',
        data: {
            labels: ['Work', 'Personal', 'Shopping', 'Health', 'Education'],
            datasets: [{
                data: [40, 25, 15, 10, 10],
                backgroundColor: [
                    '#1976d2',
                    '#7b1fa2',
                    '#388e3c',
                    '#c2185b',
                    '#f57c00'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Productivity Chart
    const productivityCtx = document.getElementById('productivityChart').getContext('2d');
    new Chart(productivityCtx, {
        type: 'line',
        data: {
            labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
            datasets: [{
                label: 'Tasks Completed',
                data: [2, 5, 8, 6, 4, 2],
                borderColor: '#1a73e8',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 2
                    }
                }
            }
        }
    });
}

// Update Analytics based on timeframe
document.getElementById('analyticsTimeframe').addEventListener('change', (e) => {
    // Here you would typically fetch new data based on the selected timeframe
    // and update the charts accordingly
    console.log('Updating analytics for timeframe:', e.target.value);
});

// Calculate and update analytics data
function updateAnalytics() {
    const tasks = document.querySelectorAll('.task-item');
    const totalTasks = tasks.length;
    const completedTasks = document.querySelectorAll('.task-item.completed').length;
    const completionRate = (completedTasks / totalTasks) * 100 || 0;

    // Update completion rate
    document.querySelector('.percentage').textContent = `${completionRate.toFixed(1)}%`;

    // You would typically update other analytics here based on real data
}

// Initialize analytics when document loads
document.addEventListener('DOMContentLoaded', () => {
    initializeAnalytics();
    updateAnalytics();
}); 