
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const todo = require('../models/todo')
const validator = require('../validator/validate')


exports.createTask = (req, res, next) => {
    const body = req.body
    console.log(body)

    if(body.user) {
        const { error, value } = validator.validateUserAndTask.validate(body)    
        if(!error) {    
            todo.findByIdAndUpdate({
                _id: body.user
            }, {
                $push: {
                    record: {
                        task: body.task
                    }
                }
            }).then(r => {
                console.log(r)
                if(r) {
                    res.json({
                        message: 'Task Added'
                    })
                } else {
                    todo.create({
                        _id: body.user,
                        record: [{
                            task: body.task
                        }]
                    }).then(r => {
                        console.log(r)
                        res.json({
                            message: 'Task Added'
                        })
                    })
                }
            }).catch(err => {
                if(err) {
                    console.log(err)
                    res.status(500).json({ message: 'Something Went Wrong' })
                }
              })
    
        } else {
            console.log(error)
            res.status(400).json({ message: error.details[0].message })
        }
    } else {
        const { error, value } = validator.validateTask.validate(body)                    
        if(!error) {
            todo.create({
                record: [{
                    task: body.task
                }]
            }).then(r => {
                console.log(r)
                res.json({
                    user: r._id,
                    message: 'Task Added'
                })
            })
        } else {
            console.log(error)
            res.status(400).json({ message: error.details[0].message })
        }
    }



}

exports.editTask =  (req, res, next) => {
    const record = req.body
    console.log(record);

    const { error, value } = validator.validateUserAndTask.validate(record)

    if(!error) {
        const {
            user: _id,
            task: newRecord
        } = record
    
        todo.updateOne({
            "record": {
                $elemMatch: {
                    _id: _id
                }
            }
        }, {
            $set: {
                'record.$._id': _id,
                'record.$.task': newRecord
            }
        }).then(r => {
            console.log(r)
            res.json({
                message: 'Task Edited'
            })
        }).catch(err => {
            if(err) {
                console.log(err)
                res.status(500).json({ message: 'Something Went Wrong' })
            }
          })
    } else {
        console.log(error)
        res.status(400).json({ message: error.details[0].message })
    }


}

exports.deleteTask = (req, res, next) => {
    const { _id } = req.body
    console.log(_id);
    const {error, value} = Joi.objectId().validate(_id);

    if(!error) {
        todo.updateOne({
            "record": {
                $elemMatch: {
                    _id: _id
                }
            }
        }, {
            $pull: {
                record: {
                    _id
                }
            }
        }).then(r => {
            console.log(r)
            res.json({ message: 'Task Deleted' })
        }).catch(err => {
            if(err) {
                console.log(err)
                res.status(500).json({ message: 'Something Went Wrong' })
            }
          })
    } else {
        console.log(error)
        res.status(400).json({ message: 'Something went wrong. clear cookie and try again.' })
    }

}

exports.deleteAllTask = (req, res, next) => {
    const { _id } = req.body
    console.log(_id);
    const {error, value} = Joi.objectId().validate(_id);

    if(!error) {
        todo.findByIdAndUpdate({
            _id
        }, {
            record: []
        }).then(r => {
            console.log(r)
            res.json({
                message: 'All Task Deleted'
            })
        }).catch(err => {
            if(err) {
                console.log(err)
                res.status(500).json({ message: 'Something Went Wrong' })
            }
          })
    } else {
        console.log(error)
        res.status(400).json({ message: 'Something went wrong. clear cookie and try again.' })
    }


}

exports.getAllTask = (req, res, next) => {
    const id = req.query.id
    console.log(id);
    const {error, value} = Joi.objectId().validate(id);


    if(!error) {    
        todo.findById(id).then(r => {
            console.log(r)
            if(r) {
                res.json(r)
            } else {
                res.json({ record: [] })
            }
        }).catch(err => {
            if(err) {
                console.log(err)
                res.status(500).json({ message: 'Something Went Wrong' })
            }
          })

    } else {
        console.log(error)
        res.status(400).json({ message: 'Something went wrong. clear cookie and try again.' })
    }
}