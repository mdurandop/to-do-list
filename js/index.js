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
const taskListInProgress = JSON.parse(localStorage.getItem('taskListInProgress')) || [];
const taskListCompleted = JSON.parse(localStorage.getItem('taskListCompleted')) || [];

const createTaskCard = (task) => {
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-card');

    const taskCardContent = 
        `<div class="head">
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
        <p class="date">${task.AddedAt}</p>`
    ;

    taskCard.innerHTML = taskCardContent;
    return taskCard;
};

const updateTasks = () => {
    tasksContainer.innerHTML = '';
    inProgressTasksContainer.innerHTML = '';
    completedTasksContainer.innerHTML = '';

    taskList.forEach(task => {
        const newTaskCard = createTaskCard(task);
        tasksContainer.appendChild(newTaskCard);
    });

    taskListInProgress.forEach(task => {
        const newTaskCard = createTaskCard(task);
        inProgressTasksContainer.appendChild(newTaskCard);
    })

    taskListCompleted.forEach(task => {
        const newTaskCard = createTaskCard(task);
        completedTasksContainer.appendChild(newTaskCard);
    });

    const allTasksCounter = taskList.length + taskListCompleted.length + taskListInProgress.length;
    document.querySelector('.all-tasks-counter').innerText = `All tasks (${allTasksCounter})`

    const counter = document.querySelector('.js-todo-counter')
    document.querySelector('.js-todo-counter-aside').innerText = `To do (${taskList.length})`
    counter.innerText = `To do (${taskList.length})`

    const inProgressCounter = document.querySelector('.in-progress-counter')
    document.querySelector('.in-progress-counter-aside').innerText = `In progress (${taskListInProgress.length})`
    inProgressCounter.innerText = `In progress (${taskListInProgress.length})`

    const completedCounter = document.querySelector('.completed-counter');
    document.querySelector('.completed-counter-aside').innerText = `In progress (${taskListCompleted.length})`
    completedCounter.innerText = `Completed (${taskListCompleted.length})`;
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

    if (event.target.classList.contains('completed')) {
        const taskIndex = Array.from(tasksContainer.children).indexOf(taskCard);

        taskListCompleted.push(taskList[taskIndex])
        localStorage.setItem('taskListCompleted', JSON.stringify(taskListCompleted))

        taskList.splice(taskIndex, 1);
        localStorage.setItem('taskList', JSON.stringify(taskList))
        updateTasks()
    }

    if (event.target.classList.contains('progress')) {
        const taskIndex = Array.from(tasksContainer.children).indexOf(taskCard);

        taskListInProgress.push(taskList[taskIndex])
        localStorage.setItem('taskListInProgress', JSON.stringify(taskListInProgress))

        taskList.splice(taskIndex, 1);
        localStorage.setItem('taskList', JSON.stringify(taskList))
        updateTasks()
    }

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

inProgressTasksContainer.addEventListener('click', (event) => {
    const taskCard = event.target.closest('.task-card');
    const moreOptionsElement = taskCard.querySelector('.content');

    moreOptionsElement.querySelector('div .progress').innerHTML = 
    `
        <img src="icons/to-do.svg" alt="In progress">
        <p class="todo">To do</p>
    `;
    
    if (event.target.classList.contains('progress') || (event.target.classList.contains('todo'))) {
        const taskIndex = Array.from(inProgressTasksContainer.children).indexOf(taskCard);

        taskList.push(taskListInProgress[taskIndex])
        localStorage.setItem('taskList', JSON.stringify(taskList))

        taskListInProgress.splice(taskIndex, 1);
        localStorage.setItem('taskListInProgress', JSON.stringify(taskListInProgress))
        updateTasks()
    }

    if (event.target.classList.contains('completed')) {
        const taskIndex = Array.from(inProgressTasksContainer.children).indexOf(taskCard);

        taskListCompleted.push(taskListInProgress[taskIndex])
        localStorage.setItem('taskListCompleted', JSON.stringify(taskListCompleted))

        taskListInProgress.splice(taskIndex, 1);
        localStorage.setItem('taskListInProgress', JSON.stringify(taskListInProgress))
        updateTasks()
    }

    if (event.target.classList.contains('delete')) {
        taskCard.remove();
        const taskIndex = Array.from(inProgressTasksContainer.children).indexOf(taskCard);
        taskListInProgress.splice(taskIndex, 1);
        localStorage.setItem('taskListInProgress', JSON.stringify(taskListInProgress));
        updateTasks()
    }
    
    if (event.target.closest('.more-options img')) {
        moreOptionsElement.style.display = 
        moreOptionsElement.style.display === 'flex' ? 'none' : 'flex';
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

    if (event.target.classList.contains('completed') || (event.target.classList.contains('todo'))) {
        const taskIndex = Array.from(completedTasksContainer.children).indexOf(taskCard);

        taskList.push(taskListCompleted[taskIndex])
        localStorage.setItem('taskList', JSON.stringify(taskList))

        taskListCompleted.splice(taskIndex, 1);
        localStorage.setItem('taskListCompleted', JSON.stringify(taskListCompleted))
        updateTasks()
    }

    if (event.target.classList.contains('progress')) {
        const taskIndex = Array.from(completedTasksContainer.children).indexOf(taskCard);

        taskListInProgress.push(taskListCompleted[taskIndex])
        localStorage.setItem('taskListInProgress', JSON.stringify(taskListInProgress))

        taskListCompleted.splice(taskIndex, 1);
        localStorage.setItem('taskListCompleted', JSON.stringify(taskListCompleted))
        updateTasks()
    }

    if (event.target.classList.contains('delete')) {
        taskCard.remove();
        const taskIndex = Array.from(completedTasksContainer.children).indexOf(taskCard);
        taskListCompleted.splice(taskIndex, 1);
        localStorage.setItem('taskListCompleted', JSON.stringify(taskListCompleted));
        updateTasks()
    }
    
    if (event.target.closest('.more-options img')) {
        moreOptionsElement.style.display = 
        moreOptionsElement.style.display === 'flex' ? 'none' : 'flex';
    }
});

updateTasks();
