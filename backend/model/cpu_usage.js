import get_cpu_usage from '../utils/get_cpu_usage.js';

export async function cpu_usage(req) {
    const cpu_data = await get_cpu_usage(req);
    return cpu_data;
}