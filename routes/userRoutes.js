import express from "express"
import { authUser, logoutUser, getUserProfile, updateUserProfile, refreshToken, homeBanner, getHomeBanner, addProjectFiles, viewProjectFiles, deleteProjectFiles, activateHomeBanner, AddProject, NearbyPlaces, AddAmenitiesGlobal, ViewAmenities, UploadMarketingMaterial, ProjectOffers, ProjectPayments, ProjectCommision, registerChannelPartner, registerBroker, projectFilter, ProjectDraft, viewAllProjects, CompareProjects, WatchLatersProject, WatchLaterView, get_commonproject } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import { ChannelPartnerAndBrokerChecker, adminChecker } from "../middleware/adminMiddleware.js";
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from "../config/cloudinary.js";



const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let folder;
        if (file.mimetype.startsWith('image/')) {
            folder = 'uploads/project/images';
        } else if (file.mimetype === 'video/mp4') {
            folder = 'uploads/project/videos';
        } else if (file.mimetype === 'application/pdf' || file.mimetype === 'application/msword') {
            folder = 'uploads/project/documents';
        } else {
            throw new Error('Invalid file type');
        }

        return {
            folder: folder,
            public_id: Date.now() + '-' + file.originalname,
            resource_type: 'auto',
        };
    },
});

// const homestorages = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'uploads/project/homebanner',
//         format: async (req, file) => 'png',
//         public_id: (req, file) => Date.now() + '-' + file.originalname,
//     }
// })

const homestorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      const ext = file.mimetype.split('/')[1];
      const publicId = `${Date.now()}-${file.originalname}`;
      return {
        folder: 'uploads/project/homebanner',
        format: ext,
        public_id: publicId,
      };
    },
  });


const UserStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads/user',
        format: async (req, file) => 'png', // supports promises as well
        public_id: (req, file) => Date.now() + '-' + file.originalname,
    },
});



const fileFilter = function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'application/pdf', 'application/msword'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, PNG, and MP4 files are allowed'));
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
const userupload = multer({ storage: UserStorage });
const homebannerUpload = multer({ storage: homestorage, fileFilter: fileFilter });


const router = express.Router()



router.post('/channel-partner-register', userupload.single('images'), registerChannelPartner)
router.post('/register-broker', userupload.single('images'), registerBroker)
router.post('/logout', logoutUser)
router.post('/auth', authUser)
router.post('/refreshToken', refreshToken)
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)
router.post('/homebanner', protect, adminChecker, homebannerUpload.array('images'), homeBanner)
router.get('/homebanner', getHomeBanner)
router.post('/activatehomebanner', protect, adminChecker, activateHomeBanner)
router.post('/addProjectFiles', protect, adminChecker, upload.array('images', 10), addProjectFiles)
router.post('/viewProjectFiles', protect, adminChecker, viewProjectFiles)
router.post('/deleteProjectFiles', protect, adminChecker, deleteProjectFiles)
router.post('/addproject', protect, adminChecker, upload.single('images'), AddProject)
router.post('/addplaces', protect, adminChecker, NearbyPlaces)
router.post('/addamenitiesglobal', protect, adminChecker, AddAmenitiesGlobal)
router.post('/viewaminities', protect, adminChecker, ViewAmenities)
router.post('/uploadmarketingmaterial', protect, adminChecker, upload.single('images'), UploadMarketingMaterial)
router.post('/projectoffer', protect, adminChecker, ProjectOffers)
router.post('/projectpaymets', protect, adminChecker, ProjectPayments)
router.post('/projectcommission', protect, adminChecker, ProjectCommision)
router.post('/projectFilter', projectFilter)
router.get('/projectdraft', protect, adminChecker, ProjectDraft)
router.get('/viewallprojects', protect, adminChecker, viewAllProjects)
router.post('/compareprojects', CompareProjects)
router.post('/watchlatersproject', protect, ChannelPartnerAndBrokerChecker, WatchLatersProject)
router.get('/watchlaterview', protect, ChannelPartnerAndBrokerChecker, WatchLaterView)


export default router;
