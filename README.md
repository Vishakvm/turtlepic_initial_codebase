# TurtlePic / Frontend

```
Copyright (c) 2022-present TurtlePic. All Rights Reserved.
Proprietary and confidential information of TurtlePic.
Disclosure, use, or reproduction without written authorization of TurtlePic is prohibited.
```

## Table of Contents

1. [Welcome](#welcome)
2. [Getting started](#getting-started)
3. [Tech stack](#tech-stack)
4. [Git rules](#git-rules)
5. [Dependencies](#dependencies)
6. [Import rules](#import-rules)
7. [File naming conventions](#file-naming-conventions)
8. [Comments rules](#comments-rules)
9. [Cross browser compatibility](#cross-browser-compatibility)

## WELCOME

<p style='color:DarkOrange'>
Welcome on board - we are pleased to have you!
</p>

#### Please validate requirements

- `Node.js`: Please make sure you have recommended [Node.js](https://nodejs.org/en/) version, (suggestion v14.17.3).
- `Yarn`: Validate Yarn version `yarn --version` - should be at least 1.13.0, or
  install Yarn through the npm package manager:
  ```
  npm install --global yarn
  ```
- `React-scripts`: If react-scripts are not installed, install through the yarn package manager:
  ```
   yarn add --dev react-scripts
  ```
- `Typescript`: If typescript is not added, add through the yarn package manager:
  ```
   yarn add --dev typescript
  ```

## GETTING STARTED

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
In the project directory, you can run:

| Command          | Action                             | Description                                                |
|:---------------- |:---------------------------------- |:---------------------------------------------------------- |
| yarn install     | yarn                               | Install all dependencies for a project                     |
| yarn start       | yarn react-scripts start           | Runs the app in the development mode                       |
| yarn lint        | yarn eslint . --ext .tsx --ext .ts | Launches the linter                                        |
| yarn test        | yarn react-scripts test            | Launches the test runner in the interactive watch mode     |
| yarn build       | yarn react-scripts build           | Builds the app for production to the `build` folder.       |
| yarn validate    | [linter / unit-tests /]            | Command used by `CI/CD` to validate the code quality.      |

#### `yarn install && yarn start`

Runs the app in the development mode.\
Open [http://localhost:8083](http://localhost:8083) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `yarn validate`

Before commit make sure that your code meet the best standards and our expectations.

Run `yarn validate` that is used by CI/CD or run separately
linter `yarn lint` ([TypeScript ESLint](https://github.com/typescript-eslint/typescript-eslint))
and the test runner `yarn test` in the interactive watch mode.

See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://docs.gitlab.com/ee/ci/environments/) for more information.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## TECH STACK

Please be familiar with

- [TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [React.js](https://reactjs.org/) + hooks
- [Material-UI](https://material-ui.com/components/paper/)

## GIT RULES

- Merging:

  - Please always take a pull from main to keep the branch up-to-date with
    the base branch (usually main(master)).
    ```

- Try to commit in reference to the module and the story.

  - `[MODULE][CLICKUP-TICKET-ID]: Comment`
    And then close ClickUp ticket from the portal once code is merged 

- Don't commit directly to main(master)/staging/develop branches.

- Don't merge your branch with master/staging/develop branches
  You can submit a pull request and it needs to be reviewed by your supervisor / team lead

### Please read:

- https://docs.gitlab.com/
- https://docs.gitlab.com/ee/user/project/merge_requests/
- https://www.atlassian.com/git/tutorials/making-a-pull-request


## DEPENDENCIES

**Always version dependencies!**

If you want to add a new dependency or remove existing one - please do the following:

- Discuss the reason with the team.
- Ask your team leader.

## IMPORT RULES

Please follow the belowe import rules:

1. Group of React libraries.
2. Group of other dependencies.
3. Optional context (state manager)
4. Models
5. Views

Example:

```
import React from 'react';

import clsx from 'clsx';

import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import AppBar from '@material-ui/core/AppBar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Typography from '@material-ui/core/Typography';

import AdminContext from './AdminContext';

import { CompanyModel, CompanyDepartmentType } from '../models/CompanyModel';

import AdminCompaniesView from './views/AdminCompaniesView';
import AdminTaxRuleEngineView from './views/AdminTaxRuleEngineView';
```

## FILE NAMING CONVENTIONS

Please follow the naming convencions:
`Prefix-name-[View|Context].[ts|tsx]` for example

- admin/view/`Admin`Companies`View`.tsx
- admin/view/`Admin`Logs`View`.tsx
- admin/`Admin`Context.ts

## COMMENTS RULES

Please follow comments [best practices](https://make.wordpress.org/core/handbook/best-practices/inline-documentation-standards/javascript/).

- File Headers

  ```
  /**
  * Summary
  *
  * Description. (use period)
  */
  ```

- Functions

  ```
  /**
  * Summary
  *
  * Description. (use period)
  *
  * @param {type}   var           Description.
  * @param {type}   [var]         Description of optional variable.
  * @param {type}   [var=default] Description of optional variable with default variable.
  * @param {Object} objectVar     Description.
  * @param {type}   objectVar.key Description of a key in the objectVar parameter.
  *
  * @return {type} Return value description.
  */
  ```

## CROSS BROWSER COMPATIBILITY

Cross browser refers to the ability for the TurtlePic platform to support all the web browsers.

- [Chrome](https://www.w3schools.com/browsers/browsers_chrome.asp) **C56**

- [Firefox](https://www.w3schools.com/browsers/browsers_firefox.asp) **FF51**

- [Internet Explorer Edge/IE](https://www.w3schools.com/browsers/browsers_explorer.asp) **Edge14** / **IE11**

- [Safari](https://www.w3schools.com/browsers/browsers_safari.asp) **S10**

## QUESTIONS

For any further questions, please do contact Midhat Shafat <midhat.shafat@rmgx.in> or in case of emergency,
you can reach out to CTO, Nishant Varshney <nishant.varshney@rmgx.in>

