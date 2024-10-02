import Commission from "./CommisionModel.js";
import Material from "./MaterialModel.js";
import Offer from "./OfferModel.js";
import Payment from "./PaymentsModel.js";
import Place from "./PlaceModel.js";
import ProjectDesignType from "./ProjectDesignModel.js";
import Amenity from "./amenetiesModel.js";
import HomeSchema from "./homeModel.js";
import HomeBannerSlider from "./homebannersliderModel.js";
import MyFeeds from "./myfeedsModel.js";
import Project from "./projectModel.js";
import User from "./userModel.js";
import ProjectAmenity from "./ProjectamenitiesModel.js"
import UserLikes from "./likeModel.js";
import Watchlater from "./watchLaterModel.js";
import Attachments from "./AttachmentsModel.js"
import Passwordreset from "./PasswordresetModel.js";
import Locations from "./locationsModal.js";
import Communitys from "./communitiesModal.js"
import Developers from "./developerModal.js"
import ProjectTrack from "./projectTracksModal.js"
import Estimation from "./estimationsModal.js";
import NearByAmenity from "./nearByAmenitiesModal.js"
import ProjectNearByAmenity from "./ProjectNearByAmenitiesModal.js"
import Team from "./teamModal.js"
import Emailcommition from "./emailcommitionModel.js";
import Emailverify from "./emailverifyModel.js";
import Communication from './CommunicationModal.js' 
import Notification from "./notificationModel.js";
import New_Project from "./new_projectModel.js";
import Device_token from "./device_tokenModel.js";
import Folder from "./FolderModel.js";
import Assect_image from "./assect_imageModel.js";
import Assect_Feed from "./assect_feedModel.js";
import MyHighlight from "./myheighlightModel.js";
import Assect_Highlight from "./assect_highlight.js";
import UserShares from "./shareModel.js";
import Common_project from "./common_projectModel.js";
import HighlightLikes from "./assect_highlight_likeModel.js";
import HighlightShare from "./assect_highlight_share.Model.js";

ProjectAmenity.belongsTo(Amenity);
Amenity.hasMany(ProjectAmenity);

// Define the association
User.hasMany(Watchlater);
Watchlater.belongsTo(User);

// // You might also want to export other associations if needed
// ProjectAmenity.sync({alter:true}).then(() => console.log('alter created'))
Project.hasMany(Place, { foreignKey: 'project_id' });
Project.hasMany(ProjectAmenity, { foreignKey: 'project_id' });
Project.hasMany(Material, { foreignKey: 'project_id' });
Project.hasMany(ProjectDesignType, { foreignKey: 'project_id' });
Project.hasMany(Payment, { foreignKey: 'project_id' });
Project.hasMany(Offer, { foreignKey: 'project_id' });
Project.hasMany(Commission, { foreignKey: 'project_id' });



// Associations for Folder, Assect_image, Assect_Feed, and Assect_Highlight models
Folder.hasMany(Assect_image, { foreignKey: 'folderId'});
Assect_image.belongsTo(Folder, { foreignKey: 'folderId'});

Folder.hasMany(Assect_Feed, { foreignKey: 'folderId'});
Assect_Feed.belongsTo(Folder, { foreignKey: 'folderId'});

Folder.hasMany(Assect_Highlight, { foreignKey: 'folderId'});
Assect_Highlight.belongsTo(Folder, { foreignKey: 'folderId'});

MyFeeds.hasMany(Assect_Feed, { foreignKey: 'feedId' });
Assect_Feed.belongsTo(MyFeeds, { foreignKey: 'feedId' });

MyHighlight.hasMany(Assect_Highlight, { foreignKey: 'highlightId' });
Assect_Highlight.belongsTo(MyHighlight, { foreignKey: 'highlightId' });

// HighlightLikes Model
// HighlightLikes.belongsTo(Assect_Highlight, { foreignKey: 'pid' });
// Assect_Highlight.hasMany(HighlightLikes, { foreignKey: 'pid' });

// // HighlightShare Model
// HighlightShare.belongsTo(Assect_Highlight, { foreignKey: 'pid' });
// Assect_Highlight.hasMany(HighlightShare, { foreignKey: 'pid' });



// Assect_Highlight.sync({ alter: true });
// Assect_Feed.sync({ alter: true });
// Assect_image.sync({ alter: true });
// Folder.sync({ alter: true });
// HighlightLikes.sync();
// HighlightShare.sync();
// Assect_Highlight.sync(); 


export  {
    Material,
    UserLikes,
    Place,
    ProjectAmenity,
    Amenity,
    Commission,
    HomeBannerSlider,
    HomeSchema,
    MyFeeds,
    Offer,
    Payment,
    ProjectDesignType,
    Project,
    User,
    Watchlater,
    Attachments,
    Passwordreset,
    Locations,
    Communitys,
    Developers,
    ProjectTrack,
    Estimation,
    NearByAmenity,
    ProjectNearByAmenity,
    Team,
    Emailcommition,
    Emailverify,
    Communication,
    Notification,
    New_Project,
    Device_token,
    MyHighlight,
    Folder,
    Assect_image,
    Assect_Feed,
    Assect_Highlight,
    UserShares,
    Common_project,
    HighlightLikes,
    HighlightShare
}




