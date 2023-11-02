import S3 from "aws-sdk/clients/s3.js";
import { nanoid } from "nanoid";

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
  region: "eu-north-1",
  apiVersion: "2010-12-01",
};

const awsS3 = new S3(awsConfig);

const uploadImage = (req, res) => {
  try {
    const { image } = req.body;

    const base64Image = new Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const type = image.split(";")[0].split("/")[1];

    const params = {
      Bucket: "skywards3",
      Key: `${nanoid()}.${type}`,
      Body: base64Image,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: `image/${type}`,
    };

    awsS3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        res.status(400).json({ error: "Upload failed. Try again." });
      } else {
        res.status(200).json(data);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Upload failed. Try again." });
  }
};

const deleteImage = (req, res) => {
  try {
    const { Key, Bucket } = req.body;
    awsS3.deleteObject({ Bucket, Key }, (err, data) => {
      if (err) {
        console.log(err);
        res.status(400).json({ error: "Deletion failed. Try again." });
      } else {
        res.status(200).json({ message: "Deletion successful." });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Deletion failed. Try again." });
  }
};

const adController = {
  uploadImage,
  deleteImage,
};

export default adController;
