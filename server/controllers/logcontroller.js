const Express = require("express");
const router = Express.Router();
const { LogModel } = require("../models");
const Log = require("../models/log");
const validateJWT = require("../middleware/validate-jwt");


/* Posting a Log */
router.post('/', validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const { id } = req.user;
    const logEntry = {
        description,
        definition,
        result,
        owner_id: id
    }
    try {
        const newLog = await LogModel.create(logEntry);
        res.status(200).json(newLog);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/* Getting all Logs for individual */
router.get('/', validateJWT, async (req, res) => {
    const { id } = req.user;
    try {
        const userLogs = await LogModel.findAll({
            where: {
                owner_id: id
            }
        });
        res.status(200).json(userLogs);
    } catch (err) {
        res.status(500).json({ error: err });
    }
})

/* Getting an individuals log by id */
router.get("/:id", validateJWT, async (req, res) => {
    const owner_id = req.user.id;
    const logId = req.params.id;
    try {
        const idLog = await LogModel.findAll({
            where: {
                owner_id,
                id: logId
            }
        });
        res.status(200).json(idLog);
    } catch (err) {
        res.status(500).json({ error: err });
    }
})
/* Updating an individuals log by id */
router.put("/:id", validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const logId = req.params.id;
    const { id } = req.user;

    const query = {
        where: {
            owner_id: id,
            id: logId
        }
    };

    const updatedLog = {
        description: description,
        definition: definition,
        result: result
    };
    try {
        const update = await LogModel.update(updatedLog, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/* Deleting an individuals log by id */
router.delete("/:id", validateJWT, async (req, res) => {
    const logId = req.params.id;
    const { id } = req.user;

    try {
        const query = {
            where: {
                owner_id: id,
                id: logId
            }
        }

        await LogModel.destroy(query);
        res.status(200).json({ message: "Log removed." })
    } catch (err) {
        res.status(500).json({ error: err });
    }
});


module.exports = router;