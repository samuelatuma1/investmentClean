import {
    atom, selector, Selector
} from "recoil";

import {storeDataInLs, getLsValue} from "../utils.js";
/**
 * @desc => User Atom
 * @default => default: {
        fullName: "",
        email: "",
        token: "",
        _id
    }
 */



const User = atom({
    key: "User",
    default: {
        fullName: "",
        email: "",
        token: "",
        _id: ""
    }
})

/**
 * const UserState: RecoilState<{
    fullName: string;
    email: string;
    token: string;
    _id: string;
}>
 */
const UserState = selector({
    key: "UserState",
    /**
     * 
     * @param {*} param
     * @returns {User} => {fullName: string;
    email: string;
    token: string;
    _id: string;}
     */
    get: ({get}) => {
         return get(User)?.token ? get(User) : getLsValue("user");
    },

    /**
     * @desc sets a new user {fullName: string;
    email: string;
    token: string;
    _id: string;}
     */
    set: (({get, set}, {fullName, email, token, _id}) => {
        // store Data in local storage
        storeDataInLs("user", {fullName, email, token, _id});

        set(User, {fullName, email, token, _id});
    })
})

export {UserState};