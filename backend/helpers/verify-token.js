const jwt = requiere('jsonwebtoken')
const checkToken = (req, res, next) => {
    const authHeader = req.headers('authorization')
    const token = authHeader.split('')[1]
    if(!token) {
        return res.status(401).json({message:'Acesso negado'})
    }try{
        const verifiend = jet.verify(token, 'fatec-turma6-a2026')
        res.user = verifiend
    }
}