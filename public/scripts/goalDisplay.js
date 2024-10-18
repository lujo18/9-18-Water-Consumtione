const root = document.querySelector(":root")
const VISUAL_MULTIPLIER = getComputedStyle(root).getPropertyValue('--visual-scale');
const scheduleVisual = document.querySelector("#schedule-visual")
const isMilitaryTime = false;
const scrollIndicator = document.querySelector(".scroll-indicator")
const scheduleContainer = document.querySelector("div:has(#schedule-visual)");


scheduleContainer.addEventListener("scroll", e => {
    scrollIndicator.style.animation = "scroll-indication 1s forwards"
})


function goalGrid () {
    for (let i = 0; i < 24; i++) {
        let grid = document.createElement("div");
        grid.classList.add("background-grid");

        
        grid.style.left = `${i * VISUAL_MULTIPLIER}rem`

        let time = document.createElement('p');
        if (isMilitaryTime) {
            time.innerText = i + 1
        }
        else {
            time.innerText = i + 1 < 13 ? `${i + 1}AM` : `${(i + 1) - 12}PM`;
        }

        
        grid.appendChild(time)

        

        scheduleVisual.querySelector("#bg-grid").appendChild(grid);
    }
}

async function visualizeSchedule() {
    wakeTime = retrieve("wakeTime");
    stopDrinkingTime = retrieve("stopDrinkingTime");
    sleepTime = retrieve("sleepTime");

    console.log(wakeTime)

    scheduleVisual.querySelector("#time-blocks").innerHTML = ' ';

    // set i to the decimal remainder + 1 whole cup
    let waterGoals = retrieve("hourlyWaterGoals");
    for (let i = 0; i<waterGoals.length; ++i){
        
        let section = document.createElement("div");
        section.classList.add("schedule-section");
        section.style.width = `${VISUAL_MULTIPLIER - (VISUAL_MULTIPLIER/4)}rem`
        section.style.marginLeft = `${(VISUAL_MULTIPLIER - (VISUAL_MULTIPLIER * 3 / 4))/2}rem`
        section.style.marginRight = `${(VISUAL_MULTIPLIER - (VISUAL_MULTIPLIER * 3 / 4))/2}rem`
        section.style.animationDelay = `${i/10}s`

        let label = document.createElement("p");
        label.innerText = waterGoals[i];

        console.log("Water drank: ")
        console.log(retrieve("waterDrank"))
        console.log("Water goal: ")
        console.log(waterGoals[i])
        if (retrieve("waterDrank") >= waterGoals[i]) {
            section.classList.add("completed");
        }

        section.appendChild(label);

        scheduleVisual.querySelector("#time-blocks").appendChild(section);
        
    }

    // Sets styling for water blocks so they go one after another.
    scheduleVisual.querySelector("#time-blocks").style.marginLeft = `${(wakeTime[0] - 1) * VISUAL_MULTIPLIER}rem`
    scheduleVisual.querySelector("#time-blocks").style.width = `${((stopDrinkingTime[0] + 1 ) - wakeTime[0]) * VISUAL_MULTIPLIER}rem`

    addTimeHighlights();
}

function addTimeHighlights() {
    let grids = scheduleVisual.querySelector("#bg-grid").childNodes

    for (const item of grids) {
        item.style.borderBottom = "none"
        item.style.boxShadow = "none"
    }
    
    // sets special styles for blocks that are wake, stop drinking and sleep time
    grids.item(wakeTime[0] -1).style.borderBottom = "2px solid #e5f840"
    //grids.item(wakeTime[0] -1).style.boxShadow = "inset 0px -8px 5px -5px yellow"
    grids.item(sleepTime[0] -1).style.borderBottom = "2px solid blue"
    //grids.item(sleepTime[0] -1).style.boxShadow = "inset 0px -8px 5px -5px blue"

    for (let i = stopDrinkingTime[0]; i < sleepTime[0]; i++) {
        grids.item(i - 1).style.borderBottom = "2px solid #5f4cb5"
        //grids.item(i -1).style.boxShadow = "inset 0px -8px 5px -5px purple"
    }
}


function retrieve(item) {
    return JSON.parse(localStorage.getItem(item));
}




goalGrid()
visualizeSchedule();
