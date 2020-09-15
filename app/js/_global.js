// Global

app.global = {
    init: function(){ // Load all global functions here
        console.log("load global functions");
        
        app.global.gridOrdering();
    },
    gridOrdering: 
    function(){ // Some specific function

        
        const shuffleButton = document.querySelector('.shuffleBtn')
        const gridItem = [...document.querySelectorAll('.item')]


        shuffleButton.addEventListener('click', () => {

            gridItem.forEach(item => {
                const random = Math.floor(Math.random() * 3)

                item.setAttribute('style', `order: ${random}`)
            })

        })

        
        
    }
}

// Run the global stuff
app.global.init();