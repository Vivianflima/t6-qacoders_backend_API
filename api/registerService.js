const _ = require('lodash')
const Register = require('./register')
const fullNameRegex = /^[A-ZÀ-Ÿ][A-zÀ-ÿ']+\s([A-zÀ-ÿ']\s?)*[A-ZÀ-Ÿ][A-zÀ-ÿ']+$/;
const mailRegex = /\S+@\S+\.\S+/;


Register.methods(['get', 'post', 'put', 'delete'])
Register.updateOptions({ new: true, runValidators: true })

Register.after('post', sendErrorsOrNext).after('put', sendErrorsOrNext)
Register.before('post', register).before('put', register)

function sendErrorsOrNext(req, res, next) {
    const bundle = res.locals.bundle

    if (bundle.errors){
        var errors = parseErrors(bundle.errors)   
        res.status(500).json({ errors })     
    } else {
        next()
    }
}

function parseErrors(nodeRestfulErrors){
    const errors = []
    _.forIn(nodeRestfulErrors, error => errors.push(error.message))
    return errors
}

const sendErrorsFromDB = function(res,dbErrors) {
    const errors = []
    _.forIn(dbErrors.errors, error => errors.push(error.message))
    return res.status(400).json({ errors })
}


function register(req, res, next){
    const fullName = req.body.fullName || ''
    const cpf = req.body.cpf || ''
    const mail = req.body.mail || ''
    const phone = req.body.phone || ''
    const address = req.body.address || ''
    const number = req.body.number || ''
    const complement = req.body.complement || ''

    if(fullName == null || fullName == ""){
        return res.status(400).send({ alert: ["O Campo Nome Completo é Obrigatório."] })
    }

    if(!fullName.match(fullNameRegex)){
        return res.status(400).send({ alert: ["Infome o nome e o sobrenome."] })
    }
   
    if(cpf == null || cpf == ""){
        return res.status(400).send({ alert: ["O Campo CPF é Obrigatório."] })
    }
  
    if(mail == null || mail == ""){
        return res.status(400).send({ alert: ["O Campo E-mail é Obrigatório."] })
    }

    if(!mail.match(mailRegex)){
        return res.status(400).send({ alert: ["Infome um e-mail válido."] })
    }
        
       
    const newBody = new Register({
        fullName,
        cpf,
        mail,
        phone,
        address,
        number,
        complement,
    })

    newBody.save(err =>{
        if(err){
            return sendErrorsFromDB(res, err)
        } else{
            res.status(201).json(newBody)
        }

    })
}


module.exports = Register

