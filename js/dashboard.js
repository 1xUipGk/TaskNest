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

// Add Task with Priority
function addTask(taskData) {
    const tasksList = document.querySelector('.tasks-list');
    const taskElement = document.createElement('div');
    taskElement.className = `task-item ${taskData.priority}-priority`;
    taskElement.setAttribute('data-priority', taskData.priority);
    
    taskElement.innerHTML = `
        <div class="task-content">
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