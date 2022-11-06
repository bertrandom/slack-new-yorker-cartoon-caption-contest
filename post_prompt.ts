import config from 'pamplemousse';
import { DateTime } from 'luxon';
import { getDirname } from 'https://deno.land/x/cross_dirname@v0.1.0/mod.ts';

const firstCartoon = 510;

const epoch = DateTime.fromISO("2022-11-04");
const now = DateTime.fromISO(DateTime.now().toISODate());

const daysElapsed = now.diff(epoch, 'days').toObject().days;

const cartoonIndex = firstCartoon + daysElapsed;

const cartoonFilePath = getDirname() + `/data/cartoons/${cartoonIndex}.jpg`;

const cartoonUrl = `${config.get('baseUrl')}${cartoonIndex}.jpg`;

try {
    const f = await Deno.open(cartoonFilePath);
} catch(e) {
    if (e instanceof Deno.errors.NotFound) {
        console.error(`${cartoonFilePath} does not exist, aborting..`);
        Deno.exit();
    }
}

const chatPostMessageResponse = await fetch(
	`https://slack.com/api/chat.postMessage`,
	{
		'headers': {
			'accept': 'application/json',
			'content-type': 'application/json',
			'Authorization': `Bearer ${config.slack.bot_token}`,
		},
		'body': JSON.stringify(
            {
                channel: config.slack.channel_id,
                "blocks": [
                    {
                        "type": "image",
                        "title": {
                            "type": "plain_text",
                            "text": "Cartoon",
                            "emoji": true
                        },
                        "image_url": cartoonUrl,
                        "alt_text": "Cartoon"
                    }
                ]
            }
        ),
		'method': 'POST',
	},
);

const responseBody = await chatPostMessageResponse.json();

if (responseBody.ok) {

    const messageId = responseBody.message.ts;

    const threadResponse = await fetch(
        `https://slack.com/api/chat.postMessage`,
        {
            'headers': {
                'accept': 'application/json',
                'content-type': 'application/json',
                'Authorization': `Bearer ${config.slack.bot_token}`,
            },
            'body': JSON.stringify(
                {
                    channel: config.slack.channel_id,
                    thread_ts: messageId,
                    "blocks": [
                        {
                            "type": "section",
                            "text": {
                                "type": "plain_text",
                                "text": "Submit your caption below.",
                                "emoji": true
                            }
                        },
                    ]
                }
            ),
            'method': 'POST',
        },
    );

}