(function(){const l=document.createElement("link").relList;if(l&&l.supports&&l.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const N of s.addedNodes)N.tagName==="LINK"&&N.rel==="modulepreload"&&o(N)}).observe(document,{childList:!0,subtree:!0});function t(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(n){if(n.ep)return;n.ep=!0;const s=t(n);fetch(n.href,s)}})();function pe(e,l,t,o,n,s){o?n>0?e.src="img/Day_rain.png":s>0?e.src="img/Day_snow.png":l>=30&&t==0?e.src="img/Day_cloudy.png":e.src="img/Day.png":n>0&&t>0?e.src="img/Night_rain.png":s>0&&t>0?e.src="img/Night_snow.png":l>=30&&t==0?e.src="img/Night_cloudy.png":e.src="img/Night.png"}function _e(e,l,t,o,n){o>0?e.src="img/Day_rain.png":n>0?e.src="img/Day_snow.png":l<.8*t?e.src="img/Day_cloudy.png":e.src="img/Day.png"}async function le(e,l){const t=`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${e}&longitude=${l}&localityLanguage=en`,o=await fetch(t);if(!o.ok)throw new Error("Location API request failed");return o.json()}async function C(e,l){const t=`https://api.open-meteo.com/v1/forecast?latitude=${e}&longitude=${l}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,snowfall,cloud_cover,pressure_msl,wind_speed_10m&hourly=temperature_2m&daily=temperature_2m_max,sunshine_duration,temperature_2m_min,precipitation_sum,rain_sum,showers_sum,snowfall_sum&wind_speed_unit=ms&forecast_days=16&timezone=Europe%2FMoscow`,o=await fetch(t);if(!o.ok)throw new Error("Weather API request failed");return o.json()}async function re(e,l){const t=`https://api-bdc.net/data/timezone-by-location?latitude=${e}&longitude=${l}&key=bdc_524e2eb17bce449981829ff94720e53c`,o=await fetch(t);if(!o.ok)throw new Error("Time Zone API request failed");return o.json()}let f,i,v,D,B;const L=new Date;async function z(){try{let A=function(r){return(r-oe)/(me-oe)};var e=A;if(m&&y){f=await le(m,y),i=await C(m,y),v=await re(m,y);const r=/T/g;let c=v.localTime.search(r);console.log(c),D=v.localTime.slice(c+1,c+3),B=v.localTime.slice(c+4,c+6)}else f=await le(),i=await C(f.latitude,f.longitude),v=await re(f.latitude,f.longitude),D=String(L.getHours()).padStart(2,"0"),B=String(L.getMinutes()).padStart(2,"0");console.log(f),console.log(i),console.log(v),console.log("%c today: ","color:#3cd737"),console.log(L),console.log("%c timeZoneData.localTime: ","color:#3cd737"),console.log(v.localTime);const l=i.current.cloud_cover,t=i.current.precipitation,o=i.current.is_day,n=i.current.rain,s=i.current.snowfall;let N=document.querySelector("#icon img");N=pe(N,l,t,o,n,s),document.querySelector("#temperature").innerHTML=Math.round(i.hourly.temperature_2m[+D])+"°",console.log(+D),document.querySelector("#time").innerHTML=`${D}:${B}`;const de={month:"long",day:"numeric",weekday:"long"};document.querySelector("#date").innerHTML=new Intl.DateTimeFormat("en-US",de).format(L),document.querySelector("#location").innerHTML=`${f.countryCode}, ${f.city}`,document.querySelector("#wind").innerHTML=`Wind: ${i.current.wind_speed_10m} m/s`,document.querySelector("#humidity").innerHTML=`Humidity: ${i.current.relative_humidity_2m}%`,document.querySelector("#pressure").innerHTML="Pressure: "+Math.round(i.current.pressure_msl*.7500637554)+" mm";let G=document.querySelectorAll(".charts-css th"),K=document.querySelectorAll(".area td .data"),_=document.querySelectorAll(".area td"),I=document.querySelectorAll(".line td"),Q,g;m&&y?(g=+D,console.log("nowTime = "+g)):(Q=new Date,g=Q.getHours(),console.log("nowTime from Data = "+g));let T=i.hourly.temperature_2m,$=[],X=0;console.log("hourlyTemp20h = "+$);for(let r=0;r<20;r++)$.push(T[g+r]),X=Math.round(X+$[r]),console.log("nowTime + i: "),console.log(g+r);console.log("hourlyTemp20h: "+$);let Y=Math.max(...$),ee=Math.min(...$);const te=(Y-ee)*.2,oe=ee-te,me=Y+te;for(let r=0;r<2;r++){let c,h,q,b;if(r==0)c=T[g-2],h=T[g],q=A(c),b=A(h),K[r].innerHTML=T[g]+"°",_[r].style.setProperty("--start",q),_[r].style.setProperty("--end",b),I[r].style.setProperty("--start",q),I[r].style.setProperty("--end",b),c<0?_[r].className="minus":_[r].className="";else for(let d=0;d<9;d++)c=T[g+d*2],h=T[g+(d+1)*2],console.log(d),q=A(c),b=A(h),_[d+1].style.setProperty("--start",q),_[d+1].style.setProperty("--end",b),I[d+1].style.setProperty("--start",q),I[d+1].style.setProperty("--end",b),h<0?_[d+1].className="minus":_[d+1].className="",d<8&&(K[d+1].innerHTML=h+"°");console.log("current temp: "+T[g]),console.log(`%c start: ${c}`,"color:#3cd737"),console.log(`%c end: ${h}`,"color:#be3016")}for(let r=0;r<9;r++){let c;m&&y?(c=new Date(v.localTime),c.setHours(c.getHours()+2*r)):(c=new Date(L),c.setHours(L.getHours()+2*r)),G[r].innerHTML=`${c.getHours()}:00`,console.log(G[r].innerHTML)}let ye=document.querySelectorAll(".daily_date"),ge=document.querySelectorAll(".day img"),fe=document.querySelectorAll(".daily_temp"),x=i.daily.sunshine_duration,he=x.reduce((r,c)=>r+c,0)/x.length;for(let r=0;r<7;r++){let c=new Date(L);c.setDate(L.getDate()+r);const h={month:"long",day:"numeric"};ye[r].innerHTML=new Intl.DateTimeFormat("en-US",h).format(c),_e(ge[r],x[r],he,i.daily.rain_sum[r],i.daily.snowfall_sum[r]),fe[r].innerHTML=Math.round((i.daily.temperature_2m_max[r]+i.daily.temperature_2m_min[r])/2)+"°"}}catch(l){console.error(l)}}let m,y;z();Z();let V=document.querySelector(".location"),ve=document.querySelector("#change_location_btn"),Le=document.querySelector("#location_header button"),U=document.querySelector("#dark_background"),O=document.querySelector(".tip"),u={},p=document.querySelector("#location_search input"),P=document.querySelector(".search_result"),S=document.querySelectorAll(".result_item"),ne=document.querySelectorAll(".search_result .city"),ce=document.querySelectorAll(".search_result .flag img"),Se=document.querySelectorAll(".search_result .country"),ae,a={},F=document.querySelector(".favorite_locations"),w=document.querySelectorAll(".favorite_item"),M=document.querySelectorAll(".favorite_locations .city"),se=document.querySelectorAll(".favorite_locations .flag img"),ie=document.querySelectorAll(".favorite_locations .country"),we=document.querySelectorAll(".add_favorite"),Te=document.querySelectorAll(".remove_favorite"),W=localStorage.length,H,j,Ne=document.querySelector("#detect_location");function R(){V.className=="location invisible"?(V.className="location",U.style.display="block"):(V.className="location invisible",U.style.display="none")}function J(){let e=Object.keys(a).length;!p.value&&e?(P.className="search_result hidden",F.className="favorite_locations",O.className="tip"):!p.value&&!e?(P.className="search_result hidden",F.className="favorite_locations hidden",O.className="tip"):p.value&&p.value.length>1&&e?(P.className="search_result",F.className="favorite_locations",O.className="tip hidden"):p.value.length>1&&(P.className="search_result",F.className="favorite_locations hidden",O.className="tip hidden")}async function $e(e){const l=`https://geocoding-api.open-meteo.com/v1/search?name=${e}&count=10&language=en&format=json`,t=await fetch(l);if(!t.ok)throw new Error("Location API request failed");return t.json()}async function E(){try{const e=await $e(p.value);if(p.value&&p.value.length>1&&e.results){let t=Object.keys(e.results).length;for(let o=0;o<t&&o<5;o++){console.log(e.results[o]),u[`loc${o}`]={city:e.results[o].name,latitude:e.results[o].latitude,longitude:e.results[o].longitude},e.results[o].country?u[`loc${o}`].country=e.results[o].country:u[`loc${o}`].country="",e.results[o].country_code&&(u[`loc${o}`].countryCode=e.results[o].country_code.toLowerCase()),Se[o].innerHTML=u[`loc${o}`].country,e.results[o].country_code?ce[o].src=`https://open-meteo.com/images/country-flags/${u[`loc${o}`].countryCode}.svg`:ce[o].src="https://open-meteo.com/images/country-flags/united_nations.svg";let n=ne[o].childNodes[ne[o].childNodes.length-1];if(n.nodeValue=u[`loc${o}`].city,S[o].style.display="flex",o<t-1&&o<4&&(S[o].style.borderBottomLeftRadius="0px",S[o].style.borderBottomRightRadius="0px"),t<5){for(let s=5;s>t;s--)S[s-1].style.display=="flex"&&(S[s-1].style.display="none");o==t-1&&(S[o].style.borderBottomLeftRadius="5px",S[o].style.borderBottomRightRadius="5px")}}J()}let l=Object.keys(a).length;if(console.log("FLDLength = "+l),l==0)J();else{for(let t=0;t<l;t++){M[t].nodeValue=a[`loc${t}`].city,ie[t].innerHTML=a[`loc${t}`].country,se[t].src=`https://open-meteo.com/images/country-flags/${a[`loc${t}`].countryCode}.svg`;let o=M[t].childNodes[M[t].childNodes.length-1];if(o.nodeValue=a[`loc${t}`].city,w[t].style.display="flex",t<l-1&&t<2&&(w[t].style.borderBottomLeftRadius="0px",w[t].style.borderBottomRightRadius="0px"),l<3){for(let n=3;n>l;n--)w[n-1].style.display!=="none"&&(w[n-1].style.display="none");t==l-1&&(w[t].style.borderBottomLeftRadius="5px",w[t].style.borderBottomRightRadius="5px")}}J()}}catch(e){console.error(e)}}function qe(e){let l=Object.keys(a).length;if(l<3){a[`loc${l}`]={city:u[`loc${e}`].city,country:u[`loc${e}`].country,latitude:u[`loc${e}`].latitude,longitude:u[`loc${e}`].longitude,countryCode:u[`loc${e}`].countryCode};let t=JSON.stringify(a);localStorage.setItem("fav",t),H=localStorage.getItem("fav"),j=JSON.parse(H),M[l].nodeValue=a[`loc${l}`].city,ie[l].innerHTML=a[`loc${l}`].country,se[l].src=`https://open-meteo.com/images/country-flags/${a[`loc${l}`].countryCode}.svg`;let o=M[l].childNodes[M[l].childNodes.length-1];o.nodeValue=a[`loc${l}`].city,E(),k()}else console.log("fav data is 3"),k()}function be(e){delete a[`loc${e}`];const l={};Object.keys(a).sort().forEach((o,n)=>{l[`loc${n}`]=a[o]}),a=l;let t=JSON.stringify(a);localStorage.setItem("fav",t),H=localStorage.getItem("fav"),j=JSON.parse(H),E(),k()}function ue(e,l){const t=l.currentTarget;t.classList.contains("favorite_item")?(console.log("Favorite item clicked:",e),m=a[`loc${e}`].latitude,y=a[`loc${e}`].longitude,console.log(m,y)):t.classList.contains("result_item")?(console.log("Search result item clicked:",e),m=u[`loc${e}`].latitude,y=u[`loc${e}`].longitude,console.log(m,y)):console.log("Unknown class clicked:",e),C(m,y),R(),z(),Z()}function De(){m="",y="",C(m,y),R(),z(),Z()}async function Z(){try{let n=function(){f&&i?(clearInterval(e),t.className="loader hidden",o.className="loader_bg hidden"):console.log("something wrong")};var l=n;const t=document.querySelector(".loader"),o=document.querySelector(".loader_bg");t.className="loader",o.className="loader_bg";var e=setInterval(n,1e3)}catch(t){console.error(t)}}ve.addEventListener("click",()=>{E(),k(),R()});Le.addEventListener("click",R);U.addEventListener("click",R);W?(H=localStorage.getItem("fav"),j=JSON.parse(H),a=j):W="0";p.addEventListener("input",()=>{clearTimeout(ae),ae=setTimeout(E,500)});we.forEach((e,l)=>{e.addEventListener("click",()=>qe(l))});Te.forEach((e,l)=>{e.addEventListener("click",()=>be(l))});w.forEach((e,l)=>{e.addEventListener("click",t=>{ue(l,t)})});S.forEach((e,l)=>{e.addEventListener("click",t=>{ue(l,t)})});Ne.addEventListener("click",De);E();let Me=document.querySelector("#debug #variables"),He=document.querySelector("#debug #local_storage");function k(){Me.innerHTML=JSON.stringify(a),He.innerHTML=JSON.stringify(localStorage)+" localLength = "+W+" Object.keys(favoriteLocationData).length = "+Object.keys(a).length}k();