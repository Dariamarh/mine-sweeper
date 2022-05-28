'use strict'
document.addEventListener('contextmenu', event => event.preventDefault());

const EMPTY = ''
const BOMB = '💣'
const FLAG = '🚩'
const LIFE = '💗'
const SMILE = '<img src="img/start.jfif" height ="65" width="65"/>'
const WIN = '<img src="img/win2.png" height ="65" width="65"/>'
const LOOSE = '<img src="img/lost.jpg" height ="65" width="65"/>'

var firstClickTimer = true
var gameOver = false
// var restartFlag = false
// var gLives = 3
var gTimerInterval
var gBoard
// var msec = 0
var firstClick = true
var hintsStatus = false
var gLevel = {
    SIZE: 4,
    MINES: 2,
    LIVES: 2,
    MaxFlags: 5,
    HintsCnt: 1
}


var gGame = {}
function initGame() {
    // restart() 
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        startTime: 0,
        lives: 3
    }
    gGame.isOn = true
    // gGame.shownCount = 0
    // gGame.markedCount = 0

    renderLives()
    buildBoard()
    console.table(gBoard)
    renderBoard()

    var elWrong = document.querySelector('.game-over')
    elWrong.innerText = ''


}
//change board size acording to the level size
function changeBoard(elInput) {
    // restart()
    clearInterval(gTimerInterval)
    var elSpan = document.querySelector('.timer')
    elSpan.innerText = '0'
    var newBorderSize
    switch (elInput) {
        case 'Easy':
            newBorderSize = 16 ** 0.5
            break;
        case 'Medium':
            newBorderSize = 64 ** 0.5
            break;
        case 'Hard':
            newBorderSize = 144 ** 0.5
            break;

    }
    if (newBorderSize === 4) gLevel.MINES = 2, gLevel.LIVES = 2, gLevel.MaxFlags = 5, gLevel.HintsCnt = 5
    if (newBorderSize === 8) gLevel.MINES = 12, gLevel.LIVES = 3, gLevel.MaxFlags = 20, gLevel.HintsCnt = 3
    if (newBorderSize === 12) gLevel.MINES = 30, gLevel.LIVES = 5, gLevel.MaxFlags = 50, gLevel.HintsCnt = 5
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
}
function buildMines(iIdx, jIdx) {
    // set mines on the board
    for (var i = 0; i < gLevel.MINES; i++) {
        var randIdxRow = getRandomInt(0, gLevel.SIZE - 1)
        var randIdxCol = getRandomInt(0, gLevel.SIZE - 1)
        // console.log(i);
        if ((randIdxRow === iIdx && randIdxCol === jIdx) || (gBoard[randIdxRow][randIdxCol].isMine === true))
            i--
        // if (gBoard[randIdxRow][randIdxCol].isMine === true)
        //     i--
        gBoard[randIdxRow][randIdxCol].isMine = true
    }
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
    var classList = ''
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr\n>'
        for (var j = 0; j < gBoard[0].length; j++) {
            // var classList = gBoard[i][j].isShown ? 'shown' : 'hidden'

            var classList = gBoard[i][j].isShown === true ? 'visible' : 'hidden'
            var cell = gBoard[i][j].isMine === true ? 'BOMB' : gBoard[i][j].negsCount
            // classList = 'visible'
            strHTML += `\t<td
            id="cell-${i}-${j}"
            class="cell ${classList}"
            onclick="cellClicked(this , ${i}, ${j})"
            oncontextmenu="cellMarked(this, ${i}, ${j}, event )">
            </td>\n`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    var elBoard = document.querySelector(".board")
    // console.log(strHTML);
    elBoard.innerHTML = strHTML
    // elBoard.style.visbility = 'shown'
}



function hintsButton() {
    hintsStatus = true
    if (gLevel.HintsCnt === 0) return


}

function findingNeighbors(elCell, myArray, i, j, isShown, cellType) {
    var rowLimit = myArray.length - 1;
    var columnLimit = myArray[0].length - 1;
    for (var x = Math.max(0, i - 1); x <= Math.min(i + 1, rowLimit); x++) {
        for (var y = Math.max(0, j - 1); y <= Math.min(j + 1, columnLimit); y++) {
            if (x !== i || y !== j) {
                if (!gBoard[x][y].isShown) {
                    gBoard[x][y].isShown = isShown
                    gBoard[i][j].isShown = isShown
                    console.log(gBoard[x][y].isShown);
                }
            }

        }
    }
    console.log(gBoard);
    renderBoard()

}

function cellClicked(elCell, i, j) {

    if (hintsStatus && gLevel.HintsCnt !== 0) {
        gLevel.HintsCnt--
        var cellType
        if (gBoard.isMine) {
            cellType = BOMB
        }
        else {
            cellType = gBoard[i][j].negsCount
        }
        findingNeighbors(elCell, gBoard, i, j, true, cellType)
        // setTimeout(function () { findingNeighbors(elCell, gBoard, i, j, false, '') }, 2000)
        hintsStatus = false
        // return
    }

    if (gameOver) return
    if (!gGame.isOn) return
    if (gBoard[i][j].isShown) return
    if (gBoard[i][j].isMarked) return
    if (firstClick) {
        buildMines(i, j)
        setMinesNegsCount()
        firstClickTimer = false
        startTimer()
        console.table(gBoard)
    }
    firstClick = false
    gBoard[i][j].isShown = true

    if (gBoard[i][j].isMine) {
        elCell.innerHTML = BOMB
        gLevel.LIVES--
        elCell.style.backgroundColor = 'orange'
        renderLives()
        gGame.markedCount++ // if clicked on BOMB and you have lives increase markedCount (selected flags)
        if (gLevel.LIVES === 0) {
            elCell.style.backgroundColor = 'red' // last life will be red background
            ifGameOver()
            return
        }
        return
    }
    elCell.innerText = gBoard[i][j].negsCount === 0 ? '' : gBoard[i][j].negsCount
    elCell.style.backgroundColor = 'white'
    // check if clicked cell==0 and activate recursion (expandShown)
    if (gBoard[i][j].negsCount === 0) {
        expandShown(elCell, i, j)
    }
}

function cellMarked(elCell, i, j) {
    if (gameOver) return
    if (!gGame.isOn) return
    console.log(gBoard[i][j].isMarked, gBoard[i][j].isShown);
    if (!gBoard[i][j].isShown) {
        if (!gBoard[i][j].isMarked) {
            elCell.innerHTML = FLAG
            gBoard[i][j].isMarked = true

            if (gBoard[i][j].isMine === gBoard[i][j].isMarked) {
                gGame.markedCount++
                if (gGame.markedCount === gLevel.MINES) {
                    var elWrong = document.querySelector('.game-over')
                    elWrong.innerText = 'YOU ARE A WINNER!!!'
                    elWrong.style.color = 'white'
                    var elReset = document.querySelector('.restart')
                    elReset.innerHTML = WIN
                    victory()
                    // clearInterval(gTimerInterval)
                }
            }
        }
        else { //if shown remove flag
            elCell.innerHTML = ' '
            gGame.markedCount--
            gBoard[i][j].isMarked = false
        }
    }
}

function expandShown(elCell, rowIdx2, colIdx2) {

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
    if (cell.negsCount === 0) {
        elCell.style.backgroundColor = 'white'
    }
    else elCell.innerText = cell.negsCount
    elCell.style.backgroundColor = 'white'
}


function ifGameOver() {
    var elWrong = document.querySelector('.game-over')
    elWrong.innerText = 'Game over'
    elWrong.style.color = 'white'
    var elReset = document.querySelector('.restart')
    elReset.innerHTML = LOOSE
    clearInterval(gTimerInterval)
    // elWrong.style.color = 'white'
    gameOver = true
    
}

function victory() {
    clearInterval(gTimerInterval)
    gGame.isOver = true
    gGame.isOn = false
}


function restart() {
    clearInterval(gTimerInterval)
    gameOver = false
    var levelGame = ''
    switch (gLevel.SIZE) {
        case 4:
            levelGame = 'Easy'
            break;
        case 8:
            levelGame = 'Medium'
            break;
        case 12:
            levelGame = 'Hard'
            break;
    }
    hintsStatus = false
    // console.log(gLevel.SIZE);
    changeBoard(levelGame)
    firstClickTimer = true
    firstClick = true
    var elSpan = document.querySelector('.timer')
    elSpan.innerText = '0'

    initGame()
    var elReset = document.querySelector('.restart')
    elReset.innerHTML = SMILE
}

function renderLives() {
    var elLives = document.querySelector('.lives')
    var strHTML = 'Lives: <br>'
    for (var i = 0; i < gLevel.LIVES; i++) {
        strHTML += LIFE
    }

    elLives.innerHTML = strHTML + '<br/>'
}