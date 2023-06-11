const core = require('@actions/core');
const github = require('@actions/github');

const added_files = core.getInput('added_files');

(
    async () => {
        try {
            core.notice("Sample");
            core.info(added_files);
        } catch (error) {
            core.setFailed(error.message);
        }
    }
)();