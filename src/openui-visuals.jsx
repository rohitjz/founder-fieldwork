import React,{useState,useEffect,Component} from "react";
import {createRoot} from "react-dom/client";
import {Renderer} from "@openuidev/react-lang";
import {createVisualLibrary,lessonVisualProgram} from "./visual-programs.mjs";

function Segments({labels,value,onChange,label}) {
  return <div className="example-switch" role="group" aria-label={label}>{labels.map((text,i)=><button key={text} type="button" aria-pressed={i===value} onClick={()=>onChange(i)}>{text}</button>)}</div>;
}
function VisualRoot({props,renderNode}) {
  return <div className="learning-visual" data-openui-rendered="true">{renderNode(props.children)}<p className="visual-hint">{props.hint}</p></div>;
}
function CompareScene({props}) {
  const [choice,setChoice]=useState(1);
  return <section aria-label="Compare interview questions">
    <Segments labels={["Ask for an opinion","Ask about behavior"]} value={choice} onChange={setChoice} label="Choose an interview question"/>
    <div className="question-example"><span>You ask</span><p>{choice?props.after:props.before}</p></div>
    <div className="question-result" aria-live="polite"><span>You can learn</span><p>{choice?props.afterResult:props.beforeResult}</p></div>
  </section>;
}
function ScopeScene({props}) {
  const [expanded,setExpanded]=useState(false);
  return <section aria-label="Compare the scope of a first product">
    <Segments labels={["A complete small pilot","A larger backlog"]} value={expanded?1:0} onChange={i=>setExpanded(i===1)} label="Choose product scope"/>
    <svg className={expanded?"scope-drawing expanded":"scope-drawing"} viewBox="0 0 600 238" role="img" aria-label={expanded?"The useful workflow surrounded by additional features":"A safe input, reviewed output, and customer review"}>
      <path className="scope-line" d="M100 119H500"/>
      {props.extras.map((label,i)=>{const x=i%2?468:132,y=i<2?28:210;return <g className="scope-extra" key={label}><path d={`M${x} ${y<119?y+17:y-17}L300 119`}/><rect x={x-70} y={y-17} width="140" height="34" rx="6"/><text x={x} y={y+4} textAnchor="middle">{label}</text></g>;})}
      {props.core.map((label,i)=><g className="scope-core" key={label} transform={`translate(${100+i*200} 119)`}><rect x="-88" y="-30" width="176" height="60" rx="8"/><text y="4" textAnchor="middle">{label}</text></g>)}
    </svg>
    <ol className="scope-key">{props.core.map(label=><li key={label}>{label}</li>)}</ol>
    {expanded&&<p className="scope-extras">Additional work: {props.extras.join(", ")}.</p>}
    <p className="scope-explanation" aria-live="polite">{expanded?"These features add scope. They are not necessary to test this first useful handoff.":"The customer still receives a complete result. You have reduced technical scope, not the responsibility to deliver safely."}</p>
  </section>;
}
const library=createVisualLibrary({VisualRoot,CompareScene,ScopeScene});
let root=null;
class ErrorBoundary extends Component {
  constructor(props){super(props);this.state={error:false};}
  static getDerivedStateFromError(){return {error:true};}
  componentDidCatch(error){this.props.onError(error);}
  render(){return this.state.error?<p role="alert">This example could not render. The written explanation is still available.</p>:this.props.children;}
}
function VisualRenderer({host,response,onError}) {
  useEffect(()=>{if(host.dataset.visualState!=="error")host.dataset.visualState="ready";},[host]);
  return <ErrorBoundary onError={onError}><Renderer response={response} library={library} isStreaming={false} publishObservability={false} onError={errors=>{if(errors.length){host.dataset.visualState="error";onError(new Error(errors.map(e=>e.message).join("; ")));}}}/></ErrorBoundary>;
}
export function unmountLessonVisual(){if(root){root.unmount();root=null;}}
export function mountLessonVisual(host,id,{onError}) {
  unmountLessonVisual();
  root=createRoot(host);
  root.render(<VisualRenderer host={host} response={lessonVisualProgram(id)} onError={onError}/>);
}
