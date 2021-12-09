import { cpu_usage as model } from "../model/cpu_usage.js";

export default function cpu_usage(server) {

    server.post('/cpu-usage', async (req, res, next) => {
        try {
            const result = await model(req);
            res.contentType = 'json';
            res.send(result);
            next(false);
        }
        catch(err) {
            res.send(500, err.message);
            next(err);
        }
    });
}