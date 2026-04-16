import{c as s,j as e,m as l}from"./index-k9UjwgYu.js";/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c=[["polyline",{points:"22 17 13.5 8.5 8.5 13.5 2 7",key:"1r2t7k"}],["polyline",{points:"16 17 22 17 22 11",key:"11uiuu"}]],d=s("trending-down",c);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]],p=s("trending-up",x);function y({icon:i,value:n,label:a,trend:t,color:r="bg-primary-50 text-primary-600",index:o=0}){return e.jsxs(l.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:o*.08},className:"bg-white rounded-[1.5rem] p-8 shadow-[0_15px_30px_-5px_rgba(2,132,199,0.08)] border border-sky-100 hover:shadow-[0_25px_40px_-5px_rgba(2,132,199,0.12)] transition-all duration-300 flex flex-col items-center text-center",children:[e.jsx("div",{className:`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm border border-sky-50 ${r}`,children:i}),e.jsx("p",{className:"text-4xl font-black text-slate-800 tracking-tight mb-3",children:n}),e.jsxs("div",{className:"flex flex-col items-center gap-2 mt-2 w-full",children:[e.jsx("p",{className:"text-base text-slate-500 font-bold tracking-wide uppercase",children:a}),t!==void 0&&e.jsxs("span",{className:`flex items-center gap-1.5 text-sm font-black px-3 py-1 bg-opacity-10 rounded-full ${t>=0?"text-emerald-600 bg-emerald-100":"text-red-500 bg-red-100"}`,children:[t>=0?e.jsx(p,{size:16}):e.jsx(d,{size:16}),Math.abs(t),"%"]})]})]})}export{y as K};
