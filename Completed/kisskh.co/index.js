import getKKey from "./key.js";

(async () => {
  const id = "173638";
  //err=false&ts=null&time=null
  const resp = await (
    await fetch(
      `https://kisskh.co/api/DramaList/Episode/${id}.png?kkey=${getKKey(id)}`
    )
  ).text();
  console.log(resp);
})();

// test("returns a filled object of episode sources", async () => {
//   const data1 = await zoro.fetchEpisodeSources(
//     "rezero-starting-life-in-another-world-season-3-19301$episode$128356$both"
//   );
//   const data2 = await zoro.fetchEpisodeSources(
//     "rezero-starting-life-in-another-world-season-3-19301$episode$128536$both"
//   );
//   expect(data1.sources).not.toEqual([]);
//   expect(data2.sources).not.toEqual([]);
// });

// test("returns a filled object of episode sources", async () => {
//   const url = new URL("https://megaup.cc/media/m4T2e2CqWS2JcOL2GLtL7hfpCQ");
//   const mega = new MegaUpDecoder();
//   const data = await mega.extract(url);
//   expect(data.sources).not.toEqual([]);
// });
