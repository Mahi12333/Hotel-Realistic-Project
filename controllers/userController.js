import asyncHandler from 'express-async-handler'
import generatedToken from '../utils/generatedToken.js';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Material, Place, Amenity, Commission, HomeBannerSlider, HomeSchema, MyFeeds, Offer, Payment, ProjectDesignType, Project, User, ProjectAmenity, Watchlater } from '../models/index.js';
import fs from 'fs/promises'
import { Op, where } from 'sequelize';
import { sequelize } from '../config/db.js';
import { ApiError } from '../utils/ApiErrors.js';
import { ApiResponse } from '../utils/ApiReponse.js';
import cloudinary from '../config/cloudinary.js';




// @desc Auth user/set token
// route Post /api/users/auth
// @access Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    // Check the user and password match
    if (user && await bcrypt.compare(password, user.password)) {

         const { accessToken, refreshToken } = generatedToken(res,user.id);
        res.status(200).json({
           user,
           accessToken,
           refreshToken
        });

    } else {
        throw new ApiError(400, "Invalid email and password" );  
    }
});


// @desc register user
// route Post /api/users/register
// @access Public
const registerBroker = asyncHandler(async (req, res) => {
    console.log('zaid');
    const {
         password, email, first_name, last_name,
        address, communication, is_active, team_name, channel_ptn_id, contact_number
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
        throw new ApiError(400, "User already exists" ) ; 
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);  // 10 rounds is generally enough, more rounds are more secure but slower
    const hashedPassword = await bcrypt.hash(password, salt);
    const username = first_name + last_name

    // Create new user with all the fields
    const user = await User.create({
        username:username.replace(/\s+/g, '').toLowerCase(), password: hashedPassword, email, first_name, last_name, logo: req.file.path,
        address, communication, role: '3', is_active, team_name, channel_ptn_id, contact_number
    });

    if (user) {
        generatedToken(res, user.id);  // Assuming generatedToken function returns a token

        const response={
            id: user.id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
        }
        return res.json(
            new ApiResponse(201, response, "User registered Successfully")
        )
    } else {
        throw new ApiError(400, "Invalid user data" ) ; 
    }
});

const registerChannelPartner = asyncHandler(async (req, res) => {
    const {
         password, email, first_name, last_name, company_name,
        address, communication, is_active, team_name, contact_number
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
        throw new ApiError(400, "User already exists" ); 
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);  // 10 rounds is generally enough, more rounds are more secure but slower
    const hashedPassword = await bcrypt.hash(password, salt);
    const username = first_name + last_name

    // Create new user with all the fields
    const user = await User.create({
        username:username.replace(/\s+/g, '').toLowerCase(), password: hashedPassword, email, first_name, last_name, logo: req.file.path, company_name,
        address, communication, role: '2', is_active, team_name, channel_ptn_id: '0', contact_number
    });

    if (user) {
        const token = generatedToken(res, user.id);  // Assuming generatedToken function returns a token

        const response={
            id: user.id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            token
        }
        return res.json(
            new ApiResponse(201, response, "User registered Successfully")
        )

    } else {
        throw new ApiError(400, "Invalid user data" ) ; 
    }
});



// @desc logout user
// route Post /api/users/logout
// @access Public
const logoutUser = asyncHandler(async (req, res) => {

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
})

// @desc get user profile
// route Get /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.user.id,
        {
            attributes: { exclude: ['password'] }
        });

    if (user) {
        return res.json(
            new ApiResponse(201, user, "User Profile Fetch Successfully")
        )
    }
    else {
        throw new ApiError(404, "Invalid user data" ) ; 
    }

})

// @desc update user profile
// route Put /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.user.id)

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password
        }

        const updateUser = await user.save();
        const response={
            id: updateUser.id,
            name: updateUser.username,
            email: updateUser.email
        }
        return res.json(
            new ApiResponse(201, response, "User registered Successfully")
        )

    }
    else {
        throw new ApiError(404, "Invalid user data" ) ; 
    }
   
})


const refreshToken = asyncHandler(async (req, res) => {
    const refreshTokens = req.cookies.refreshToken;


    if (!refreshTokens) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }

    try {

        const decoded = jwt.verify(refreshTokens, process.env.JWT_REFRESH_SECRET);
        const { accessToken, refreshToken } = generatedToken(res, decoded.userId);
     
        res.status(200).json({ message: 'Token refreshed successfully',accessToken,refreshToken });

    } catch (error) {
        throw new ApiError(403, "Invalid refresh token" ) ; 
    }
})

