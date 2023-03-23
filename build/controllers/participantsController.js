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
exports.participantsController = void 0;
const wcCoreMSQLConnection_1 = require("../config/database/wcCoreMSQLConnection");
const participantsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    switch (req.method) {
        // SELECT PARTICIPANT
        case 'GET':
            if (!req.params.id) {
                // SELECT ALL PARTICIPANTS
                try {
                    const selectAll = yield wcCoreMSQLConnection_1.wcCoreMSQLConnection.query('EXECUTE usp_Participant_SelectAll');
                    res.send(selectAll[0]);
                }
                catch (error) {
                    res.status(500).send(error);
                }
                // HANDLE SELECTION BY conversationId
            }
            else if (req.body.selector === 'conversationId') {
                try {
                    const response = yield wcCoreMSQLConnection_1.wcCoreMSQLConnection.query('EXECUTE usp_Participant_Select_ConId :conversationId', {
                        replacements: {
                            conversationId: req.body.conversationId
                        }
                    });
                    res.send(response[0][0]);
                }
                catch (error) {
                    res.status(500).send(error);
                    console.log(error);
                }
                // HANDLE SELECTION BY userId
            }
            else if (req.body.selector === 'userId') {
                try {
                    const response = yield wcCoreMSQLConnection_1.wcCoreMSQLConnection.query('EXECUTE usp_Participant_Select_UserId :userId', {
                        replacements: {
                            userId: req.body.userId
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
        // CREATE NEW PARTICIPANT
        case 'POST':
            try {
                yield wcCoreMSQLConnection_1.wcCoreMSQLConnection.query('EXECUTE usp_Participant_Create :userId, :conversationId', {
                    replacements: {
                        userId: req.body.userId,
                        conversationId: req.body.conversationId,
                    }
                });
                res.send(`Participant with userId ${req.body.userId} created successfully`);
            }
            catch (error) {
                res.status(500).send(error);
                console.log(error);
            }
            break;
        // UPDATE EXISTING PARTICIPANT
        case 'PUT':
            res.send('Cannot update participant(s)');
            break;
        // DELETE EXISTING PARTICIPANT BY userId AND conversationId
        case 'DELETE':
            try {
                yield wcCoreMSQLConnection_1.wcCoreMSQLConnection.query('EXECUTE usp_Participant_Delete :userId, :conversationId', {
                    replacements: {
                        userId: req.body.userId,
                        conversationId: req.body.conversationId,
                    }
                });
                res.send(`Participant with userId ${req.body.userId} and conversationId ${req.body.conversationId} deleted successfully`);
            }
            catch (error) {
                res.status(500).send(error);
                console.log(error);
            }
            break;
        default:
            res.status(500).send('Please provide appropriate HTTP request type');
            break;
    }
});
exports.participantsController = participantsController;
