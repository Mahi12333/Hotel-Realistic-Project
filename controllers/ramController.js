import asyncHandler from 'express-async-handler';

import Myfeeds from '../models/myfeedsModel.js';
import { Material, Place, Amenity, Commission,ProjectAmenity, HomeBannerSlider, HomeSchema, MyFeeds, Offer, Payment, ProjectDesignType, Project, User, MyHighlight,Folder,Assect_image, Assect_Feed, Assect_Highlight, UserShares, UserLikes } from '../models/index.js';
import { ApiError } from '../utils/ApiErrors.js';
import { ApiResponse } from '../utils/ApiReponse.js';
import { Op } from 'sequelize';
import { sequelize } from '../config/db.js';
import imageSize from 'image-size';
import axios from 'axios';


const myfeeds = asyncHandler(async (req, res) => {
    const { project_type,project_title,move_to,project_name,developer,community,describtion, link, id, assets_banner,status } = req.body;

    let newAssetsBanner = assets_banner; // Retain existing assets_banner if no file is uploaded zaid
    if (req.file) {
        newAssetsBanner = req.file.path; // Update with the new file path if a file is uploaded  zaid 
    }

    if (id) {
        // Update existing record
        const feed = await MyFeeds.findByPk(id);
        if (feed) {
            await feed.update({
                source_type:project_type,
                title:project_title,
                move_to:"",
                project:project_name,
                developer:developer,
                community:community,
                link,
                assets_banner: newAssetsBanner,
                describtion:describtion,
                status:status
            });
            return res.json(new ApiResponse(201, "Data Updated successfully."));
        } else {
            return res.status(404).json(new ApiResponse(404, "Data not found."));
        }
    } else {
        // Create new record
        await MyFeeds.create({
            source_type:project_type,
                title:project_title,
                move_to:"",
                project:project_name,
                developer:developer,
                community:community,
                link,
                assets_banner: newAssetsBanner,
                describtion:describtion,
                status:status
        });
        return res.json(new ApiResponse(201, "Data Submitted successfully."));
    }
});

// ! Get Active Feeds--------------
const GetMyFeeds = asyncHandler(async (req, res)=>{
    const MyfeedsData = await MyFeeds.findAll({ where: {'status':'1'} },{order: [['id', 'ASC']]});
    
    if(MyfeedsData)
    {
        return res.json(
            new ApiResponse(200,MyfeedsData, "All Data List.")
        )
    }
    else{
        throw new ApiError(403, "data is not available" ) ; 
    }

});

// ! Get Active Feeds--------------
const GetMyFeedsDraft = asyncHandler(async (req, res)=>{
    const MyfeedsData = await MyFeeds.findAll({ where: {'status':'0'} },{order: [['id', 'ASC']]});
    //const MyfeedsData = await Myfeeds.findAll({order: [['id', 'ASC']]});
    if(MyfeedsData)
    {
        return res.json(
            new ApiResponse(200,MyfeedsData, "All Data List.")
        )
    }
    else{
        throw new ApiError(403, "data is not available" ) ;
    }

});

const homeBannerSliders = asyncHandler(async (req, res) => {
    for (const file of req.files){ 
        let filePath = file.path.replace(/\\/g, '/');
        console.log(file);   
        const user = await HomeBannerSlider.create({
            banner_title:req.body.banner_title, 
            images_name:file.filename,
            images_path:filePath
        });
    } 
    return res.json(
        new ApiResponse(200,"Slider home banner Submitted successfully.")
    ) 
});

const getHomeBannerSlider=asyncHandler(async(req, res)=>{
    const MybannserData = await HomeBannerSlider.findAll({ where: {'is_active':'1'} },{order: [['id', 'ASC']]});
    //const MyfeedsData = await Myfeeds.findAll({order: [['id', 'ASC']]});
    if(MybannserData)
    {
        return res.json(
            new ApiResponse(200,MybannserData, "All Data List.")
        )
    }
    else{
        throw new ApiError(403, "data is not available" ) ; 
    }
});
const AddLikesFeeds = asyncHandler(async(req, res)=>{
    const user_id = req.body.user_id ? req.body.user_id : '';
    const project_id = req.body.project_id ? req.body.project_id : '';
    if(!user_id)
    {
      return  res.status(403).json({ message: 'User ID Mandatory.' });
    }
    if(!project_id)
    {
      return  res.status(403).json({ message: 'Project ID Mandatory.' });
    }
    const checklike = await UserLikes.findOne({where: {'user_id':user_id, 'pid':project_id, 'type':'feeds'}});
    if(checklike)
    {
        await UserLikes.destroy({where:{'user_id':user_id, 'pid':project_id, 'type':'feeds'}});
       return res.status(200).json({message: 'Unlike.'});
    }
    else{
        const user = await UserLikes.create({
            user_id:user_id, 
            pid:project_id,
            type:'feeds'
        });
        return res.json(
            new ApiResponse(200,user, "Like.")
        )
    }
    
});



const create_myfeeds = asyncHandler(async (req, res) => {
    const { project_type, project_title, project_name, developer, community, describtion, link, folder_id, city, assets_feed  } = req.body;

    // Validate the required fields
    if (!project_type || !project_title || !project_name || !developer || !describtion || !community || !folder_id || !link ||!city) {
        return res.status(400).json({
            message: "All fields are required."
        });   
    }
    

    // Validate that either assets_feed or req.files is provided
    if ((!assets_feed || assets_feed.length === 0) && (!req.files || req.files.length === 0)) {
        return res.status(400).json({ message: "At least one source of files is required (mylibrary or local files)." });
    }

    if (assets_feed && assets_feed.length > 0 && req.files && req.files.length > 0) {
        return res.status(400).json({
            message: "You can only upload from one source, either 'mylibrary' or local files, not both."
        });
    }


    // Create a single feed
    const feed = await MyFeeds.create({
        source_type: project_type,
        title: project_title,
        project: project_name,
        developer: developer,
        community: community,
        link: link,
        describtion: describtion,
        city:city
    });

    if (!feed) {
        return res.status(500).json({
            message: "Data submission failed."
        });
    }


    // Handle assets_feed (mylibrary) if provided
    if (assets_feed && assets_feed.length > 0) {
        const parsedAssets = assets_feed.map(asset => {
            const parsedAsset = JSON.parse(asset);
            return {
                title: project_title,
                path: parsedAsset.path,
                filename: parsedAsset.filename,
                size: parsedAsset.size,
                folderId: folder_id,
                feedId: feed.id
            };
        });
        await Assect_Feed.bulkCreate(parsedAssets);
    }


     // If files are uploaded, associate them with the feed
     if (req.files && req.files.length > 0) {
        const assetImages = req.files.map(image => ({
            title:project_title,
            path: image.path,
            filename: image.filename.split('-').pop(), 
            size: image.size,
            folderId: folder_id,
            feedId: feed.id
        }));

        await Assect_Feed.bulkCreate(assetImages);
    }

    return res.json(new ApiResponse(201,feed, "Data Submitted successfully."));
});

