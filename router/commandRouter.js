const router = require("express").Router();
const commandContrller = require("../controller/commandController");

router.post("/command", commandContrller.parseCommand.bind(commandContrller));
module.exports = router;