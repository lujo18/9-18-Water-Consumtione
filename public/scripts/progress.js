const timeNob = document.querySelector("#time-nob");
const timeBackground = document.querySelector("#time-background")
const totalWaterNum = document.querySelector("#total-water-num")
const totalWaterPie = document.querySelector("#total-water-pie")
const waterControls = document.querySelector("#water-controls")
document.documentElement.style.setProperty("--border-completion", `${0}deg`)
let waterDrank = 0;
let pieAngle = 0;

setInterval(() => {
    let time = new Date();
    let hour = time.getHours();
    let minutes = time.getMinutes()/60;
    let seconds = time.getSeconds()/60/60;

    timeBackground.style.width = `${(hour + minutes + seconds) * VISUAL_MULTIPLIER}rem`
    timeNob.style.marginLeft = `${(hour + minutes + seconds) * VISUAL_MULTIPLIER}rem`
}, 1000)

function changePieAngle () {
    pieAngle = Math.round((360 * waterDrank) / retrieve("dailyGoal"))

    let currentAngle = document.documentElement.style.getPropertyValue("--border-completion")
    currentAngle = parseInt(currentAngle.substring(0, currentAngle.indexOf("deg")))

    console.log("Current: " + currentAngle)
    console.log("pieAngle: " + pieAngle)

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

    
}

waterControls.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", ()=>{
        
        waterDrank += parseFloat(button.value);
        waterDrank = waterDrank < 0 ? 0 : waterDrank;

        store("waterDrank", waterDrank);

        changePieAngle()
        visualizeSchedule()
    })
})


if (retrieve("waterDrank")) {
    waterDrank=retrieve("waterDrank")
    changePieAngle()
}