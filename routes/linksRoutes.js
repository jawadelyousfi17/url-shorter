const { Router, application } = require('express')
const moment = require('moment');

const router = Router()
const Url = require('../models/urls')

router.get('/new', (req, res) => {
    res.render('new', {
        error: null,
        link: null
    })
})

router.post('/new', async (req, res) => {
    const { longurl, shorturlkey } = req.body
    try {
        const myurl = await Url.addUrl(longurl, shorturlkey)
        const user = await res.locals.user
        user.urls.push(myurl)
        user.save()
        res.redirect('/links')
        console.log(myurl)
    } catch (error) {
        console.log(error)
        res.render('new', {
            error,
            link: longurl
        })
    }
})

router.get('/', async (req, res) => {
    const page = req.query.page || 1
    const sort = req.query.sort || 1
    const popular = req.query.popular || 0
    const allurls = req.query.all || 0
    let last, sortedUrls, newdata
    try {
        const pageSize = 10
        const pageNumber = page || 1
        const data = await res.locals.user.populate('urls')
        const startIndex = (pageNumber - 1) * pageSize;
        const endIndex = pageNumber * pageSize;
        if (endIndex >= data.urls.length) last = true
        if (allurls == 0) {
            newdata = data.urls
            if (sort == 1) {
                sortedUrls = newdata.sort((a, b) => b.createdAt - a.createdAt);
            }
            if (sort == 2) {
                sortedUrls = newdata.sort((a, b) => a.createdAt - b.createdAt);
            }
            sortedUrls = sortedUrls.slice(startIndex, endIndex)
        } else {
            newdata = data.urls
            if (sort == 1) {
                sortedUrls = newdata.sort((a, b) => b.createdAt - a.createdAt);
            }
            if (sort == 2) {
                sortedUrls = newdata.sort((a, b) => a.createdAt - b.createdAt);
            }
        }
        if (sort == 1) {
            sortedUrls = newdata.sort((a, b) => b.createdAt - a.createdAt);
        }
        if (sort == 2) {
            sortedUrls = newdata.sort((a, b) => a.createdAt - b.createdAt);
        }
        if (popular == 1) { sortedUrls = newdata.sort((a, b) => b.visited - a.visited) } 
        const date = 5
        if (data) res.render('links', {
            data: sortedUrls || newdata,
            page: parseInt(page),
            last,
            sort,
            popular,
            allurls
        })
    }
    catch (error) {
        res.status(400).render('badreq', {
        })
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        const data = await Url.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: 'Ok' })
    } catch (error) {
        res.render('badreq', {
        })
    }

})

module.exports = router