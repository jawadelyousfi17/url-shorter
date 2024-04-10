const { Router } = require('express')
const router = Router()

const { signup, login, logout } = require('../controllers/userControllers')
const { loginCheck , requireAuth } = require('../middleware.js/authCheck')



router.post('/signup', signup)

router.post('/login', login)


// router.post('/login', login)


router.get('/login', loginCheck , (req, res) => {
    res.render('login' , {
        error : null , 
       data :  { username : '' , name : '' } 
    })
})
router.get('/signup', loginCheck , (req, res) => {
    res.render('signup', {
        data : { username : '' , name : '' } ,
        error:  { username: null, password: null, name: null }

    })
})
// router.get('/signup', loginCheck, (req, res) => {
//     res.render('signup', {
//         error: null
//     })
// })
router.get('/logout', requireAuth ,  logout )
// router.get('/reset' ,   requireAuth ,userCheck , reset_get)
// router.post('/reset' , userCheck , reset )



module.exports = router