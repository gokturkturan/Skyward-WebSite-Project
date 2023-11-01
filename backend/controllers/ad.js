const uploadImage = (req, res) => {
  return res.status(200).json(req.body.image);
};

const adController = {
  uploadImage,
};

export default adController;
