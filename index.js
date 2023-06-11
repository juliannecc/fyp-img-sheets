const core = require('@actions/core');
const github = require('@actions/github');

const token = core.getInput('token');
const octokit = github.getOctokit(token);

const owner = core.getInput('owner');
const repo = core.getInput('repo');
const commit_id = core.getInput('commit_id');

async function getCommit(owner, repo, commit_id){
    try {
        const commitOut = octokit.rest.git.getCommit({
            owner: `${owner}`,
            repo: `${repo}`,
            commit_sha: `${commit_id}`,
          });

        return commitOut;
    } catch (error) {
        core.setFailed(error)
    }

}

(
    async () => {
        try {
            core.notice("Sample");
            const commitOutput = getCommit(owner, repo, commit_id);
            commitOutput.then((response) => {
                core.info(response.data);
            })
        } catch (error) {
            core.setFailed(error.message);
        }
    }
)();