//! need for modified --------------------------------
// const homeBanner = asyncHandler(async (req, res) => {

//     const {
//         project_name, redirect_link, is_active, created_at
//     } = req.body;

//     const homebannerDetails = await HomeSchema.create({
//         project_name, redirect_link, banner_img: req.file.path, is_active, created_at
//     });
//     if (homebannerDetails) {
//         res.status(201).json(homebannerDetails);
//     } else {
//         res.status(400);
//         throw new Error('Invalid data');
//     }
// })

const getImageDimensions = async (filepath) => {
    const result = await cloudinary.api.resource(filepath);
    return { width: result.width, height: result.height };
  };

const homeBanner = asyncHandler(async (req, res) => {
    const {
        project_name, redirect_link, is_active,
    } = req.body;
    if (!project_name && !redirect_link && !is_active) {
        throw new ApiError(400, "All fields are required");
    }
    // const count = await HomeSchema.count({
    //     where: {
    //       project_name: project_name,
    //       is_active: "1"
    //     }
    //   });
    //   if(count>=2){
    //     throw new ApiError(400, "Two Project Name already Created");
    //   }

    const getallHomeBanner = [];
    for (const file of req.files) {
        const publicId = file.filename;
        const dimensions = await getImageDimensions(publicId);
        if (dimensions.width >= 1920 || dimensions.height >= 1080) {
            const device_type = 'desktop';
            const DesktopBannar = await HomeSchema.create({
                project_name, redirect_link, banner_img: file.path, is_active, types: device_type
            });
            getallHomeBanner.push(DesktopBannar);
        }
        else if (dimensions.width <= 400 || dimensions.height <= 200) {
            const device_type = 'mobile';
            const MobileBannar = await HomeSchema.create({
                project_name, redirect_link, banner_img: file.path, is_active, types: device_type
            });
            getallHomeBanner.push(MobileBannar);
        } else {
            throw new ApiError(400, "Image Size is Invalid");
        }

    }
    return res.json(new ApiResponse(201, getallHomeBanner, "Home Banners Successfully Created"));
})


const getHomeBanner = asyncHandler(async (req, res) => {
    const { device_type } = req.query;
    console.log(device_type);
    let  getallHomeBanner = []
    if(device_type){
        const device = device_type.toLocaleLowerCase();
        getallHomeBanner = await HomeSchema.findAll(
           {
               where: {
                   is_active: '1',
                   types: device
               },
           });
    }
    else{
        getallHomeBanner = await HomeSchema.findAll(
           {
               where: {
                   is_active: '1',
               },
               attributes: {
                exclude: ['is_active','types','createdAt','updatedAt']
            }
           });
    }
    if (getallHomeBanner) {
        return res.json(
            new ApiResponse(200, getallHomeBanner, "banner images load succssefully")
        )
    }
    else {
        throw new ApiError(403, "data is not available");
    }
})

const addProjectFiles = asyncHandler(async (req, res) => {
    for (const file of req.files) {
        await ProjectDesignType.create({
            project_id: req.body.project_id,
            file_name: file.originalname,
            project_design_type: req.body.project_design_type,
            file_path: file.path
        })
    }
    return res.json(
        new ApiResponse(201, "File uploaded successfully")
    )
})
const viewProjectFiles = asyncHandler(async (req, res) => {
    const { project_id, project_design_type } = req.body
    const projectFiles = await ProjectDesignType.findAll({
        where: {
            project_id,
            project_design_type
        }
    });
    return res.json(
        new ApiResponse(200,projectFiles, "File successfully Display")
    )
})
const deleteProjectFiles = asyncHandler(async (req, res) => {
    const { id } = req.body;

    const projectFile = await ProjectDesignType.findByPk(id);
    if (!projectFile) {
        throw new ApiError(404, "No project files found with the provided ID." ) ; 
    }

    let filePath = projectFile.file_path;
    filePath = filePath.replace(/\\/g, '/');

    await ProjectDesignType.destroy({
        where: {
            id: id
        }
    })

    // Delete the file from the file system
    const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
    if (fileExists) {
        // Delete the file from the file system
        await fs.unlink(filePath);
    } else {
        console.warn('File does not exist:', filePath);
    }
    return res.json(
        new ApiResponse(200, "Project file and associated file deleted successfully.")
    )
})

