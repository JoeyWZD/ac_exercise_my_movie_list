const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movies = []
let filteredMovies = []

const datapanel = document.querySelector('#data-panel')

const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')



// 設定每一頁的數量為12個
const MOVIES_PER_PAGE = 12  

axios
  .get(INDEX_URL)
  .then(function (response) {
    // handle success
    movies.push(...response.data.results)
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPage(1))
  })

//監聽表單提交事件
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  // if (!keyword.length) {
  //   return alert('請輸入有效字串！')
  // }
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )
  //錯誤處理：無符合條件的結果
  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }
  //重製分頁器
  renderPaginator(filteredMovies.length)
  renderMovieList(getMoviesByPage(1))
})

// 監聽分頁被點擊到的狀況
paginator.addEventListener('click', function onPaginatorClicked(event) {
  //如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== 'A') return
  //透過 dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page)
  //更新畫面
  renderMovieList(getMoviesByPage(page))
})

// 設定函式來更新資料 
function renderMovieList(data) {
  let rawhtml = ''
  data.forEach(item => {
    rawhtml += `<div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src=${POSTER_URL + item.image}
              class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title"> ${item.title}</h5>
              <div class="card-footer">
                <button class="btn btn-primary btn-show-more" data-id="${item.id}" data-bs-toggle="modal"
                  data-bs-target="#moviemodal">More</button>
                <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
`
  });
  datapanel.innerHTML = rawhtml
}
// 加入我的最愛 的函式 目的:「將使用者點擊到的那一部電影送進 local storage 儲存起來」
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

// 在more按鈕上設定監聽器，改變modal的資料
datapanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-more')) {
    showMovieModal(Number(event.target.dataset.id))
  }else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

// 函式：計算該分頁顯示的電影
function getMoviesByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies
  //計算起始 index 
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  //回傳切割後的新陣列
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function renderPaginator(amount) {
  //計算總頁數
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  //製作 template 
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  //放回 HTML
  paginator.innerHTML = rawHTML
}


function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDescription = document.querySelector('#movie-modal-description')
  axios
    .get(INDEX_URL + id)
    .then((response) => {
      const data = response.data.results
      modalTitle.innerText = data.title
      modalDate.innerText = 'Release-Date : ' + data.release_date
      modalDescription.innerText = data.description
      modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid">`
    })
}

