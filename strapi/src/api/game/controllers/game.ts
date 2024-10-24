/**
 * game controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController(
  'api::game.game',
  ({ strapi }) => ({
    async populate(ctx) {
      try {
        console.log('Starting to populate...')
        await strapi.service('api::game.game').populate(ctx.query)
        ctx.send('Done!')
      } catch (e) {
        ctx.body = e
      }
    }
  })
)
