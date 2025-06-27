import { Router } from "express";
import { createBuyer, deleteBuyer, findAllBuyers, findBuyerById, updateBuyer } from "../models/buyers.js";
import { findAllChatsForBuyer } from "../models/listings.js";
import { buyerAuth } from "./auth.js";

const router = Router();


// Middleware to check if the authenticated buyer matches the buyerId in params
function verifyBuyerId(req, res, next) {
    const { buyerId } = req.params;
    if (!req.buyer || req.buyer._id.toString() !== buyerId) {
        return res.status(403).send("Forbidden: You can only access your own account.");
    }
    next();
}

router.get('/', async (req, res) => {
    try {
        const allBuyers = await findAllBuyers()
        res.send(allBuyers)
    }
    catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

router.post('/', async (req, res) => {
    const { username, email, password} = req.body
    if (!username || !email || !password) {
        return res.status(400).send("username and email and password required")
    }

    try {
        const newBuyer = await createBuyer(username, email, password)
        res.send(newBuyer)
    }
    catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

router.get('/:buyerId',  buyerAuth, verifyBuyerId, async function (req, res) {
    const { buyerId } = req.params

    try {
        const buyer = await findBuyerById(buyerId)
        res.send(buyer)
    }
    catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

router.put('/:buyerId',  buyerAuth, verifyBuyerId, async function (req, res) {
    const { username, email } = req.body
    if (!username || !email) {
        return res.status(400).send("username and email required")
    }
    const { buyerId } = req.params

    try {
        const buyer = await updateBuyer({
            _id: buyerId,
            email,
            username
        } )
        res.send(buyer)
    }
    catch (error) {
        console.log(error)
        res.sendStatus(500)
    }

})

router.get('/:buyerId/chats',  buyerAuth, verifyBuyerId, async function (req, res) {
    const { buyerId } = req.params;
    try {
        const chats = await findAllChatsForBuyer(buyerId);
        res.send(chats);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.delete('/:buyerId', async function(req, res) {
    const { buyerId } = req.params

    try {
        const result = await deleteBuyer(buyerId)
        res.send(result)
    }
    catch (error) {
        console.log(error)
        res.sendStatus(500)
    }

})

export default router