const save_letter_myfeeds = asyncHandler(async (req, res) => {
    const { project_type, project_title, project_name, developer, community, describtion, link, folder_id, city, assets_feed } = req.body;
     //console.log(req.body)

     if (assets_feed && assets_feed.length > 0 && req.files && req.files.length > 0) {
        return res.status(400).json({
            message: "You can only upload from one source, either 'mylibrary' or local files, not both."
        });
    }
  
    // Create a single feed
    const feed = await MyFeeds.create({
        source_type: project_type,
        title: project_title,
        project: project_name,
        developer: developer,
        community: community,
        link: link,
        describtion: describtion,
        city: city,
        status: 2,  // Assuming status 2 means draft
        is_publish: 0
    });

    if (assets_feed && assets_feed.length > 0) {
        const parsedAssets = assets_feed.map(asset => {
            const parsedAsset = JSON.parse(asset);
            return {
                title: project_title,
                path: parsedAsset.path,
                filename: parsedAsset.filename,
                size: parsedAsset.size,
                folderId: folder_id,
                feedId: feed.id
            };
        });
        await Assect_Feed.bulkCreate(parsedAssets);
    }else if (req.files && req.files.length > 0) {
        const assetImages = req.files.map(image => ({
            title: project_title,
            path: image.path,
            filename: image.filename.split('-').pop(),
            size: image.size,
            folderId: folder_id,
            feedId: feed.id
        }));

        await Assect_Feed.bulkCreate(assetImages);
    }else {
        await Assect_Feed.create({
            title: project_title,
            path: null, // Empty path since no file is provided
            filename: null,
            size: 0, // 0 size indicating no file
            folderId: folder_id,
            feedId: feed.id
        });
    }
    

    return res.json(new ApiResponse(201,feed, "Save  Submitted successfully."));
});

const getFeedDetails_byid = asyncHandler(async (req, res) => {
    const { feed_id } = req.body;

   if(!feed_id){
    return res.json(new ApiResponse(403, null, "Feed id is required."));
   }
 
    const feed = await MyFeeds.findAll({
        where: { id: feed_id },
        attributes: ['id','source_type', 'title', 'project', 'developer', 'community', 'city', 'link', 'describtion', 'createdAt'], // Removed empty string
        include: [{
            model: Assect_Feed,
            attributes: ['id', 'title', 'path', 'filename'],
            include: [{
                model: Folder,  // Include 'Folder' properly
                attributes: ['id', 'name']
            }]
        }]
    });

    if (!feed) {
        return res.json(new ApiResponse(403, null, "Feed not found."));
    }

    const totalLikeCount = await UserLikes.count({
        where: { pid: feed_id, type: 'feeds' } // Filter by feed ID and type if necessary
    });
    const totalShareCount = await UserLikes.count({
        where: { pid: feed_id, type: 'feeds' } // Filter by feed ID and type if necessary
    });


    const response={
        feed,
        totalLikeCount,
        totalShareCount
    }


    return res.json(new ApiResponse(200, response, "Feed details retrieved successfully."));
});

const updatedFeed = asyncHandler(async (req, res) => {
    const { id } = req.body;
    const { project_type, project_title, project_name, developer, community, describtion, link, folder_id } = req.body;
      
       // Start transaction
       const transaction = await sequelize.transaction();
      
       if (!id) {
        return res.status(400).json({
            message: "Feeds Id are required."
        });
    }
     // Validate the required fields
     if (!project_type || !project_title || !project_name || !developer || !describtion || !community || !folder_id || !link) {
        return res.status(400).json({
            message: "All fields are required."
        });   
    }
     // Check if files are provided
     if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            message: "Files are required."
        });
    }

    try {
        const feed = await MyFeeds.findOne({ where: { id: id } }, { transaction });

        if (!feed) {
            return res.json(new ApiResponse(403, null, "Feed not found."));
        }

        // Update the feed details
        await feed.update({
            source_type: project_type,
            title: project_title,
            project: project_name,
            developer: developer,
            community: community,
            link: link,
            describtion: describtion
        }, { transaction });

        if (req.files && req.files.length > 0) {
            // Delete existing associated images
            await Assect_Feed.destroy({ where: { feedId: id } }, { transaction });

            const assetImages = req.files.map(image => ({
                title: project_title,
                path: image.path,
                filename: image.filename.split('-').pop(),
                size: image.size,
                folderId: folder_id,
                feedId: feed.id
            }));

            await Assect_Feed.bulkCreate(assetImages, { transaction });
        }

        // Commit transaction
        await transaction.commit();

        return res.json(new ApiResponse(200, feed, "Feed updated successfully."));
    } catch (error) {
        // Rollback transaction if anything goes wrong
        await transaction.rollback();
        throw new ApiError(500, 'Something went wrong.');
    }
});


 const ActivefetchFeeds_highlight = asyncHandler(async (req, res) => {
    const { search, type, page=1 } = req.query;
    const limit = 4;  // Set limit per page
    const offset = (parseInt(page) - 1) * limit;

    if(!type){
        return res.json(new ApiResponse(200, null, "Please Provide Type."));
    }
     // Helper function to fetch data based on type (feeds/highlight)
     const getActiveData = async (model, assetModel, searchField) => {
        let whereClause = {
            status: '1',
            is_publish: '1'
        };

        // If a search query is provided, add a filter for the project_name or title
        if (search) {
            whereClause = {
                ...whereClause,
                [searchField]: { [Op.like]: `%${search}%` } // Search for partial match in searchField
            };
        }

        return await model.findAll({
            where: whereClause,
            attributes: ['id', 'source_type', 'title', 'project', 'developer', 'community', 'city', 'link', 'describtion', 'createdAt'],
            include: [{
                model: assetModel,
                attributes: ['id', 'title', 'path', 'filename'],
                include: [{
                    model: Folder,  // Include 'Folder' properly
                    attributes: ['id', 'name']
                }],
            }],
            order:[['createdAt', 'DESC']],
            limit,
            offset
        });
    };

    // Handle 'feeds' type
    if (type === 'feeds') {
        const feeds = await getActiveData(MyFeeds, Assect_Feed, 'title');
        return res.json(new ApiResponse(200, feeds, "Feeds retrieved successfully."));
    }

    // Handle 'highlight' type
    if (type === 'highlights') {
        const highlight = await getActiveData(MyHighlight, Assect_Highlight, 'project_name');
        return res.json(new ApiResponse(200, highlight, "Highlights retrieved successfully."));
    }

    return res.json(new ApiResponse(400, null, "Invalid type provided."));
     
});

const InActivefetchFeeds_highlight = asyncHandler(async (req, res) => {
    const { search, type, page=1 } = req.query;
    const limit = 4;  // Set limit per page
    const offset = (parseInt(page) - 1) * limit;
    if(!type){
        return res.json(new ApiResponse(200, null, "Please Provide Type."));
    }
     // Helper function to fetch data based on type (feeds/highlight)
     const getActiveData = async (model, assetModel, searchField) => {
        let whereClause = {
            status: '0',
            is_publish: '0'
        };

        // If a search query is provided, add a filter for the project_name or title
        if (search) {
            whereClause = {
                ...whereClause,
                [searchField]: { [Op.like]: `%${search}%` } // Search for partial match in searchField
            };
        }

        return await model.findAll({
            where: whereClause,
            // attributes: ['id', 'source_type', 'title', 'project', 'developer', 'community', 'city', 'link', 'describtion', 'createdAt'],
            include: [{
                model: assetModel,
                attributes: ['id', 'title', 'path', 'filename'],
                include: [{
                    model: Folder,  // Include 'Folder' properly
                    attributes: ['id', 'name']
                }],
            }],
            order:[['createdAt', 'DESC']],
            limit,
            offset
        });
    };

    // Handle 'feeds' type
    if (type === 'feeds') {
        const feeds = await getActiveData(MyFeeds, Assect_Feed, 'title');
        return res.json(new ApiResponse(200, feeds, "Feeds retrieved successfully."));
    }

    // Handle 'highlight' type
    if (type === 'highlights') {
        const highlight = await getActiveData(MyHighlight, Assect_Highlight, 'project_name');
        return res.json(new ApiResponse(200, highlight, "Highlights retrieved successfully."));
    }

    return res.json(new ApiResponse(400, null, "Invalid type provided."));

});

