import Abstract from './abstract';
import {getAlreadywatchedMoviesAmount} from '../utils/movie-func';
import {getUserRank} from '../utils/ranking';
const createRatingTemplate = (watchedMoviesAmount) => {
  const rank = getUserRank(watchedMoviesAmount);
  return rank ? `<p class="profile__rating">${rank}</p>` : '';
};
const createUserProfileTemplate = (movies) => {
  const watchedMoviesAmount = getAlreadywatchedMoviesAmount(movies);
  if (!watchedMoviesAmount) {
    return ' ';
  }
  const ratingTemplate = createRatingTemplate(watchedMoviesAmount);
  return `<section class="header__profile profile">
    ${ratingTemplate}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};
export default class UserProfile extends Abstract {
  constructor(movies) {
    super();
    this._movies = movies;
  }

  getTemplate() {
    return createUserProfileTemplate(this._movies);
  }
}
