import mongoose from 'mongoose';

const whatsappSchema = mongoose.Schema({
    message: String,
    name: String,
    timestamp: String,
    from: String,
    to: String
});


export default mongoose.model('messagecontent', whatsappSchema);