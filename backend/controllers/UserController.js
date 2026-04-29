const User = require('../models/User')
const bcrypt = require ('bcrypt')
const createUserToken = require('../helpers/create-user-token')
const getTokens = require ('../helpers/get-tokens')

module.exports = class UserController {
    static async register(req, res) {

        const {name, email, phone, password,confirmpassword} = req.body
        if(!name){
            res.status(422).json({message: 'Nome é obrigatorio'})
            return
        }

        if(!email){
            res.status(422).json({message: 'Email é obrigatorio'})
            return
        }

        if(!phone){
            res.status(422).json({message: 'Telefone é obrigatorio'})
            return
        }

        if(!password){
            res.status(422).json({message: 'Senha é obrigatorio'})
            return
        }

        if(!confirmpassword){
            res.status(422).json({message: 'Confirmação de senha é obrigatorio'})
            return
        }

        if(password !== confirmpassword){
            res.status(422).json({message: 'As senhas não coincidem'})
            return
        }
        const userExist = await User.findOne({email: email})

        if(userExist){
            res.status(422).json({message:'O usuario ja existe em nossos registros.'})
            return
        }

        const salt =await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        const user = new User({
            name,
            email,
            phone,
            password: passwordHash,
        })
        try{
            const newUser = await user.save()
            await createUserToken (newUser,req,res)
        
        }catch (error){
            res.status(503).json({message: error})
        }
    }
        static async login(req,res){
            const{email, password} = req.body 

            if(!email){
                res.status(422).json({message: 'Email é obrigatorio'})
                return
            }
            if(!password){
                res.status(422).json({message: 'Senha é obrigatorio'})
                return
            }
            const userExist = await User.findOne({email: email})
            if(userExist){
                res.status(401).json({
                    message:'Nâo autorizado, sem registro'
                })
                return
            }
            const checkPassword = await bcrypt.compare(password, userExist.password)

            if(!checkPassword){
                res.status(401).json({
                    message:'Nâo autorizado, sem registro'
                })
                return
            }
            await createUserToken(userExist, req, res)
        }
    static async checkUser(req,res){
        let currentUser

        console.log(req.headers.authorization)

        if(req.headers.authorization){
            const token = getToken(req)
            const decodeToken = jwt.verify(token,'fatec-turma6-a2026')
            currentUser = await User.findById(decodeToken.id)
            currentUser.password = undefined

        }else{
            currentUser = null
        }
        res.status(200).send(currentUser)
    }
    static async getUserById(req,res){
        const id = req.parms.id
        const user = await User.findById(id)

        if(!user)
        res.status(404).json({
        messege:'Usuario não encontrado'
})
return
}
res.status(200).json(user)
}

static async editUser(req, res){
    res.status(200).json({
        message:'Usuario atualizado com sucesso!'
    })
}

