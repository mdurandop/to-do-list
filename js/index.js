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