import config from 'pamplemousse';
import { DB } from 'sqlite';
import { DateTime } from 'luxon';
import { getDirname, getFilename } from 'https://deno.land/x/cross_dirname@v0.1.0/mod.ts';

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

console.log(cartoonUrl);