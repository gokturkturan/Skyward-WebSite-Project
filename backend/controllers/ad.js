import S3 from "aws-sdk/clients/s3.js";
import { nanoid } from "nanoid";
import slugify from "slugify";
import Ad from "../models/ad.js";
import User from "../models/user.js";
import NodeGeocoder from "node-geocoder";

const options = {
  provide: "google",
  apiKey: "",
  formatter: null,
};

const googleGeocoder = NodeGeocoder(options);

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
    res.status(500).json({ error: "Something went wrong. Try again." });
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
    res.status(500).json({ error: "Something went wrong. Try again." });
  }
};

const createAd = async (req, res) => {
  try {
    const { photos, price, address, propertyType, title } = req.body;

    if (!photos?.length) {
      return res.status(400).json({
        error: "You must upload the photos of property you will sell.",
      });
    }
    if (!price) {
      return res
        .status(400)
        .json({ error: "You must enter the price of property you will sell." });
    }
    if (!propertyType) {
      return res
        .status(400)
        .json({ error: "You must choose the type of property you will sell." });
    }
    if (!address) {
      return res.status(400).json({
        error: "You must enter the address of property you will sell.",
      });
    }
    if (!title) {
      return res.status(400).json({
        error:
          "You must enter the title of the ad of the property you will sell.",
      });
    }

    const geo = await googleGeocoder.geocode(address);

    const ad = await new Ad({
      ...req.body,
      postedBy: req.user.userId,
      location: {
        type: "Point",
        coordinates: [geo?.[0]?.longitude, geo?.[0]?.latitude],
      },
      googleMap: geo,
      slug: slugify(`${propertyType}-${address}-${price}-${nanoid(6)}`),
    }).save();

    // user role change
    const user = await User.findById(req.user.userId);
    if (user.role !== "Seller") {
      user.role = "Seller";
    }

    const newUser = await user.save();
    newUser.password = undefined;
    newUser.resetCode = undefined;

    res.status(200).json({ ad, newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong. Try again." });
  }
};

const AllAds = async (req, res) => {
  try {
    const adsForSell = await Ad.find({ action: "sell" })
      .select("-googleMap -location -photo.Key -photo.key -photo.ETag")
      .sort({ createdAt: -1 })
      .limit(12);

    const adsForRent = await Ad.find({ action: "rent" })
      .select("-googleMap -location -photo.Key -photo.key -photo.ETag")
      .sort({ createdAt: -1 })
      .limit(12);

    res.status(200).json({ adsForSell, adsForRent });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong. Try again." });
  }
};

const adController = {
  uploadImage,
  deleteImage,
  createAd,
  AllAds,
};

export default adController;
