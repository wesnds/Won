/**
 * game service
 */
import axios from 'axios'
import { JSDOM } from 'jsdom'
import { factories } from '@strapi/strapi'

async function getGameInfo(slug) {
  const gogSlug = slug.replaceAll('-', '_').toLowercase()
  const body = await axios.get(`https://gog.com/game/${gogSlug}`)
  const dom = new JSDOM(body.data)

  const raw_desc = dom.window.document.querySelector('.description')

  const desc = raw_desc.innerHTML
  const short_desc = raw_desc.textContent.slice(0, 160)
  const ratingElement = dom.window.document.querySelector(
    '.age-restictions__icon use'
  )

  return {
    desc,
    short_desc,
    rating: ratingElement
      ? ratingElement
          .getAttribute('xlink:href')
          .replace(/_/g, '')
          .replace('#', '')
      : 'BR0'
  }
}

export default factories.createCoreService('api::game.game', () => ({
  async populate(params) {
    const gogApiUrl = `https://catalog.gog.com/v1/catalog?limit=48&order=desc%3Atrending`
    const {
      data: { products }
    } = await axios.get(gogApiUrl)

    console.log(await getGameInfo(products[2].slug))
  }
}))
