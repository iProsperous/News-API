const url = 'https://iprosperous.github.io/News-API/';

function customHttp() {
  return {
    get(url, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        xhr.send();
      } catch (error) {
        cb(error);
      }
    },
    post(url, body, headers, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        xhr.send(JSON.stringify(body));
      } catch (error) {
        cb(error);
      }
    },
  };
}
// Init http module
const http = customHttp();




const newsService = (function() {
  const apiKey = '49270792686b4d7eacd9023faaf7e133';
  const apiUrl = 'https://newsapi.org/v2/';

  return {
    topHeadlines(country = "ru", callback) {
      http.get(`${apiUrl}/top-headlines?country=${country}&category=technology&apiKey=${apiKey}`, callback);
    },
    everything(query, callback) {
      http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, callback);
    },
  };

})();

const form = document.forms['newsControls'];
const countrySelect = form.elements['country'];
const searchInput = form.elements['search'];

form.addEventListener('submit', (e) => {
  e.preventDefault();
  loadNews();
})

document.addEventListener("DOMContentLoaded", function(){
  
  loadNews();
});

function loadNews() {
  const country = countrySelect.value;
  const searchText = searchInput.value;

  if (!searchText) {
  newsService.topHeadlines(country, onGetResponse);
  } else {
  newsService.everything (searchText, onGetResponse);
  }
}

function onGetResponse(err, res) {
 // console.log (res);
  renderNews(res.articles);
}

function renderNews(news) {
 const newsContainer = document.querySelector('.content');
 if (newsContainer.children.length) {
  clearContainer(newsContainer);
 }
 let fragment='';

 news.forEach(newsItem => {
    const element = newsTemplate(newsItem);
    fragment +=element;
 });

 //newsContainer.insertAdjacentHTML('afterbegin', fragment);
 console.log(fragment);
 newsContainer.insertAdjacentHTML('afterbegin', fragment);
}

function clearContainer(container) {
  let child = container.lastElementChild;
  while(child) {
    container.removeChild(child);
    child = container.lastElementChild;
  }
}

function newsTemplate({ urlToImage, title, url, description }) {
  return `
    <div>
      <div class="card">
        <div class="card-image">
          <img src="${urlToImage}">
          <p class="card-title text-shadow">${title || ''}</p>
        </div>
        <div class="card-content">
          <p>${description || ''}</p>
        </div>
        <div class="card-action">
          <a href="${url}">Подробнее...</a>
        </div>
      </div>
    </div>
    `
}