const Draft_fetchFeeds_highlight = asyncHandler(async (req, res) => {
    const { search, type, page=1 } = req.query;
    const limit = 4;  // Set limit per page
    const offset = (parseInt(page) - 1) * limit;
    if(!type){
        return res.json(new ApiResponse(200, null, "Please Provide Type."));
    }
     // Helper function to fetch data based on type (feeds/highlight)
     const getActiveData = async (model, assetModel, searchField) => {
        let whereClause = {
            status: '2',
            is_publish: '0'
        };

        // If a search query is provided, add a filter for the project_name or title
        if (search) {
            whereClause = {
                ...whereClause,
                [searchField]: { [Op.like]: `%${search}%` } // Search for partial match in searchField
            };
        }

        return await model.findAll({
            where: whereClause,
            // attributes: ['id', 'source_type', 'title', 'project', 'developer', 'community', 'city', 'link', 'describtion', 'createdAt'],
            include: [{
                model: assetModel,
                attributes: ['id', 'title', 'path', 'filename'],
                include: [{
                    model: Folder,  // Include 'Folder' properly
                    attributes: ['id', 'name']
                }],
            }],
            order:[['createdAt', 'DESC']],
            limit,
            offset
        });
    };

    // Handle 'feeds' type
    if (type === 'feeds') {
        const feeds = await getActiveData(MyFeeds, Assect_Feed, 'title');
        return res.json(new ApiResponse(200, feeds, "Feeds retrieved successfully."));
    }

    // Handle 'highlight' type
    if (type === 'highlights') {
        const highlight = await getActiveData(MyHighlight, Assect_Highlight, 'project_name');
        return res.json(new ApiResponse(200, highlight, "Highlights retrieved successfully."));
    }

    return res.json(new ApiResponse(400, null, "Invalid type provided."));
   
});

const GetMyFeedsCount_highlight = asyncHandler(async (req, res) => {
    const { type } = req.query;

    // Validate type
    if (!type) {
        return res.json(new ApiResponse(200, null, "Please Provide Type."));
    }

    // Helper function to count records based on status and publish state
    const getCounts = async (model, assetModel) => {
        const activeCount = await model.count({
            where: { status: '1', is_publish: '1' },
            include: [{ model: assetModel, include: [Folder] }]
        });

        const inactiveCount = await model.count({
            where: { status: '0', is_publish: '0' },
            include: [{ model: assetModel, include: [Folder] }]
        });

        const draftCount = await model.count({
            where: { status: '2', is_publish: '0' },
            include: [{ model: assetModel, include: [Folder] }]
        });

        return {
            draft: draftCount,
            active: activeCount,
            inactive: inactiveCount
        };
    };

    let responseData;

    if (type === 'feeds') {
        // Get counts for feeds
        responseData = await getCounts(MyFeeds, Assect_Feed);
        return res.status(200).json(new ApiResponse(200, responseData, "Feeds count view successful."));
    }

    if (type === 'highlights') {
        // Get counts for highlights
        responseData = await getCounts(MyHighlight, Assect_Highlight);
        return res.status(200).json(new ApiResponse(200, responseData, "Highlight count view successful."));
    }

    return res.json(new ApiResponse(400, null, "Invalid type provided."));

  });

const deleteFeed = asyncHandler(async (req, res) => {
    const { all_id } = req.body;
    //console.log(all_id);
    // Check if all_id exists
    if (!all_id || !Array.isArray(all_id) || all_id.length === 0) {
        return res.json(new ApiResponse(403, null, "Feed ID(s) are required."));
    }
    //console.log(all_id);
    // Loop through all_id without JSON.parse (assuming it's already an array)
    for (let id of all_id) {
        const feed = await MyFeeds.findOne({ where: { id: id } });

        // If feed is found, delete associated assets and the feed
        if (feed) {
            // Delete associated assets
            await Assect_Feed.destroy({
                where: { feedId: id }
            });

            // Delete the feed
            await feed.destroy();
        }
    }

    return res.json(new ApiResponse(200, null, "Feed(s) deleted successfully."));
});




const Create_folder=asyncHandler(async(req,res)=>{
    const { name } = req.body;

    // Log folder name for debugging
    //console.log(name);

    // Validate folder name input
    if (!name) {
        return res.json(new ApiResponse(403, null, "Folder Name is required."));
    }

    // Check if folder with the same name already exists
    const existFolder = await Folder.findOne({ where: { name: name } });

    // If the folder exists, throw an error
    if (existFolder) {
        return res.json(new ApiResponse(403,null, "Folder Name already exists."));
    }

    // Create the folder if it doesn't exist
    const folder = await Folder.create({ name: name });

    // Return the response with the created folder
    return res.json(new ApiResponse(201, folder, "Folder created successfully"));
});
const updated_folder=asyncHandler(async(req,res)=>{
    const{folder_id,name}=req.body;
    if(!folder_id || !name){
      return res.json(new ApiResponse(403, null, "Folder id and Name is required."));
    }
    const existFolder=await Folder.findOne({where:{id:folder_id}});
    if(!existFolder){
        return res.json(new ApiResponse(403, null, "Folder Not Exists."));
    }
    const existFolder_name=await Folder.findOne({where:{name:name}});
    if(existFolder_name){
        return res.json(new ApiResponse(403, null, "Folder Name already Exists."));
    }
    await Folder.update(
        { name: name }, // New name to update
        { where: { id: folder_id } } // Specify the folder to update
    );
    const updatedFolder = await Folder.findOne({ where: { id: folder_id } });
    return res.json(new ApiResponse(201, updatedFolder, "folder Updated successfully"));
});
const Get_folder = asyncHandler(async (req, res) => {
    const { tody_data, last_7_days, last_month, last_3_month, last_year, name, page = 1 } = req.body;
    const limit = 10;  // Set limit per page
    const offset = parseInt(page) * limit;

    // Construct filter and sort conditions
    let whereClause = {};
    let orderClause = [];

    // Filtering logic based on date
    if (tody_data) {
        whereClause.createdAt = { [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)) }; // Today's date
    } else if (last_7_days) {
        whereClause.createdAt = { [Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) }; // Last 7 days
    } else if (last_month) {
        whereClause.createdAt = { [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 1)) }; // Last month
    } else if (last_3_month) {
        whereClause.createdAt = { [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 3)) }; // Last 3 months
    } else if (last_year) {
        whereClause.createdAt = { [Op.gte]: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) }; // Last year
    }

    // Sorting logic based on name
    if (name) {
        orderClause.push(['name', name === 'asc' ? 'ASC' : 'DESC']);
    }

    // Fetch total number of records to handle pagination correctly
    const totalFolders = await Folder.count({
        where: whereClause
    });

    // Fetch data from the database based on filter conditions
    const folders = await Folder.findAll({
        where: whereClause,
        order: orderClause.length > 0 ? orderClause : [['createdAt', 'DESC']], // Default sort by createdAt
        limit,
        offset
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalFolders / limit);

    // Return the folders along with pagination details
    return res.json(new ApiResponse(200, {
        folders,
        currentPage: parseInt(page) + 1, // To make the page 1-indexed
        totalPages,
        totalRecords: totalFolders
    }, "All folders successfully displayed"));
});

