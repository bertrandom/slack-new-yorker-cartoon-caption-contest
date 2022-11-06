# slack-new-yorker-cartoon-caption-contest

Posts a prompt to caption a New Yorker cartoon into a Slack channel each day

<img width="585" alt="slack" src="https://user-images.githubusercontent.com/57770/200153400-7ced8c53-9f17-4666-9f33-d0c042fa9729.png">

## installation

Run `bin/retrieve_cartoons.sh`.

Host `data/cartoons` somewhere.

Create a new Slack app, sample manifest:
```
{
    "display_information": {
        "name": "New Yorker Caption Contest"
    },
    "features": {
        "bot_user": {
            "display_name": "New Yorker Caption Contest",
            "always_online": false
        }
    },
    "oauth_config": {
        "scopes": {
            "bot": [
                "chat:write",
                "chat:write.public"
            ]
        }
    },
    "settings": {
        "org_deploy_enabled": false,
        "socket_mode_enabled": false,
        "token_rotation_enabled": false
    }
}
```

Install the app on your workspace.

Copy `config/default.json5` to `config/prod.json5`.

Change the baseUrl to where you're hosting the cartoons.

Put the bot token and channel ID in `prod.json5`.

## usage

You can run it manually like this:
```
NODE_ENV=prod deno run --allow-env --allow-read=./,.env,config,data --allow-write=data --allow-net=slack.com post_prompt.ts
```

But it is expected to run as a cronjob, see `crontab` for an example.

## notes

As of publication, the dataset starts with cartoon 510 and goes to 825. 510 starts on 2022-11-04 and it will increment each day after that. That means that this should run for ~315 days, but if you call `bin/retrieve_cartoons.sh` occasionally it may go longer.