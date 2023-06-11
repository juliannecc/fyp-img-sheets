const core = require('@actions/core');
const github = require('@actions/github');

const added_files = core.getInput('added_files');

function strToArr (str){
    return str.split(' ');
}

(
    async () => {
        try {
            core.notice("Sample");
            core.info(strToArr(added_files));
        } catch (error) {
            core.setFailed(error.message);
        }
    }
)();