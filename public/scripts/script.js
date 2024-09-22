const goalForm = document.querySelector('#goal-form');
const customGoalInput = document.querySelector("#custom-goal-input");
const goalDisplay = document.querySelector("#goal-display");
const scheduleVisual = document.querySelector("#schedule-visual")

//
const stopHoursInput = document.querySelector("#stop-hours-input");
const wakeTimeInput = document.querySelector("#wake-input");
const sleepTimeInput = document.querySelector("#sleep-input");
const drinkIncrementsInput = document.querySelector("#drink-increments");

let dailyGoal;
let stopDrinkingHours;
let stopDrinkingTime = [];
let wakeTime = [];
let sleepTime = [];
let drinkIncrements;

let waterGoals = [];


customGoalInput.onclick = () => {
    let customCheck = document.querySelector("input#custom-goal").checked = true;
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
    console.log("i = " + (dailyGoal % 1) + drinkIncrements)
    console.log("i < " + dailyGoal)
    console.log("i += " + drinkIncrements)


    // set i to the decimal remainder + 1 whole cup
    for (let i = drinkIncrements; i <= dailyGoal + drinkIncrements; i += dailyGoal / drinkIncrements) {
        waterGoals = [];
        waterGoals.push(i)
        console.log("i = " + (dailyGoal % 1) + drinkIncrements)
        console.log("i < " + dailyGoal)
        console.log("i += " + drinkIncrements + "\n")
        let section = document.createElement("div");
        section.classList.add("schedule-section");
        section.style.width = `${((stopDrinkingTime[0] - wakeTime[0]) / (dailyGoal)) * 1.5}rem`

        let label = document.createElement("p");
        label.innerText = i;
        section.appendChild(label);

        scheduleVisual.querySelector("#time-blocks").appendChild(section);
    }
    scheduleVisual.querySelector("#time-blocks").style.marginLeft = `${(wakeTime[0] - 1) * 1.5}rem`
    scheduleVisual.querySelector("#time-blocks").style.width = `${(stopDrinkingTime[0] - wakeTime[0]) * 1.5}rem`
}

async function updateSystem() {
    let goalChecked = document.querySelector(".goal-check:checked");

    dailyGoal = goalChecked.value != "0" ? goalChecked.value : customGoalInput.value;

    goalDisplay.innerHTML = dailyGoal + " Cups";

    drinkIncrements = drinkIncrementsInput.value ? parseInt(drinkIncrementsInput.value) : 1;
    stopDrinkingHours = stopHoursInput.value;
    wakeTime = convertTime(wakeTimeInput.value);
    sleepTime = convertTime(sleepTimeInput.value);

    stopDrinkingTime = [...sleepTime];
    stopDrinkingTime[0] -= stopDrinkingHours;
    if (stopDrinkingTime[0] <= 0) {stopDrinkingTime[0] += 24;}

    console.log(drinkIncrements)

    await visualizeSchedule();
    scheduleVisual.style.paddingLeft = `${wakeTime[0]}rem`
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

        
        grid.style.left = `${i * 1.5}rem`

        let time = document.createElement('p');
        time.innerText = i + 1;
        grid.appendChild(time)

        scheduleVisual.querySelector("#bg-grid").appendChild(grid);
    }
}



updateSystem()
goalGrid()