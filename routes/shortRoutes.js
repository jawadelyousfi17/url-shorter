const { Router } = require('express')
const router = Router()
const Url = require('../models/urls')

router.get('/:id' , async (req , res ) =>  {
    const shorturl = req.params.id
    try {
        const myurl = await Url.findOne({shorturl}) 
        if(myurl) {
            myurl.visited++
            myurl.save()
            res.redirect(myurl.longurl)
        } else {
            res.status(404).render('404')
        }
    } catch (error) {
        
    }
})

module.exports = router