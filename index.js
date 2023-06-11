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
    }

});

function strToArr (str){
    return str.split(' ');
}

function groupArr(arr){
    arr.sort();
    const binned = arr.reduce((result, word) => {
        const letter = word.substring(0,12);
        result[letter] = result[letter] || [];
        result[letter].push(word);
        return result;
      }, {})

      return binned;
}


(
    async () => {
        try {
            core.notice("Sample");
            core.info(strToArr(added_files));
            let source = ['06-05-23/Control/1.png', '06-05-23/Control/2.png', '06-05-23/-K/1.png', '06-05-23/-K/2.png', '06-05-23/-N/1.png', '06-06-23/-N/1.png'];
            core.info(JSON.stringify(groupArr(source)));
        } catch (error) {
            core.setFailed(error.message);
        }
    }
)();