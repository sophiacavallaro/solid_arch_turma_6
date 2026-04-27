const User = require('../models/User')
const bcrypt = require ('bcrypt')
const { checkout } = require('../routers/UserRouters')

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

        if(confirmpassword){
            res.status(422).json({message: 'Confirmação de senha é obrigatorio'})
            return
        }

        if(!password !== confirmpassword){
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
            res.status(201).json({message: 'Usuario criado no Get Pet',
            newUser
        }) 
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

            if(checkPassword){
                res.status(401).json({
                    message:'Nâo autorizado, sem registro'
                })
                return
            }
            await createUserToken(userExist, req, res)
        }

}

