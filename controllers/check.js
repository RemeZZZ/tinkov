import fetch from 'node-fetch';
import env from 'dotenv';
import { queue } from '../store/index.js';

env.config();

const auth = `Partner-Basic api-key="${process.env.API_KEY}", api-secret="${process.env.API_SECRET}", agent-id="${process.env.CLIENT_ID}"`;

export async function check(request, response) {
  const { inn, phone } = request.body;

  queue.push(async () => {
    const resultFetch = await fetch(
      'https://business.tinkoff.ru/api/v1/public/partner/innScoring',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: auth,
        },

        body: JSON.stringify({
          inn: inn,
        }),
      },
    );

    try {
      const result = await resultFetch.json();

      setTimeout(async () => {
        try {
          const resultFetch = await fetch(
            `https://business.tinkoff.ru/api/v1/public/partner/innScoring/${result?.result?.scoreId}`,
            {
              method: 'GET',

              headers: {
                Authorization: auth,
              },
            },
          );

          const resultScoring = await resultFetch.json();

          const status = resultScoring?.result?.result;

          const finaly =
            resultFetch.status !== 200
              ? 'Хз'
              : status === 'APPROVED'
              ? 'Да'
              : status === 'DUPLICATE'
              ? 'Нет'
              : 'Хз';

          response.status(200).send({
            payload: { phone, inn },

            result: finaly,
          });
        } catch {
          response.status(200).send({
            payload: { phone, inn },

            result: 'хз',
          });
        }
      }, 5000);
    } catch {
      response.status(200).send({
        payload: { phone, inn },

        result: 'хз',
      });
    }
  });
}
