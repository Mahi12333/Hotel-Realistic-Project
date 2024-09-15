import express from "express"

import {GetMyFeeds, GetMyFeedsDraft, getHomeBannerSlider, AddLikesFeeds, homeBannerSliders, Create_folder, file_upload_folder, Get_folder, Get_file, Delete_folder, Delete_file, create_myfeeds, save_letter_myfeeds, getFeedDetails_byid, deleteFeed, updatedFeed, Delete_folder_byId, Preview_folder_byId, updated_folder, CreateLikesFeed, create_myheighlight, save_letter_myhighlight, get_highLightDetails_byid, deleteHighlight, updatedHighlight, AddLikesHighlight, Publish_Highlight, feedsActivate, highlightActivate, Publish_Feeds, Add_ShareFeeds, Add_ShareHighlight, detailsImage, updatedimagefile, ActivefetchFeeds_highlight, InActivefetchFeeds_highlight, Draft_fetchFeeds_highlight, GetMyFeedsCount_highlight } from "../controllers/ramController.js";

import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import { adminChecker } from "../middleware/adminMiddleware.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";


const storagefeedsimg = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const ext = file.mimetype.split('/')[1];
        const publicId = `${Date.now()}-${file.originalname}`;
        
        return {
            folder: 'uploads/myfeeds',
            format: ext,
            public_id: publicId,
            resource_type: file.mimetype.startsWith('video/') ? 'video' : 'image' 
        };
    },
});

const homebannersliderimg = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads/slider',
        format: async (req, file) => 'png', // supports promises as well
        public_id: (req, file) => Date.now() + '-' + file.originalname,
    },
});


const folderimg = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const ext = file.mimetype.split('/')[1];
        const publicId = `${Date.now()}-${file.originalname}`;
        
        return {
            folder: 'uploads/mylibrary',
            format: ext,
            public_id: publicId,
            resource_type: file.mimetype.startsWith('video/') ? 'video' : 'image' 
        };
    },
});


// File filter function to allow only specific image and video types
const fileFilter = function (req, file, cb) {
    console.log('File Info:', file); // Log file info for debugging
    
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        console.log('Invalid file type:', file.mimetype); // Log invalid type
        cb(new Error('Only JPEG, PNG, and MP4 files are allowed')); // Reject the file
    }
};

const upload = multer({
    storage: storagefeedsimg,
    fileFilter: fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 },// Limit file size to 100MB
});
const upload_folder = multer({
    storage: folderimg,
    fileFilter: fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 },// Limit file size to 100MB
});

const uploadslider = multer({ storage: homebannersliderimg, fileFilter: fileFilter });

const router = express.Router()


router.post('/myfeeds', upload.array('assets_feed'), create_myfeeds);//!adminChecker
router.get('/myfeeds/active', adminChecker,GetMyFeeds );
router.get('/myfeeds/draft', adminChecker,GetMyFeedsDraft);
router.post('/slider', uploadslider.array('banner', 1), homeBannerSliders);
router.get('/slider', getHomeBannerSlider);
router.post('/likes', AddLikesFeeds);
router.post('/create-folder', Create_folder);
router.post('/get-folder', Get_folder);
router.post('/delete-folder', Delete_folder);
router.post('/file-upload-folder', upload_folder.array('assets_banner'), file_upload_folder);
router.post('/get-file-from-folder', Get_file);
router.post('/delete-file', Delete_file);
router.post('/save_myfeeds_draft', upload.array('assets_feed'), save_letter_myfeeds);
router.post('/getFeedDetails_byid', getFeedDetails_byid);
router.post('/active', ActivefetchFeeds_highlight);
router.post('/fetch_count', GetMyFeedsCount_highlight);
router.post('/inactive', InActivefetchFeeds_highlight);
router.post('/draft', Draft_fetchFeeds_highlight);
router.delete('/deletefeeds', deleteFeed);  
router.put('/updatedfeeds',upload.array('assets_feed'), updatedFeed);
router.post('/delete-folder-id', Delete_folder_byId);
router.post('/preview-folder-id', Preview_folder_byId);
router.put('/updatedfolder', updated_folder);
router.post('/likes-feed', CreateLikesFeed);
router.post('/myhighlight', upload.array('assets_feed'), create_myheighlight);
router.post('/save_myhighliht_draft', upload.array('assets_feed'), save_letter_myhighlight);
router.post('/highlight_details_byid', get_highLightDetails_byid);
router.delete('/deletehighlights', deleteHighlight);  
router.put('/updatedhighlight',upload.array('assets_feed'), updatedHighlight);
router.post('/likes-highlight', AddLikesHighlight);//
router.get('/publish-highlight',Publish_Highlight);//
router.get('/publish-feed',Publish_Feeds);
router.post('/ac-feed-change', feedsActivate);
router.post('/ac-highlight-change', highlightActivate);
router.post('/share-feed', Add_ShareFeeds);
router.post('/share-highlight', Add_ShareHighlight);
router.post('/detailsImage', detailsImage);
router.put('/updatedimagefile', updatedimagefile);
export default router;