const Delete_folder=asyncHandler(async(req,res)=>{
    const {all_id}=req.body;
    if (!all_id || !Array.isArray(all_id) || all_id.length === 0) {
        return res.json(new ApiResponse(403,null, "Folder ID(s) are required."));
    }
    for(let id of all_id){
        await Folder.destroy({where:{id:id}})
    }
    return res.json(new ApiResponse(201,null, " folder successfully Delete"));
});

const Delete_folder_byId=asyncHandler(async(req,res)=>{
    const {id}=req.body;
    await Folder.destroy({where:{id:id}})
    
    return res.json(new ApiResponse(201,null, " folder successfully Delete"));
});
const Preview_folder_byId=asyncHandler(async(req,res)=>{
    const {folder_id}=req.body;
    const preview_folder=await Folder.findOne({where:{id:folder_id}});
    const files = await Assect_image.findAll({
        where: { folderId: folder_id }, // Corrected where clause to match folderId
        attributes: ['size'],
        include: [{
            model: Folder,
            attributes: ['id','name'],
        }]
    });
    const myfeeds_image=await Assect_Feed.findAll({
        where:{folderId:folder_id},
        attributes: ['size'],
        include: [{
            model: Folder,
            attributes: ['id','name'],
        }]

    });
    const myhighlight_image=await Assect_Highlight.findAll({
        where:{folderId:folder_id},
        attributes: ['size'],
        include: [{
            model: Folder,
            attributes: ['id','name'],
        }]

    });
    const Folder_name=preview_folder.name;
    
    const image_file = [...files, ...myfeeds_image, ...myhighlight_image];
    let total_size_in_bytes = 0;
    image_file.forEach(image => {
        // Assuming file size is stored in 'file_size' attribute in bytes
        total_size_in_bytes += image.size || 0;
    });
    const kbps = total_size_in_bytes / 1024;
    const mbps = kbps / 1024;
    const gbps = mbps / 1024;
    let total_size = '';
    if (gbps > 1) {
        total_size = `${gbps.toFixed(2)} GB`;
    } else if (mbps > 1) {
        total_size = `${mbps.toFixed(2)} MB`;
    } else {
        total_size = `${kbps.toFixed(2)} KB`;
    }
    const response={
        Folder_name,
        total_size
    }

    return res.json(new ApiResponse(201,response, " folder name and Size successfully "));
});

const file_upload_folder= asyncHandler(async(req,res)=>{
    const { all_id } = req.body;
  //  console.log("hh");
//    console.log(typeof(all_id));
    // if (!all_id || !Array.isArray(all_id) || all_id.length === 0) {
    //     return res.json(new ApiResponse(403, "Folder ID(s) are required."));
    // }
    const All_id_perse=JSON.parse(all_id);
    if (!all_id || All_id_perse.length === 0) {
        return res.json(new ApiResponse(403, null, "Folder ID(s) are required."));
    }
  console.log(all_id);
    if (!req.files || req.files.length === 0) {
        return res.json(new ApiResponse(403, null, "No files uploaded."));
    }
    
    let uploadedFiles = [];
    for (let id of All_id_perse) {
        console.log("id",id)
        const folder = await Folder.findOne({ where: { id: id } });
        console.log(folder)
        if (folder) {
            for (let file of req.files) {
                console.log(req.files);

                const newFile = await Assect_image.create({
                    folderId: folder.id,
                    filename: file.filename.split('-').pop(),
                    path: file.path,
                    size: file.size
                });
                uploadedFiles.push(newFile);
            }
        }
    }

    return res.json(new ApiResponse(201, uploadedFiles, "Files uploaded successfully to folder(s)."));
})


const Get_file = asyncHandler(async (req, res) => {
    const { folder_id, today_data, last_7_days, last_month, last_3_month, last_year, name, size, page = 1 } = req.body;
    const limit = 4;  // Set limit per page
    const offset = (parseInt(page) - 1) * limit;

    // Check if folder exists
    const folder = await Folder.findOne({ where: { id: folder_id } });
    if (!folder) {
        return res.json(new ApiResponse(403, null, "Folder not found."));
    }

    // Construct filter and sort conditions
    let whereClause = { folderId: folder_id };  // Filter by folder ID
    let orderClause = [];

    // Filtering logic based on date
    if (today_data) {
        whereClause.createdAt = { [Op.gte]: new Date().setHours(0, 0, 0, 0) };  // Today
    } else if (last_7_days) {
        whereClause.createdAt = { [Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) };  // Last 7 days
    } else if (last_month) {
        whereClause.createdAt = { [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 1)) };  // Last month
    } else if (last_3_month) {
        whereClause.createdAt = { [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 3)) };  // Last 3 months
    } else if (last_year) {
        whereClause.createdAt = { [Op.gte]: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) };  // Last year
    }

    // Sorting logic based on name or size
    if (name) {
        orderClause.push(['filename', name === 'asc' ? 'ASC' : 'DESC']);
    }
    if (size) {
        orderClause.push(['size', size === 'asc' ? 'ASC' : 'DESC']);
    }

    // Fetch images, feeds, and highlights with pagination
    const [files, feedFiles, highlightFiles, totalImageCount, totalFeedCount, totalHighlightCount] = await Promise.all([
        Assect_image.findAll({
            where: whereClause,
            attributes: ['id', 'path', 'filename', 'size'],
            include: [{ model: Folder, attributes: ['id', 'name'] }],
            order: orderClause.length ? orderClause : [['createdAt', 'DESC']],
            limit,
            offset
        }),
        Assect_Feed.findAll({
            where: whereClause,
            attributes: ['id', 'path', 'filename', 'size'],
            include: [{ model: Folder, attributes: ['id', 'name'] }],
            order: orderClause.length ? orderClause : [['createdAt', 'DESC']],
            limit,
            offset
        }),
        Assect_Highlight.findAll({
            where: whereClause,
            attributes: ['id', 'path', 'filename', 'size'],
            include: [{ model: Folder, attributes: ['id', 'name'] }],
            order: orderClause.length ? orderClause : [['createdAt', 'DESC']],
            limit,
            offset
        }),
        Assect_image.count({ where: whereClause }),  // Total images count
        Assect_Feed.count({ where: whereClause }),   // Total feeds count
        Assect_Highlight.count({ where: whereClause })    // Total highlights count
    ]);

    // Merge the image, feed, and highlight data
    const imageFiles = [...files, ...feedFiles, ...highlightFiles];

    // Calculate total pages based on total count and limit
    const totalRecords = totalImageCount + totalFeedCount + totalHighlightCount;
    const totalPages = Math.ceil(totalRecords / limit);

    // Return the response with paginated data
    return res.json(new ApiResponse(200, {
        files: imageFiles,
        currentPage: page,
        totalPages,
        totalRecords
    }, "Files fetched and sorted successfully."));
});


