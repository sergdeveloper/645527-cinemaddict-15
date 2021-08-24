import { generateComments } from './comment.js';
import { getRandomInteger } from '../utils/common.js';

const descriptionText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

const descriptionArray = descriptionText.split('. ');

export const generateMovie = () => {
  return {
    id: getRandomInteger (0, 100),
    comments: generateComments(),
    filmInfo: {
      title: 'A Little Pony Without The Carpet',
      alternative_title: 'Laziness Who Sold Themselves',
      total_rating: 5.3,
      poster: "images/posters/the-man-with-the-golden-arm.jpg",
      age_rating: 0,
      director: "Tom Ford",
      writers: [
        "Takeshi Kitano",
      ],
      actors: [
        "Morgan Freeman",
      ],
      release: {
        date: "2019-05-11T00:00:00.000Z",
        release_country: "Finland",
      },
      runtime: 77,
      genre: [
        "Comedy",
      ],
      description: descriptionArray.slice(0, getRandomInteger(1,5)),
    },
    user_details: {
      watchlist: false,
      already_watched: true,
      watching_date: "2019-04-12T16:12:32.554Z",
      favorite: false,
    },
  };
};

