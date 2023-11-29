import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

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
const uploadThumbnail = multer({ limits: { fileSize: 4 * 1024 * 1024 }, storage: thumbnailStorage });
router.post('/thumbnail', uploadThumbnail.single('thumbnail'), (req, res) => {
  res.send(req.file?.path.replace('public\\', ''));
});

const avatarStorage = createStorage("avatars")
const uploadAvatar = multer({ limits: { fileSize: 2 * 1024 * 1024 }, storage: avatarStorage });
router.post('/avatar', uploadAvatar.single('avatar'), (req, res) => {
  res.send(req.file?.path.replace('public\\', ''));
});

const bannerStorage = createStorage("banners")
const uploadBanner = multer({ limits: { fileSize: 4 * 1024 * 1024 }, storage: bannerStorage });
router.post('/banner', uploadBanner.single('banner'), (req, res) => {
  res.send(req.file?.path.replace('public\\', ''));
});

const deleteByUrl = async (req, res) => {
  try {
    req.query.del_url && fs.unlinkSync(`${__dirname}\\public\\${req.query.del_url}`)
    res.status(200).json(true);
  } catch (err) { res.status(500).json(err); }
}
router.delete('/', deleteByUrl)

export default router;