const activateHomeBanner = asyncHandler(async (req, res) => {
    const home = await HomeSchema.findByPk(req.body.id)
    if (!home) {
        throw new ApiError(404, "Home Banner not found" ) ; 
    }

    await home.update({ is_active: '1' });
    await home.save();
    return res.json(
        new ApiResponse(200, "this Banner activated in live website.")
    )
})

const AddProject = asyncHandler(async (req, res) => {
    let project;
    const data = req.body;
    if (data.step === '0') {

        if (data.project_id) {
            let existingProject = await Project.findOne({ where: { id: data?.project_id } });
            if (existingProject) {
                // Update existing project with filled fields
                const filledFields = Object.entries(data).filter(([key, value]) => value !== '')
                    .reduce((obj, [key, value]) => {
                        obj[key] = value;
                        return obj
                    }, {})
                if (data.images !== '') {
                    filledFields.project_banner = req?.file?.path;
                }
                await existingProject.update(filledFields);

                project = await Project.findAll({
                    where: {
                        id: data.project_id
                    },
                    include: [
                        {
                            model: Place,
                            where: {
                                project_id: data.project_id
                            },
                            required: false
                        },
                        {
                            model: Material,
                            where: {
                                project_id: data.project_id
                            },
                            required: false
                        },
                        {
                            model: ProjectDesignType,
                            where: {
                                project_id: data.project_id
                            },
                            required: false
                        },
                        {
                            model: Payment,
                            where: {
                                project_id: data.project_id
                            },
                            required: false
                        },
                        {
                            model: Offer,
                            where: {
                                project_id: data.project_id
                            },
                            required: false
                        },
                        {
                            model: Commission,
                            where: {
                                project_id: data.project_id
                            },
                            required: false
                        },
                        {
                            model: ProjectAmenity,
                            attributes: ['is_check'],
                            where: { project_id: data.project_id },
                            required: false,
                            include: [
                                {
                                    model: Amenity,
                                    attributes: ['id', 'name', 'images'],
                                    required: false
                                }
                            ]
                        }
                    ]
                })
                return res.json(
                    new ApiResponse(200,project, "Project when step is 0.")
                )
            }
        }
        else {

            // Create new project
            if (data.images === '') {
                data.project_banner = ''
            }
            else {
                data.project_banner = req?.file?.path
            }
            data.user_id = req.user.id
            data.is_publish = '0'
            project = await Project.create(data);
            return res.json(
                new ApiResponse(201,project, "Project")
            )
        }


    }
    if (data.step === '1') {
        // Step 1 fields (only required fields)
        const step1Data = {
            project_name: data.project_name,
            developer_name: data.developer_name,
            community_name: data.community_name,
            location: data.location,
            project_type: data.project_type,
            description: data.description,
            project_banner: req.file.path, // Assuming this is required for step 1
            step: data.step,
            user_id: req.user.id,
            is_publish: '0',
            commission: '',
            amenities: '',
            service_charge: '',
            area_starts: '',
            bedroom: '',
            estimation: '',
            starting_price: ''
        };
        project = await Project.create(step1Data);
        return res.json(
            new ApiResponse(201,project, "Project when step is 1.")
        )
    }
    else if (data.step === '2') {
        // Step 2 fields (additional fields required)
        const step2Data = {
            starting_price: data.starting_price,
            estimation: data.estimation,
            bedroom: data.bedroom,
            area_starts: data.area_starts,
            service_charge: data.service_charge,
            step: data.step
        };
        // Find the project by project_id and update it with step 2 data
        project = await Project.findOne({ where: { id: data.project_id } });
        if (!project) {
            throw new ApiError(404, "Project not found" ) ; 
        }
        await project.update(step2Data);
        return res.json(
            new ApiResponse(201,project, "Project when step is 2.")
        )
    }
    else if (data.step === '3' || data.step === '4') {
        const stepData = {
            step: data.step,
        };
        // Find the project by project_id and update it with step 2 data
        project = await Project.findOne({ where: { id: data.project_id } });
        if (!project) {
            throw new ApiError(404, "Project not found" ) ; 
        }
        await project.update(stepData);
        return res.json(
            new ApiResponse(201,project, "Project when step is 3 and 4.")
        )
    }
    else if (data.step === '5') {
        const step5Data = {
            step: data.step,
            commission: data.commission
        };
        // Find the project by project_id and update it with step 2 data
        project = await Project.findOne({ where: { id: data.project_id } });
        if (!project) {
            throw new ApiError(404, "Project not found" ) ; 
        }
        await project.update(step5Data);
        return res.json(
            new ApiResponse(201,project, "Project when step is 5.")
        )
    }
    else if (data.step === '6') {
        project = await Project.findOne({ where: { id: data.project_id } });
        await project.update({ step: data.step });
        project = await Project.findAll({
            where: {
                id: data.project_id
            },
            include: [
                {
                    model: Place,
                    where: {
                        project_id: data.project_id
                    },
                    required: false
                },
                {
                    model: Material,
                    where: {
                        project_id: data.project_id
                    },
                    required: false
                },
                {
                    model: ProjectDesignType,
                    where: {
                        project_id: data.project_id
                    },
                    required: false
                },
                {
                    model: Payment,
                    where: {
                        project_id: data.project_id
                    },
                    required: false
                },
                {
                    model: Offer,
                    where: {
                        project_id: data.project_id
                    },
                    required: false
                },
                {
                    model: Commission,
                    where: {
                        project_id: data.project_id
                    },
                    required: false
                },
                {
                    model: ProjectAmenity,
                    attributes: ['is_check'],
                    where: { project_id: data.project_id },
                    include: [
                        {
                            model: Amenity,
                            attributes: ['id', 'name', 'images'],
                            required: false
                        }
                    ]
                }
            ]
        })
        return res.json(
            new ApiResponse(201,project, "Project when step is 6.")
        )
    }
    else if (data.step === '7') {
        project = await Project.findOne({ where: { id: data.project_id } });
        await project.update({ step: data.step, is_publish: "1" });
        return res.json(
            new ApiResponse(200,project, "Project are successfully Publish.")
        )
    }
})


