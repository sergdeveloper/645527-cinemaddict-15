import MoviesModel from '../model/movies';
import {isOnline} from '../utils/common';
const getSyncedMovies = (items) => {items.filter(({success}) => success)
  .map(({payload}) => payload.movie);
};
const createStoreStructure = (items) => {items.reduce((acc, current) => {Object.assign({}, acc, {
  [current.id]: current,
});
}, {});
};
export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getmovies() {
    if (isOnline()) {
      return this._api.getmovies()
        .then((movies) => {
          const items = createStoreStructure(movies.map(MoviesModel.adaptToServer));
          this._store.setItems(items);
          return movies;
        });
    }
    const storeMovies = Object.values(this._store.getItems());
    return Promise.resolve(storeMovies.map(MoviesModel.adaptToClient));
  }

  updateMovie(movie) {
    if (isOnline()) {
      return this._api.updateMovie(movie)
        .then((updatedmovie) => {
          this._store.setItem(updatedmovie.id, MoviesModel.adaptToServer(updatedmovie));
          return updatedmovie;
        });
    }
    this._store.setItem(movie.id, MoviesModel.adaptToServer(Object.assign({}, movie)));
    return Promise.resolve(movie);
  }

  getComments(movieId) {
    if (isOnline()) {
      return this._api.getComments(movieId)
        .then((comments) => comments);
    }
    return Promise.resolve([]);
  }

  addComment(movie, comment) {
    if (isOnline()) {
      return this._api.addComment(movie, comment)
        .then((response) => response);
    }
    return Promise.reject();
  }

  deleteComment(commentId) {
    if (isOnline()) {
      return this._api.deleteComment(commentId)
        .then((response) => response);
    }
    return Promise.reject();
  }

  sync() {
    if (isOnline()) {
      const storeMovies = Object.values(this._store.getItems());
      return this._api.sync(storeMovies)
        .then((response) => {
          const updatedMovies = getSyncedMovies(response.updated);
          const items = createStoreStructure([...updatedMovies]);
          this._store.setItems(items);
        });
    }
    return Promise.reject(new Error('Sync data failed'));
  }
}
