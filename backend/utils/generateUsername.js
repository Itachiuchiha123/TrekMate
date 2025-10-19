import { customAlphabet } from "nanoid";
import User from "../models/user.model.js";

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 5);

export const generateUniqueUsername = async (base = "user") => {
    let username = `${base}_${nanoid()}`;
    let exists = await User.findOne({ username });

    while (exists) {
        username = `${base}_${nanoid()}`;
        exists = await User.findOne({ username });
    }

    return username;
};
