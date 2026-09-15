/**
 * Inline script injected into <head> to apply the persisted theme + accent
 * before first paint, avoiding a flash of the wrong surface.
 */
export function ThemeScript() {
  const script = `(function(){try{
var k="elo-theme",ak="elo-accent";
var map={light:"paper",dark:"slate"};
var t=localStorage.getItem(k)||"system";if(map[t])t=map[t];
var isTheme=["paper","mist","sepia","contrast","slate","midnight","ocean","grape"].indexOf(t)>=0;
var dark=["slate","midnight","ocean","grape"];
if(!isTheme){t=(window.matchMedia("(prefers-color-scheme: dark)").matches)?(localStorage.getItem(k)==null?"slate":"slate"):"paper";}
var a=localStorage.getItem(ak)||"amber";
var isAccent=["amber","gold","blue","green","indigo","orange","pink","purple","red","teal","cyan","mint"].indexOf(a)>=0;
if(!isAccent)a="amber";
var d=document.documentElement;
d.setAttribute("data-theme",t);d.setAttribute("data-accent",a);
var cmap={paper:"#f2f2f7",mist:"#eef2f6",sepia:"#eae0ce",contrast:"#ffffff",slate:"#000000",midnight:"#000000",ocean:"#070d18",grape:"#0b0814"};
d.style.colorScheme=dark.indexOf(t)>=0?"dark":"light";
var m=document.querySelector('meta[name="theme-color"]');
if(m)m.setAttribute("content",cmap[t]);
}catch(e){var r=document.documentElement;r.setAttribute("data-theme","paper");r.setAttribute("data-accent","amber");}})();`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}