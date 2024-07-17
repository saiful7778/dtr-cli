# DTR CLI tool

![dtr-cli](https://github.com/user-attachments/assets/54cd87ab-e75d-4412-90dc-5c451dac1b7a)


1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Commands](#commands)
   - [init](#init-options)
   - [add](#add-options)
   - [create](#create-options)
   - [read](#read-options)
   - [delete](#delete-options)
   - [create-template](#create-template-options)
   - [template](#template-options)
5. [Configuration](#configuration)
6. [Global Configuration](#global-configuration)
7. [Install for development](#install-for-development)

## Introduction

DTR-CLI is a command-line interface tool designed to help manage and interact with code files in your directory. It includes various commands to initialize configurations, add code files, create new code files, read existing files, delete files, and manage boilerplate templates.

## Installation

```bash
npm install -g dtr-cli
# for linux or mac
sudo npm install -g dtr-cli
```

## Usage

After installation, you can use the `dtr` command followed by the specific subcommand.

```bash
dtr <command> [options]
```

## Commands

### Init options

Initialize the `dtr-config.json` configuration file.

```bash
dtr init [options]
```

#### Options

- `-c, --code <codeFolder>`: Path for the code file directory.

### Add options

Add a code file to your directory.

```bash
dtr add [codeName]
```

#### Arguments

- `[codeName]`: Name of the code file you want to add.

### Create options

Create a new code file.

```bash
dtr create [options]
```

#### Options

- `-n, --name <codeName>`: Name of the code file.
- `-f, --from <codeFrom>`: Source of the code file. Accepts 'local' | 'internet'.
- `-u, --url <internetURL>`: GitHub code URL if you select 'codeFrom' as 'internet'.
- `-p, --path <localPath>`: Current directory file path if you select 'codeFrom' as 'local'.

### Read options

Read all code files.

```bash
dtr read [options]
```

#### Options

- `-n, --name <codeName>`: Name of the code file.

### Delete options

Delete a global code file.

```bash
dtr delete
```

### Create template options

Create a new boilerplate template.

```bash
dtr create-template [options]
```

#### Options

- `-n, --name <name>`: Name of the template.
- `-s, --source <source>`: Source folder of the template.

### template options

Add a boilerplate template in the current directory.

```bash
dtr template [options]
```

#### Options

- `-n, --name <name>`: Name of the template.

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