const Delete_file=asyncHandler(async(req,res)=>{
    const { all_file_id, folder_id } = req.body;

    // Validate folder_id and all_file_id
    if (!folder_id) {
        return res.json(new ApiResponse(403, null, "Folder ID is required."));
    }

    if (!all_file_id || all_file_id.length === 0) {
        return res.json(new ApiResponse(403, null, "File IDs are required for deletion."));
    }

    // Find the folder by folder_id
    const folder = await Folder.findOne({ where: { id: folder_id } });
    if (!folder) {
        return res.json(new ApiResponse(403, null, "Folder not found."));
    }

    const deletedFiles = [];

    // Loop through each file_id
    for (let file_id of all_file_id) {
        let file = await Assect_image.findOne({ where: { id: file_id, folderId: folder.id } });

        if (!file) {
            file = await Assect_Feed.findOne({ where: { id: file_id, folderId: folder.id } });
        }

        if (!file) {
            file = await Assect_Highlight.findOne({ where: { id: file_id, folderId: folder.id } });
        }

        // If the file is found, delete it
        if (file) {
            await file.destroy(); // Deletes the file from the database
            deletedFiles.push(file); // Keep track of deleted files
        }
    }

    // Check if any files were actually deleted
    if (deletedFiles.length === 0) {
        return res.status(404).json(new ApiResponse(404, null, "No files found to delete."));
    }

    // Return a response with the deleted files
    return res.json(new ApiResponse(200, deletedFiles, "files successfully deleted."));
  
});




const CreateLikesFeed = asyncHandler(async (req, res) => {
    const { feedsId, userId, method } = req.body;
  
    if (!userId) {
      return res.json(new ApiResponse(403, null, "User ID Mandatory."));
    }
    if (!feedsId) {
      return res.json(new ApiResponse(403, null, "Project ID Mandatory."));
    }
    const [existingLike, likeCount] = await Promise.all([
      UserLikes.findOne({
        where: { user_id: userId, pid: feedsId, type: "feeds" },
      }),
      UserLikes.count({ where: { pid: feedsId, type: "feeds" } }),
    ]);
  
    if (method === "fetch") {
      return res.json(
        new ApiResponse(200, likeCount, existingLike ? "true" : "false")
      );
    } else {
      if (existingLike) {
        await UserLikes.destroy({
          where: { user_id: userId, pid: feedsId, type: "feeds" },
        });
        const newLikeCount = likeCount - 1; // Decrement like count
        return res.json(new ApiResponse(200, newLikeCount, "false"));
      } else {
        await UserLikes.create({ user_id: userId, pid: feedsId, type: "feeds" });
        const newLikeCount = likeCount + 1; // Increment like count
        return res.json(new ApiResponse(200, newLikeCount, "true"));
      }
    }
  });

  const create_myheighlight = asyncHandler(async (req, res) => {
    const { project_title, project_name, developer, city, community, link, folder_id, assets_highlight } = req.body;
   //console.log(req.body);
  
   //console.log('Uploaded Files:', req.files);
    // Validate the required fields
    if (!city || !project_title || !project_name || !developer || !community || !folder_id || !link) {
        return res.json(new ApiResponse(403, null, "All fields are required."));
    }
     // Validate that either assets_feed or req.files is provided
    if ((!assets_highlight || assets_highlight.length === 0) && (!req.files || req.files.length === 0)) {
        return res.status(400).json({ message: "At least one source of files is required (mylibrary or local files)." });
    }

    if (assets_highlight && assets_highlight.length > 0 && req.files && req.files.length > 0) {
        return res.status(400).json({
            message: "You can only upload from one source, either 'mylibrary' or local files, not both."
        });
    }

    // Create a single feed
    const highlight = await MyHighlight.create({
        project_name: project_title,
        project: project_name,
        developer: developer,
        community: community,
        link: link,
        city: city
    });

    if (!highlight) {
        return res.json(new ApiResponse(403, null, "Data submission failed."));
    }

     // Handle assets_feed (mylibrary) if provided
     if (assets_highlight && assets_highlight.length > 0) {
        const parsedAssets = assets_highlight.map(asset => {
            const parsedAsset = JSON.parse(asset);
            return {
                title: project_title,
                path: parsedAsset.path,
                filename: parsedAsset.filename,
                size: parsedAsset.size,
                folderId: folder_id,
                feedId: feed.id
            };
        });
        await Assect_Highlight.bulkCreate(parsedAssets);
    }




     // If files are uploaded, associate them with the feed
     if (req.files && req.files.length > 0) {
        const assetImages = req.files.map(image => ({
            title:project_title,
            path: image.path,
            filename: image.filename.split('-').pop(),
            size: image.size,
            folderId: folder_id,
            highlightId: highlight.id
        }));

        await Assect_Highlight.bulkCreate(assetImages);
    }

    return res.json(new ApiResponse(201,highlight, "Data Submitted successfully."));
});


const save_letter_myhighlight = asyncHandler(async (req, res) => {
    const { project_title, project_name, developer, community, city, link, folder_id, assets_highlight } = req.body;
     //console.log(req.body)
  
    // Create a single feed
    const highlight = await MyHighlight.create({
        project_name: project_title,
        project: project_name,
        developer: developer,
        community: community,
        link: link,
        city: city,
        status: 2,
        is_publish: 0
    });

    if (assets_highlight && assets_highlight.length > 0 && req.files && req.files.length > 0) {
        return res.status(400).json({
            message: "You can only upload from one source, either 'mylibrary' or local files, not both."
        });
    }

     // If files are uploaded, associate them with the feed

     if (req.files && req.files.length > 0) {
        const assetImages = req.files.map(image => ({
            title: project_title,
            path: image.path,
            filename: image.filename.split('-').pop(), //image.filename.split('/').pop()
            size: image.size,
            folderId: folder_id,
            highlightId: highlight.id
        }));

        await Assect_Highlight.bulkCreate(assetImages);
    }else if (assets_highlight && assets_highlight.length > 0) {
        const parsedAssets = assets_highlight.map(asset => {
            const parsedAsset = JSON.parse(asset);
            return {
                title: project_title,
                path: parsedAsset.path,
                filename: parsedAsset.filename,
                size: parsedAsset.size,
                folderId: folder_id,
                feedId: feed.id
            };
        });
        await Assect_Highlight.bulkCreate(parsedAssets);
    }else{
        await Assect_Highlight.create({
            title: project_title,
            path: null,
            filename: null,
            size: null,
            folderId: folder_id,
            highlightId: highlight.id
        });
    }
    

    return res.json(new ApiResponse(201,highlight, "Save  Submitted successfully."));
});

