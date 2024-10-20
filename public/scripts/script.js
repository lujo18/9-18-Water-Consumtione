const goalForm = document.querySelector('#goal-form');
const customGoalInput = document.querySelector("#custom-goal-input");
const goalDisplay = document.querySelector("#goal-display");

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



async function updateSystem() {
    let goalChecked = document.querySelector(".goal-check:checked");

    dailyGoal = goalChecked.value != "0" ? goalChecked.value : customGoalInput.value;

    goalDisplay.innerHTML = dailyGoal + " Cups";

    //drinkIncrements = drinkIncrementsInput.value ? parseInt(drinkIncrementsInput.value) : 1;
    stopDrinkingHours = stopHoursInput.value;
    wakeTime = await convertTime(wakeTimeInput.value);
    sleepTime = await convertTime(sleepTimeInput.value);

    //console.log("Script.js waketime: ");
    //console.log(wakeTime)
    //console.log("\n")

    stopDrinkingTime = [...sleepTime];
    stopDrinkingTime[0] -= stopDrinkingHours;
    if (stopDrinkingTime[0] <= 0) {stopDrinkingTime[0] += 24;}

    let waterGoals = []
    let hourlyGoal = 0
    for (let i = 0; i < ((stopDrinkingTime[0]) - wakeTime[0]); i += 1) {
        hourlyGoal += Math.round((dailyGoal) / ((stopDrinkingTime[0]) - wakeTime[0]) * 100)/100
        waterGoals.push(hourlyGoal);

        waterGoals[i] = Math.round(waterGoals[i] * 2)/2
    }

    
    scheduleVisual.style.paddingLeft = `${wakeTime[0]}rem`

    //console.log("created local variables")
    store("stopDrinkingTime", stopDrinkingTime);
    store("stopDrinkingHours", stopDrinkingHours);
    store("wakeTime", wakeTime);
    store("sleepTime", sleepTime);
    store("dailyGoal", dailyGoal);
    store("hourlyWaterGoals", waterGoals);

    //console.log("Script.js waketime store: ");
    //console.log(retrieve("wakeTime"))
    //console.log("\n")

    await visualizeSchedule();
}


goalForm.addEventListener("change", () => {
    updateSystem();
})

goalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
})


function change(btn, value) {
    let numInput = btn.parentElement.querySelector("input[type='number']");
    
    if (parseInt(numInput.value) + value >= numInput.min && parseInt(numInput.value) + value <= numInput.max) {
        numInput.value = parseInt(numInput.value) + parseInt(value);
    }
    //console.log(numInput.value)
    updateSystem();
}


//clearStorage()

// On every new load in, we either create local storage vars, or update form inputs to them.
if (localStorage.getItem("dailyGoal") == null) {
    // Initialize all of our local variables
    //console.log("no local variables")

} else {
    //console.log("local variables found");
    dailyGoal = retrieve("dailyGoal");
    stopDrinkingTime = retrieve("stopDrinkingTime");
    stopDrinkingHours = retrieve("stopDrinkingHours");
    wakeTime = retrieve("wakeTime");
    sleepTime = retrieve("sleepTime");
    hourlyGoal = retrieve("hourlyWaterGoal");


    // Set all form items to those values
    try {
        goalForm.querySelectorAll(".goal-check").forEach(goal => {
            
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

    wakeTimeInput.value = `${wakeTime[0] < 10 ? "0" + wakeTime[0] : wakeTime[0]}:${wakeTime[1] < 10 ? "0" + wakeTime[1] : wakeTime[1]}`;
    sleepTimeInput.value = `${sleepTime[0] < 10 ? "0" + sleepTime[0] : sleepTime[0]}:${sleepTime[1] < 10 ? "0" + sleepTime[1] : sleepTime[1]}`;
}

updateSystem()



function clearStorage () {

    localStorage.removeItem("dailyGoal");
    localStorage.removeItem("stopDrinkingTime");
    localStorage.removeItem("stopDrinkingHours");
    localStorage.removeItem("wakeTime");
    localStorage.removeItem("sleepTime");
    localStorage.removeItem("hourlyWaterGoal");
}