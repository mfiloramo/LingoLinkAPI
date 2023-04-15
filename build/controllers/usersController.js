"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersController = void 0;
const wcCoreMSQLConnection_1 = require("../config/database/wcCoreMSQLConnection");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const usersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    switch (req.method) {
        case 'GET':
            if (!req.body.userId) {
                // SELECT ALL USERS
                try {
                    const selectAll = yield wcCoreMSQLConnection_1.wcCoreMSQLConnection.query('EXECUTE usp_User_SelectAll');
                    res.send(selectAll[0][0]); // TODO: CHANGE BACK TO ARRAY (REMOVE 1 [0])
                }
                catch (error) {
                    res.status(500).send(error);
                }
            }
            else {
                // SELECT USER BY ID
                try {
                    const response = yield wcCoreMSQLConnection_1.wcCoreMSQLConnection.query('EXECUTE usp_User_Select :userId', {
                        replacements: {
                            userId: req.body.userId,
                        }
                    });
                    res.send(response[0][0]);
                }
                catch (error) {
                    res.status(500).send(error);
                    console.log(error);
                }
            }
            break;
        // CREATE NEW USER
        case 'POST':
            if (req.body.token) {
                try {
                    const decodedToken = jsonwebtoken_1.default.decode(req.body.token);
                    const userId = decodedToken.oid;
                    // SELECT USER BY ID
                    const response = yield wcCoreMSQLConnection_1.wcCoreMSQLConnection.query('EXECUTE usp_User_Select :userId', {
                        replacements: {
                            userId,
                        },
                    });
                    if (response[0][0]) {
                        res.send({ success: true, user: response[0][0] });
                    }
                    else {
                        res.status(404).send({ success: false, message: 'User not found' });
                    }
                }
                catch (error) {
                    res.status(500).send(error);
                    console.log(error);
                }
            }
            else {
                try {
                    yield wcCoreMSQLConnection_1.wcCoreMSQLConnection.query('EXECUTE usp_User_Create :username, :email, :password', {
                        replacements: {
                            username: req.body.username,
                            email: req.body.email,
                            password: req.body.password
                        }
                    });
                    res.send(`User ${req.body.username} created successfully`);
                }
                catch (error) {
                    res.status(500).send(error);
                    console.log(error);
                }
            }
            break;
        // UPDATE EXISTING USER
        case 'PUT':
            try {
                yield wcCoreMSQLConnection_1.wcCoreMSQLConnection.query('EXECUTE usp_User_Update :userId, :username, :email, :password', {
                    replacements: {
                        userId: req.body.userId,
                        username: req.body.username,
                        email: req.body.email,
                        password: req.body.password,
                    }
                });
                res.json(`User ${req.body.username} updated successfully`);
            }
            catch (error) {
                res.status(500).send(error);
                console.log(error);
            }
            break;
        // DELETE EXISTING USER BY ID
        case 'DELETE':
            try {
                yield wcCoreMSQLConnection_1.wcCoreMSQLConnection.query('EXECUTE usp_User_Delete :userId', {
                    replacements: {
                        userId: req.body.userId,
                    }
                });
                res.json(`User ${req.body.userId} deleted successfully`);
            }
            catch (error) {
                res.status(500).send(error);
                console.log(error);
            }
            break;
        // THROW ERROR INDICATING INVALID REQUEST TYPE
        default:
            res.status(500).send('Please provide appropriate HTTP request type');
            break;
    }
});
exports.usersController = usersController;
