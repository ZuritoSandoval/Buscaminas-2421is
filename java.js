const WIDTH = 5,
  BOARD_SIZE = 100,
  SQUARES = [],
  BOMB_AMOUNT = 4 

const gameContainer = document.querySelector('.game-container')

let gameActive = true,
  flags = 0

  console.log("Creado por Fernando")
function createBoard() {
  console.log("Creacion de bombas de manera aletoria")
  const bombsArr = Array(BOMB_AMOUNT).fill(true)
  const noBombsArr = Array(BOARD_SIZE - BOMB_AMOUNT).fill(false)
  const gameArr = [...noBombsArr, ...bombsArr].sort(() => Math.random() - 0.50)

  for(let i = 0; i < BOARD_SIZE; i++) {
    const square = document.createElement('div')
    square.setAttribute('id', i)
    square.className = (gameArr[i]) ? 'bomb': ''
    gameContainer.appendChild(square) 
    SQUARES.push(square)

    square.addEventListener('click', event => handleCellClick(event.target))
    square.addEventListener('contextmenu', event => {
      event.preventDefault()
      addFlag(event.target)
    })
  }

  for(let i = 0; i < BOARD_SIZE; i++) {
    console.log("Numeros de bombas")
    let total = 0
    const isInLeftSide = (i % WIDTH) === 0 
    const isInRightSide = (i % WIDTH) === (WIDTH - 1) 
    if(SQUARES[i].className === '') {
      if(i > 0 && !isInLeftSide && SQUARES[i - 1].classList.contains('bomb')) total++ 
      if(i > 9 && !isInRightSide && SQUARES[i + 1 - WIDTH].classList.contains('bomb')) total++ 
      if(i > 10 && SQUARES[i - WIDTH].classList.contains('bomb')) total++ 
      if(i > 11 && !isInLeftSide && SQUARES[i - 1 - WIDTH].classList.contains('bomb')) total++ 
      if(i < 98 && !isInRightSide && SQUARES[i + 1].classList.contains('bomb')) total++ 
      if(i < 90 && !isInLeftSide && SQUARES[i - 1 + WIDTH].classList.contains('bomb')) total++ 
      if(i < 88 && !isInRightSide && SQUARES[i + 1 + WIDTH].classList.contains('bomb')) total++
      if(i < 89 && SQUARES[i + WIDTH].classList.contains('bomb')) total++ 
      SQUARES[i].setAttribute('data-total', total)
      console.log(SQUARES[i])
    }
  }
}

createBoard()

function handleCellClick(square) {
  console.log("Funcion de clic de mina")
  if(!gameActive) return
  if(square.classList.contains('checked')) return
  if(square.classList.contains('bomb')) {
    gameOver(square)
  } else {
    let total = square.getAttribute('data-total')
    if(total != 0) {
      square.className = 'checked'
      square.innerText = total
      addColorText(square, total)
    } else {
      checkNeighbordSquares(square, square.id)
      square.className = 'checked'
    }
  }
}

function addColorText(square, total) {
  console.log("Se añade el color de las casillas (numeros)")
  let color = ''
  if(total == 1) {
    color = 'txt-blue'
  } else if (total == 2) {
    color = 'txt-green'
  } else if (total == 3) {
    color = 'txt-red'
  } else if (total == 4) {
    color = 'txt-purple'
  }
  square.classList.add(color)
}

function checkNeighbordSquares(square, currentId) {
  const isInLeftSide = (currentId % WIDTH) === 0 
  const isInRightSide = (currentId % WIDTH) === (WIDTH - 1) 

  setTimeout(() => {
    if(currentId > 0 && !isInLeftSide ) {
      const newId = SQUARES[parseInt(currentId) - 1].id,
        newSquare = document.getElementById(newId)
        handleCellClick(newSquare)
    }
    if(currentId > 9 && !isInRightSide) {
      const newId = SQUARES[parseInt(currentId) + 1 - WIDTH].id
      newSquare = document.getElementById(newId)
      handleCellClick(newSquare)
    }
    if(currentId > 10) {
      const newId = SQUARES[parseInt(currentId) - WIDTH].id
      newSquare = document.getElementById(newId)
      handleCellClick(newSquare)
    }
    if(currentId > 11 && !isInLeftSide) {
      const newId = SQUARES[parseInt(currentId) - 1 - WIDTH].id
      newSquare = document.getElementById(newId)
      handleCellClick(newSquare)    }
    if(currentId < 98 && !isInRightSide) {
      const newId = SQUARES[parseInt(currentId) + 1].id
      newSquare = document.getElementById(newId)
      handleCellClick(newSquare)
    }
    if(currentId < 90 && !isInLeftSide) {
      const newId = SQUARES[parseInt(currentId) - 1 + WIDTH].id
      newSquare = document.getElementById(newId)
      handleCellClick(newSquare)
    }
    if(currentId < 88 && !isInRightSide) {
      const newId = SQUARES[parseInt(currentId) + 1 + WIDTH].id
      newSquare = document.getElementById(newId)
      handleCellClick(newSquare)
    }
    if(currentId < 89) {
      const newId = SQUARES[parseInt(currentId) + WIDTH].id
      newSquare = document.getElementById(newId)
      handleCellClick(newSquare)
    }
  }, 100)
}

function gameOver() {
  console.log("Mina encontrada")
  alert('Encontraste una MINA :(')
  gameActive = false
  for(const square of SQUARES) {
    if(square.classList.contains('bomb')) {
      square.innerHTML = '&#128163;'
    }
  }
}

function addFlag(square) {
  if(!gameActive) return
  if(!square.classList.contains('checked') && (flags < BOMB_AMOUNT)) {
    if(!square.classList.contains('flag')) {
      square.classList.add('flag')
      square.innerHTML = '&#9873;'
      flags++
      handleFlags()
    } else {
      square.classList.remove('flag')
      square.innerHTML = ''
      flags--
    }
  }
}

function handleFlags() {
  let matches = 0
  for(const square of SQUARES) {
    if(square.classList.contains('flag') && square.classList.contains('bomb')) {
      matches++
    }
    if(matches === BOMB_AMOUNT) {
      gameActive = false
      alert('Eres el ganador!!!!')
      break
    }
  }
}