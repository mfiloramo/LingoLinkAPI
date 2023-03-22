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
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersController = void 0;
const wcCoreMSQLConnection_1 = require("../config/database/wcCoreMSQLConnection");
const usersController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    switch (req.method) {
        // SELECT USER BY ID
        case 'GET':
            try {
                const response = yield wcCoreMSQLConnection_1.wcCoreMSQLConnection.query('EXECUTE usp_User_Select :userId', {
                    replacements: {
                        userId: req.body.userId,
                    }
                });
                res.send(response[0][0]);
            }
            catch (error) {
                console.log(error);
            }
            break;
        // CREATE NEW USER
        case 'POST':
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
                console.log(error);
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
                res.send(`User ${req.body.username} updated successfully`);
            }
            catch (error) {
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
                res.send(`User ${req.body.userId} deleted successfully`);
            }
            catch (error) {
                console.log(error);
            }
            break;
        default:
            break;
    }
});
exports.usersController = usersController;
