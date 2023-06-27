"use strict";var e=require("debug"),t=require("licia/isWindows"),o=require("licia/getPort"),n=require("qrcode-reader"),a=require("fs"),r=require("child_process"),s=require("licia/sleep"),i=require("licia/toStr"),c=require("licia/waitUntil"),l=require("licia/concat"),u=require("licia/dateFormat"),d=require("ws"),p=require("events"),h=require("licia/uuid"),m=require("licia/stringify");function f(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var w=f(e),v=f(t),y=f(o),g=f(n),b=f(a),E=f(r),q=f(s),M=f(i),j=f(c),$=f(l),P=f(u),C=f(d),x=f(h),k=f(m);/^win/.test(process.platform);class H extends p.EventEmitter{constructor(e){super(),this.ws=e,this.ws.addEventListener("message",(e=>{this.emit("message",e.data)})),this.ws.addEventListener("close",(()=>{this.emit("close")}))}send(e){this.ws.send(e)}close(){this.ws.close()}}const S=new Map,F=new Map,R="Connection closed";class D extends p.EventEmitter{constructor(e,t,o){super(),this.puppet=t,this.namespace=o,this.callbacks=new Map,this.transport=e,this.debug=w.default("automator:protocol:"+this.namespace),this.onMessage=e=>{var t,o;this.debug(`${P.default("yyyy-mm-dd HH:MM:ss:l")} ◀ RECV ${e}`);const{id:n,method:a,error:r,result:s,params:i}=JSON.parse(e);if(null===(t=null==s?void 0:s.method)||void 0===t?void 0:t.startsWith("on"))return void((e,t,o)=>{const n=S.get(e);(null==n?void 0:n.has(t))&&n.get(t)(o)})(s.method,n,s);if(null===(o=null==s?void 0:s.method)||void 0===o?void 0:o.startsWith("Socket.")){return void((e,t,o)=>{const n=F.get(t);(null==n?void 0:n.has(e))&&n.get(e)(o)})(s.method.replace("Socket.",""),s.id,s.data)}if(!n)return this.puppet.emit(a,i);const{callbacks:c}=this;if(n&&c.has(n)){const e=c.get(n);c.delete(n),r?e.reject(Error(r.message||r.detailMessage)):e.resolve(s)}},this.onClose=()=>{this.callbacks.forEach((e=>{e.reject(Error(R))}))},this.transport.on("message",this.onMessage),this.transport.on("close",this.onClose)}send(e,t={},o=!0){if(o&&this.puppet.adapter.has(e))return this.puppet.adapter.send(this,e,t);const n=x.default(),a=k.default({id:n,method:e,params:t});return this.debug(`${P.default("yyyy-mm-dd HH:MM:ss:l")} SEND ► ${a}`),new Promise(((e,t)=>{try{this.transport.send(a)}catch(e){t(Error(R))}this.callbacks.set(n,{resolve:e,reject:t})}))}dispose(){this.transport.close()}static createDevtoolConnection(e,t){return new Promise(((o,n)=>{const a=new C.default(e);a.addEventListener("open",(()=>{o(new D(new H(a),t,"devtool"))})),a.addEventListener("error",n)}))}static createRuntimeConnection(e,t,o){return new Promise(((n,a)=>{w.default("automator:runtime")(`${P.default("yyyy-mm-dd HH:MM:ss:l")} port=${e}`);const r=new C.default.Server({port:e});j.default((async()=>{if(t.runtimeConnection)return!0}),o,1e3).catch((()=>{r.close(),a("Failed to connect to runtime, please make sure the project is running")})),r.on("connection",(function(e){w.default("automator:runtime")(`${P.default("yyyy-mm-dd HH:MM:ss:l")} connected`);const o=new D(new H(e),t,"runtime");t.setRuntimeConnection(o),n(o)})),t.setRuntimeServer(r)}))}}const T=w.default("automator:devtool");async function W(e,t,o){const{port:n,cliPath:a,timeout:r,cwd:s="",account:i="",args:c=[],launch:l=!0}=t;let u=!1,d=!1;if(!1!==l){const t={stdio:"ignore",detached:!0};s&&(t.cwd=s);let o=$.default(c,[]);o=$.default(o,["auto","--project"]),o=$.default(o,[e,"--auto-port",M.default(n)]),i&&(o=$.default(o,["--auto-account",i]));try{T("%s %o %o",a,o,t);const e=E.default.spawn(a,o,t);e.on("error",(e=>{u=!0})),e.on("exit",(()=>{setTimeout((()=>{d=!0}),15e3)})),e.unref()}catch(e){u=!1}}else setTimeout((()=>{d=!0}),15e3);const p=await j.default((async()=>{try{if(u||d)return!0;const e=await async function(e,t){let o;try{o=await D.createDevtoolConnection(e.wsEndpoint,t)}catch(t){throw Error(`Failed connecting to ${e.wsEndpoint}, check if target project window is opened with automation enabled`)}return o}({wsEndpoint:`ws://127.0.0.1:${n}`},o);return e}catch(e){}}),r,1e3);if(u)throw Error(`Failed to launch ${o.devtools.name}, please make sure cliPath is correctly specified`);if(d)throw Error(`Failed to launch ${o.devtools.name} , please make sure http port is open`);return await q.default(5e3),T(`${P.default("yyyy-mm-dd HH:MM:ss:l")} connected`),p}const A={devtools:{name:"Wechat web devTools",remote:!0,automator:!0,paths:[v.default?"C:/Program Files (x86)/Tencent/微信web开发者工具/cli.bat":"/Applications/wechatwebdevtools.app/Contents/MacOS/cli"],required:["project.config.json","app.json","app.js"],defaultPort:9420,validate:async function(e,t){const o=function(e,t){const o=t.devtools.paths.slice(0);e&&o.unshift(e);for(const e of o)if(b.default.existsSync(e))return e;throw Error(`${t.devtools.name} not found, please specify executablePath option`)}(e.executablePath,t);let n=e.port||t.devtools.defaultPort;if(!1!==e.launch)try{n=await async function(e,t){const o=await y.default(e||t);if(e&&o!==e)throw Error(`Port ${e} is in use, please specify another port`);return o}(n)}catch(t){e.launch=!1}else{n===await y.default(n)&&(e.launch=!0)}return Object.assign(Object.assign({},e),{port:n,cliPath:o})},async create(e,t,o){const n=await W(e,t,o);return o.compiled?w.default("automator:devtool")("Waiting for runtime automator"):(w.default("automator:devtool")("initRuntimeAutomator"),n.send("App.callWxMethod",{method:"$$initRuntimeAutomator",args:[]})),n}},adapter:{"Tool.enableRemoteDebug":{reflect:async(e,t)=>{let{qrCode:o}=await e("Tool.enableRemoteDebug",t,!1);return o&&(o=await function(e){const t=new Buffer(e,"base64");return new Promise((async(e,o)=>{const n=await require("jimp").read(t),a=new g.default;a.callback=function(t,n){if(t)return o(t);e(n.result)},a.decode(n.bitmap)}))}(o)),{qrCode:o}}},"App.callFunction":{reflect:async(e,t)=>{return e("App.callFunction",Object.assign(Object.assign({},t),{functionDeclaration:(o=t.functionDeclaration,"}"===o[o.length-1]?o.replace("{","{\nvar uni = wx;\n"):o.replace("=>","=>{\nvar uni = wx;\nreturn ")+"}")}),!1);var o}},"Element.getHTML":{reflect:async(e,t)=>({html:(await e("Element.getWXML",t,!1)).wxml})}}};module.exports=A;
