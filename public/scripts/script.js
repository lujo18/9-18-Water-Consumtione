const goalForm = document.querySelector('#goal-form');
const customGoalInput = document.querySelector("#custom-goal-input");
const goalDisplay = document.querySelector("#goal-display");
const scheduleVisual = document.querySelector("#schedule-visual")

//
const stopHoursInput = document.querySelector("#stop-hours-input");
const wakeTimeInput = document.querySelector("#wake-input");
const sleepTimeInput = document.querySelector("#sleep-input");
//const drinkIncrementsInput = document.querySelector("#drink-increments");

let dailyGoal;
let stopDrinkingHours;
let stopDrinkingTime = [];
let wakeTime = [];
let sleepTime = [];
//let drinkIncrements;

let waterGoals = [];  // hourlyWaterGoals in localStorage

const VISUAL_MULTIPLIER = 2;

customGoalInput.onclick = () => {
    let customCheck = document.querySelector("input#custom-goal").checked = true;
    updateSystem();
}

function convertTime(value) {
    let temp = [];
    temp = value.split(":");
    for (let i = 0; i < temp.length; i++) {
        temp[i] = parseInt(temp[i]);
    }
    return temp;

}

async function visualizeSchedule() {
    scheduleVisual.querySelector("#time-blocks").innerHTML = '';
    


    // set i to the decimal remainder + 1 whole cup
    let waterGoals = []
    let hourlyGoal = 0
    for (let i = 0; i < ((stopDrinkingTime[0]) - wakeTime[0]); i += 1) {
         
        hourlyGoal += Math.round((dailyGoal) / ((stopDrinkingTime[0]) - wakeTime[0]) * 100)/100
        waterGoals.push(hourlyGoal);

        waterGoals[i] = Math.round(waterGoals[i] * 2)/2
    
        
        let section = document.createElement("div");
        section.classList.add("schedule-section");
        section.style.width = `${VISUAL_MULTIPLIER - .5}rem`
        section.style.marginLeft = `${(VISUAL_MULTIPLIER - 1.5)/2}rem`
        section.style.marginRight = `${(VISUAL_MULTIPLIER - 1.5)/2}rem`
        section.style.animationDelay = `${i/10}s`

        let label = document.createElement("p");
        label.innerText = waterGoals[i];
        section.appendChild(label);

        scheduleVisual.querySelector("#time-blocks").appendChild(section);
        
    }


    // Sets styling for water blocks so they go one after another.
    scheduleVisual.querySelector("#time-blocks").style.marginLeft = `${(wakeTime[0] - 1) * VISUAL_MULTIPLIER}rem`
    scheduleVisual.querySelector("#time-blocks").style.width = `${((stopDrinkingTime[0] + 1 ) - wakeTime[0]) * VISUAL_MULTIPLIER}rem`

    let grids = scheduleVisual.querySelector("#bg-grid").childNodes
    
    console.log(grids)

    for (const item of grids) {
        item.style.borderBottom = "none"
        item.style.boxShadow = "none"
    }
    
    // sets special styles for blocks that are wake, stop drinking and sleep time
    grids.item(wakeTime[0] -1).style.borderBottom = "2px solid yellow"
    grids.item(wakeTime[0] -1).style.boxShadow = "inset 0px -8px 5px -5px yellow"
    grids.item(sleepTime[0] -1).style.borderBottom = "2px solid blue"
    grids.item(sleepTime[0] -1).style.boxShadow = "inset 0px -8px 5px -5px blue"

    for (let i = stopDrinkingTime[0]; i < sleepTime[0]; i++) {
        grids.item(i - 1).style.borderBottom = "2px solid purple"
        grids.item(i -1).style.boxShadow = "inset 0px -8px 5px -5px purple"
        console.log(i)
    }

    store("hourlyWaterGoals", waterGoals);

    
}

async function updateSystem() {
    let goalChecked = document.querySelector(".goal-check:checked");

    dailyGoal = goalChecked.value != "0" ? goalChecked.value : customGoalInput.value;

    goalDisplay.innerHTML = dailyGoal + " Cups";

    //drinkIncrements = drinkIncrementsInput.value ? parseInt(drinkIncrementsInput.value) : 1;
    stopDrinkingHours = stopHoursInput.value;
    wakeTime = convertTime(wakeTimeInput.value);
    sleepTime = convertTime(sleepTimeInput.value);

    stopDrinkingTime = [...sleepTime];
    stopDrinkingTime[0] -= stopDrinkingHours;
    if (stopDrinkingTime[0] <= 0) {stopDrinkingTime[0] += 24;}

    

    await visualizeSchedule();
    scheduleVisual.style.paddingLeft = `${wakeTime[0]}rem`

    console.log("created local variables")
    store("stopDrinkingTime", stopDrinkingTime);
    store("stopDrinkingHours", stopDrinkingHours);
    store("wakeTime", wakeTime);
    store("sleepTime", sleepTime);
    store("dailyGoal", dailyGoal);

    console.log(wakeTime)
    console.log(sleepTime)
}



goalForm.addEventListener("change", () => {
    updateSystem();
})

goalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
})


function goalGrid () {
    for (let i = 0; i < 24; i++) {
        let grid = document.createElement("div");
        grid.classList.add("background-grid");

        
        grid.style.left = `${i * VISUAL_MULTIPLIER}rem`

        let time = document.createElement('p');
        time.innerText = i + 1;
        grid.appendChild(time)

        

        scheduleVisual.querySelector("#bg-grid").appendChild(grid);
    }
}

//clearStorage()

// On every new load in, we either create local storage vars, or update form inputs to them.
if (localStorage.getItem("dailyGoal") == null) {
    // Initialize all of our local variables
    console.log("no local variables")

} else {
    console.log("local variables found");
    dailyGoal = retrieve("dailyGoal");
    stopDrinkingTime = retrieve("stopDrinkingTime");
    stopDrinkingHours = retrieve("stopDrinkingHours");
    wakeTime = retrieve("wakeTime");
    sleepTime = retrieve("sleepTime");
    hourlyGoal = retrieve("hourlyWaterGoal");


    // Set all form items to those values
    try {
        goalForm.querySelectorAll(".goal-check").forEach(goal => {
            console.log("this value: " + goal.value)
            if (goal.value == dailyGoal) {
                goal.checked = true;
                throw {}
            } else if (goal.value == 0) {
                goal.checked = true;
                goalForm.querySelector("#custom-goal-input").value = dailyGoal;
            }
        });
    } catch (e) {

    }

    stopHoursInput.value = stopDrinkingHours;

    console.log(wakeTime)
    console.log(sleepTime)
    //console.log(wakeTimeInput.value);
    //console.log(wakeTime[0] + ":" + wakeTime[1]);
    wakeTimeInput.value = `${wakeTime[0] < 10 ? "0" + wakeTime[0] : wakeTime[0]}:${wakeTime[1] < 10 ? "0" + wakeTime[1] : wakeTime[1]}`;
    sleepTimeInput.value = `${sleepTime[0] < 10 ? "0" + sleepTime[0] : sleepTime[0]}:${sleepTime[1] < 10 ? "0" + sleepTime[1] : sleepTime[1]}`;
    
}

goalGrid()
updateSystem()



function clearStorage () {

    localStorage.removeItem("dailyGoal");
    localStorage.removeItem("stopDrinkingTime");
    localStorage.removeItem("stopDrinkingHours");
    localStorage.removeItem("wakeTime");
    localStorage.removeItem("sleepTime");
    localStorage.removeItem("hourlyWaterGoal");
}