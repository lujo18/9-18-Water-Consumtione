const timeNob = document.querySelector("#time-nob");
const timeBackground = document.querySelector("#time-background")
const totalWaterNum = document.querySelector("#total-water-num")
const totalWaterPie = document.querySelector("#total-water-pie")
const waterControls = document.querySelector("#water-controls")
document.documentElement.style.setProperty("--border-completion", `${0}deg`)
let waterDrank = 0;
let pieAngle = 0;

//const dateTest = document.querySelector("#date-test")
/*let testDate = new Date(dateTest.value);
//console.log(testDate)
dateTest.addEventListener("change", () => {
    testDate = new Date(dateTest.value)
    checkDate()
})*/

let todayDate = new Date();

const yearProgressVisual = document.querySelector("#year-progress-visual")
const daysCompletedNumberVisual = document.querySelector("#display-completed");
const daysActiveNumberVisual = document.querySelector("#display-days");
const averageWaterNum = document.querySelector("#average-water-num");
const totalCupsVisual = document.querySelector("#display-drank");
const predictionCupsVisual = document.querySelector("#display-drank-prediction");


let lastActive;
let currentActive;

let dailyProgressArray = {};



function changePieAngle () {
    pieAngle = Math.round((360 * waterDrank) / retrieve("dailyGoal"))

    let currentAngle = document.documentElement.style.getPropertyValue("--border-completion")
    currentAngle = parseInt(currentAngle.substring(0, currentAngle.indexOf("deg")))

    let i = 0;
    setInterval(() => {
        if(currentAngle != pieAngle) {
            if (currentAngle > pieAngle) {
                currentAngle--;
            }
            else {
                currentAngle++;
            }
            document.documentElement.style.setProperty("--border-completion", `${currentAngle}deg`)
        } else {
            return
        }
        
    }, 17);

    totalWaterNum.innerHTML = waterDrank;

    let now = new Date(retrieve("lastActive")).getUTCDate()

    //console.log(now)
    
}

function getDaysInYear(date) {
    let year = new Date(date).getUTCFullYear;
    return ((year % 4 === 0 && year % 100 > 0) || (year % 400 == 0)) ? 366 : 365;
}

//const numberOfAverageShowerDisplay = document.querySelector("#avg-shower");
//const numberOfAverageCarDisplay = document.querySelector("#avg-car")

function updateDaysCompletedVisual() {
    let days = 0;
    let completed = 0;
    let totalDrank = 0;
    let drankAverage = 0;
    let yearPrediction = 0;

    let average = 0;
    Object.keys(dailyProgressArray[todayDate.getUTCFullYear()]).forEach(month => {
        Object.keys(dailyProgressArray[todayDate.getUTCFullYear()][month]).forEach(day => {
            if (dailyProgressArray[todayDate.getUTCFullYear()][month][day].completion) {
                if (dailyProgressArray[todayDate.getUTCFullYear()][month][day].completion >= 1) {
                    completed++
                    average ++
                } else {
                    average += dailyProgressArray[todayDate.getUTCFullYear()][month][day].completion
                }

                days++
            }

            if (dailyProgressArray[todayDate.getUTCFullYear()][month][day].drank) {
                totalDrank += dailyProgressArray[todayDate.getUTCFullYear()][month][day].drank;
            }
            
            
            //console.log(dailyProgressArray)
        })
    })

    drankAverage = Math.round(Math.round((totalDrank / days) * 100) / 100)
    yearPrediction = drankAverage * 265;

    average = Math.round((average / days) * 100)

    document.documentElement.style.setProperty("--average-border-completion", `${(average * 360)/100}deg`)

    averageWaterNum.innerHTML = average

    daysCompletedNumberVisual.innerHTML = completed;
    daysActiveNumberVisual.innerHTML = days;

    totalCupsVisual.innerHTML = totalDrank
    predictionCupsVisual.innerHTML = yearPrediction

    //numberOfAverageShowerDisplay.innerHTML = Math.round(yearPrediction / 275.2)
    //numberOfAverageCarDisplay.innerHTML = Math.round(yearPrediction / 624000 * 100) / 100
}


