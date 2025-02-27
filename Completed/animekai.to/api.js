/** @format */

import express from 'express'
import AnimeKai from './animekai_parser.js'

const API = express()
const port = 3090
//const animekai = new AnimeKai()

API.listen(port, async () => {
	console.log(`Opening On Port: ${port}`)
})

API.get('/KAI/Episodes', async (req, res) => {
	res.header('Content-Type', 'application/json')
	const { name } = req.query

	if (!name) return res.send('Failed')
	//const parser = new AnimeKai()
	let episode_list = await AnimeKai.fetch_episodes_from_cache_and_set(name)
	return res.send(JSON.stringify(episode_list, null, 4))
})

API.get('/KAI/Fetch-Servers', async (req, res) => {
	res.header('Content-Type', 'application/json')
	const { id } = req.query

	if (!id) return res.send('Failed')
	let server_list = await AnimeKai.fetch_servers(id)
	return res.send(JSON.stringify(server_list, null, 4))
})

API.get('/KAI/Fetch-Stream', async (req, res) => {
	res.header('Content-Type', 'application/json')
	const { id } = req.query

	if (!id) return res.send('Failed')
	let sources = await AnimeKai.fetch_source(id)
	return res.send(JSON.stringify(sources, null, 4))
})
