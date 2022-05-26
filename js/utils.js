
function createMat(size) {
    var mat = []
    for (var i = 0; i < size; i++) {
        mat[i] = []
        for (var j = 0; j < size; j++) {
            mat[i][j] = ''
        }
    }
    return mat
}


function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
}


function convertMsToTime(milliseconds) {
    var seconds = Math.floor(milliseconds / 1000)
    var minutes = Math.floor(seconds / 60)

    seconds = seconds % 60
    minutes = minutes % 60

    return `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}:${(
        milliseconds % 1000
    )
        .toString()
        .substring(0, 3)}`
}

function callTimer() {
    msec += 15
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = convertMsToTime(sec)
}

function startTimer() {

    var startTime = Date.now()

    gTimerInterval = setInterval(() => {
        gGame.secsPassed = ((Date.now() - startTime) / 1000).toFixed(1)
        var elSpan = document.querySelector('.timer')
        elSpan.innerText = gGame.secsPassed
    }, 60)
}