const NearbyPlaces = asyncHandler(async (req, res) => {
    const data = req.body

    const insertPlacesObj = {
        project_id: data.project_id,
        place: data.place,
        place_time: data.place_time
    }

    const placeData = await Place.create(insertPlacesObj)
    if (!placeData) {
        throw new ApiError(404, "Place is not found" ) ; 
    }

    return res.json(
        new ApiResponse(200,placeData, "Nearby Place successfully add your project.")
    )
})

const AddAmenitiesGlobal = asyncHandler(async (req, res) => {
    const data = req.body

    const insertAmenitiesObj = {
        name: data.name,
        images: data.images,
    }

    const amentiesData = await Amenity.create(insertAmenitiesObj)
    if (!amentiesData) {
        throw new ApiError(404, "amenities is not found" ) ; 
    }

    return res.json(
        new ApiResponse(201,amentiesData, "amenities successfully add your project.")
    )
})
const ViewAmenities = asyncHandler(async (req, res) => {
    const { id, is_check, project_id } = req.body;

    if (id !== undefined) {
        const amenity = await Amenity.findByPk(id);

        if (!amenity) {
            throw new ApiError(404, "amenities is not found" ) ; 
        }
        // Check if a ProjectAmenity entry exists for the provided amenityId and projectId
        let existingProjectAmenity = await ProjectAmenity.findOne({
            where: {
                AmenityId: id,
                project_id: project_id
            }
        });

        // If a ProjectAmenity entry exists, toggle the value of is_check
        if (existingProjectAmenity) {

            const isCheck = existingProjectAmenity.is_check == 'true' ? 'false' : 'true'

            await existingProjectAmenity.update({ is_check: isCheck })
        }
        else {
            await ProjectAmenity.create({
                AmenityId: id,
                project_id: project_id,
                is_check: 'true' // Assuming is_check should be true for new entries

            });
        }
    }

    // If no ProjectAmenity entry exists, create a new one with is_check set to true

    const amenities = await Amenity.findAll({

        include: [{
            model: ProjectAmenity,
            attributes: ['is_check'],
            required: false,
            where: { project_id: project_id }
        }]
    })

    const response = amenities.map(amenity => {
        const amenityData = amenity.toJSON();
        if (!amenityData.ProjectAmenities || amenityData.ProjectAmenities.length === 0) {
            amenityData.ProjectAmenities = [{ is_check: 'false' }];
        }
        return amenityData;
    });

    return res.json(
        new ApiResponse(201,response, "amenities successfully project.")
    )
})

