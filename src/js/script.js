import "../scss/style.scss" 
console.log('script loaded')

const shuffleBtn = document.getElementById('btnShuffle')
const shuffleItems = [...document.querySelectorAll('.item')]

    shuffleBtn.addEventListener('click', () => {
        shuffleItems.forEach((item) => {
            const random = Math.floor(Math.random() * 4)
        item.setAttribute('style', `order: ${random};`)
        })
    })
