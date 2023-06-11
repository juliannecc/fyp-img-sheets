const core = require('@actions/core');
const github = require('@actions/github');
const {google} = require('googleapis');
const keys = require('./keys.json')

const added_files = core.getInput('added_files');

const private_key_id = core.getInput('private_key_id');
const private_key = core.getInput('private_key');
const client_email = core.getInput('client_email');
const client_id = core.getInput('client_id');
const client_x509_cert_url = core.getInput('client_x509_cert_url');
const spreadsheetid = core.getInput('spreadsheetid');

const owner = core.getInput('owner');
const repo = core.getInput('repo');

function strToArr (str){
    return str.split(' ');
}

function groupArr(arr){
    arr.sort();
    const binned = arr.reduce((result, word) => {
        const letter = word.substring(0,14);
        result[letter] = result[letter] || [];
        result[letter].push(word);
        return result;
      }, {})

      return binned;
}

const chars =
    ['A', 'B', 'C', 'D', 'E',
      'F', 'G', 'H', 'I', 'J',
      'K', 'L', 'M', 'N', 'O',
      'P', 'Q', 'R', 'S', 'T',
      'U', 'V', 'W', 'X', 'Y', 'Z'];

const numberToExcelHeader = (index) => {
  index -= 1;

  const quotient = Math.floor(index / 26);
  if (quotient > 0) {
    return numberToExcelHeader(quotient) + chars[index % 26];
  }

  return chars[index % 26];
};

const client = new google.auth.JWT(
    client_email, 
    null, 
    private_key, 
    ['https://www.googleapis.com/auth/spreadsheets']
);

client.authorize(function(err, tokens){

    if(err){
        core.error(err);
        return
    } else {
        core.info("Connected");

        const fileObj  = groupArr(strToArr(added_files));
        let fileList = Object.keys(fileObj);
        fileList.forEach((folder) => {
            let sheet = folder.split("/")[1];
              let col = numberToExcelHeader(parseInt(folder.split("/")[0].split("-")[1]));
              fileObj[folder].forEach((file) => {
              let row = parseInt(file.match(/(?<=_)[0-9]*/gi)[0])+2
              let cell = col+row;
              let link = `=Image("https://raw.githubusercontent.com/${owner}/${repo}/main/${file}")`;
              console.log(sheet, cell, link)
              gsrun(client, sheet, cell, [[link]]);
            });
        });

        
    }

});

async function gsrun(cl, sheet, cell, link){
    const gsapi = google.sheets({version:'v4', auth:cl});
    const updateOptions = {
        spreadsheetId: `${spreadsheetid}`,
        range: `${sheet}!${cell}`,
        valueInputOption:'USER_ENTERED',
        resource: {values: link}
    };

    let response = await gsapi.spreadsheets.values.update(updateOptions);
    core.info(JSON.stringify(response));

}

// (
//     async () => {
//         try {
//             core.notice("Sample");
//             core.info(strToArr(added_files));
//             let source = ['06-05-23/Control/1.png', '06-05-23/Control/2.png', '06-05-23/-K/1.png', '06-05-23/-K/2.png', '06-05-23/-N/1.png', '06-06-23/-N/1.png'];
//             core.info(JSON.stringify(groupArr(source)));
//         } catch (error) {
//             core.setFailed(error.message);
//         }
//     }
// )();