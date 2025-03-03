//! only movies
import { load } from "cheerio";

const baseURL = "https://fzmovies.net/";

const headers = {
  Cookie: "PHPSESSID=6118ijg91ju3ped7n619nbuhma;",
  Referer: baseURL,
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/244.178.44.111 Safari/537.36",
};

const getLinks = async (url) => {
  const r = await (await fetch(url, { headers })).text();
  const link = baseURL + r.match(/href='(download.php[^']*)'/)[1];

  const r1 = await (await fetch(link, { headers })).text();

  const $ = load(r1);

  const downloadLinks = $("input[name='download1']")
    .map((i, e) => $(e).attr("value").split("?fromwebsite")[0])
    .get();

  return downloadLinks;
};
const getServers = async (url) => {
  const r1 = await (await fetch(baseURL + url, { headers })).text();
  const imdb = r1.match(/data-title=['"](.*?)["']/)[1];
  let $ = load(r1);
  const links = $(".moviesfiles")
    .map((i, e) => ({
      url: baseURL + $(e).find("#downloadoptionslink2").attr("href"),
      quality: $(e)
        .find("font")
        .text()
        .match(/\[(.*?)\]/)[1],
      name: $(e).find("#downloadoptionslink2").text().split(" ").pop(),
      size: $(e)
        .find("dcounter")
        .text()
        .match(/\((.*?)\)/)[1],
    }))
    .get();
  return [links, imdb];
};
const main = async (url) => {
  const [servers, imdb] = await getServers(url);
  const server = servers[1];
  const links = await getLinks(server.url);
  return {
    ...server,
    sources: links,
    imdb: imdb,
  };
};
const data = await main("movie-Venom Let There Be Carnage--hmp4.htm");
console.log(data);
