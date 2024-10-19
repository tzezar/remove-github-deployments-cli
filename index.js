#!/usr/bin/env node

import { program } from 'commander';
import prompts from 'prompts';
import { Octokit } from '@octokit/rest';

// CLI version and description
program
  .version('1.0.0')
  .description("CLI to remove GitHub deployments");

// Command to remove deployments
program
  .command('init')
  .description(`Remove deployments from the specified GitHub repository`)
  .action(async () => {
    const questions = [
      {
        type: 'text',
        name: 'githubToken',
        message: 'Enter your GitHub access token:',
        validate: token => token.length > 0 ? true : 'Access token cannot be empty.'
      },
      {
        type: 'text',
        name: 'repo',
        message: 'Enter the repository name (owner/repo):',
        validate: repo => repo.length > 0 ? true : 'Repository name cannot be empty.'
      },
      {
        type: 'confirm',
        name: 'deleteActive',
        message: 'Do you want to remove active deployments as well?',
        initial: false
      },
      {
        type: 'confirm',
        name: 'confirmDelete',
        message: 'Are you sure you want to remove the deployments?',
        initial: false
      }
    ];

    const answers = await prompts(questions);

    // Check if user confirmed deletion
    if (!answers.confirmDelete) {
      console.log('Aborted deletion of deployments.');
      return;
    }

    const [owner, repo] = answers.repo.split("/");
    const octokit = new Octokit({
      auth: answers.githubToken,
    });

    let hasDeployments = true;

    // Loop until there are no more deployments to remove
    while (hasDeployments) {
      // Fetch all deployments
      const { data: deployments } = await octokit.repos.listDeployments({
        owner,
        repo,
      });

      if (deployments.length === 0) {
        console.log("No more deployments found.");
        hasDeployments = false;
        break;
      }

      // Deactivate and remove each deployment
      for (const deployment of deployments) {
        // Check if the deployment is active and if the user wants to remove active deployments
        if (deployment.status === 'active' && !answers.deleteActive) {
          console.log(`Skipping active deployment: ${deployment.id}`);
          continue;
        }

        try {
          // Deactivate the deployment
          await octokit.repos.createDeploymentStatus({
            owner,
            repo,
            deployment_id: deployment.id,
            state: "inactive",
          });
          console.log(`Deactivated deployment: ${deployment.id}`);
        } catch (deactivateError) {
          console.error(`Error deactivating deployment ${deployment.id}:`, deactivateError.message);
          continue; // Skip deletion if deactivation fails
        }

        // Attempt to remove the deployment
        try {
          await octokit.repos.deleteDeployment({
            owner,
            repo,
            deployment_id: deployment.id,
          });
          console.log(`Deleted deployment: ${deployment.id}`);
        } catch (deleteError) {
          console.error(`Error deleting deployment ${deployment.id}:`, deleteError.message);
        }
      }
    }
  });

// Parse the command line arguments
program.parse(process.argv);
