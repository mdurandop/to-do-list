// Header & aside bar DOM elements

const asideNavbarElement = document.querySelector('aside')

document.querySelector('header .js-open-menu').addEventListener('click', () => {
    asideNavbarElement.style.display = 'block'
})

document.querySelector('.js-menu').addEventListener('click', () => {
    asideNavbarElement.style.display = 'none'
})

const now = dayjs().format('D MMM YYYY');
document.querySelector('.js-now').innerText = now;

const addTaskButtons = document.querySelectorAll('.add-task');
const taskModalElement = document.querySelector('.task-modal');

addTaskButtons.forEach(button => {
    button.addEventListener('click', () => {
        taskModalElement.style.display = 'flex'
        document.querySelector('.js-discard-task').addEventListener('click', () => {
            taskModalElement.style.display = 'none'
        })
    })
})

const taskList = JSON.parse(localStorage.getItem('taskList')) || []
updateTasks()

const saveTaskButton = document.querySelector('.js-add-new-task');


function updateTasks() {
    const tasksContainer = document.querySelector('.tasks-list');
    tasksContainer.innerHTML = ''

    taskList.forEach(task => {
        const newTaskCard = document.createElement('div')
        newTaskCard.classList.add('task-card')
    
        newTaskCard.innerHTML = 
        `
            <div class="head">
                <div class="task-name-description">
                    <p class="heading">${task.name}</p>
                    <p class="description">${task.description}</p>
                </div>
                <img src="icons/more.svg" alt="">
            </div>
            <p class="date">${task.AddedAt}</p>
        `
        tasksContainer.appendChild(newTaskCard);
    })
}


saveTaskButton.addEventListener('click', () => {
    let taskName = document.querySelector('.task-name').value || 'Task name';
    let taskDescription = document.querySelector('.task-description').value;
    let taskAddedAt = now;
    taskList.push({name: taskName, description: taskDescription, AddedAt: taskAddedAt})

    updateTasks()

    localStorage.setItem('taskList', JSON.stringify(taskList))
    
    console.log(taskList)

    taskModalElement.style.display = 'none'

});
