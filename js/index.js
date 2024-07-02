const asideNavbarElement = document.querySelector('aside');
const openMenuButton = document.querySelector('header .js-open-menu');
const closeMenuButton = document.querySelector('.js-menu');
const nowElement = document.querySelector('.js-now');
const addTaskButtons = document.querySelectorAll('.add-task');
const taskModalElement = document.querySelector('.task-modal');
const saveTaskButton = document.querySelector('.js-add-new-task');
const tasksContainer = document.querySelector('.tasks-list');

const now = dayjs().format('D MMM YYYY');
nowElement.innerText = now;

const toggleDisplay = (element, display) => {
    element.style.display = display;
};

const showModal = () => toggleDisplay(taskModalElement, 'flex');
const hideModal = () => toggleDisplay(taskModalElement, 'none');
const showAsideNavbar = () => toggleDisplay(asideNavbarElement, 'block');
const hideAsideNavbar = () => toggleDisplay(asideNavbarElement, 'none');

openMenuButton.addEventListener('click', showAsideNavbar);
closeMenuButton.addEventListener('click', hideAsideNavbar);

addTaskButtons.forEach(button => {
    button.addEventListener('click', showModal);
});

document.querySelector('.js-discard-task').addEventListener('click', hideModal);

const taskList = JSON.parse(localStorage.getItem('taskList')) || [];

const createTaskCard = (task) => {
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-card');

    const taskCardContent = `
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
                <p>Complete</p>
            </div>
            <div class="progress option">
                <img src="icons/progress.svg" alt="In progress">
                <p>In progress</p>
            </div>
            <div class="delete option">
                <img src="icons/delete.svg" alt="Delete">
                <p class="delete">Delete</p>
            </div>
            </div>
        </div>
        </div>
        <p class="date">${task.AddedAt}</p>
    `;

    taskCard.innerHTML = taskCardContent;
    return taskCard;
};

const updateTasks = () => {
    tasksContainer.innerHTML = '';
    taskList.forEach(task => {
        const newTaskCard = createTaskCard(task);
        tasksContainer.appendChild(newTaskCard);
    });
    const counter = document.querySelector('.js-todo-counter')
    counter.innerText = `To do (${taskList.length})`
};

const addTask = (taskName, taskDescription) => {
    const task = {
        name: taskName || 'Task name',
        description: taskDescription,
        AddedAt: now,
    };
    taskList.push(task);
    localStorage.setItem('taskList', JSON.stringify(taskList));

    updateTasks();
};

saveTaskButton.addEventListener('click', () => {
    const taskName = document.querySelector('.task-name').value;
    const taskDescription = document.querySelector('.task-description').value;
    addTask(taskName, taskDescription);
    hideModal();
});

tasksContainer.addEventListener('click', (event) => {
    const taskCard = event.target.closest('.task-card');
    const moreOptionsElement = taskCard.querySelector('.content');

    if (event.target.classList.contains('delete')) {
        taskCard.remove();
        const taskIndex = Array.from(tasksContainer.children).indexOf(taskCard);
        taskList.splice(taskIndex, 1);
        localStorage.setItem('taskList', JSON.stringify(taskList));
        updateTasks()
    }

    if (event.target.closest('.more-options img')) {
        moreOptionsElement.style.display = 
        moreOptionsElement.style.display === 'flex' ? 'none' : 'flex';
    }
});

const inProgressTasksContainer = document.querySelector('.in-progress-section');
const completedTasksContainer = document.querySelector('.completed-section');



updateTasks();