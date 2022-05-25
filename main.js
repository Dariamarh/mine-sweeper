'use strict'

const EMPTY = ''
const BOMB = '💣'
const FLAG = '🚩'

var currIdx = 1
var gTimerInterval
var gBoard 

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function initGame() {
    gGame.isOn = true   
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.startTime = 0 
    gBoard = buildBoard()
    console.table(gBoard)
    renderBoard(gBoard)
}

function resetGame() {
    // var gFlagCounter = 0
    gBoard = buildBoard()
    renderBoard(gBoard)
}


function buildBoard() {
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

        if (board[randIdxRow][randIdxCol].isMine === true)
            i--
        board[randIdxRow][randIdxCol].isMine = true
    }
    setMinesNegsCount(board)
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var classList = board[i][j].isShown ? '' : 'hidden'
            var cell = board[i][j].isMine === true ? 'BOMB' : board[i][j].negsCount
            strHTML +=
                `\t<td id="cell-${i}-${j}"
        class="cell ${classList}"
        onclick="cellClicked(this , ${i}, ${j}, ${cell})"
        oncontextmenu="cellMarked(event, this)"></td>\n`;
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    var elBoard = document.querySelector(".board")
    elBoard.innerHTML = strHTML
}


function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine) continue
            var currNegsCount = negsCount(board, i, j)
            board[i][j].negsCount = currNegsCount
        }
    }

}

function cellClicked(elCell, i, j, content) {
    if (gGame.isOn) {
        gGame.isOn = true
        startTimer()
    }
    if (gBoard[i][j].isShown) return
    if (gBoard[i][j].isMarked) return

    gBoard[i][j].isShown = true
    elCell.innerText = content
    elCell.classList.remove('hidden')

    checkGameOver()

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


function cellMarked(elCell, i, j) {
    if (!gBoard[i][j].isShown) {
        if (!gBoard[i][j].isMarked) {
            elCell.innerText = FLAG
            gGame.markedCount++
            gBoard[i][j].isMarked = true
        } else {
            elCell.innerText = ' '
            gGame.markedCount--
            gBoard[i][j].isMarked = false
        }

        checkGameOver()
    }
}



function checkGameOver() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var currCell = gBoard[i][j]
            if (!currCell.isMine && currCell.isMarked) return false
            if (currCell.isMine && !currCell.isMarked) return false
        }
    }
    return true

}

function expandShown(board, elCell, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board.length) continue
            if (i === rowIdx && j === colIdx) continue
            if (i === rowIdx - 1 && j === colIdx - 1) continue
            if (i === rowIdx - 1 && j === colIdx + 1) continue
            if (i === rowIdx + 1 && j === colIdx - 1) continue
            if (i === rowIdx + 1 && j === colIdx + 1) continue
            if (board[i][j].isShown ||
                gBoard[i][j].isMarked ||
                gBoard[i][j].isMine) continue

            var elShownCell = document.querySelector(`.cell-${i}-${j}`)
            showCell(elShownCell, i, j)

            if (board[i][j].negsCount === 0) {
                expandShown(board, elCell, i, j)
            }
        }
    }

}


function showCell(elCell, rowIdx, colIdx){

    if (gBoard[rowIdx][colIdx].isMine) {
        return checkGameOver()
    }

    gBoard[rowIdx][colIdx].isShown = true
    gGame.shownCount++
    var text =  (gBoard[rowIdx][colIdx].negsCount ) ? gBoard[rowIdx][colIdx].negsCount : ''
    // elCell.innerText = text
    // elCell.style.backgroundColor = 'white'

    if (gBoard[rowIdx][colIdx].negsCount === 0 ) 
    expandShown(gBoard, elCell, rowIdx, colIdx)

    checkVictory ()
}

function changeBoard(elInput) {
    var newBorderSize = elInput.value ** 0.5
    if (gLevel.SIZE === +newBorderSize) return

    if (newBorderSize === 5) gLevel.MINES = 3
    if (newBorderSize === 6) gLevel.MINES = 5

    gLevel.SIZE = newBorderSize

    resetGame()
}

function checkVictory () {

    if (gGame.markedCount === gLevel.MINES && 
        gGame.shownCount === gLevel.SIZE**2 - gLevel.MINES ) {
        console.log('Win!!')
        gGame.isOn = false
        clearInterval(gIntervalTime)
        showModal('You Won!! ')

        }

}
function showModal(msg){
    var elModal = document.querySelector('.modal')
    elModal.style.display = "block"
    var elMsg = document.querySelector('.modal p')
    elMsg.innerText = msg


}

function restart(){
    var elModal = document.querySelector('.modal')
    elModal.style.display = "none"
    initGame()
}
