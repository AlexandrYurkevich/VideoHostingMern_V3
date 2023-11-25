import express from 'express';
import multer from 'multer';

const router = express.Router();
const createStorage = (folder) =>{
  return multer.diskStorage({
    destination: function (req, file, cb) { cb(null, `public/${folder}/`) },
    filename: function (req, file, cb) {
      const filename = `${Date.now()}_${file.originalname}`;
      cb(null, filename); 
    }
  });
}
const videoStorage = createStorage("videos")
const uploadVideo = multer({ storage: videoStorage });
router.post('/video', uploadVideo.single('video'), (req, res) => {
  res.send(req.file?.path.replace('public\\', ''));
});
  
const thumbnailStorage = createStorage("thumbnails")
const uploadThumbnail = multer({ storage: thumbnailStorage });
router.post('/thumbnail', uploadThumbnail.single('thumbnail'), (req, res) => {
  res.send(req.file?.path.replace('public\\', ''));
});

const avatarStorage = createStorage("avatars")
const uploadAvatar = multer({ storage: avatarStorage });
router.post('/avatar', uploadAvatar.single('avatar'), (req, res) => {
  res.send(req.file?.path.replace('public\\', ''));
});

const bannerStorage = createStorage("banners")
const uploadBanner = multer({ storage: bannerStorage });
router.post('/banner', uploadBanner.single('banner'), (req, res) => {
  res.send(req.file?.path.replace('public\\', ''));
});

export default router;