const get_highLightDetails_byid = asyncHandler(async (req, res) => {
    const { highlight_id } = req.body;
   if(!highlight_id){
    return res.json(new ApiResponse(403, null, "highlight id is required.."));
   }

    const highlight = await MyHighlight.findAll({
        where: { id: highlight_id },
        attributes: ['id', 'project_name', 'project', 'developer', 'community', 'city', 'link', 'createdAt'], // Removed empty string
        include: [{
            model: Assect_Highlight,
            attributes: ['id', 'title', 'path', 'filename'],
            include: [{
                model: Folder,  // Include 'Folder' properly
                attributes: ['id', 'name']
            }]
        }]
    });

    if (!highlight) {
        return res.json(new ApiResponse(403, null, "highlight not found.."));
    }

    const totalLikeCount = await UserLikes.count({
        where: { pid: highlight_id, type: 'highlights' } // Filter by feed ID and type if necessary
    });
    const totalShareCount = await UserLikes.count({
        where: { pid: highlight_id, type: 'highlights' } // Filter by feed ID and type if necessary
    });

    const response={
        highlight,
        totalLikeCount,
        totalShareCount
    }

    return res.json(new ApiResponse(200, response, "highlight details retrieved successfully."));
});

const ActivefetchHighlight = asyncHandler(async (req, res) => {
    const { search } = req.query; // Get the search query from the request

    // Define the search filter for the title
    let whereClause = {
        status: '1',
        is_publish: '1'
    };

    // If a search query is provided, add a filter for the title
    if (search) {
        whereClause = {
            ...whereClause,
            project_name: { [Op.like]: `%${search}%` } // Search for partial match in project_name
        };
    }

    // Fetch the highlights with the search filter
    const highlight = await MyHighlight.findAll({
        where: whereClause,
        attributes: ['id', 'project_name', 'project', 'developer', 'community', 'city', 'link'],
        include: [{
            model: Assect_Highlight,
            attributes: ['id', 'title', 'path', 'filename'],
            include: [{
                model: Folder,
                attributes: ['id', 'name']
            }]
        }]
    });

    return res.json(new ApiResponse(200, highlight, "Highlights retrieved successfully."));
});

const InActivefetchHighlight = asyncHandler(async (req, res) => {
    const { search } = req.query; // Get the search query from the request

    // Define the search filter for the title
    let whereClause = {
        status: '0',
        is_publish: '0'
    };
    // If a search query is provided, add a filter for the title
     // If a search query is provided, add a filter for the project_name in MyHighlight
     if (search) {
        whereClause = {
            ...whereClause,
            project_name: { [Op.like]: `%${search}%` } // Search for partial match in project_name
        };
    }

    // Fetch the highlights with the search filter
    const highlight = await MyHighlight.findAll({
        where: whereClause,
        attributes: ['id', 'project_name', 'project', 'developer', 'community', 'city', 'link'],
        include: [{
            model: Assect_Highlight,
            attributes: ['id', 'title', 'path', 'filename'],
            include: [{
                model: Folder,
                attributes: ['id', 'name']
            }]
        }]
    });



    return res.json(new ApiResponse(200, highlight, "highlight retrieved successfully."));
});

const Draft_fetchHighlight = asyncHandler(async (req, res) => {
    const { search } = req.query; // Get the search query from the request

    // Define the search filter for the title
    let whereClause = {
        status: '2',
        is_publish: '0'
    };

     // If a search query is provided, add a filter for the title
     if (search) {
        whereClause = {
            ...whereClause,
            project_name: { [Op.like]: `%${search}%` } // Search for partial match in project_name
        };
    }
     // Fetch the highlights with the search filter
     const highlight = await MyHighlight.findAll({
        where: whereClause,
        attributes: ['id', 'project_name', 'project', 'developer', 'community', 'city', 'link'],
        include: [{
            model: Assect_Highlight,
            attributes: ['id', 'title', 'path', 'filename'],
            include: [{
                model: Folder,
                attributes: ['id', 'name']
            }]
        }]
    });

    return res.json(new ApiResponse(200, highlight, "highlight retrieved successfully."));
});

const GetMyHighlightCount = asyncHandler(async (req, res) => {
    // Get page and size from query parameters with default values
    const ActiveHighlight_count = await MyHighlight.findAll({
        where:{status:'1',
            is_publish: '1'
        },
        include: [{
            model: Assect_Highlight,
            include: [Folder]
        }]
    });
    const Activehighlight_Counts = ActiveHighlight_count.length;
    const InActiveHeighlight_count = await MyHighlight.findAll({
        where:{status:'0',
            is_publish: '0'
        },
        include: [{
            model: Assect_Highlight,
            include: [Folder]
        }]
    });
    const InActivehighlight_counts = InActiveHeighlight_count.length;
    const DraftHightlight_count = await MyHighlight.findAll({
        where:{status:'2',
            is_publish: '0'
        },
        include: [{
            model: Assect_Highlight,
            include: [Folder]
        }]
    });
    const Drafthighlight_counts = DraftHightlight_count.length;
  
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          draft: Drafthighlight_counts,
          active: Activehighlight_Counts,
          inactive: InActivehighlight_counts
        },
        "Feeds count view successful."
      )
    );
});

  const deleteHighlight = asyncHandler(async (req, res) => {
    const { all_id } = req.body;

    // Check if all_id exists
    if (!all_id || !Array.isArray(all_id) || all_id.length === 0) {
        return res.json(new ApiResponse(403, null, "Highlight ID(s) are required."));
    }

    // Loop through all_id without JSON.parse (assuming it's already an array)
    for (let id of all_id) {
        const highlight = await MyHighlight.findOne({ where: { id: id } });

        // If feed is found, delete associated assets and the feed
        if (feed) {
            // Delete associated assets
            await Assect_Highlight.destroy({
                where: { highlightId: id }
            });

            // Delete the feed
            await highlight.destroy();
        }
    }

    return res.json(new ApiResponse(200, null, "Highlight(s) deleted successfully."));
});

const updatedHighlight = asyncHandler(async (req, res) => {
    const { id } = req.body;
    const { project_title, project_name, developer, community, city, link, folder_id } = req.body;
      //console.log(req.body)
       // Start transaction
       const transaction = await sequelize.transaction();
     
       if (!id) {
        return res.status(400).json({
            message: "Highlight Id are required."
        });
    }
     // Validate the required fields
     if (!project_title || !project_name || !developer || !city || !community || !folder_id || !link) {
        return res.status(400).json({
            message: "All fields are required."
        });   
    }
     // Check if files are provided
     if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            message: "Files are required."
        });
    }

    try {
        const highlight = await MyHighlight.findOne({ where: { id: id } }, { transaction });

        if (!highlight) {
            return res.json(new ApiResponse(403, null, "Highlight ID(s) not Found."));
        }

        // Update the feed details
        await highlight.update({
            project_name: project_title,
            project: project_name,
            developer: developer,
            community: community,
            link: link,
            city: city
        }, { transaction });

        if (req.files && req.files.length > 0) {
            // Delete existing associated images
            await Assect_Highlight.destroy({ where: { highlightId: id } }, { transaction });

            const assetImages = req.files.map(image => ({
                title: project_title,
                path: image.path,
                filename: image.filename.split('-').pop(),
                size: image.size,
                folderId: folder_id,
                highlightId: highlight.id
            }));

            await Assect_Highlight.bulkCreate(assetImages, { transaction });
        }

        // Commit transaction
        await transaction.commit();

        return res.json(new ApiResponse(200, highlight, "Highlight updated successfully."));
    } catch (error) {
        console.log(error)
        // Rollback transaction if anything goes wrong
        await transaction.rollback();
        throw new ApiError(500, 'Something went wrong.');
    }
});

