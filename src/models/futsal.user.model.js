import mongoose from "mongoose";

const futsalUserSchema = mongoose.Schema({}, { strict: false });

const FutsalUser = mongoose.model("FutsalUser", futsalUserSchema);
export default FutsalUser;
