const jwt = require ('jsonwebtoken')
const User = require('../models/User')

const getUserToken = async (token) => {
    const decodad = jwt.verify(token,'fatec-turma6-a2026')
    const userId = decodad.id 
    const user = await User.findById({_id:userId})
    return user
}
module.exports = getUserToken