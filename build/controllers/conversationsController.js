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
const conversationsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('ping controller');
    switch (req.method) {
        // SELECT CONVERSATION
        case 'GET':
            if (!req.params.id) {
                // SELECT ALL CONVERSATIONS
                try {
                    const selectAll = yield wcCoreMSQLConnection_1.wcCoreMSQLConnection.query('EXECUTE usp_Conversation_SelectAll', {
                        replacements: {
                            userId: req.params.id
                        }
                    }).catch((err) => console.log(err));
                    res.json(selectAll[0]);
                }
                catch (error) {
                    res.status(500).send(error);
                }
            }
            else {
                // SELECT CONVERSATION BY ID
                try {
                    const response = yield wcCoreMSQLConnection_1.wcCoreMSQLConnection.query('EXECUTE usp_Conversation_Select_UserId :userId', {
                        replacements: {
                            userId: req.params.id
                        }
                    });
                    res.send(response[0]);
                }
                catch (error) {
                    res.status(500).send(error);
                    console.log(error);
                }
            }
            break;
        // CREATE NEW CONVERSATION
        case 'POST':
            try {
                const conversationId = yield wcCoreMSQLConnection_1.wcCoreMSQLConnection.query('EXECUTE usp_Conversation_Create :name', {
                    replacements: {
                        name: req.body.name,
                    }
                });
                // RETURN NEW CONVERSATION ID
                res.json(conversationId[0][0]);
            }
            catch (error) {
                res.status(500).send(error);
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
                res.json(`Conversation ${req.body.name} updated successfully`);
            }
            catch (error) {
                res.status(500).send(error);
                console.log(error);
            }
            break;
        // DELETE EXISTING CONVERSATION BY ID
        case 'DELETE':
            try {
                yield wcCoreMSQLConnection_1.wcCoreMSQLConnection.query('EXECUTE usp_Conversation_Delete :conversationId', {
                    replacements: {
                        conversationId: req.body.conversationId,
                    }
                });
                res.json(`Conversation ${req.body.conversationId} deleted successfully`);
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
exports.conversationsController = conversationsController;
