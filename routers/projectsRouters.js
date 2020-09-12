const express = require('express')

const router = express.Router()

const Projects = require("../data/helpers/projectModel")


router.get("/", async (req, res) => {
    try {
        const projects = await Projects.get()
        res.status(200).json(projects)
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error', errInfo: err})
    }
})

router.get("/:id",validateProjectId, (req, res) => {
    res.status(200).json(res.project)
})

router.post("/", validateBody, async (req, res) => {
    const body = req.body

    try {
        const project = Projects.insert(body)
        res.status(201).json(project)
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
            res.status(400).json({ error: "that project Id is not in the DB"})
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

function validateBody(req, res, next) {
    const body = req.body

    if(!body || body === {}) {
        res.status(400).json({ message: 'Missing Project data' })
    } else {
        if(body.name && body.description) {
            next()
        } else {
            res.status(400).json({ message: 'Missing required Name or Description field' })
        }
    }
}



module.exports = router