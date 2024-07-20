# DTR CLI tool

![DTR - CLI thumbnail](https://github.com/user-attachments/assets/3c480c21-11ba-4976-bdb3-6a30ebf6bc3b)

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Commands](#commands)
   - [init](#init-command)
   - [add](#add-command)
   - [create](#create-command)
   - [read](#read-command)
   - [delete](#delete-command)
   - [create-template](#create-template-command)
   - [template](#template-command)
5. [Configuration](#configuration)
6. [Global Configuration](#global-configuration)
7. [Install for development](#install-for-development)

## Introduction

DTR-CLI is a command-line interface tool designed to help manage and interact with code files in your directory. It includes various commands to initialize configurations, add code files, create new code files, read existing files, delete files, and manage boilerplate templates.

## Installation

DTR-CLI already published on npm

```bash
npm install -g dtr-cli
```

#### For Linux and Mac user

1. Install package from npm:

   ```bash
   sudo npm install -g dtr-cli
   ```

2. Find `dtr-cli` global location:

   ```bash
   which dtr # it will return like `/usr/local/bin/dtr`
   cd /usr/local/bin
   ```

3. Show `dtr-cli` all files:
   ```bash
   ls -la
   ```
   It will return something like this:
   ```bash
   lrwxrwxrwx 1 root root 42 Jul 17 23:09 dtr -> ../lib/node_modules/dtr-cli/build/index.js
   ```
   Go to this `node_modules` folder:
   ```bash
   cd ../lib/node_modules/
   ```
4. Add read write permission:
   ```bash
   sudo chmod 775 -R dtr-cli/
   ```

Now you are ready to use `dtr-cli` by `dtr` command

## Usage

After installation, you can use the `dtr` command followed by the specific subcommand.

```bash
dtr <command> [argument] [flags]
```

## Commands

### Init command

Initialize the `dtr-config.json` configuration file.

```bash
dtr init
```

#### Flags

- `-c, --code <codeFolder>`: Path for the code file directory. This is `optional`. This is `optional`.

### Add command

Add a code file to your directory.

```bash
dtr add
```

#### Arguments

- `[codeName]`: Name of the code file you want to add. This is `optional`. This is `optional`.

### Create command

Create a new code file.

```bash
dtr create
```

#### Argument

- `[codeName]`: Name of the code file. This is `optional`.

#### Flags

- `-f, --from <codeFrom>`: Source of the code file. Accepts `'local'` | `'internet'`. This is `optional`.
- `-u, --url <internetURL>`: GitHub code URL if you select 'codeFrom' as 'internet'. This is `optional`.
- `-p, --path <localPath>`: Current directory file path if you select 'codeFrom' as 'local'. This is `optional`.

### Read command

Read all code files.

```bash
dtr read
```

#### Argument

- `[codeName]`: Name of the code file. This is `optional`.

### Delete command

Delete a global code file.

```bash
dtr delete
```

### Create template command

Create a new boilerplate template.

```bash
dtr create-template
```

#### Argument

- `[templateName]`: Name of the template. This is `optional`.

#### Options

- `-s, --source <source>`: Source folder of the template. This is `optional`.

### Template command

Add a boilerplate template in the current directory.

```bash
dtr template
```

#### Argument

- `[templateName]`: Name of the template. This is `optional`.

## Configuration

The `dtr-config.json` file will be initialized by `init` command. This file stores the configuration settings of current working directory.

Example `dtr-config.json`:

```json
{
  "codeFolder": "code", // code folder name
  "addedCode": [
    {
      "fileName": "",
      "path": ""
    }
    // all code files
  ]
}
```

## Global configuration

The `configData.json` file will be initialized in the global root directory. This file stores the configuration settings for the CLI tool.

Example `configData.json`:

```json
{
  "allFiles": [
    {
      "fileName": "",
      "path": ""
    }
    // all code files
  ],
  "allTemplates": [
    {
      "templateName": "",
      "templateFolder": ""
    }
    // all templates
  ]
}
```

## Install for development

1. Clone the repository:

   ```bash
   git clone https://github.com/saiful7778/dtr-cli.git
   cd dtr-cli
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

> **Note:** Here I use `bun` you can any of them

3. Build the package:

   ```bash
   npm run build
   # or
   yarn run build
   # or
   pnpm run build
   # or
   bun run build
   ```