const UploadMarketingMaterial = asyncHandler(async (req, res) => {
    const { file_type, project_id } = req.body

    const marketingMaterial = await Material.create({
        project_id,
        file_name: req.file.originalname,
        file_path: req.file.path,
        file_type
    })
    return res.json(
        new ApiResponse(201,marketingMaterial, "documents uploaded.")
    )
})

const ProjectOffers = asyncHandler(async (req, res) => {
    const { project_id, title, description } = req.body;

    const projectOfferInsert = await Offer.create({
        project_id,
        title,
        description
    })
    return res.json(
        new ApiResponse(201,projectOfferInsert, "documents uploaded.")
    )
})

const ProjectPayments = asyncHandler(async (req, res) => {
    const { project_id, installment, notes } = req.body;

    const projectPaymentsInsert = await Payment.create({
        project_id,
        installment,
        notes
    })
    return res.json(
        new ApiResponse(201,projectPaymentsInsert, "Payments inserted.")
    )
})
const ProjectCommision = asyncHandler(async (req, res) => {
    const { project_id, commission, description } = req.body;

    const projectCommisionInsert = await Commission.create({
        project_id,
        commission,
        description
    })
    return res.json(
        new ApiResponse(201,projectCommisionInsert, "Commision inserted.")
    )
})

const projectFilter = asyncHandler(async (req, res) => {
    const { amenities } = req.query

    let filter = {};

    const filterableFields = ['project_name', 'developer_name', 'community_name', 'bedroom', 'estimation', 'project_type'];

    // Loop through each filterable field
    filterableFields.forEach(field => {
        // If the query parameter for the field is provided, apply the filter
        if (req.query[field]) {
            filter[field] = {
                [Op.like]: `%${req.query[field]}%`
            };
        }
    });
    let parsedAmenities;

    if (amenities) {
        parsedAmenities = JSON.parse(amenities);


        filter.id = {
            [Op.in]: await sequelize.literal(`(SELECT "project_id" FROM "tbl_project_amenitities" WHERE "AmenityId" IN (${parsedAmenities.join(',')}) AND "is_check"='true'  GROUP BY "project_id" HAVING COUNT(DISTINCT "AmenityId") = ${parsedAmenities.length})`)
        };
    }


    // Fetch projects based on the filter
    const projects = await Project.findAll({
        where: filter,
        include: [
            {
                model: ProjectAmenity,
                as: 'ProjectAmenities',
                attributes: [],
                required: true // Ensure that only projects with associated amenities are returned
            }
        ],

    });



    const projectIds = projects.map(project => project.id);

    
    const project = await Project.findAll({
        where: {
            id: projectIds
        },
        include: [
            {
                model: Place,
                required: false
            },
            {
                model: Material,
                required: false
            },
            {
                model: ProjectDesignType,
                required: false
            },
            {
                model: Payment,
                required: false
            },
            {
                model: Offer,
                required: false
            },
            {
                model: Commission,
                required: false
            },
            {
                model: ProjectAmenity,
                attributes: ['is_check'],
                include: [
                    {
                        model: Amenity,
                        attributes: ['id', 'name', 'images'],
                        required: false
                    }
                ]
            }
        ]
    })

    // Fetch all amenities associated with the filtered projects




    if (project.length > 0) {
        return res.json(
            new ApiResponse(200,project, "project.")
        )
    }
    else {
        throw new ApiError(404, "project is not found" ) ; 
    }

})

