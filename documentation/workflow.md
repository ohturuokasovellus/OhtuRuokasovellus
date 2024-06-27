# How our CI.yml workflow works

A quick guide on how the CI workflow works.

## When and how to run workflow
The line
```
on:
  workflow_dispatch:
  push:
    branches:
      - main
  pull_request:
    branches: [main]
    types: [opened, synchronize]
```
defines that the workflows are run either when pushing new code into main branch, or making a pull request.
The workflow can be run manually with a 'Run workflow' button that can be found in https://github.com/ohturuokasovellus/OhtuRuokasovellus/actions/workflows/CI.yml .
When using the manual button, you can select in which branch you want the tests to be run.


## Workflow jobs

We have defined 5 different jobs for the workflow.

### Unit tests and eslint

The first job is 'unittests-and-eslint' which tests the unittests and eslint. 
The rest of the jobs will not run before 'unittests-and-eslint' is completed and passes all the tests.

You can defined that a job requires another job to complete with the 'needs' parameter after the job name.

### End-to-end jobs

We have split the end-to-end tests into 3 different jobs, because they are quite slow and use up the most time. 
The 3 jobs are executed in parallel, so each of them requires their own database. 
Our end-to-end tests use the 'concurrency' parameter to make sure that only one instance of each end-to-end test is run at a given time.
Otherwise if someone starts a new workflow, the end-to-end tests change each other's data in the same database.

Workflows in Github actions can only have 1 workflow waiting while some other workflow runs. 
For example, if someone merges a branch to main, it starts a workflow. Now if 2 people create a pull request, they both start a workflow.
However, because there can only be 1 workflow waiting, the workflow of the first pull request is cancelled.

### Openshift job

Our final job in the workflow pushes changes in the main branch to Openshift in Rahti2. 
Changes are pushed only when merging changes into main, and not, for example, when creating a pull request or manually starting a workflow.