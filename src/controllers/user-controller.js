const userController = {};

userController.updateProfileOrCoverImage = async (req, res, next) => {
  try {
    console.log(req.file);
    console.log('**************');
    console.log(req.files);
    console.log('---------------');
    console.log(req.body);
    res.json('enddddd');
  } catch (err) {
    next(err);
  }
};

module.exports = userController;
