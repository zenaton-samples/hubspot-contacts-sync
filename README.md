<p align="center">
  <a href="https://zenaton.com" target="_blank">
    <img src="https://user-images.githubusercontent.com/36400935/58254828-e5176880-7d6b-11e9-9094-3f46d91faeee.png" target="_blank" />
  </a><br>
  Build and run event-driven processes within the product journey in days instead of months.<br>
ie. payment, booking, personalized communication sequences, ETL processes and more.<br>
  <a href="https://docs.zenaton.com" target="_blank">
    <strong> Explore the docs » </strong>
  </a> <br>
  <a href="https://zenaton.com" target="_blank"> Website </a>
    ·
  <a href="https://github.com/zenaton-samples/" target="_blank"> Sample projects </a>
    ·
  <a href="https://github.com/zenaton/examples-node" target="_blank"> Examples </a>
    ·
  <a href="https://app.zenaton.com/tutorial/node/examples" target="_blank"> Tutorial </a>
</p>

## Table of contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Hubspot Contact Sync](#hubspot-contact-sync)
  - [How to run it](#how-to-run-it)
    - [Requirements](#requirements)
    - [Zenaton Agent setup](#zenaton-agent-setup)
      - [Running the Agent on Heroku (Recommended)](#running-the-agent-on-heroku-recommended)
      - [Running the Agent locally](#running-the-agent-locally)
      - [Running the Agent in Docker](#running-the-agent-in-docker)
      - [Other hosting options](#other-hosting-options)
    - [Running the workflow](#running-the-workflow)
    - [Send events to the workflow](#send-events-to-the-workflow)
  - [Going further](#going-further)
  - [Troubleshooting](#troubleshooting)
    - [Questions](#questions)
    - [Issues with the Zenaton Agent](#issues-with-the-zenaton-agent)
    - [Issues with this project](#issues-with-this-project)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Hubspot Contact Sync

This Zenaton project shows how you can use the Hubspot integration to sync inbound contacts and reach out at the right moment if a user is struggling to complete their activation process.  

The workflow launches when the user registers in the application and we create a contact in hubspot.  The workflow waits for the first 'event' in the activation process and if the user completes it then it waits up to 20 minutes for the second event. If the user does not complete the second event, then we know there is a problem so they are marked as a 'user in trouble' so that someone can reach out to them (or other automations can be added like emails, etc) 


## How to run it

### Requirements

To run this project, you need the following:

- A [Hubspot](https://www.hubspot.com/) account.
- A custom "Contact Property" named "Became a user in trouble date" of type "Date picker" set in your Hubspot settings.
- A [Zenaton](https://zenaton.com/register) account, to get your [App ID and API Token](https://app.zenaton.com/api).
- The Zenaton Hubspot integration correctly setup. You can set it up on your [Dashboard](https://app.zenaton.com/integrations). Read the [full documentation](https://docs.zenaton.com/integrations/hubspot/) if you need help.

### Zenaton Agent setup

#### Running the Agent on Heroku (Recommended)

Running the Agent on Heroku is the quickier way to get started. Make sure you have an account on [Heroku](https://www.heroku.com/) before continuing.

Click the following button to deploy this project on Heroku. You will be prompted for your Zenaton credentials and a Sendgrid API key (optional).
Make sure to fill-in them correctly and click "Deploy".

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

If you go to the [Agents page](https://app.zenaton.com/agents) on your Dashboard, you should see one agent connected.

#### Running the Agent locally

Make sure you have NodeJS correctly installed on your system. If you don't, you can download
NodeJS [here](https://nodejs.org/en/download/).

Clone this repository:

```sh
git clone git@github.com:zenaton-samples/hubspot-contacts-sync.git
```

Go into the project directory and install dependencies:

```sh
npm install
```

Fill-in the `.env` file with all the required credentials. You can find your Zenaton App ID and API Token on [this page](https://app.zenaton.com/api).
You will also need to fill your Hubspot integration ID which you can find on [this page](https://app.zenaton.com/integrations).

Install the Zenaton Agent on your system:

```sh
curl https://install.zenaton.com/ | sh
```

And then run the agent:

```
zenaton listen --boot=boot.js
```

If you go to the [Agents page](https://app.zenaton.com/agents) on your Dashboard, you should see one agent connected.

#### Running the Agent in Docker

Make sure you have Docker and docker-compose correctly installed on your system.
If not, you can find the installation instructions for Docker [here](https://docs.docker.com/install/)

Create your `.env` file by running the following command:

```sh
cp -n .env.sample .env
```

Fill-in the `.env` file with all the required credentials. You can find your Zenaton App ID and API Token on [this page](https://app.zenaton.com/api).
You will also need to fill your Hubspot integration ID which you can find on [this page](https://app.zenaton.com/integrations).

Then, you can start the agent:

```sh
cd docker && docker-compose build && docker-compose up
```

If you go to the [Agents page](https://app.zenaton.com/agents) on your Dashboard, you should see one agent connected.

#### Other hosting options

You can check [our documentation](https://docs.zenaton.com/going-to-production/) for more deployment options: AWS, Google Cloud, Clever Cloud, and more.

### Running the workflow

You're all set. It's time to start the workflow. We will use the `curl` command in a terminal to do that,
but you can start the workflow from your application, in any programming language as long as
you have access to an HTTP client.

Make sure to replace `<YOU API TOKEN>` and `<YOUR APP ID>` with the one you retrieved on the Zenaton website before using the following command.

```sh
curl --request POST \
  --url https://gateway.zenaton.com/graphql \
  --header 'authorization: Bearer <YOUR API TOKEN>' \
  --header 'content-type: application/json' \
  --data '{"query":"mutation ($input: DispatchWorkflowInput!) {\n  dispatchWorkflow(input: $input) {\n    id\n  }\n}\n","variables":{"input":{"appId":"<YOUR APP ID>","environment":"dev","name":"HubspotContactSync","input":"[{\"email\": \"john.doe@example.org\",\"firstname\": \"John\",\"lastname\": \"Doe\", \"phone\": \"+33623456789\"}]","tag":"user:123","version":null}}}'
```

This starts the workflow and you should be able to see it on your [Dashboard](https://app.zenaton.com/workflows).

The workflow will start by creating a new contact in Hubspot. Make sure your don't already have a contact with the same email address in Hubspot,
otherwise the creation of the contact will fail.

After creating the contact, it waits for a `start_process` event which could be anything your user is beginning to do in your own application.

### Send events to the workflow

Let's send this event using a `curl` command again. You can also send events from your application using an HTTP Client to send events
through the Zenaton API.

Again, make sure to correctly replace the `<YOUR API TOKEN>` and `<YOUR APP ID>` placeholders in the following command, and then run it:

```sh
curl --request POST \
  --url https://gateway.zenaton.com/graphql \
  --header 'authorization: Bearer <YOUR API TOKEN>' \
  --header 'content-type: application/json' \
  --data '{"query":"mutation ($input: SendEventToWorkflowsInput!) {\n  sendEventToWorkflows(input: $input) {\n    status\n  }\n}\n","variables":{"input":{"appId":"<YOUR APP ID>","environment":"dev","name":"start_process","data":"[]","selector":{"name":"HubspotContactSync","tag":"user:123"}}}}'
```

Check your Dashboard to see the event that has been received by the workflow. And you will see the event `start_process` has been received
by your workflow, and it is now waiting for a `complete_process` event for at most 20 minutes. If this event is not received within
20 minutes, it's probably that something went wrong.

Now you can send the `complete_process` event with the following `curl` command.
Make sure to correctly replace the `<YOUR API TOKEN>` and `<YOUR APP ID>` placeholders before running the command:

```sh
curl --request POST \
  --url https://gateway.zenaton.com/graphql \
  --header 'authorization: Bearer <YOUR API TOKEN>' \
  --header 'content-type: application/json' \
  --data '{"query":"mutation ($input: SendEventToWorkflowsInput!) {\n  sendEventToWorkflows(input: $input) {\n    status\n  }\n}\n","variables":{"input":{"appId":"<YOUR APP ID>","environment":"dev","name":"complete_process","data":"[]","selector":{"name":"HubspotContactSync","tag":"user:123"}}}}'
```

After running the command, you will see the `complete_process` received by your workflow. It means the user successfully completed the process
in the given timeframe.

Now, try to restart the workflow with a different email address, and at the last step, instead of sending the `complete_process` event,
wait 20 minutes. You will see your workflow will do an extra step: it will update the Hubspot contact to set the "User became in trouble date"
property to the current date. This way you will be able to easily find in Hubspot contacts who have been in trouble with your application
and you can decide what to do next to help them.

## Going further

There are a few things that could be improved in this workflow:

The workflow starts by creating a contact, but sometimes this contact will already exist because it has been added from somewhere else.
In that case, try to improve the workflow by first checking if the contact exists in Hubspot, and if it does, updating it instead of
creating it.

## Troubleshooting

### Questions

If you encounter any issues or problems click on the chat in the bottom right hand side of the screen on the Zenaton dashboard.

### Issues with the Zenaton Agent

If you have a question about the Agent installation or usage, you can take a look at the [dedicated documentation](https://docs.zenaton.com/agent/installation/).

### Issues with this project

If you have any issue with this sample project, feel free to open a new issue on the repository.
