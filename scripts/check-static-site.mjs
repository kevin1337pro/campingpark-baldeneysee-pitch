import { chromium, expect } from '@playwright/test';
const base=process.argv[2]??'http://127.0.0.1:4173/campingpark-baldeneysee-pitch';
const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`);});
 await page.goto(base+'/');await expect(page.getByRole('heading',{name:'Weniger Alltag. Mehr See.'})).toBeVisible();
 for(const img of await page.locator('main img').all()){await img.scrollIntoViewIfNeeded();await expect.poll(()=>img.evaluate(el=>el.naturalWidth)).toBeGreaterThan(0);}
 await page.locator('#campingtag').scrollIntoViewIfNeeded();await expect(page.locator('.camping-scene')).toHaveAttribute('data-time','24.00');
 await page.getByLabel('Anreise im Anfrage-Einstieg').fill('2030-06-10');await page.getByLabel('Abreise im Anfrage-Einstieg').fill('2030-06-13');await page.getByRole('button',{name:'Aufenthalt anfragen',exact:true}).click();
 await expect(page.getByLabel('Anreise',{exact:true})).toHaveValue('2030-06-10');await expect(page.getByLabel('Abreise',{exact:true})).toHaveValue('2030-06-13');expect(page.url()).toContain('/campingpark-baldeneysee-pitch/anfragen/');
 const next=()=>page.getByRole('button',{name:'Weiter',exact:true}).click();await next();await next();await page.getByRole('radio',{name:'Touristischer Stellplatz'}).check();await page.getByLabel('Fahrzeuglänge in Metern').fill('6.5');await next();await next();await page.getByRole('button',{name:'Beispieldaten einsetzen'}).click();await page.getByRole('checkbox',{name:/Ich habe verstanden/}).check();await next();await page.getByRole('button',{name:'Anfrage als Demo testen'}).click();await expect(page.getByRole('heading',{name:'Demo abgeschlossen.'})).toBeVisible();
 for(const route of ['anfragen','konzept','pitch']){const response=await page.goto(base+'/'+route+'/');expect(response.status()).toBe(200);await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content',/noindex/);}
 await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/');await expect(page.getByRole('heading',{name:'Weniger Alltag. Mehr See.'})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect(errors).toEqual([]);expect(failed).toEqual([]);console.log('PASS: static root, images, animation, query handoff, all six request steps, direct routes, metadata, responsive layout; no failed requests or browser errors.');
}finally{await browser.close();}
