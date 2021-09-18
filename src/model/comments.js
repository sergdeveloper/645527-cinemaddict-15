import Observer from '../utils/observer';
export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  getComments() {
    return this._comments;
  }

  addComment(updateType, update) {
    this._comments = update.comments.slice();
    this._notify(updateType, update.movie);
  }

  deleteComment(updateType, updateMovie, updateId) {
    const index = this._comments.findIndex((comment) => comment.id === updateId);
    if (index === -1) {
      throw new Error('Cant delete comment');
    }
    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1),
    ];
    updateMovie.comments = this._comments.map((comment) => comment.id);
    this._notify(updateType, updateMovie);
  }

  static adaptToClient(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        content: comment.comment,
      },
    );
    delete adaptedComment.comment;
    return adaptedComment;
  }

  static adaptToServer(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        comment: comment.content,
      },
    );
    delete adaptedComment.content;
    return adaptedComment;
  }
}