function generateYearVisual(date) {
    yearProgressVisual.innerHTML = "";

    let startYear = new Date(`1-1-${date.getUTCFullYear()}`)

    let daysInYear = getDaysInYear(startYear);
    
    // use an array of everyday, and set a class value based on a range
    // none = 0%
    // low = 1% - 25%
    // medium = 26% - 50%
    // almost = 51% - 75%
    // close = 76% - 99%
    // completed = 100%+

    for (let i = 0; i <= daysInYear; i += 1) {
        let dayBlock = document.createElement("div");
        dayBlock.id = `${startYear.getMonth()}-${startYear.getDate()}`

        dayBlock.className = "completion-none";
        setYearVisualBackground(dayBlock, startYear)

        if(startYear.getDate() == 1) {
            dayBlock.style.border = "1px solid rgb(52, 52, 52)";
        }
        yearProgressVisual.appendChild(dayBlock);
        startYear.setDate(startYear.getDate() + 1);
    }

}

function setYearVisualBackground(element, date) {
    let dayData = "test";
    try {
    Object.keys(dailyProgressArray[date.getUTCFullYear()][date.getUTCMonth()][date.getUTCDate()]);
    }
    catch (e) {
        element.className = 'completion-none';
        return;
    }
    dayData = dailyProgressArray[date.getUTCFullYear()][date.getUTCMonth()][date.getUTCDate()]
    let drank = dayData.drank
    let goal = dayData.goal
    let completion = dayData.completion

    element.title = `${date.getMonth()+1}/${date.getDate()}\n${drank}/${goal} cups`

    if(completion == 0) {
        element.className = 'completion-none'
    }
    else if(completion < .25) {
        element.className = 'completion-minor'
    }
    else if(completion < .50) {
        element.className = 'completion-half'
    }
    else if(completion < .75) {
        element.className = 'completion-medium'
    }
    else if(completion < .99) {
        element.className = 'completion-almost'
    }
    else if(completion >= 1) {
        element.className = 'completion-complete'
    }
    
}


waterControls.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", ()=>{
        
        waterDrank += parseFloat(button.value);
        waterDrank = waterDrank < 0 ? 0 : waterDrank;
        waterDrank = waterDrank > 50 ? waterDrank-1 : waterDrank;

        store("waterDrank", waterDrank);

        changePieAngle()
        visualizeSchedule()
        saveTodayData(todayDate)
    })
})

const yearVisualYear = document.querySelector("#year-progress-changer p");
const yearVisualArrows = document.querySelectorAll("#year-progress-changer i")

function updateYearArrows(date) {
    
    let currentIndex = Object.keys(dailyProgressArray).indexOf("" + date.getUTCFullYear());

    //console.log("CURRENT INDEX: " + currentIndex)
    if (Object.keys(dailyProgressArray)[currentIndex + 1] == null) {
        yearVisualArrows[1].classList.add("disabled")
    } else {
        yearVisualArrows[1].classList.remove("disabled")
    }
    if (Object.keys(dailyProgressArray)[currentIndex - 1] == null) {
        yearVisualArrows[0].classList.add("disabled")
    } else {
        yearVisualArrows[0].classList.remove("disabled")
    }

}

function changeYear(direction, element) {
    let currentIndex = Object.keys(dailyProgressArray).indexOf("" + todayDate.getUTCFullYear())

    let newYear;

    
    let newDate = new Date("1-1-" + newYear)
    
    if (Object.keys(dailyProgressArray)[currentIndex + direction]) {
        newYear = Object.keys(dailyProgressArray)[currentIndex + direction]

        updateYearArrows(newDate)
        generateYearVisual(newDate)
        updateDaysCompletedVisual()
    }

}


function updateYearVisual(date) {
    let block = document.getElementById(`${date.getUTCMonth()}-${date.getUTCDate()}`);
    setYearVisualBackground(block, date);
}

