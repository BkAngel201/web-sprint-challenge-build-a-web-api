const express = require('express')

const router = express.Router()

const Actions = require("../data/helpers/actionModel")
const Projects = require("../data/helpers/projectModel")
const { route } = require('./projectsRouters')


router.get("/", async (req, res) => {
    try {
        const actions = await Actions.get()
        res.status(200).json(actions)
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error', errInfo: err})
    }
})

router.get("/:id",validateActionId, (req, res) => {
    res.status(200).json(res.action)
})

router.post("/", validateBody, async (req, res) => {
    const body = req.body

    try {
        const action = await Actions.insert(body)
        res.status(201).json(action)
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error', errInfo: err})
    }
})

router.delete("/:id", validateActionId, async (req, res) => {
    const { id } = req.params

    try {
        const action = await Actions.remove(id)
        if(action === 1) {
            res.status(200).json({ message: 'Action Deleted'})
        } else {
            res.status(400).json({ message: "Error Deleting the Action form DB"})
        }
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error', errInfo: err})
    }
})


router.put("/:id", validateActionId, validateBody, async(req, res) => {
    const { id } = req.params

    try{
        const action = await Actions.update(id, req.body)
        res.status(200).json(action)
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error', errInfo: err})
    }
})



// Middleware functions
async function validateProjectId(req, res, next) {
    const { id } = req.params
    try {
        const project = await Projects.get(id)
        if(project === null) {
            res.status(404).json({ error: "that project Id is not in the DB"})
        } else {
            res.project = project
            next()
        }
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error', errInfo: err})
    }
}

async function validateActionId(req, res, next) {
    const { id } = req.params
    try {
        const action = await Actions.get(id)
        if(action === null) {
            res.status(404).json({ error: "that action Id is not in the DB"})
        } else {
            res.action = action
            next()
        }
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error', errInfo: err})
    }
}

function validateBody(req, res, next) {
    const body = req.body

    if(!body || body === {}) {
        res.status(400).json({ message: 'Missing Project data' })
    } else {
        if(body.description && body.project_id && body.notes) {
            next()
        } else {
            res.status(400).json({ message: 'Missing required Project ID or Description or Notes fields' })
        }
    }
}


module.exports = router