const express = require('express');
const passport = require('passport');
const { Strategy } = require('passport-github')
const { ensureLoggedIn } = require('connect-ensure-login')
const github = require ('octonode')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const path = require ('path')
const fs = require('fs')
const https = require('https')
const http = require('http')
const md5= require ('md5')
//const User = require ('./models/user_db')
const config = require('./config.json')


/*if(config.Local){
  //let dropbox = false
  const localAuth = dropbox ? require('./authentication/local') : require('./authentication/local_db')
}*/
const githubAuth = require('./authentication/github')
const localAuth = require('./authentication/local_db')


const app = express();

// NOTE: Configurar todas las est rategias
passport.use(githubAuth.strategy(config))
passport.use(localAuth.strategy(config))

passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));

app.set('views', path.resolve(__dirname + '/views'));
app.set('view engine', 'ejs');

app.use(logger('tiny'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/assets', express.static('assets'))

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

app.get('/login', (req, res) => {
  if (req.isAuthenticated()) return res.redirect('/')
  res.render('login', {config})
})

app.get('/error', (req, res) => {
  res.render('error')
})
// NOTE: Configurar todos los logins

app.use(githubAuth.login())
app.use(localAuth.login())

// NOTE: configurar todos los middlewares

app.use((req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login'))
app.use(githubAuth.middleware(config))
app.use(localAuth.middleware(config))

// Algo asi

// app.get('/libro', (req, res) => {
//   res.sendFile(path.resolve('gh-pages/index.html'));
// })

//app.get('/libro', express.static(path.resolve(__dirname, 'gh-pages')))

app.use('/libro', express.static(path.resolve(__dirname, 'gh-pages')))

app.use('/profile', (req, res) => {
  const autenticadoConGithub = req.user._json ? true : false


  let src = ''
  let name = ''
  if(autenticadoConGithub) {
    src = req.user._json.avatar_url
    name = req.user.displayName
  } else {
    src = `https://www.gravatar.com/avatar/${md5(req.user.email)}?s=200`
    name = req.user.email
  }
  console.log(localAuth)
  if (req.user.admin) {
    localAuth.getModel().findAll().then(users => {
      res.render('profile', {
        config: req.user,
        src,
        autenticadoConGithub,
        name,
        admin: true,
        users
      })
    })
  } else {
      res.render('profile', {
      config: req.user,
      src,
      autenticadoConGithub,
      name,
      admin: false
    })
  }

})

app.get('*', (req, res) => {
  res.render('libro', {user: req.user})
})

app.use((req, res) => {
  res.status(404).send('Not found');
})

app.use((req, res) => {
  console.log('estas entrando a ' + req.originalUrl)
})

app.use((req, res) => res.render('error', {error: true}))
/*
const all = require('./https')

all(config, config).then(keys => {
  https.createServer({
    key: keys.serviceKey,
    cert: keys.certificate},
  app)
  .listen(config.puerto);
})

express().get('*', (req, res) => {
  res.redirect(`https://${config.host}:${config.puerto}${req.url}`)
}).listen(8080);
*/

app.listen(process.env.PORT || 8080)