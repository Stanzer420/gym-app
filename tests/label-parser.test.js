// Tests for the nutrition label parser. Run: deno run --allow-read tests/label-parser.test.js
// parseLabel is read straight out of index.html so the test always checks the shipped code.
const html=Deno.readTextFileSync(new URL('../index.html',import.meta.url));
const src=html.slice(html.indexOf('function parseLabel(raw){'),html.indexOf('\n return out}',html.indexOf('function parseLabel(raw){'))+13);
const parseLabel=new Function(src+';return parseLabel')();
const cases=[
 ['DE classic',`Nährwerte pro 100 g pro Portion (30 g)
Brennwert 1520 kJ / 363 kcal 456 kJ / 109 kcal
Fett 6,5 g 2,0 g
davon gesättigte Fettsäuren 1,2 g 0,4 g
Kohlenhydrate 58 g 17 g
davon Zucker 1,0 g 0,3 g
Ballaststoffe 10 g 3,0 g
Eiweiß 13,5 g 4,1 g
Salz 0,02 g 0,01 g`,{k:363,f:6.5,c:58,p:13.5,u:'g'}],
 ['OCR slips',`Durchschnittliche Nährwerte je 100 g
Energie 2170 kJ/ 519 kcaI
Fett 28 g
davon gesattigte Fettsauren 16 g
Kohlenhydrate 57 g
davon Zucker 53 g
EiweiB 7,6 g
Salz 0,25 g`,{k:519,f:28,c:57,p:7.6}],
 ['kJ/kcal header',`Nutrition per 100 ml
Energy kJ/kcal 270/64
Fat 3.5 g
of which saturates 2.3 g
Carbohydrate 4.8 g
of which sugars 4.8 g
Protein 3.4 g
Salt 0.13 g`,{k:64,f:3.5,c:4.8,p:3.4,u:'ml'}],
 ['kJ only',`pro 100g: Energie 1000 kJ, Fett 1 g, Kohlenhydrate 50 g, Eiweiss 10 g`,{k:239,f:1,c:50,p:10}],
 ['less than',`Brennwert 30 kJ / 7 kcal
Fett <0,5 g
Kohlenhydrate 0,9 g
Eiweiß <0,5 g`,{k:7,f:0.5,c:0.9,p:0.5}],
 ['mince',`Nährwerte je 100 g
Brennwert 1004 kJ / 241 kcal
Fett 17 g davon gesättigte Fettsäuren 7,5 g
Kohlenhydrate 0 g
Eiweiß 21 g`,{k:241,f:17,c:0,p:21}],
 ["comma lost (real OCR)",`Nährwerte pro 100 g pro Portion (40 g)
Brennwert 1569 kJ / 372 kcal 628 kJ / 149 kcal
Fett 70g 28g

davon gesättigte Fettsäuren 1,3¢g 059g
Kohlenhydrate 58,7 g 23,5¢g

davon Zucker 12g 05g

Ballaststoffe 10g 40g

Eiweiß 13,5¢g 54g

Salz 0,02¢g <0,01¢g`,{k:372,f:7,c:58.7,p:13.5}],
 ["high fat stays",`Brennwert 2500 kJ / 600 kcal
Fett 50 g
Kohlenhydrate 20 g
Eiweiß 20 g`,{k:600,f:50,c:20,p:20}],
];
let bad=0;for(const [n,t,exp] of cases){const r=parseLabel(t);const fails=Object.entries(exp).filter(([k,v])=>r[k]!==v);console.log((fails.length?'FAIL ':'ok   ')+n, fails.length?JSON.stringify({got:r,exp}):'');bad+=fails.length?1:0}
if(bad)Deno.exit(1);