const AddLikesHighlight = asyncHandler(async (req, res) => {
    const { highlightId, userId, method } = req.body;
  
    if (!userId) {
      return res.json(new ApiResponse(403, null, "User ID Mandatory."));
    }
    if (!highlightId) {
      return res.json(new ApiResponse(403, null, "Project ID Mandatory."));
    }
    const [existingLike, likeCount] = await Promise.all([
      UserLikes.findOne({
        where: { user_id: userId, pid: highlightId, type: "highlights" },
      }),
      UserLikes.count({ where: { pid: highlightId, type: "highlights" } }),
    ]);
  
    if (method === "fetch") {
      return res.json(
        new ApiResponse(200, likeCount, existingLike ? "true" : "false")
      );
    } else {
      if (existingLike) {
        await UserLikes.destroy({
          where: { user_id: userId, pid: highlightId, type: "highlights" },
        });
        const newLikeCount = likeCount - 1; // Decrement like count
        return res.json(new ApiResponse(200, newLikeCount, "false"));
      } else {
        await UserLikes.create({ user_id: userId, pid: highlightId, type: "highlights" });
        const newLikeCount = likeCount + 1; // Increment like count
        return res.json(new ApiResponse(200, newLikeCount, "true"));
      }
    }
  });

  const highlightDeactivate = asyncHandler(async (req, res) => {
    const { id } = req.body;
  
    const highlightbyId = await MyHighlight.findByPk(id);
    if (!highlightbyId) {
      return res.json(new ApiResponse(403, null, "No highlight found with the provided ID."));
    }
  
    // Deactivate the feed by setting status to 0
    highlightbyId.status = 0;
    highlightbyId.is_publish= 0;
    await highlightbyId.save();
  
    return res.json(
      new ApiResponse(200, highlightbyId, "Highlight deactivated successfully")
    );
  });

  const highlightActivate = asyncHandler(async (req, res) => {
    const { id } = req.body;
  
    const highlightbyId = await MyHighlight.findByPk(id);
    if (!highlightbyId) {
      return res.json(new ApiResponse(403, null, "No highlight found with the provided ID."));
    }
  
    // Deactivate the feed by setting status to 0
    highlightbyId.status = 1;
    highlightbyId.is_publish= 1;
    await highlightbyId.save();
  
    return res.json(
      new ApiResponse(200, highlightbyId, "Highlight deactivated successfully")
    );
  });
  
  const highlightDraft = asyncHandler(async (req, res) => {
    const { id } = req.body;
  
    const highlightbyId = await MyHighlight.findByPk(id);
    if (!highlightbyId) {
      return res.json(new ApiResponse(403, null, "No highlight found with the provided ID."));
    }
  
    // Draft the feed by setting status to 2 and 
    highlightbyId.status = 2;
    highlightbyId.is_publish= 0;
    await highlightbyId.save();
  
    return res.json(
      new ApiResponse(200, highlightbyId, "Highlight deactivated successfully")
    );
  });

  const feedsDeactivate = asyncHandler(async (req, res) => {
    const { id } = req.body;
  
    const feedbyId = await MyFeeds.findByPk(id);
    if (!feedbyId) {
      return res.json(new ApiResponse(403, null, "No feed found with the provided ID."));
    }
  
    // Deactivate the feed by setting status to 0
    feedbyId.status = 0;
    feedbyId.is_publish = 0;
    await feedbyId.save();
  
    return res.json(
      new ApiResponse(200, feedbyId, "Feed deactivated successfully")
    );
  });
  
  const feedsActivate = asyncHandler(async (req, res) => {
    const { id } = req.body;
  
    const feedbyId = await MyFeeds.findByPk(id);
    if (!feedbyId) {
        return res.json(new ApiResponse(403, null, "No feed found with the provided ID."));
    }
  
    // Deactivate the feed by setting status to 0
    feedbyId.status = 1;
    feedbyId.is_publish = 1;
    await feedbyId.save();
  
    return res.json(
      new ApiResponse(200, feedbyId, "Feed deactivated successfully")
    );
  });

  const feedsDraft = asyncHandler(async (req, res) => {
    const { id } = req.body;
  
    const feedbyId = await MyFeeds.findByPk(id);
    if (!feedbyId) {
        return res.json(new ApiResponse(403, null, "No feed found with the provided ID."));
    }
  
    // Deactivate the feed by setting status to 0
    feedbyId.status = 2;
    feedbyId.is_publish = 0;
    await feedbyId.save();
  
    return res.json(
      new ApiResponse(200, feedbyId, "Feed deactivated successfully")
    );
  });

  const Publish_Highlight = asyncHandler(async (req, res) => {
    const highlight = await MyHighlight.findAll({
        where: { 
            status: '1' ,
            is_publish: '1'
        },
        attributes: ['id', 'project_name', 'project', 'developer', 'community', 'city', 'link'], // Removed empty string
        include: [{
            model: Assect_Highlight,
            attributes: ['id', 'title', 'path', 'filename'],
            include: [{
                model: Folder,  // Include 'Folder' properly
                attributes: ['id', 'name']
            }]
        }]
    });

    return res.json(new ApiResponse(200, highlight, "highlight retrieved successfully."));
});

const Publish_Feeds = asyncHandler(async (req, res) => {
    const feeds = await MyFeeds.findAll({
        where: { 
            status: '1',
            is_publish: '1'
        },
        attributes: ['id','source_type', 'title', 'project', 'developer', 'community', 'city', 'link', 'describtion'], // Removed empty string
        include: [{
            model: Assect_Feed,
            attributes: ['id', 'title', 'path', 'filename'],
            include: [{
                model: Folder,  // Include 'Folder' properly
                attributes: ['id', 'name']
            }]
        }]
    });

    return res.json(new ApiResponse(200, feeds, "highlight retrieved successfully."));
});


