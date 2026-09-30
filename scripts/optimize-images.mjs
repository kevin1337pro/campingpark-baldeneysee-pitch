import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
const root = 'public/images/camping';
for (const file of await readdir(`${root}/originals`)) {
  for (const width of [640,1280]) {
    for (const format of ['webp','avif']) {
      const target=`${root}/${file.replace('.jpg','')}-${width}.${format}`;
      await sharp(`${root}/originals/${file}`).resize({width,withoutEnlargement:true})[format]({quality:format==='avif'?58:82}).toFile(target);
      console.log(target, Math.round((await stat(target)).size/1024)+' KB');
    }
  }
}
