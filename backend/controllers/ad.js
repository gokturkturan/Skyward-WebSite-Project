import S3 from "aws-sdk/clients/s3.js";
import SES from "aws-sdk/clients/ses.js";
import { nanoid } from "nanoid";
import slugify from "slugify";
import Ad from "../models/ad.js";
import User from "../models/user.js";
import NodeGeocoder from "node-geocoder";
import emailTemplate from "../helpers/email.js";

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
const awsSes = new SES(awsConfig);

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

const allAds = async (req, res) => {
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

const singleAd = async (req, res) => {
  try {
    const slug = req.params.slug;
    const ad = await Ad.findOne({ slug }).populate(
      "postedBy",
      "name username email phone company photo.Location"
    );

    const related = await Ad.find({
      _id: { $ne: ad._id },
      action: ad.action,
      type: ad.type,
      propertyType: ad.propertyType,
      address: {
        $regex: ad.googleMap[0].administrativeLevels.level1long,
        $options: "i",
      },
    })
      .limit(3)
      .select("-photos.Key -photos.key -photos.ETag -photos.Bucket -googleMap");

    res.status(200).json({ ad, related });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong. Try again." });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const ad = await Ad.findById(req.params.id);

    if (ad.postedBy.toString() === req.user.userId)
      return res.status(400).json({
        error: "This ad posted by you.",
      });

    if (user.wishlist.includes(req.params.id))
      return res
        .status(400)
        .json({ error: "This ad is already on your wishlist." });

    user.wishlist.push(req.params.id);
    const updatedWishlistUser = await user.save();
    const { password, resetCode, ...rest } = updatedWishlistUser._doc;
    res.status(200).json({ rest });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong. Try again." });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user.wishlist.includes(req.params.id)) {
      return res
        .status(400)
        .json({ error: "This ad is not already on your wihslist." });
    }

    const removeAdFromWishlist = user.wishlist.filter((id) => {
      return id.toString() !== req.params.id;
    });

    user.wishlist = removeAdFromWishlist;
    const updatedWishlistUser = await user.save();
    const { password, resetCode, ...rest } = updatedWishlistUser._doc;
    res.status(200).json({ rest });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong. Try again." });
  }
};

const contactSeller = async (req, res) => {
  try {
    const { name, email, phone, message, adId } = req.body;

    if (!message || !name || !email || !phone) {
      return res.status(400).json({ error: "Please fill the form." });
    }

    const ad = await Ad.findById(adId).populate("postedBy", "email");
    if (!ad) {
      return res.status(400).json({ error: "This ad was not found." });
    }

    if (ad.postedBy._id.toString() === req.user.userId)
      return res.status(400).json({
        error: "This ad posted by you.",
      });

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(400).json({ error: "User was not found." });
    }

    if (user.searchedProperties.includes(adId)) {
      return res
        .status(400)
        .json({ error: "A message has already been sent to this ad." });
    }

    user.searchedProperties.push(adId);
    await user.save();

    awsSes.sendEmail(
      emailTemplate(
        ad.postedBy.email,
        `<p>You have received a new customer message</p>
        <h4>Customer Details</h4>
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <p>Phone: ${phone}</p>
        <p>Message: ${message}</p>
    <a href="${process.env.CLIENT_URL}/ad/${ad.slug}"}>${ad.propertyType} in ${ad.address} for ${ad.action} ${ad.price}</a>`,
        email,
        `New Message Received`
      ),
      (err, data) => {
        if (err) {
          console.log(err);
          return res.status(400).json({ error: "Mail sending failed." });
        } else {
          return res.status(200).json({ message: "Mail sending successful." });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Something went wrong. Try again." });
  }
};

const userAds = async (req, res) => {
  try {
    const perPage = 2;
    const page = req.params.page ? req.params.page : 1;

    const total = await Ad.find({ postedBy: req.user.userId });

    const ads = await Ad.find({ postedBy: req.user.userId })
      .populate("postedBy", "name email username phone company")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).json({ ads, total: total.length });
  } catch (err) {
    console.log(err);
  }
};

const editAd = async (req, res) => {
  try {
    const { photos, price, address, propertyType, title } = req.body;

    const ad = await Ad.findById(req.params.id);

    const owner = req.user.userId == ad?.postedBy;

    if (!owner) return res.status(400).json({ error: "Permission denied" });

    const geo = await googleGeocoder.geocode(address);

    const updatedAd = await Ad.findByIdAndUpdate(req.params.id, {
      ...req.body,
      slug: slugify(`${propertyType}-${address}-${price}-${nanoid(6)}`),
      location: {
        type: "Point",
        coordinates: [geo[0].longitude, geo[0].latitude],
      },
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

const enquiredProperties = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const ads = await Ad.find({ _id: user.searchedProperties }).sort({
      createAd: -1,
    });
    res.status(200).json({ ads });
  } catch (err) {
    console.log(err);
  }
};

const wishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const ads = await Ad.find({ _id: user.wishlist }).sort({
      createAd: -1,
    });
    res.status(200).json({ ads });
  } catch (err) {
    console.log(err);
  }
};

const deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(400).json({ error: "This ad was not found." });

    const owner = req.user.userId === ad.postedBy;
    if (owner) return res.status(400).json({ error: "Permission denied." });

    await ad.deleteOne();
    res.status(200).json({ message: "Ad deleted successfully." });
  } catch (err) {
    console.log(err);
  }
};

const adController = {
  uploadImage,
  deleteImage,
  createAd,
  allAds,
  singleAd,
  addToWishlist,
  removeFromWishlist,
  contactSeller,
  userAds,
  editAd,
  enquiredProperties,
  wishlist,
  deleteAd,
};

export default adController;
