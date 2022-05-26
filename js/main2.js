'use strict'
document.addEventListener('contextmenu', event => event.preventDefault());

const EMPTY = ''
const BOMB = '💣'
const FLAG = '🚩'
const LIFE = '💗'

var firstClickTimer = true
var gameOver = false
var restartFlag = false
var gLives = 3
var gTimerInterval
var gBoard
var msec = 0


var gLevel = {
    SIZE: 4,
    MINES: 2
}


var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    startTime: 0,
    lives: 3
}
function initGame() {
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gLives = 3
    buildBoard()
    console.table(gBoard)
    renderBoard()
    var elWrong = document.querySelector('.game-over')
    elWrong.innerText = ''


}
//change board size acording to the level size
function changeBoard(elInput) {
    var elInput
    var newBorderSize = elInput.value ** 0.5
    if (newBorderSize === 4) gLevel.MINES = 2
    if (newBorderSize === 8) gLevel.MINES = 12
    if (newBorderSize === 12) gLevel.MINES = 30
    gLevel.SIZE = newBorderSize

    initGame()
}


function buildBoard() {
    gBoard = createMat(gLevel.SIZE)
    //create empty board with gBoard objects
    for (var i = 0; i < gLevel.SIZE; i++) {
        gBoard[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            gBoard[i][j] = {
                isMine: false,
                negsCount: 0,
                isMarked: false,
                isShown: false,
            }
        }
    }
    // set mines on the board
    for (var i = 0; i < gLevel.MINES; i++) {
        var randIdxRow = getRandomInt(0, gLevel.SIZE - 1)
        var randIdxCol = getRandomInt(0, gLevel.SIZE - 1)

        if (gBoard[randIdxRow][randIdxCol].isMine === true)
            i--
        gBoard[randIdxRow][randIdxCol].isMine = true
    }
    setMinesNegsCount(gBoard) // 

    // console.table(gBoard)
}
function setMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) continue
            gBoard[i][j].negsCount = findNegNum(i, j)
        }
    }
}
function findNegNum(rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            var currCell = gBoard[i][j]
            if (currCell.isMine) count++
        }
    }
    return count
}

function renderBoard() {
    var strHTML = ''
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gBoard[0].length; j++) {
            var classList = gBoard[i][j].isShown ? 'shown' : 'hidden'
            var cell = gBoard[i][j].isMine === true ? 'BOMB' : gBoard[i][j].negsCount
            strHTML += `\t<td
            id="cell-${i}-${j}"
            class="cell ${classList}"
            onclick="cellClicked(this , ${i}, ${j}, ${cell})"
            oncontextmenu="cellMarked(this, ${i}, ${j}, event )">
            </td>\n`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    var elBoard = document.querySelector(".board")
    elBoard.innerHTML = strHTML
}

function cellClicked(elCell, i, j) {
    // console.log(elCell, i, j)
    if (gameOver) return
    if (!gGame.isOn) return
    if (gBoard[i][j].isShown) return
    if (gBoard[i][j].isMarked) return
    gBoard[i][j].isShown = true

    elCell.classList.remove('hidden')
    elCell.classList.add('show')
    if (gBoard[i][j].isMine) {
        elCell.innerHTML = BOMB
        ifGameOver()
        clearInterval(gTimerInterval)
        return
    }
    elCell.innerText = gBoard[i][j].negsCount === 0 ? '' : gBoard[i][j].negsCount
    //timer activation
    if (firstClickTimer) {
        firstClickTimer = false
        startTimer()
    }
    // check if clicked cell==0 and activate recursion (expandShown)
    if (gBoard[i][j].negsCount === 0) {
        console.log(i, j)
        expandShown(elCell, i, j)
    }
}

function cellMarked(elCell, i, j) {
    // console.log(i, j)
    if (gameOver) return
    if (!gGame.isOn) return

    if (!gBoard[i][j].isShown) {
        if (!gBoard[i][j].isMarked) {

            elCell.innerText = FLAG
            gBoard[i][j].isMarked = true

            if (gBoard[i][j].isMine === gBoard[i][j].isMarked) {
                gGame.markedCount++
                if (gGame.markedCount === gLevel.MINES) {
                    var elWrong = document.querySelector('.game-over')
                    elWrong.innerText = 'VICTORIOUS!!!'
                    elWrong.style.color = 'white'
                    clearInterval(gTimerInterval)
                }
            } else {
                elCell.innerText = ' '
                gGame.markedCount--
                gBoard[i][j].isMarked = false
            }

        }
    }
}

function expandShown(elCell, rowIdx2, colIdx2) {
    console.log(colIdx2)
    for (var i = rowIdx2 - 1; i <= rowIdx2 + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx2 - 1; j <= colIdx2 + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === rowIdx2 && j === colIdx2) continue
            var currCell = gBoard[i][j]
            var cellId = '#' + getIdName({ i, j })
            var newElCell = document.querySelector(cellId)
            currCell.isShown = true
            var elCellToShow = document.querySelector(`.cell-${i}-${j}`)
            showCell(newElCell, currCell)
            console.log(elCell,'kjkjjkjk',newElCell);
        }
    }
}

function getIdName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass
}


function showCell(elCell, cell) {
    elCell.classList.remove('hidden')
    elCell.classList.add('shown')
    if (cell.isMine) {
        elCell.innerHTML = BOMB
        return
    }

    if (cell.negsCount === 0){
        elCell.style.backgroundColor = 'white'
    }
    else elCell.innerText = cell.negsCount
    // elCell.innerText = cell.negsCount === 0 ? '': cell.negsCount
}


function ifGameOver() {
    var elWrong = document.querySelector('.game-over')
    elWrong.innerText = 'Game over'
    // elWrong.style.color = 'white'
    gameOver = true
}

function victory() {
    clearInterval(gTimerInterval)
    gGame.isOver = true
    gGame.isOn = false
}


function restart() {

    gameOver = false
    // clearInterval(gTimerInterval)
    // startTimer()
    restartFlag = true
    firstClickTimer = true
    initGame()

}



function renderLives() {
    const elLives = document.querySelector('.lives')
    var strHTML = ''
    for (var i = 0; i < gGame.lives; i++) {
        strHTML += LIFE
    }

    elLives.innerHTML = strHTML
}