const ProjectDraft = asyncHandler(async (req, res) => {
   
    const project = await Project.findAll({
        where: {
            is_publish: '0'
        },
        include: [
            {
                model: Place,
                required: false
            },
            {
                model: Material,
                required: false
            },
            {
                model: ProjectDesignType,

                required: false
            },
            {
                model: Payment,

                required: false
            },
            {
                model: Offer,

                required: false
            },
            {
                model: Commission,

                required: false
            },
            {
                model: ProjectAmenity,
                attributes: ['is_check'],

                include: [
                    {
                        model: Amenity,
                        attributes: ['id', 'name', 'images'],
                        required: false
                    }
                ]
            }
        ]
    })
    if (project) {
        return res.json(
            new ApiResponse(200,project, "project.")
        )
    }
    else {
        throw new ApiError(404, "project is not found" ) ; 
        
    }

})

const viewAllProjects = asyncHandler(async (req, res) => {
    const project = await Project.findAll({
        where: {
            is_publish: '1'
        },
        include: [
            {
                model: Place,
                required: false
            },
            {
                model: Material,
                required: false
            },
            {
                model: ProjectDesignType,

                required: false
            },
            {
                model: Payment,

                required: false
            },
            {
                model: Offer,

                required: false
            },
            {
                model: Commission,

                required: false
            },
            {
                model: ProjectAmenity,
                attributes: ['is_check'],

                include: [
                    {
                        model: Amenity,
                        attributes: ['id', 'name', 'images'],
                        required: false
                    }
                ]
            }
        ]
    })
    if (project) {
        return res.json(
            new ApiResponse(200,project, "project.")
        )
    }
    else {
        throw new ApiError(404, "project is not found" ) ;
    }
})


const CompareProjects = asyncHandler(async (req,res) => {
    const project_id = req.body.projectIds;
    const campareProjectsData = await Project.findAll({
        where:{
            id:project_id,
            is_publish:'1'
        },
        include: [
            {
                model: Place,
                required: false
            },
            {
                model: Material,
                required: false
            },
            {
                model: ProjectDesignType,

                required: false
            },
            {
                model: Payment,

                required: false
            },
            {
                model: Offer,

                required: false
            },
            {
                model: Commission,

                required: false
            },
            {
                model: ProjectAmenity,
                attributes: ['is_check'],
               where:{
                is_check:'true'
               },
                include: [
                    {
                        model: Amenity,
                        attributes: ['id', 'name', 'images'],
                        required: false
                    }
                ]
            }
        ]
    })
    if(campareProjectsData){
        return res.json(
            new ApiResponse(200,campareProjectsData, "project.")
        )
    }
    else{
        throw new ApiError(404, "project is not found" ) ;
    }
})


const WatchLatersProject = asyncHandler(async (req,res) => {
    const UserId = req.user.id
    const {project_id,name} = req.body
    console.log(UserId);
    const existingWatchlater = await Watchlater.findOne({
        where:{
            UserId,
            project_id
        }
    });
    if(existingWatchlater){
        await existingWatchlater.update({
            is_check:!existingWatchlater.is_check
        })
        if(existingWatchlater.is_check){
            return res.json(
                new ApiResponse(201, "Project saved to Watch later.")
            )
        }
        else{
            return res.json(
                new ApiResponse(201, "Project remove to Watch later.")
            )
        }
    }
    else{
        await Watchlater.create({
            UserId,project_id,is_check:true,name
        })
        
         return res.json(
            new ApiResponse(201, "Project Save to Watch later.")
        )
    }

    
   
})

const WatchLaterView = asyncHandler(async (req,res) => {
    const WatchLaterViewShow = await Watchlater.findAll({
        where:{
            UserId:req.user.id,
            is_check:true
        },
        attributes:{
            exclude:['UserId']
        }
     
    })
    if(WatchLaterViewShow.length > 0){
        return res.json(
            new ApiResponse(200,WatchLaterViewShow, "Project saved to Watch later.")
        )
    }
    else{
        throw new ApiError(404, "data not found" ) ;
    }
})



export {
    authUser,
    registerBroker,
    registerChannelPartner,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    refreshToken,
    homeBanner,
    getHomeBanner,
    addProjectFiles,
    viewProjectFiles,
    deleteProjectFiles,
    activateHomeBanner,
    AddProject,
    NearbyPlaces,
    AddAmenitiesGlobal,
    ViewAmenities,
    UploadMarketingMaterial,
    ProjectOffers,
    ProjectPayments,
    ProjectCommision,
    projectFilter,
    ProjectDraft,
    viewAllProjects,
    CompareProjects,
    WatchLatersProject,
    WatchLaterView,
  

}

