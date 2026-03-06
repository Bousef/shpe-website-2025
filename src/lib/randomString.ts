import cryptoRandomString from 'crypto-random-string';

type Crypto = {
    new_attendance_key: string;
}

export default function RandomString(
    event_title: string, points: number
): Promise<Crypto> {

    let _long_string = cryptoRandomString({length: 24, type:'alphanumeric'});

    const transformed_event_title = event_title.replace(/ /g, "_");

    return Promise.resolve({new_attendance_key: points + _long_string + transformed_event_title});
}