const express = require('express')
const router = express.Router()
const api = require('../controllers/api')



router.post('/create', api.createTask)

router.put('/edit', api.editTask)

router.delete('/delete', api.deleteTask)

router.delete('/delete-all', api.deleteAllTask)

router.get('/get', api.getAllTask)


module.exports = router;

