module.exports = {
  getAddedFiles: ({ github, context, core }) => {
    const {
      issue: { number: issue_number },
      repo: { owner, repo }
    } = context;

    // Use the Github API to query for the list of files from the PR
    github
      .paginate(
        'GET /repos/{owner}/{repo}/pulls/{pull_number}/files',
        { owner, repo, pull_number: issue_number },
        (response) => response.data.filter((file) => file.status === 'added')
      )
      .then((files) => {
        // Save these values to the Github env
        core.exportVariable('NEW_FILES', files);
        core.exportVariable('NEW_FILES_COUNT', files.length);

        console.log('New files: ', files);
      });
  },
  validateCodeowners: async ({ github, context, fetch, ignore }) => {
    const { NEW_FILES } = process.env;

    const response = await fetch(
      'https://raw.githubusercontent.com/timngyn/docs/test-codeowners-workflow/.github/CODEOWNERS'
    );
    const body = await response.text();

    // Filter CODEOWNERS file. At the end of these filters,
    // codeownersFilePatterns should only include patterns for
    // our mdx files
    const codeownersFilePatterns = body
      .split('\n')
      .filter((e) => !e.startsWith('#'))
      .filter((e) => !e.includes('aws-amplify/documentation-team'))
      .filter((e) => e.length > 1)
      .map((e) => e.split(/\s+/)[0]);

    console.log(codeownersFilePatterns);

    // Add the patterns to the ignore package
    const ig = ignore().add(codeownersFilePatterns);

    const filesNotInCodeowners = [];

    JSON.parse(NEW_FILES).forEach((newFile) => {
      // Check if the file isn't covered by our list of patterns
      if (!ig.ignores(newFile.filename)) {
        console.log(`${newFile.filename} is not covered by CODEOWNERS`);
        filesNotInCodeowners.push(newFile.filename);
      }
    });

    const {
      issue: { number: issue_number },
      repo: { owner, repo }
    } = context;

    // If we found files not covered by CODEOWNERS, then add a comment to the PR
    if (filesNotInCodeowners.length > 0) {
      const files = filesNotInCodeowners.map((e) => `- ${e}\n`).join('');

      const needCodeownersUpdateComment = `CODEOWNERS need to be updated because these new files are not covered:\n ${files}`;
      github.rest.issues.createComment({
        owner,
        repo,
        issue_number,
        body: needCodeownersUpdateComment
      });
      const labels = ['update-codeowners'];
      github.rest.issues.addLabels({ owner, repo, issue_number, labels });
    }
  }
};