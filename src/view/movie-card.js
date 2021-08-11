import dayjs from 'dayjs';
export const createMovieCardTemplate = (singleMovie) => {

  const { filmInfo: { title, description, poster, total_rating, genre, runtime, release:{date}}, comments }  = singleMovie;
  function getTimeFromMins(time) {
    const hours = Math.trunc(time/60);
    const minutes = time % 60;
    return hours + 'h ' + minutes + 'm';
  }

  return `<article class="film-card">
  <h3 class="film-card__title">${title}</h3>
  <p class="film-card__rating">${total_rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${dayjs(date).format('YYYY')}</span>
    <span class="film-card__duration">${getTimeFromMins(runtime)}</span>
    <span class="film-card__genre">${genre}</span>
  </p>
  <img src="${poster}" alt="" class="film-card__poster">
  <p class="film-card__description">${description}</p>
  <a class="film-card__comments">${comments.length} comments </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
  </div>
</article>`;
};