function saveTodayData(date) {
    checkProgressArray(date)
    ////console.log("Save Today Data")
    if (!retrieve("dailyProgressArray")) {
        createProgressArray(date);
    } else {
        dailyProgressArray = retrieve("dailyProgressArray");
    }
    
    dailyProgressArray[date.getUTCFullYear()][date.getUTCMonth()][date.getUTCDate()].drank = waterDrank;
    dailyProgressArray[date.getUTCFullYear()][date.getUTCMonth()][date.getUTCDate()].goal = parseFloat(retrieve("dailyGoal"));
    dailyProgressArray[date.getUTCFullYear()][date.getUTCMonth()][date.getUTCDate()].completion = waterDrank / parseFloat(retrieve("dailyGoal"))
    store("dailyProgressArray", dailyProgressArray)

    updateYearVisual(date)
    
}

function checkDate() {
    checkProgressArray(todayDate)
    waterDrank = dailyProgressArray[todayDate.getUTCFullYear()][todayDate.getUTCMonth()][todayDate.getUTCDate()].drank
    totalWaterNum.innerHtml = waterDrank
    store("waterDrank", waterDrank);
    changePieAngle()
    visualizeSchedule()

}

function resetNewDay() {
    checkProgressArray(todayDate)
    //console.log("Reset New Day:")
    waterDrank = 0;
    store("waterDrank", waterDrank);

    changePieAngle()
    visualizeSchedule()

}

function checkProgressArray(date) {
    if(!retrieve("dailyProgressArray")) {
        dailyProgressArray = {};
    }
    else {
        dailyProgressArray = retrieve("dailyProgressArray")
    }

    //console.log("Check Progress Array:")
    let year = date.getUTCFullYear();
    let month = date.getUTCMonth();
    let day = date.getUTCDate();
    //console.log("DATE: : :")
    //console.log(date)
    //console.log(date.getUTCMonth())
    //console.log(date.getUTCDate())  // FIX ME : the dates are 1 behind because of arrays
    // FIX ME : the id system mistakes 12/1 as 1/21


    if (!dailyProgressArray[year]) {
        dailyProgressArray[year] = {};
    }

    if (!dailyProgressArray[year][month]) {
        dailyProgressArray[year][month] = {};
    }

    if (!dailyProgressArray[year][month][day]) {
        dailyProgressArray[year][month][day] = {};
        dailyProgressArray[year][month][day].drank = 0;
        dailyProgressArray[year][month][day].goal = 0;
        dailyProgressArray[year][month][day].average = 0;
    }
    
    store("dailyProgressArray", dailyProgressArray);
}

function createProgressArray() {
    //console.log("Create Progress Array")
    if (!retrieve("dailyProgressArray")) {
        checkProgressArray(todayDate);
    }
}

// Settup on load

if (retrieve("waterDrank")) {
    waterDrank = retrieve("waterDrank");
    changePieAngle();
}




checkDate();
checkProgressArray(todayDate);
generateYearVisual(todayDate);
updateDaysCompletedVisual()
updateYearArrows(todayDate)

setInterval(() => {
    let todayDate = new Date();
    let hour = todayDate.getHours();
    let minutes = todayDate.getMinutes()/60;
    let seconds = todayDate.getSeconds()/60/60;

    if (!retrieve("lastActive") || retrieve("lasActive").getUTCDate() != todayDate.getUTCDate()) {
        resetNewDay();
        checkDate();
    }
    localStorage.setItem("lastActive", JSON.stringify(todayDate))

    timeBackground.style.width = `${(hour - 1 + minutes + seconds) * VISUAL_MULTIPLIER}rem`
    timeNob.style.marginLeft = `${(hour - 1 + minutes + seconds) * VISUAL_MULTIPLIER}rem`

}, 1000)


// if statement (lastActive has a value) 
// if not, then it to the current time
// if statement (LastActive day != current day) 
// then run checkd day (reset to new day)