const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = JSON.parse(localStorage.getItem('favoriteMovies'))|| []
const datapanel = document.querySelector('#data-panel')

const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

let filteredMovies = []


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
                <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
              </div>
            </div>
          </div>
        </div>
      </div>
`
  });
  datapanel.innerHTML = rawhtml
}

// 在more按鈕上設定監聽器，改變modal的資料
datapanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-more')) {
    showMovueModal(Number(event.target.dataset.id))
  }else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

function removeFromFavorite(id){
  if (!movies || !movies.length) return

  //透過 id 找到要刪除電影的 index
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if (movieIndex === -1) return 
  //刪除該筆電影
  movies.splice(movieIndex, 1)

  //存回 local storage
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))

  //更新頁面
  renderMovieList(movies)

}

function showMovueModal(id) {
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

renderMovieList(movies)