const Add_ShareHighlight = asyncHandler(async (req, res) => {
    const { highlightId, userId, method } = req.body;
  
    if (!userId) {
      return res.json(new ApiResponse(403, null, "User ID Mandatory."));
    }
    if (!highlightId) {
      return res.json(new ApiResponse(403, null, "Project ID Mandatory."));
    }
    const [existingShare, likeShare] = await Promise.all([
      UserShares.findOne({
        where: { user_id: userId, pid: highlightId, type: "highlights" },
      }),
      UserShares.count({ where: { pid: highlightId, type: "highlights" } }),
    ]);
  
    if (method === "fetch") {
      return res.json(
        new ApiResponse(200, likeShare, existingShare ? "true" : "false")
      );
    } else {
      if (existingShare) {
        await UserShares.destroy({
          where: { user_id: userId, pid: highlightId, type: "highlights" },
        });
        const newShareCount = likeShare - 1; // Decrement like count
        return res.json(new ApiResponse(200, newShareCount, "false"));
      } else {
        await UserLikes.create({ user_id: userId, pid: highlightId, type: "highlights" });
        const newShareCount = likeShare + 1; // Increment like count
        return res.json(new ApiResponse(200, newShareCount, "true"));
      }
    }
  });


  const Add_ShareFeeds = asyncHandler(async (req, res) => {
    const { feedtId, userId, method } = req.body;
  
    if (!userId) {
      return res.json(new ApiResponse(403, null, "User ID Mandatory."));
    }
    if (!feedtId) {
      return res.json(new ApiResponse(403, null, "Project ID Mandatory."));
    }
    const [existingShare, likeShare] = await Promise.all([
      UserShares.findOne({
        where: { user_id: userId, pid: feedtId, type: "feeds" },
      }),
      UserShares.count({ where: { pid: feedtId, type: "feeds" } }),
    ]);
  
    if (method === "fetch") {
      return res.json(
        new ApiResponse(200, likeShare, existingShare ? "true" : "false")
      );
    } else {
      if (existingShare) {
        await UserShares.destroy({
          where: { user_id: userId, pid: feedtId, type: "feeds" },
        });
        const newShareCount = likeShare - 1; // Decrement like count
        return res.json(new ApiResponse(200, newShareCount, "false"));
      } else {
        await UserLikes.create({ user_id: userId, pid: feedtId, type: "feeds" });
        const newShareCount = likeShare + 1; // Increment like count
        return res.json(new ApiResponse(200, newShareCount, "true"));
      }
    }
  });

  
  const detailsImage = asyncHandler(async (req, res) => {
    const { folder_id, image_id } = req.body;

    // Check if folder exists
    const folder = await Folder.findOne({ where: { id: folder_id } });
    if (!folder) {
        return res.json(new ApiResponse(403, null, "Folder not found."));
    }

    // Construct filter conditions for folderId and image_id
    let whereClause = { folderId: folder_id, id: image_id };

    // Try fetching the file from Assect_image first
    let file = await Assect_image.findOne({
        where: whereClause,
        attributes: ['id', 'path', 'filename', 'size', 'createdAt'],
        include: [{ model: Folder, attributes: ['id', 'name'] }],
    });

    // If not found in Assect_image, try fetching from Assect_Feed
    if (!file) {
        file = await Assect_Feed.findOne({
            where: whereClause,
            attributes: ['id', 'title', 'path', 'filename', 'size', 'createdAt'],
            include: [{ model: Folder, attributes: ['id', 'name'] }],
        });
    }

    // If not found in Assect_Feed, try fetching from Assect_Highlight
    if (!file) {
        file = await Assect_Highlight.findOne({
            where: whereClause,
            attributes: ['id', 'title', 'path', 'filename', 'size', 'createdAt'],
            include: [{ model: Folder, attributes: ['id', 'name'] }],
        });
    }

    // If file is still not found, return an error
    if (!file) {
        return res.json(new ApiResponse(404, null, "File not found."));
    }

     // Convert file size to a readable format (KB, MB, GB)
     const formatSize = (size) => {
        const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
        const sizeInUnits = (size / Math.pow(1024, i)).toFixed(2);
        const unit = ['B', 'KB', 'MB', 'GB', 'TB'][i];
        return `${sizeInUnits} ${unit}`;
    };

    // Get image dimensions (if it's an image file)
    /*let dimensions = null;
    try {
        dimensions = imageSize(file.path);  // You might need to fetch the file locally for sizeOf
    } catch (error) {
        console.log('Error fetching image dimensions:', error.message);
    }*/

        // Fetch the image from the remote URL to get dimensions

    let dimensions = null;
    try {
        const response = await axios({
            url: file.path,
            responseType: 'arraybuffer',  // Fetch as binary data
        });
        const buffer = Buffer.from(response.data, 'binary');
        dimensions = imageSize(buffer);  // Get image dimensions
    } catch (error) {
        console.log('Error fetching image dimensions:', error.message);
    }


    // Return the file details along with size and dimensions (if applicable)
    return res.json(new ApiResponse(200, {
        file: {
            ...file.dataValues,
            size: formatSize(file.size),  // Format size
            dimensions: dimensions ? `${dimensions.width}x${dimensions.height}` : null,  // Dimensions if available
        }
    }, "File details fetched successfully."));
});


const updatedimagefile = asyncHandler(async (req, res) => {
    const { folder_id, image_id, filename } = req.body;

    // Check if folder exists
    const folder = await Folder.findOne({ where: { id: folder_id } });
    if (!folder) {
        return res.json(new ApiResponse(403, null, "Folder not found."));
    }

    // Construct filter conditions for folderId and image_id
    let whereClause = { folderId: folder_id, id: image_id };

    // Try fetching the file from Assect_image first
    let file = await Assect_image.findOne({
        where: whereClause,
        attributes: ['id', 'path', 'filename', 'size', 'createdAt'],
        include: [{ model: Folder, attributes: ['id', 'name'] }],
    });

    // If not found in Assect_image, try fetching from Assect_Feed
    if (!file) {
        file = await Assect_Feed.findOne({
            where: whereClause,
            attributes: ['id', 'title', 'path', 'filename', 'size', 'createdAt'],
            include: [{ model: Folder, attributes: ['id', 'name'] }],
        });
    }

    // If not found in Assect_Feed, try fetching from Assect_Highlight
    if (!file) {
        file = await Assect_Highlight.findOne({
            where: whereClause,
            attributes: ['id', 'title', 'path', 'filename', 'size', 'createdAt'],
            include: [{ model: Folder, attributes: ['id', 'name'] }],
        });
    }

    // If file is still not found, return an error
    if (!file) {
        return res.json(new ApiResponse(404, null, "File not found."));
    }

    // Update the filename
    try {
        if (file instanceof Assect_image) {
            await file.update({ filename });
        } else if (file instanceof Assect_Feed) {
            await file.update({ filename });
        } else if (file instanceof Assect_Highlight) {
            await file.update({ filename });
        }
    } catch (error) {
        return res.json(new ApiResponse(500, null, "Error updating filename."));
    }

    // Return the updated file details
    return res.json(new ApiResponse(200, {
        file: {
            ...file.dataValues,
            filename,
        }
    }, "Filename updated successfully."));
});



  






  







export {
    myfeeds,
    GetMyFeeds,
    GetMyFeedsDraft,
    homeBannerSliders,
    getHomeBannerSlider,
    AddLikesFeeds,
    Create_folder,
    Get_folder,
    file_upload_folder,
    Get_file,
    Delete_folder,
    Delete_file,
    create_myfeeds,
    save_letter_myfeeds,
    getFeedDetails_byid,
    // ActivefetchFeeds,
    // InActivefetchFeeds,
    // Draft_fetchFeeds,
    deleteFeed,
    updatedFeed,
    Delete_folder_byId,
    Preview_folder_byId,
    updated_folder,
    CreateLikesFeed,
    GetMyFeedsCount_highlight,
    create_myheighlight,
    save_letter_myhighlight,
    get_highLightDetails_byid,
    ActivefetchFeeds_highlight,
    InActivefetchFeeds_highlight,
    Draft_fetchFeeds_highlight,
    // GetMyHighlightCount,
    deleteHighlight,
    updatedHighlight,
    AddLikesHighlight,
    feedsActivate,
    feedsDraft,
    feedsDeactivate,
    highlightActivate,
    highlightDeactivate,
    highlightDraft,
    Publish_Highlight,
    Publish_Feeds,
    Add_ShareFeeds,
    Add_ShareHighlight,
    detailsImage,
    updatedimagefile


}
