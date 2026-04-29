const router = require('express').Router()
const UserController = require('../controllers/UserController')
const verifyToken = requiere('../helpers/verify-token')

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/checkUser', UserController.checkUser)
router.get('/:id', UserController.getUserById)
router.put('/edit/:id', verifyToken.editUser)


module.exports = router