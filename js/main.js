'use strict'

const EMPTY = ''
const BOMB = '💣'
const FLAG = '🚩'

var gBoard
var gIntervalTime

var gLevel = {
    SIZE: 4,
    MINES: 2,
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    startTime: 0,
}


function initGame() {
    gGame.isOn = false
    gGame.shownCount = 0
    gGame.startTime = 0
    gGame.markedCount = 0

    gBoard = buildBoard()
    console.log(gBoard)
    renderBoard(gBoard)
}

function buildBoard(rowIdx = 0, colIdx = 0) {
    var board = createMat(gLevel.SIZE)
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                isMine: false,
                negsCount: 0,
                isMarked: false,
                isShown: false,
            }
        }
    }

    for (var i = 0; i < gLevel.MINES; i++) {

        var randIdxRow = getRandomInt(0, gLevel.SIZE - 1)
        var randIdxCol = getRandomInt(0, gLevel.SIZE - 1)
        if (randIdxRow === rowIdx, randIdxCol === colIdx) {
            i--
            continue
        }
        if (board[randIdxRow][randIdxCol].isMine === true) i--
        board[randIdxRow][randIdxCol].isMine = true
    }
    setMinesNegCount(board)
    return board
}

function setMinesNegCount(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {

            if (board[i][j].isMine) continue

            var currCellNegsCount = negsCount(board, i, j)
            board[i][j].negsCount = currCellNegsCount
        }
    }
}

function negsCount(board, rowIdx, colIdx) {
    var cnt = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board.length) continue
            if (i === rowIdx && j === colIdx) continue

            if (board[i][j].isMine) cnt++
        }
    } return cnt
}


function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var className = `cell cell-${i}-${j} `
            strHTML += `<td class="${className}" 
                            onmousedown="cellClicked(event, this,${i},${j})"
                            >  </td>`
        }
        strHTML += '</tr>'
    }
    strHTML += ''
    var elBoard = document.querySelector(".board")
    elBoard.innerHTML = strHTML
}


function startGame(rowIdx, colIdx) {
    gGame.isOn = true
    gBoard = buildBoard(rowIdx, colIdx)
    renderBoard(gBoard)
    gGame.startTime = Date.now()
    gIntervalTime = setInterval(showTime, 24)

}

//flag
function cellClicked(event, elCell, i, j) {
    if (!gGame.isOn) startGame(elCell, i, j)
    if (event.button === 2) {
        elCell.innerText = gBoard[i][j].isMarked ? '' : FLAG
        if (gBoard[i][j].isMarked) {
            gBoard[i][j].isMarked = false
            gGame.markedCount--
        } else {
            gBoard[i][j].isMarked = true
            gGame.markedCount++
        }
        ifVictory()
        return
    } else if (event.button === 0)
        if (gBoard[i][j].isShown || gBoard[i][j].isMarked) return
    elCell.style.backgroundColor = 'grey'
    showCell(elCell, i, j)
}


function ifVictory() {

    if (gGame.markedCount === gLevel.MINES &&
        gGame.shownCount === gLevel.SIZE ** 2 - gLevel.MINES) {
        gGame.isOn = false
        clearInterval(gIntervalTime)
        showModal('Victorious')
    }
}

function gameOver() {
    clearInterval(gIntervalTime)
    gGame.isOn = false
    showModal('You Lost')
}


function showModal(msg) {
    var elModal = document.querySelector('.modal')
    elModal.style.display = "block"
    var elMsg = document.querySelector('.modal p')
    elMsg.innerText = msg
}


function showCell(elCell, rowIdx, colIdx) {

    if (gBoard[rowIdx][colIdx].isMine) {
        elCell.innerText = BOMB
        return gameOver()
    }

    gBoard[rowIdx][colIdx].isShown = true
    gGame.shownCount++

    var text = (gBoard[rowIdx][colIdx].negsCount) ? gBoard[rowIdx][colIdx].negsCount : ''
    elCell.innerText = text

    if (gBoard[rowIdx][colIdx].negsCount === 0) changeBoard(gBoard, elCell, rowIdx, colIdx)
    ifVictory()
}


function changeBoard(board, elCell, rowIdx, colIdx) {


}


function showTime() {
    var time = ((Date.now() - gGame.startTime) / 1000).toFixed()
    var elTime = document.querySelector(".timer")
    elTime.innerText = time
}

function chooseLevel(elBtn) {
    var newBorderSize = elInput.value ** 0.5
    if (gLevel.SIZE === +newBorderSize) return

    if (newBorderSize === 5) gLevel.MINES = 3
    if (newBorderSize === 6) gLevel.MINES = 5

    gLevel.SIZE = newBorderSize
    gBoard = buildBoard()
    renderBoard(gBoard)
}

function restart() {
    var elModal = document.querySelector('.modal')
    elModal.style.display = "none"
    initGame()
}


