const { Octokit } = require("octokit");
const {} = require("process");
const { execSync } = require("child_process");
// const {v4} = require("crypto");
const { existsSync, mkdirSync, rmdirSync, rm } = require("fs");
const getRandomId = () => (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2);

var all_branch = [];

var workspace_dir = __dirname + "/temp_workspace";

// make directory
const makeDir = (f) => {
  return !existsSync(f) && mkdirSync(f, { recursive: true, force: true });
};

// delete directory
const deleteDir = (f = workspace_dir) => {
  return existsSync(f) && rmdirSync(f, { recursive: true });
};

deleteDir();
// const { OctokitRest = Octokit } = require("@octokit/rest");
// const token = "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";//jooeg
const token = "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";//daimondjoel

const exec_sync = (command) => {
  execSync(command, { stdio: "inherit", shell: true });
};

// create branch inside directory with git command
const createBranch = (repoNameUrl, repoName, new_branch_name, rebaseWith = 'main') => {
    const id = getRandomId();
    all_branch.push(`${workspace_dir + '/' + id + '/' + new_branch_name }`);
    makeDir(`${workspace_dir + '/' + id}`);
    try {
        // exec_sync(`cd ${workspace_dir + '/' + id } && git clone ${repoNameUrl}`);
        // exec_sync(`cd ${workspace_dir + '/' + id + '/' + repoName } && git checkout -b ${new_branch_name}`);
        // exec_sync(`cd ${workspace_dir + '/' + id + '/' + repoName } && git rebase ${rebaseWith}`);
        // exec_sync(`cd ${workspace_dir + '/' + id + '/' + repoName } && git push --set-upstream origin ${new_branch_name}`);
        exec_sync(`cd ${workspace_dir + '/' + id } && git init && git config --global core.longpaths true && git clone ${repoNameUrl} && cd ${repoName} && git branch ${new_branch_name} && git checkout ${new_branch_name} && git fetch origin && git merge origin ${new_branch_name} && git pull origin ${new_branch_name} && git rebase ${ rebaseWith } && git push --set-upstream origin ${new_branch_name}`);
    } catch (err) {
        console.log(`Error: ${err}`);
    }
    return id;
};

// delete branch inside directory with git command
const deleteBranch = (branchName) => {
    exec_sync(`cd ${workspace_dir + '/' + getRandomId() } && git branch -D ${branchName}`);
    deleteDir(workspace_dir);
};

// clone main branch and create a pr branch from a repo in the temp_workspace with GitHub CLI
const cloneMainBranchh = (owner) => {
  exec_sync(`gh repo clone ${owner}/stip-demo --branch main --single-branch`);
  exec_sync(`cd stip-demo && git checkout -b new-pr`);
  exec_sync(`cd stip-demo && git push --set-upstream origin new-pr`);
};

// createBranch("https://github.com/JOOOEG123/stip-demo.git");

// }
createBranch("https://github.com/Daimondjoel22/automation-test.git", "automation-test", "new-pr1");

const createPullRequest = async (owner) => {
  const { data } = await octokit.request("POST /repos/{owner}/{repo}/pulls", {
    owner: owner,
    repo: "stip-demo",
    title: "test",
    head: "new-pr",
    base: "main",
  });
}
   


// createBranch('main_branch');

// const octokitRest = new OctokitRest({
//     auth: token,
//     userAgent: 'myApp v1.2.3',
//     baseUrl: 'https://api.github.com',
//     log: {
//         debug: () => {},
//         info: () => {},
//         warn: console.warn,
//         error: console.error
//     },
//     request: {
//         agent: undefined,
//         fetch: undefined,
//         timeout: 0
//     }
// });
// octokitRest.res

const octokit = new Octokit({
  auth: token,
});

// octokit.request('GET /user').then(({ data }) => {
//     console.log(data.login);
// });

const getUserName = async () => {
  const { data } = await octokit.request("GET /user");
  console.log(data);
  return data.login;
};

// create a pull request in a repo
// const createPullRequest = async (owner) => {
//   const { data } = await octokit.request("POST /repos/{owner}/{repo}/pulls", {
//     owner: owner,
//     repo: "stip-demo",
//     title: "new PR",
//     head: "new-pr",
//     base: "main",
//   });
//   console.log(data);
//   return data;
// };

// merge main branch to release branch
const mergeMainToRelease = async (owner) => {
  const { data } = await octokit.request("POST /repos/{owner}/{repo}/merges", {
    owner: owner,
    repo: "automation-test",
    base: "main",
    head: "new-pr1",
  });
  // console.log(owner, data);
  return data;
};
getUserName();
mergeMainToRelease("Daimondjoel22");


// octokit.rest.pulls.create(
//     {
//         owner: 'JOOOEG123',
//         repo: 'stip-demo',
//         title: 'new PR',
//         head: 'new-pr',
//         base: 'main'
//     }
// ).then(({ data }) => {
//     console.log(data);
// }
// );

// clone main branch and create a pr branch
const cloneMainBranch = async (owner) => {
  const { data } = await octokit.request(
    "POST /repos/{owner}/{repo}/git/refs",
    {
      owner: owner,
      repo: "stip-demo",
      ref: "refs/heads/new-pr",
      sha: "c3d0be41ecbe669545ee3e94d31ed9a4bc91ee3c",
    }
  );
  console.log(data);
  return data;
};

// read a ts file in main branch
const readTsFile = async (owner) => {
  const { data } = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner: owner,
      repo: "stip-demo",
      path: "src/environments/environment.ts",
    }
  );
  console.log(data);
  return data;
};

// get all repos
const getAllRepos = async () => {
  const { data } = await octokit.request("GET /user/repos");
  console.log(data);
  return data;
};

async function main() {
  const userName = await getUserName();
  console.log(userName);

  // const merge = await mergeBranch(userName);
  // console.log(merge);
  // const repos = await getAllRepos();
  // console.log(repos);
  // const pullRequest = await createPullRequest(userName);
  // console.log(pullRequest);
  // const clone = await cloneMainBranch(userName);
  // console.log(clone);
  const read = await readTsFile(userName);
  console.log(read);
  console.log(Buffer.from(read.content, read.encoding).toString("utf-8"));
}

// main();

// get all repos
// octokit.request('GET /user/repos').then(({ data }) => {
//     console.log(data);
// });

// // Path: test.js
// const { Octokit } = require('@octokit/rest');
// const octokit = new Octokit({
//     auth: ' token'
// });

// octokit.issues.listForRepo({
//     owner: 'owner',
//     repo: 'repo',
//     state: 'open',
//     per_page: 100
// }).then(({ data }) => {
//     console.log(data);
// });