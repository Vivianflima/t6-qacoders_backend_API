const { Model } = require('mongoose')
const beautifulUnique = require('mongoose-beautiful-unique-validation');
const restful = require('node-restful');
const mongoose = restful.mongoose

const registerSchema = new mongoose.Schema({ 
    fullName: { type: String, required: true},
    cpf: { type: String, required: true},
    mail: { type: String, required: true},
    phone: { type: String, required: false},
    address: { type: String, required:true},
    number: { type: Number, required: false},
    complement: { type: String, required: false}
})

registerSchema.plugin(beautifulUnique)

module.exports = restful.model('Register', registerSchema)