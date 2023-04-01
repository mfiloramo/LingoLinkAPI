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
exports.messagesController = void 0;
const wcCoreMSQLConnection_1 = require("../config/database/wcCoreMSQLConnection");
const messagesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    switch (req.method) {
        // SELECT MESSAGE
        case 'GET':
            if (!req.params.id) {
                // SELECT ALL MESSAGES
                try {
                    const selectAll = yield wcCoreMSQLConnection_1.wcCoreMSQLConnection.query('EXECUTE usp_Message_SelectAll');
                    res.send(selectAll[0]);
                }
                catch (error) {
                    res.status(500).send(error);
                }
            }
            else {
                // SELECT MESSAGES BY CONVERSATION ID
                try {
                    const response = yield wcCoreMSQLConnection_1.wcCoreMSQLConnection.query('EXECUTE usp_Message_Select :conversationId', {
                        replacements: {
                            conversationId: req.params.id
                        }
                    });
                    res.json(response[0]);
                }
                catch (error) {
                    res.status(500).send(error);
                    console.log(error);
                }
            }
            break;
        // CREATE NEW MESSAGE
        case 'POST':
            try {
                yield wcCoreMSQLConnection_1.wcCoreMSQLConnection.query('EXECUTE usp_Message_Create :conversationId, :userId, :content, :timestamp', {
                    replacements: {
                        conversationId: req.body.conversationId,
                        userId: req.body.userId,
                        content: req.body.content,
                        timestamp: new Date().toISOString()
                    }
                });
                res.json(`Message with conversationId ${req.body.conversationId} created successfully`);
            }
            catch (error) {
                res.status(500).send(error);
                console.log(error);
            }
            break;
        // UPDATE EXISTING MESSAGE
        case 'PUT':
            try {
                yield wcCoreMSQLConnection_1.wcCoreMSQLConnection.query('EXECUTE usp_Message_Update :messageId, :content, :timestamp', {
                    replacements: {
                        messageId: req.body.messageId,
                        content: req.body.content,
                        timestamp: new Date().toISOString(),
                    }
                });
                res.json(`Message ${req.body.messageId} updated successfully`);
            }
            catch (error) {
                res.status(500).send(error);
                console.log(error);
            }
            break;
        // DELETE EXISTING MESSAGE BY MESSAGE ID
        case 'DELETE':
            try {
                yield wcCoreMSQLConnection_1.wcCoreMSQLConnection.query('EXECUTE usp_Message_Delete :messageId', {
                    replacements: {
                        messageId: req.body.messageId,
                    }
                });
                res.json(`Message ${req.body.messageId} deleted successfully`);
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
exports.messagesController = messagesController;
