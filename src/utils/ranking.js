const RankTypes = {
  '1': 'Novice',
  '11': 'Fan',
  '21': 'Movie Buff',
};
const getUserRank = (watchedMoviesAmount) => {
  const ratingLimits = Object.keys(RankTypes);
  let rank = null;
  for (let i = ratingLimits.length - 1; i >= 0; i--) {
    if (watchedMoviesAmount >= Number(ratingLimits[i])) {
      rank = RankTypes[ratingLimits[i]];
      break;
    }
  }
  return rank;
};
export {getUserRank};
