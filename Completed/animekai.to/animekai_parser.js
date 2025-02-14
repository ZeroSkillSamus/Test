/** @format */
import initCycleTLS from 'cycletls'
import * as cheerio from 'cheerio'
import AnimekaiDecoder from './decoder.js'

const decoder = AnimekaiDecoder
export default class AnimeKai {
	static BASE_URL = 'https://animekai.to'

	/*
const testhtml = `
		<div class="aitem-wrapper mini sugg">
			<a class="aitem" href="/watch/naruto-shippuden-mv9v">
				<div class="poster">
					<div>
					<img src="https://static.animekai.to/c0/i/9/8a/67664abaf05fa@100.jpg">
					</div>
				</div>
			<div class="detail">
				<h6 class="title" data-jp="NARUTO: Shippuuden">Naruto: Shippuden</h6>
				<div class="info">
				<span class="sub"><svg><use href="#sub"></use></svg>500</span>
				<span class="dub"><svg><use href="#dub"></use></svg>500</span>
				<span><b>500</b></span>
				<span>2007</span>
				<span><b>TV</b></span>
				<span class="rating">PG 13</span>
			</div>
		</div>
		</a>
		<a class="aitem" href="/watch/naruto-shippuden-konoha-gakuen-special-jx19">
		 <div class="poster">
		 	<div>
		 		<img src="https://static.animekai.to/cd/i/c/17/67664949a806b@100.jpg">
		 	</div>
		 </div>
		 <div class="detail">
		 	<h6 class="title" data-jp="NARUTO: Shippuuden - Shippu! &quot;Konoha Gakuen&quot; Den">Naruto Shippuden: Konoha Gakuen - Special</h6>
			<div class="info">
				<span class="sub"><svg><use href="#sub"></use></svg>1</span>
				<span><b>1</b></span>
				<span>2008</span>
				<span><b>SPECIAL</b></span>
				<span class="rating">PG 13</span>
			</div>
		</div>
		</a>
		<a class="aitem" href="/watch/naruto-shippuden-the-movie-the-lost-tower-65yp">
			<div class="poster">
				<div>
					<img src="https://static.animekai.to/04/i/3/e1/676649f73dd66@100.jpg">
				</div>
			</div>
		<div class="detail">
			<h6 class="title" data-jp="NARUTO: Shippuuden - The Lost Tower">Naruto Shippuden the Movie: The Lost Tower</h6>
			<div class="info">
				<span class="sub"><svg><use href="#sub"></use></svg>1</span>
				<span class="dub"><svg><use href="#dub"></use></svg>1</span>
				<span>2010</span>
				<span><b>MOVIE</b></span>
				<span class="rating">PG 13</span>
				</div>
			</div>
		</a>
		<a class="aitem" href="/watch/naruto-shippuden-the-movie-6l3k">
			<div class="poster">
				<div>
				<img src="https://static.animekai.to/93/i/4/0f/67664a064454d@100.jpg">
				</div>
			</div>
		<div class="detail">
			<h6 class="title" data-jp="NARUTO: Shippuuden Movie">Naruto Shippuden the Movie</h6>
			<div class="info">
				<span class="sub"><svg><use href="#sub"></use></svg>1</span>
				<span class="dub"><svg><use href="#dub"></use></svg>1</span>
				<span>2007</span>
				<span><b>MOVIE</b></span>
				<span class="rating">PG 13</span>
			</div>
		</div>
		</a>
		<a class="aitem" href="/watch/naruto-shippuden-the-movie-the-will-of-fire-j85j">
			<div class="poster">
				<div>
					<img src="https://static.animekai.to/e0/i/9/8f/67664a2030d2b@100.jpg">
				</div>
			</div>
		<div class="detail">
			<h6 class="title" data-jp="NARUTO: Shippuuden - Hi no Ishi wo Tsugu Mono">Naruto Shippuden the Movie: The Will of Fire</h6>
			<div class="info">
				<span class="sub"><svg><use href="#sub"></use></svg>1</span>
				<span class="dub"><svg><use href="#dub"></use></svg>1</span>
				<span>2009</span>
				<span><b>MOVIE</b></span>
				<span class="rating">PG 13</span>
				</div>
			</div>
		 </a>
		 </div><div class="sfoot"><a class="more-btn" href="https://animekai.to/browser?keyword=naruto+shippuuden">View All results <i class="fa-solid fa-arrow-right-long"></i></a></div>`
	*/
	static async return_response(url) {
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
		return response
	}

	static async find_desired_anime_link(name) {
		let url = `https://animekai.to/ajax/anime/search?keyword=${encodeURIComponent(name)}`

		let response = await this.return_response(url)

		let html = response.body.result.html
		//console.log(html)
		let found_element = null

		let $ = cheerio.load(html)
		const results = $('a.aitem')

		results.each((_, elm) => {
			let jp_name = $(elm).find('div.detail > h6.title').attr('data-jp')
			if (jp_name && jp_name.toLowerCase() === name) {
				found_element = $(elm).attr('href')
				return false
			}
		})

		if (found_element === null) return null
		else return `${this.BASE_URL}${found_element}`
	}

	static async fetch_episodes(name) {
		let anime_link = await this.find_desired_anime_link(name)
		if (!anime_link) return []

		let response = await this.return_response(anime_link)

		const doc = response.body
		const dataId = doc.match(/class="rate-box".*?data-id\s*=\s*["'](.*?)['"]/)[1]

		response = await this.return_response(
			`https://animekai.to/ajax/episodes/list?ani_id=${dataId}&_=${decoder.generate_token(dataId)}`
		)
		const $ = cheerio.load(response.body.result)
		const episodes = $('a')
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
		return episodes
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
