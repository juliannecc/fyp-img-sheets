const core = require('@actions/core');
const github = require('@actions/github');

const added_files = core.getInput('added_files');

function strToArr (str){
    return str.split(' ');
}

function groupArr (arr){
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
            core.info(groupArr(source));
        } catch (error) {
            core.setFailed(error.message);
        }
    }
)();