// change this so it exports a function to both update the table, adding things to it
// and it has a function to attempt to fetch data from the table
const {google} = require('googleapis');
const axios = require('axios');
const fs = require('fs');
const { saveCredentials } = require('../googleauth');
var moment = require('moment');
const { InteractionCollector } = require('discord.js');
moment().format();
const env = require('dotenv');
env.config();

const credentials = JSON.parse(fs.readFileSync(`client_secret_534397392378-tgenntfvj91qdavdgmnmmjp8tud31pnv.apps.googleusercontent.com.json`, 'utf-8'));
const token = fs.readFileSync('google-oauth-token.json', 'utf-8');
const oAuth2Client = new google.auth.OAuth2(
    credentials.web.client_id, credentials.web.client_secret, credentials.web.redirect_uris[0],
);
oAuth2Client.setCredentials({refresh_token: JSON.parse(token).refresh_token});



module.exports = {
    oAuth2Client,
    async getSheetValue(messageId) {
        // search the primary column of the sheet for the messageId, and if found return the associated interaction

        // const credentials = JSON.parse(fs.readFileSync('client_secret_534397392378-tgenntfvj91qdavdgmnmmjp8tud31pnv.apps.googleusercontent.com.json', 'utf-8'));
        // const authClientObject = new google.auth.OAuth2(
        //     credentials.web.client_id, credentials.web.client_secret, credentials.web.redirect_uris[0],
        // );
        // const token = fs.readFileSync('google-oauth-token.json', 'utf-8');
        // authClientObject.setCredentials(JSON.parse(token));

        const sheet = google.sheets({
            version: "v4",
            auth: oAuth2Client
        });



        const request = {
            spreadsheetId: process.env.GOOGLE_TEST_SHEET_ID,
            valueRenderOption: 'FORMATTED_VALUE',
            range: 'ReportTracker!A1:B',
            majorDimension: 'ROWS',
            auth: oAuth2Client,
        };


        try {
            const data = await sheet.spreadsheets.values.get(request);
            const rows = data.data.values
            for (let i = 0; i < rows.length; i += 1) {
                if(rows[i][0] === messageId) {
                    // then it may be to my advantage to delete this entry here to keep the size of the 
                    // sheet small, unless I can somehow start archiving things after 15 minutes
                    return rows[i][1];
                }
            }
        }
        catch (error) {
            console.error(error);
        }

    },
    async newSheetRow(messageId, interaction_token) {
        // update the google sheet and add a new row to it with the message id of the mod interaction, 
        // and the interaction object of the original ephemeral message

        
        // const token = fs.readFileSync('google-oauth-token.json', 'utf-8');
        // try {
        //     authClientObject.setCredentials(JSON.parse(token));
        // }
        // catch(err) {
        //     console.err(err);
        //     // token not valid
        // }

        const sheet = google.sheets({
            version: "v4",
            auth: oAuth2Client
        });

        await sheet.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_TEST_SHEET_ID,
            range: "ReportTracker!A:B",
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [[`${messageId}`,`${interaction_token}`, moment().add(15,'minute').unix()]],
            },
        });
    },



    // what needs to be done here is
    // 1. check if the person is in the sheet of listed people who have access
    // 2. if they are, check their permissions, and if they have permissions for any other sheet then we have to update all sheets, based on
    // access bits later in their row to align with the permission bit that is now being set
    // 3. if they are not, add them, add their permission bit, and add access bits for every sheet
    // lets please see if wes has a better idea of how to implement this
    // also collapse the viewer and editor commands into a single command with an extra parameter defining what perms the user gets
    async addEditor(user_id, email_address, mod_role, sheet_name, permission) {
        // change this to update access. Should a user have all their access values set to 0, 
        // we remove them. Otherwise, theyre kept. This secondary sheet allows to correctly update without changing the list in any major way
        // we check first if they exist in the sheet, we can do this by grabbing all people inside the sheet and then searching for the id. This should 
        // not be a problem since there should be few people on the list. 
        // if they do not exist we send an update directly to that sheet, else we send the update with their updated permissions to the secondary sheet
        // and the script will properly update the main sheet
        

        // set credentials for access
        // const credentials = JSON.parse(fs.readFileSync('client_secret_534397392378-tgenntfvj91qdavdgmnmmjp8tud31pnv.apps.googleusercontent.com.json', 'utf-8'));
        // const authClientObject = new google.auth.OAuth2(
        //     credentials.web.client_id, credentials.web.client_secret, credentials.web.redirect_uris[0],
        // );
        // const token = fs.readFileSync('google-oauth-token.json', 'utf-8');
        // authClientObject.setCredentials(JSON.parse(token));

        const sheet = google.sheets({
            version: "v4",
            auth: oAuth2Client
        });

        const request = {
            spreadsheetId: process.env.GOOGLE_TEST_SHEET_ID,
            valueRenderOption: 'FORMATTED_VALUE',
            range: 'Access!A2:F',
            majorDimension: 'ROWS',
            auth: oAuth2Client,
        };

        // gather data from main access sheet, check if user is already in the access sheet
        let inAccessSheet = false;
        let row = null;
        try {
            const data = await sheet.spreadsheets.values.get(request);
            const rows = data.data?.values?? false;
            if (rows) {
                for (let i = 0; i < rows.length; i += 1) {
                    if(rows[i][0] === user_id) {
                        inAccessSheet = true;
                        row = rows[i];
                    }
                }
            }
        }
        catch (error) {
            console.error(error);
        }


        if(inAccessSheet) {
            // user exists in the access sheet and we need to send to the updateAccess sheet
            // this also requires enumerating over variable row (theoretically i dont need the flag, i can just check if row is null but this is cleaner)
            let updatedRow = [];
            for (let i = 0; i < row.length; i += 1) {
                updatedRow.push(row[i]);
            }
            if (sheet_name === 'Report_Sheet') {
                updatedRow[3] = permission;
            }
            else if (sheet_name === 'Punishment_Sheet') {
                updatedRow[4] = permission;
            }
            else if (sheet_name === 'Punishment_Log_Form') {
                updatedRow[5] = permission;
            }
            await sheet.spreadsheets.values.append({
                spreadsheetId: process.env.GOOGLE_TEST_SHEET_ID,
                range: "UpdateAccess!A1:F",
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: [updatedRow],
                },
            });
        }
        else {
            // user does not exist yet and need to be added to the access sheet to start with
            let updatedRow = [`${user_id}`,`${email_address}`, `${mod_role}`];
            if (sheet_name === 'Report_Sheet') {
                updatedRow.push(permission);
                updatedRow.push(0);
                updatedRow.push(0);
            }
            else if (sheet_name === 'Punishment_Sheet') {
                updatedRow.push(0);
                updatedRow.push(permission);
                updatedRow.push(0);
            }
            else if (sheet_name === 'Punishment_Log_Form') {
                updatedRow.push(0);
                updatedRow.push(0);
                updatedRow.push(permission);
            }

            await sheet.spreadsheets.values.append({
                spreadsheetId: process.env.GOOGLE_TEST_SHEET_ID,
                range: "Access!A:F",
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: [updatedRow],
                },
            });
        }
        // update actual permissions
        let access_role = null;
        if (permission === 3) 
            access_role = 'writer';
        else if (permission === 2) 
            access_role = 'commenter';
        else if (permission === 1) 
            access_role = 'reader';
        else
            // need to remove access, so instead of post call needs to be delete call
            return;
        const permissions = {
            type: 'user',
            emailAddress: `${email_address}`,
            role: access_role
        };


        // NEED TO CHANGE SHEET ID TO MATCH WHAT IS NECESSARY

        axios.post(`https://www.googleapis.com/drive/v3/files/${process.env.GOOGLE_TEST_SHEET_ID}/permissions`,
        permissions, {headers: {Authorization: "Bearer "+JSON.parse(token).access_token}}
        );

    },
    // removes all access from all sheets
    async removeAccess(user_id) {
        // for what will be done to handle this, we will create another sheet inside of the main sheet.
        // it will solely be sent the user id. We will have a google script running checking that sheet if any ids appear in it. 
        // If they do, it will look for that id within the main access sheet, delete that row, and then delete the row in the secondary sheet
        // this function only needs to write to the secondary sheet. This can also be updated to remove access from certain sheets

        // this will essentially do the same thing as update access but it will instead pass all 0s to the access permissions, 
        // which will tell the google script to delete everything

        const sheet = google.sheets({
            version: "v4",
            auth: oAuth2Client
        });

        const request = {
            spreadsheetId: process.env.GOOGLE_TEST_SHEET_ID,
            valueRenderOption: 'FORMATTED_VALUE',
            range: 'Access!A2:F',
            majorDimension: 'ROWS',
            auth: oAuth2Client,
        };

        // gather data from main access sheet, check if user is already in the access sheet
        let inAccessSheet = false;
        let row = null;
        try {
            const data = await sheet.spreadsheets.values.get(request);
            const rows = data.data.values
            for (let i = 0; i < rows.length; i += 1) {
                if(rows[i][0] === user_id) {
                    inAccessSheet = true;
                    row = rows[i]
                }
            }
        }
        catch (error) {
            console.error(error);
        }

        if(inAccessSheet) {
            // user exists in the access sheet and we need to send to the updateAccess sheet
            // this also requires enumerating over variable row (theoretically i dont need the flag, i can just check if row is null but this is cleaner)
            let updatedRow = [];
            for (let i = 0; i < 3; i += 1) {
                updatedRow.push(row[i]);
            }
            for (let i = 3; i < 6; i += 1) {
                updatedRow.push(0);
            }
            await sheet.spreadsheets.values.append({
                spreadsheetId: process.env.GOOGLE_TEST_SHEET_ID,
                range: "UpdateAccess!A1:F",
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: [updatedRow],
                },
            });
            return 0;
        }
        else {
            return 1;
        }
    },
    async displayPermissions () {
        const sheet = google.sheets({
            version: "v4",
            auth: oAuth2Client
        });

        const request = {
            spreadsheetId: process.env.GOOGLE_TEST_SHEET_ID,
            valueRenderOption: 'FORMATTED_VALUE',
            range: 'Access!A2:F',
            majorDimension: 'ROWS',
            auth: oAuth2Client,
        };

        try {
            const data = await sheet.spreadsheets.values.get(request);
            const rows = data.data.values
            return rows;
        }
        catch (error) {
            console.error(error);
            return null;
        }

    },
}