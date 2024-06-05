const jwt = require('jsonwebtoken')
const JWT_SECRET = 'Manishisagood@boy';

const fetchuser = (req, resp, next) =>{
    const token = req.header('auth-token');
    if(!token){
        resp.status(401).send({error: "pleasee authenticate using a valid token"});
    }

    try{
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    }
    catch(error){
        resp.status(401).send({error: "please authenticate using a valid token"});
    }

}

module.exports = fetchuser;
