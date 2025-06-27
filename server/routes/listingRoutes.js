import { Router } from "express";
import {
    createListing,
    deleteListing,
    findAllChatsForListing,
    findAllListings,
    findListingById,
    findListingsBySeller,
    findOrCreateChatForListing,
    updateListing
} from "../models/listings.js";
import { sellerAuth } from "./auth.js";

const router = Router();

async function verifySellerOwnedListing(req, res, next) {
    const { listingId } = req.params;
    const listing = await findListingById(listingId)
    if (!listing) {
        return res.sendStatus(404);
    }
    if (listing.seller._id.toString() !== req.seller._id.toString()) {
        return res.sendStatus(403);
    }
    res.listing = listing; // attach listing to request for further use
    next();
}

// GET /api/listings
router.get("/", async (req, res) => {
    try {
        const allListings = await findAllListings();
        res.send(allListings);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// POST /api/listings
router.post("/", sellerAuth,  async (req, res) => {
    const { title, description } = req.body
    if (!title) {
        return res.status(400).send("Listings required a title and an optional description")
    }
    try {
        const newListing = await createListing(title, description, req.seller);
        res.send(newListing);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// GET /api/listings/mine
router.get("/mine", sellerAuth, async (req, res) => {
    try {
        const listings = await findListingsBySeller(req.seller);
        res.send(listings);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// GET /api/listings/:listingId
router.get("/:listingId", async (req, res) => {
    const { listingId } = req.params;
    try {
        const listing = await findListingById(listingId);
        res.send(listing);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// PUT /api/listings/:listingId
router.put("/:listingId", sellerAuth, verifySellerOwnedListing, async (req, res) => {
    const { listingId } = req.params;
    const { title, description } = req.body;
``
    try {
        const updated = await updateListing({ _id: listingId, title, description });
        res.send(updated);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// DELETE /api/listings/:listingId
router.delete("/:listingId", sellerAuth, verifySellerOwnedListing, async (req, res) => {
    const { listingId } = req.params;
    try {
        const result = await deleteListing(listingId);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// GET /api/listings/:listingId/chats (Seller View)
router.get("/:listingId/chats", sellerAuth, verifySellerOwnedListing, async (req, res) => {
    const { listingId } = req.params;
    try {
        const chats = await findAllChatsForListing(listingId);
        res.send(chats);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// POST /api/listings/:listingId/chats (Buyer initiates chat)
router.post("/:listingId/chats", buyerAuth, async (req, res) => {
    const { listingId } = req.params;
    const buyerId = req.buyer && req.buyer._id;
    try {
        const chat = await findOrCreateChatForListing(listingId, buyerId);
        res.send(chat);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

export default router