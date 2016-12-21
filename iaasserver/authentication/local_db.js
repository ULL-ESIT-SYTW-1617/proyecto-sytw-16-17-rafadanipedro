const passport = require('passport');
const { Strategy } = require('passport-local')
const bcrypt = require('bcrypt-nodejs')
const Sequelize = require('sequelize')
const express = require('express')
const UserSchema = require('../models/user_db')

let db
let User

const getModel = () => User

const strategy = (config) => {
  db = new Sequelize('database', 'rafa', 'password', {
    dialect: 'sqlite',
    storage: './db.sqlite'
  });

  User = UserSchema(db)

  db.sync().then(() => {
    console.log('Conectado con sqlite!!')

    User.findOne().then(user => {
      if(!user) {
        return Promise.all(config.BaseDatos.lectores.map((lector, i) =>
            i === 0 ?
              User.create({email: lector, password: bcrypt.hashSync('1234'), admin: true}) :
              User.create({email: lector, password: bcrypt.hashSync('1234'), admin: false})
        ))
      }
    })
    .then(() => console.log('Metidos todos los usuarios'))
    .catch(err => {
      console.log('Hubo un error')
      console.error(err)
    })
  })

  return new Strategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (email, password, done) => {
    console.log(`Parece que el usuario ${email} quiere auntenticarse`)
    User.findOne({where: {email}}).then(user => {
      console.log('Buscando al usuario...')
      if (!user) return done(null, false)
      console.log('Encontré al usuario')
      if (bcrypt.compareSync(password, user.password)) {
        user.auth = 'Local'
        console.log('Las contraseñas coinciden')
        return done(null, user)
      }
      console.log('Las contraseñas no coinciden')
      return done(null, false)
    }).catch(console.error)
  })
}

const login = () => {
  const router = express.Router()
  router.get('/login/password', (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/login')
    res.render('reg', req.user)
  })

  router.get('/login/email', (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/login')
    res.render('email', req.user)
  })

  router.post('/login/password', (req, res) => {
    if (bcrypt.compareSync(req.body.NewPass, req.user.password)) {
      return res.render('error', {error: true, message: 'La contraseña que tenías es la misma'})
    }

    if (bcrypt.compareSync(req.body.OldPassword, req.user.password)) {
      if (req.body.NewPass === req.body.ConfirmPass) {
        User.findOne({where: {email: req.user.email}})
          .then(user =>
            user.update({password: bcrypt.hashSync(req.body.NewPass)})
          )
          .then(() =>
            res.redirect('/logout')
          )
          .catch(err =>
            res.render('error', {error: true, message: 'Hubo un error desconocido al intentar cambiarte la contraseña'})
          )
      } else {
        res.render('error', {error: true, message: 'Las contraseñas no coinciden'})
      }
    }
  })

  router.post('/login/email', (req, res) => {
    if (req.body.NewEmail !== req.body.ConfirmEmail) {
      return res.render('error', {error: true, message: 'Los emails no coinciden'})
    }

    User.findOne({where: {email: req.user.email}})
      .then(user =>
        user.update({email: req.body.NewEmail})
      )
      .then(() =>
        res.redirect('/logout')
      )
      .catch(err =>
        res.render('error', {error: true, message: 'Hubo un error desconocido al intentar cambiarte la contraseña'})
      )
  })

  router.post('/login/local', passport.authenticate('local', {failureRedirect : '/login'}), (req, res) => res.redirect('/'));

  return router
}

const middleware = () => {
  const router = express.Router()

  // Comprobar que el uuario está autenticado
  router.use((req, res, next) => {
    if (!req.user.password) {
      return next()
    }
    if(bcrypt.compareSync('1234', req.user.password)) {
      return res.redirect('/login/password')
    }
    next()
  })

  router.post('/api/users', (req, res) => {
    User.create({email: req.body.email, password: bcrypt.hashSync('1234')})
    .then(() => res.send('Se ha creado correctamente el usuario!'))
    .catch(err => res.status(500).send(err))
  })

  router.post('/api/users/:id', (req, res) => {
    User.findById(req.params.id)
    .then(user => user.update({email: req.body.email}))
    .then(() => res.send('Tengo que modificar el email!'))
    .catch(err => res.status(500).send(err))
  })

  router.delete('/api/users/:id', (req, res) => {
    User.findById(req.params.id)
    .then(reg => reg.destroy())
    .then(() => res.send('Se ha eliminado correctamente el usuario!'))
    .catch(err => res.status(500).send(err))
  })

  return router
}


module.exports = {
  strategy,
  login,
  middleware,
  getModel
}
