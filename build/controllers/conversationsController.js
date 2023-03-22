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
exports.conversationsController = void 0;
const wcCoreMSQLConnection_1 = require("../config/database/wcCoreMSQLConnection");
const conversationsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    switch (req.method) {
        // SELECT CONVERSATION BY ID
        case 'GET':
            try {
                const response = yield wcCoreMSQLConnection_1.wcCoreMSQLConnection.query('EXECUTE usp_Conversation_Select :conversationId', {
                    replacements: {
                        conversationId: req.body.conversationId,
                    }
                });
                res.send(response[0][0]);
            }
            catch (error) {
                console.log(error);
            }
            break;
        // CREATE NEW CONVERSATION
        case 'POST':
            try {
                yield wcCoreMSQLConnection_1.wcCoreMSQLConnection.query('EXECUTE usp_Conversation_Create :name', {
                    replacements: {
                        name: req.body.name,
                    }
                });
                res.send(`Conversation with name ${req.body.name} created successfully`);
            }
            catch (error) {
                console.log(error);
            }
            break;
        // UPDATE EXISTING CONVERSATION
        case 'PUT':
            try {
                yield wcCoreMSQLConnection_1.wcCoreMSQLConnection.query('EXECUTE usp_Conversation_Update :conversationId, :name', {
                    replacements: {
                        conversationId: req.body.conversationId,
                        name: req.body.name,
                    }
                });
                res.send(`Conversation ${req.body.name} updated successfully`);
            }
            catch (error) {
                console.log(error);
            }
            break;
        // DELETE EXISTING CONVERSATION BY ID
        case 'DELETE':
            try {
                yield wcCoreMSQLConnection_1.wcCoreMSQLConnection.query('EXECUTE usp_Message_Delete :conversationId', {
                    replacements: {
                        conversationId: req.body.conversationId,
                    }
                });
                res.send(`Conversation ${req.body.conversationId} deleted successfully`);
            }
            catch (error) {
                console.log(error);
            }
            break;
        default:
            break;
    }
});
exports.conversationsController = conversationsController;
