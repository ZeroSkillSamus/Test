/** @format */
import initCycleTLS from 'cycletls'
import * as cheerio from 'cheerio'
import AnimekaiDecoder from './decoder.js'

const decoder = AnimekaiDecoder

// Function will remove special characters
//  -> Will also detect multiple spaces and replace them with a single space
function clean_anime_name(title) {
	return title
		.replace(/[^\w\s]/g, '')
		.replace(/\s+/g, ' ')
		.toLowerCase()
}

// Create episodes cache map

export default class AnimeKai {
	static BASE_URL = 'https://animekai.to'
	static EPISODES_CACHE = new Map()

	// Method to add episode to cache
	static addEpisodeToCache(id, episodeData) {
		this.EPISODES_CACHE.set(id, episodeData)
	}

	// Method to get episode from cache
	static getEpisodeFromCache(id) {
		return this.EPISODES_CACHE.get(id)
	}

	// Method to check if episode exists in cache
	static isEpisodeInCache(id) {
		return this.EPISODES_CACHE.has(id)
	}

	static async return_response(url) {
		console.log(url)
		const session = await fetch('http://localhost:3060/cf-clearance-scraper', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				url,
				mode: 'waf-session',
			}),
		})
			.then((res) => res.json())
			.catch((err) => {
				console.error(err)
				return null
			})
		//
		if (!session || session.code != 200) return console.error(session)
		const cycleTLS = await initCycleTLS()
		const response = await cycleTLS(
			url,
			{
				body: '',
				userAgent: session.headers['user-agent'],
				headers: {
					...session.headers,
					cookie: session.cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join('; '),
				},
			},
			'get'
		)

		cycleTLS.exit().catch((err) => {
			console.error(err)
		})

		if (!session || session.code != 200) return console.error(session)
		console.log(response.body)
		return response
	}

	static async find_desired_anime_link(name) {
		let url = `https://animekai.to/ajax/anime/search?keyword=${encodeURIComponent(name)}`

		let response = await this.return_response(url)
		let html = response.body.result.html
		let found_element = null

		let $ = cheerio.load(html)
		const results = $('a.aitem')

		results.each((_, elm) => {
			let jp_name = $(elm).find('div.detail > h6.title').attr('data-jp')
			jp_name = clean_anime_name(jp_name)

			if (jp_name && jp_name === name) {
				found_element = $(elm).attr('href')
				return false
			}
		})

		if (found_element === null) return null
		else return `${this.BASE_URL}${found_element}`
	}

	static async fetch_episodes_from_cache_and_set(name) {
		name = clean_anime_name(name)
		if (!this.isEpisodeInCache(name)) return await this.fetch_episodes(name)
		//Check date
		let date_added = this.EPISODES_CACHE.dateAdded
		if (date_added > 2) {
			return await this.fetch_episodes(name)
		} else {
			return this.EPISODES_CACHE.get(name).episodes
		}
	}

	static async fetch_episodes(name) {
		let anime_link = await this.find_desired_anime_link(name)
		let episodes = { dateAdded: new Date() }
		if (!anime_link) return []

		let response = await this.return_response(anime_link)

		const doc = response.body
		const dataId = doc.match(/class="rate-box".*?data-id\s*=\s*["'](.*?)['"]/)[1]

		response = await this.return_response(
			`https://animekai.to/ajax/episodes/list?ani_id=${dataId}&_=${decoder.generate_token(dataId)}`
		)
		//console.log(resp)
		const $ = cheerio.load(response.body.result)
		const episodes_list = $('a')
			.map((_, el) => {
				return {
					number: el.attribs['num'],
					slug: el.attribs['slug'],
					title: $(el).find('span').text(),
					id: el.attribs['token'],
					is_filler: el.attribs['class'].includes('filler'),
				}
			})
			.get()

		// Insert into map
		if (episodes_list.length == 0) {
			return []
		}

		this.EPISODES_CACHE.set(name, episodes)
		episodes.episodes = episodes_list
		return episodes_list
	}

	static async fetch_servers(id) {
		let url = `https://animekai.to/ajax/links/list?token=${id}&_=${decoder.generate_token(id)}`
		let response = await this.return_response(url)
		//const doc = response.body
		const $ = cheerio.load(response.body.result)
		const servers = $('.server-items')
			.map((i, el) => {
				const type = el.attribs['data-id']
				const servers = $(el)
					.find('span')
					.map((i, server) => ({
						server: $(server).text(),
						id: server.attribs['data-lid'],
					}))
					.get()

				return {
					[`${type}`]: servers,
				}
			})
			.get()
		return servers
	}

	static async fetch_source(id) {
		let orig_url = `https://animekai.to/ajax/links/view?id=${id}&_=${decoder.generate_token(id)}`
		let response = await this.return_response(orig_url)
		if (response.status != 200) return

		let { url } = JSON.parse(decoder.decode_iframe_data(response.body.result).replace(/\\/gm, ''))
		url = url.replace(/\/(e|e2)\//, '/media/')

		const sources = await this.return_response(url)

		let decoded = JSON.parse(decoder.decode(sources.body.result).replace(/\\/gm, ''))
		let default_stream = decoded.sources[0].file
		let resp = await (await fetch(default_stream)).text()

		let iframeLinks = { sources: [] }
		const resolutions = resp.match(/(RESOLUTION=)(.*)(\s*?)(\s*.*)/g)
		resolutions?.forEach((str) => {
			let index_of_m3u8 = default_stream.indexOf('list')

			const resolution = str.split('\n')[0].split('x')[1]
			const stream_url = `${default_stream.substring(0, index_of_m3u8)}${str.split('\n')[1].trim()}`
			iframeLinks.sources.push({
				url: stream_url,
				quality: resolution,
				is_m3u8: stream_url.includes('.m3u8'),
			})
		})
		return {
			intro: null,
			outro: null,
			...iframeLinks,
		}
	}
}

// AnimeKai.fetch_source('mxSYmE79Bg').then((x) => {})
