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

const saveTaskButton = document.querySelector('.js-add-new-task');

saveTaskButton.addEventListener('click', () => {
    let taskName = document.querySelector('.task-name').value || 'Task name';
    let taskDescription = document.querySelector('.task-description').value;

    const tasksContainer = document.querySelector('.tasks');
    const newTaskCard = document.createElement('div')
    newTaskCard.classList.add('task-card')

    newTaskCard.innerHTML = 
    `
        <div class="head">
            <div class="task-name-description">
                <p class="heading">${taskName}</p>
                <p>${taskDescription}</p>
            </div>
            <img src="icons/more.svg" alt="">
        </div>
        <p class="date">${now}</p>
    `

    tasksContainer.appendChild(newTaskCard);
    taskModalElement.style.display = 'none'
});
