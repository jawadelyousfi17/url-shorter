const express = require('express')
const cookieParser = require('cookie-parser')
const path = require('path')
const expressLayouts = require('express-ejs-layouts');



const conectDb = require('./db/conectdb')
const userRoutes = require('./routes/userRoutes')
const linksRoutes = require('./routes/linksRoutes')
const shortRoutes = require('./routes/shortRoutes')
const {userCheck , requireAuth } = require('./middleware.js/authCheck')

const PORT = 3001

const app = express()

// Conect db and run server 
conectDb(() => app.listen(PORT , console.log(`server is running on port ${PORT} ...`))  )

app.use(expressLayouts);
 app.set('view engine', 'ejs')
 app.set('layout', 'layouts/layout')
 app.use(express.static(path.join(__dirname, 'public')))
 app.use(express.json())
 app.use(cookieParser())
 app.use(express.urlencoded({ extended: false }))


 app.use('*' , userCheck , (req , res , next ) => {
    // console.log(user)
    next()
 })
 app.get('/' , (req , res) => {
    res.redirect('/links')
 })
 app.use('/links' , requireAuth , linksRoutes )
 app.use(userRoutes)
app.use(shortRoutes)





      

