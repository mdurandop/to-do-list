// Element selectors
const asideNavbarElement = document.querySelector('aside');
const openMenuButton = document.querySelector('header .js-open-menu');
const closeMenuButton = document.querySelector('.js-menu');
const nowElement = document.querySelector('.js-now');
const addTaskButtons = document.querySelectorAll('.add-task');
const taskModalElement = document.querySelector('.task-modal');
const saveTaskButton = document.querySelector('.js-add-new-task');
const tasksContainer = document.querySelector('.tasks-list');
const inProgressTasksContainer = document.querySelector('.in-progress-list');
const completedTasksContainer = document.querySelector('.completed-list');

// Set current date
const now = dayjs().format('D MMM YYYY');
nowElement.innerText = now;

// Utility functions
const toggleDisplay = (element, display) => {
    element.style.display = display;
};

const showModal = () => toggleDisplay(taskModalElement, 'flex');
const hideModal = () => toggleDisplay(taskModalElement, 'none');
const showAsideNavbar = () => toggleDisplay(asideNavbarElement, 'block');
const hideAsideNavbar = () => toggleDisplay(asideNavbarElement, 'none');

const loadFromLocalStorage = (key) => {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (error) {
        console.error(`Error loading ${key} from local storage`, error);
        return [];
    }
};

const saveToLocalStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error saving ${key} to local storage`, error);
    }
};

const taskList = loadFromLocalStorage('taskList');
const taskListInProgress = loadFromLocalStorage('taskListInProgress');
const taskListCompleted = loadFromLocalStorage('taskListCompleted');

openMenuButton.addEventListener('click', showAsideNavbar);
closeMenuButton.addEventListener('click', hideAsideNavbar);

addTaskButtons.forEach(button => {
    button.addEventListener('click', showModal);
});

document.querySelector('.js-discard-task').addEventListener('click', hideModal);

const createTaskCard = (task) => {
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-card');
    taskCard.innerHTML = `
        <div class="head">
            <div class="task-name-description">
                <p class="heading">${task.name}</p>
                <p class="description">${task.description}</p>
            </div>
            <div class="more-options">
                <img src="icons/more.svg" alt="More options">
                <div class="content">
                    <div class="completed option">
                        <img src="icons/check.svg" alt="Complete">
                        <p class="completed">Complete</p>
                    </div>
                    <div class="progress option">
                        <img src="icons/progress.svg" alt="In progress">
                        <p class="progress">In progress</p>
                    </div>
                    <div class="delete option">
                        <img src="icons/delete.svg" alt="Delete">
                        <p class="delete">Delete</p>
                    </div>
                </div>
            </div>
        </div>
        <p class="date">${task.AddedAt}</p>`;
    return taskCard;
};

const updateTasks = () => {
    const updateContainer = (container, tasks) => {
        container.innerHTML = '';
        tasks.forEach(task => container.appendChild(createTaskCard(task)));
    };

    updateContainer(tasksContainer, taskList);
    updateContainer(inProgressTasksContainer, taskListInProgress);
    updateContainer(completedTasksContainer, taskListCompleted);

    const allTasksCounter = taskList.length + taskListInProgress.length + taskListCompleted.length;
    document.querySelector('.all-tasks-counter').innerText = `All tasks (${allTasksCounter})`;

    const updateCounter = (selector, count) => {
        document.querySelector(selector).innerText = `(${count})`;
    };

    updateCounter('.js-todo-counter', taskList.length);
    updateCounter('.js-todo-counter-aside', taskList.length);
    updateCounter('.in-progress-counter', taskListInProgress.length);
    updateCounter('.in-progress-counter-aside', taskListInProgress.length);
    updateCounter('.completed-counter', taskListCompleted.length);
    updateCounter('.completed-counter-aside', taskListCompleted.length);
};

const addTask = (taskName, taskDescription) => {
    const task = { name: taskName || 'Task name', description: taskDescription, AddedAt: now };
    taskList.push(task);
    saveToLocalStorage('taskList', taskList);
    updateTasks();
};

saveTaskButton.addEventListener('click', () => {
    const taskName = document.querySelector('.task-name').value;
    const taskDescription = document.querySelector('.task-description').value;
    addTask(taskName, taskDescription);
    hideModal();
});

const taskManagementHandler = (event, container, sourceList, targetList, targetKey) => {
    const taskCard = event.target.closest('.task-card');
    const taskIndex = Array.from(container.children).indexOf(taskCard);
    const task = sourceList.splice(taskIndex, 1)[0];

    if (targetList) {
        targetList.push(task);
        saveToLocalStorage(targetKey, targetList);
    }

    saveToLocalStorage(container.dataset.key, sourceList);
    updateTasks();
};

tasksContainer.addEventListener('click', (event) => {
    const taskCard = event.target.closest('.task-card');
    const moreOptionsElement = taskCard.querySelector('.content');

    if (event.target.classList.contains('completed')) {
        taskManagementHandler(event, tasksContainer, taskList, taskListCompleted, 'taskListCompleted');
    } else if (event.target.classList.contains('progress')) {
        taskManagementHandler(event, tasksContainer, taskList, taskListInProgress, 'taskListInProgress');
    } else if (event.target.classList.contains('delete')) {
        taskManagementHandler(event, tasksContainer, taskList, null, null);
    } else if (event.target.closest('.more-options img')) {
        moreOptionsElement.style.display = moreOptionsElement.style.display === 'flex' ? 'none' : 'flex';
    }
});

inProgressTasksContainer.addEventListener('click', (event) => {
    
    const taskCard = event.target.closest('.task-card');
    const moreOptionsElement = taskCard.querySelector('.content');

    moreOptionsElement.querySelector('div .progress').innerHTML = 
    `
    <img src="icons/to-do.svg" alt="In progress">
    <p class="todo">To do</p>
    `;

    if (event.target.classList.contains('progress') || event.target.classList.contains('todo')) {
        taskManagementHandler(event, inProgressTasksContainer, taskListInProgress, taskList, 'taskList');
    } else if (event.target.classList.contains('completed')) {
        taskManagementHandler(event, inProgressTasksContainer, taskListInProgress, taskListCompleted, 'taskListCompleted');
    } else if (event.target.classList.contains('delete')) {
        taskManagementHandler(event, inProgressTasksContainer, taskListInProgress, null, null);
    } else if (event.target.closest('.more-options img')) {
        moreOptionsElement.style.display = moreOptionsElement.style.display === 'flex' ? 'none' : 'flex';
    }
});

completedTasksContainer.addEventListener('click', (event) => {
    const taskCard = event.target.closest('.task-card');
    const moreOptionsElement = taskCard.querySelector('.content');

    moreOptionsElement.querySelector('div .completed').innerHTML = 
    `
        <img src="icons/to-do.svg" alt="In progress">
        <p class="todo">To do</p>
    `

    if (event.target.classList.contains('completed') || event.target.classList.contains('todo')) {
        taskManagementHandler(event, completedTasksContainer, taskListCompleted, taskList, 'taskList');
    } else if (event.target.classList.contains('progress')) {
        taskManagementHandler(event, completedTasksContainer, taskListCompleted, taskListInProgress, 'taskListInProgress');
    } else if (event.target.classList.contains('delete')) {
        taskManagementHandler(event, completedTasksContainer, taskListCompleted, null, null);
    } else if (event.target.closest('.more-options img')) {
        moreOptionsElement.style.display = moreOptionsElement.style.display === 'flex' ? 'none' : 'flex';
    }
});

updateTasks();
