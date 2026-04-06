import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de imagem não suportado. Use PNG, JPG, WEBP ou SVG.'));
  }
};

export const logoUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

const contractFileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Formato não suportado. Use PDF, DOC ou DOCX.'));
  }
};

export const contractUpload = multer({
  storage,
  fileFilter: contractFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});
