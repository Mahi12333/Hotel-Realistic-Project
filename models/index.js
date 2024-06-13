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
    Watchlater
}




