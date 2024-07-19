export const mongooseSaveError = (error, data, next) => {
  console.log(error);
  const { name, code } = error;
  error.staus = name === 'MongoServerError' && code === 11000 ? 409 : 400;
  next();
};

export const setUpdateSettings = function (next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
};
