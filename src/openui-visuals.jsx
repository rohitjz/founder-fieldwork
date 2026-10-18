import React, { useState, useEffect, Component } from "react";
import { createRoot } from "react-dom/client";
import { Renderer, useTriggerAction } from "@openuidev/react-lang";
import { createVisualLibrary, lessonVisualProgram, courseRouteProgram } from "./visual-programs.mjs";

function Glyph({name,x=0,y=0,size=32}) {
  const paths={
    market:"M4 6H28V27H4ZM4 12H28M12 12V27M20 12V27M8 3V8M24 3V8",
    person:"M22 9A6 6 0 1 1 10 9A6 6 0 1 1 22 9M5 29V25C5 17 27 17 27 25V29",
    paper:"M8 3H22L27 8V29H8ZM22 3V9H27M12 14H23M12 19H23M12 24H19M4 9V30",
    target:"M28 16A12 12 0 1 1 4 16A12 12 0 1 1 28 16M23 16A7 7 0 1 1 9 16A7 7 0 1 1 23 16M16 3V9M23 16H30M16 23V30M2 16H9",
    lock:"M9 14V9C9 0 23 0 23 9V14M6 14H26V29H6ZM16 20V24",
    review:"M5 5H25V29H5ZM10 12L13 15L20 8M10 22H21",
    input:"M5 14H27V28H5ZM16 2V19M10 13L16 19L22 13",
    pencil:"M5 27L7 19L23 3L29 9L13 25ZM7 19L13 25M20 6L26 12",
    people:"M20 8A4 4 0 1 1 12 8A4 4 0 1 1 20 8M8 27V22C8 15 24 15 24 22V27M3 11A4 4 0 0 1 9 8M2 26V22C2 18 4 16 7 16M29 11A4 4 0 0 0 23 8M30 26V22C30 18 28 16 25 16",
    speech:"M4 5H28V23H14L8 29V23H4ZM9 11H23M9 17H19",
    cursor:"M6 3L27 17L17 20L13 29ZM17 20L24 28",
    search:"M23 13A9 9 0 1 1 5 13A9 9 0 1 1 23 13M20 20L29 29",
    route:"M5 26H12V8H24M19 3L24 8L19 13M5 22V30"
  };
  if(!Object.hasOwn(paths,name))throw new RangeError(`Unknown visual glyph: ${name}`);
  return <svg x={x} y={y} width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]}/></svg>;
}
function Segments({labels,value,onChange,label}) {
  return <div className="visual-segments" role="group" aria-label={label}>{labels.map((item,i)=><button key={item} type="button" aria-pressed={value===i} onClick={()=>onChange(i)}>{item}</button>)}</div>;
}
function VisualRoot({props,renderNode}) {
  return <div className={props.title?"openui-canvas":"openui-route-root"} data-openui-rendered="true">
    {props.title&&<div className="visual-heading"><span className="visual-emblem" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none"><path d="M3 3H9V9H3ZM11 11H17V17H11ZM11 3H17V9M3 11V17H9" stroke="currentColor" strokeWidth="1.2"/></svg></span><div><h4>{props.title}</h4><p>{props.hint}</p></div></div>}
    {renderNode(props.children)}
    {props.title&&<div className="visual-credit"><span>Fictional running case</span><span>Rendered with OpenUI</span></div>}
  </div>;
}
function FlowScene({props}) {
  const [active,setActive]=useState(0);
  const icons={friction:["market","person","paper"],assumptions:["target","lock","review"],manual:["input","pencil","review"],launch:["people","speech","cursor"],focus:["search","target","route"]};
  return <section className="visual-scene" aria-label="Inspect the decision sequence">
    <svg className="flow-drawing" viewBox="0 0 600 190" role="img" aria-label={props.labels.join(", then ")}>
      <path className="visual-guide" d="M94 84H506"/>
      <path className="visual-connect" d="M143 84H241M349 84H447"/>
      <path className="visual-arrow" d="M233 80L241 84L233 88M439 80L447 84L439 88"/>
      {props.labels.map((item,i)=><g key={item} className={active===i?"scene-node is-selected":"scene-node"} transform={`translate(${94+i*206} 84)`}>
        <rect className="node-orbit" x="-45" y="-45" width="90" height="90" rx="22"/>
        <rect className="node-body" x="-32" y="-32" width="64" height="64" rx="15"/>
        <Glyph name={icons[props.kind][i]} x={-16} y={-16}/>
        <text className="node-name" y="73" textAnchor="middle">{item}</text>
        <circle className="node-junction" cx="0" cy="45" r="3"/>
      </g>)}
    </svg>
    <Segments labels={props.labels.map((label,i)=>`${i+1}. ${label}`)} value={active} onChange={setActive} label="Choose a step in the visual model"/>
    <p className="visual-explanation" aria-live="polite">{props.descriptions[active]}</p>
  </section>;
}
function CompareScene({props}) {
  const [active,setActive]=useState(1);
  return <section className="visual-scene question-scene">
    <Segments labels={["Ask for a prediction","Ask about the last time"]} value={active} onChange={setActive} label="Compare customer interview questions"/>
    <div className="conversation-visual">
      <div className="conversation-avatar"><Glyph name="person" size={30}/><span>You ask</span></div>
      <div className="question-bubble"><span>The question</span><p>{active?props.after:props.before}</p></div>
      <div className="conversation-thread" aria-hidden="true"><span/><span/><span/></div>
      <div className="answer-bubble"><span>What you can learn</span><p aria-live="polite">{active?props.afterResult:props.beforeResult}</p></div>
    </div>
  </section>;
}
function ScopeScene({props}) {
  const [expanded,setExpanded]=useState(false);
  return <section className="visual-scene scope-scene">
    <Segments labels={["Minimum pilot","Full feature backlog"]} value={expanded?1:0} onChange={i=>setExpanded(i===1)} label="Compare MVP scope"/>
    <svg className={expanded?"scope-drawing expanded":"scope-drawing"} viewBox="0 0 600 270" role="img" aria-label={expanded?"A core workflow surrounded by optional features":"A complete small workflow from checklist to customer review"}>
      <path className="scope-core-connection" d="M116 134H484"/>
      {props.extras.map((item,i)=>{
        const x=i%2?474:126,y=i<2?35:231;
        return <g key={item} className="scope-extra"><path d={`M${x} ${y<134?y+19:y-19}L300 134`}/><rect x={x-70} y={y-18} width="140" height="36" rx="9"/><text x={x} y={y+4} textAnchor="middle">{item}</text></g>;
      })}
      {props.core.map((item,i)=><g key={item} className="scope-core" transform={`translate(${100+i*200} 134)`}><rect x="-88" y="-36" width="176" height="72" rx="13"/><Glyph name={["paper","pencil","review"][i]} x={-14} y={-25} size={28}/><text y="23" textAnchor="middle">{item}</text></g>)}
    </svg>
    <ol className="scope-key">{props.core.map(item=><li key={item}>{item}</li>)}</ol>
    {expanded&&<ul className="scope-extra-key">{props.extras.map(item=><li key={item}>{item}</li>)}</ul>}
    <p className="visual-explanation" aria-live="polite">{expanded?"These extra features add work without being necessary to test this first handoff. A larger backlog is not stronger evidence.":"The pilot remains a complete workflow: a safe input, a useful result, and a customer review. Technical scope is smaller; responsibility is unchanged."}</p>
  </section>;
}
function OfferScene({props}) {
  const [active,setActive]=useState(1);
  return <section className="visual-scene offer-scene">
    <Segments labels={props.units} value={active} onChange={setActive} label="Compare pricing units"/>
    <div className="offer-visual">
      <div className="offer-icon" aria-hidden="true"><Glyph name="paper" size={56}/><span>Pilot offer</span></div>
      <div className="offer-document"><span className="offer-document-title">A unit of value</span><strong>{props.units[active]}</strong><dl><div><dt>Scope</dt><dd>Agreed before delivery</dd></div><div><dt>Price</dt><dd>Still needs a real offer</dd></div><div><dt>Cost</dt><dd>Measure actual delivery</dd></div></dl></div>
    </div>
    <p className="visual-explanation" aria-live="polite">{props.descriptions[active]}</p>
  </section>;
}
function ReturnScene({props}) {
  const [active,setActive]=useState(1);
  return <section className="visual-scene return-scene">
    <Segments labels={["Inspect daily activity","Inspect the next close"]} value={active} onChange={setActive} label="Compare return-use cadence"/>
    <svg className={active?"return-drawing cadence":"return-drawing"} viewBox="0 0 600 210" role="img" aria-label="Two monthly close opportunities separated by a quiet period">
      <path className="return-track" d="M74 114H526"/>
      <path className="return-arc" d="M106 83C180 9 420 9 494 83"/>
      {Array.from({length:15},(_,i)=><path key={i} className="day-tick" d={`M${150+i*21} 108V120`}/>)}
      {[94,300,506].map((x,i)=><g key={x} className={i===1?"quiet-period":"return-event"} transform={`translate(${x} 114)`}>{i===1?<rect x="-63" y="-16" width="126" height="32" rx="16"/>:<><rect x="-31" y="-32" width="62" height="64" rx="12"/><Glyph name="review" x={-16} y={-17}/></>}<text className="return-label" y={i===1?4:65} textAnchor="middle">{props.labels[i]}</text></g>)}
    </svg>
    <ol className="return-key">{props.labels.map(item=><li key={item}>{item}</li>)}</ol>
    <p className="visual-explanation" aria-live="polite">{active?"The next close creates a new opportunity to use the service. Inspect who returned, what they used, and why others did not.":"Quiet days may be normal between closes. A daily-login chart can miss the cadence of the customer's actual job."}</p>
  </section>;
}
function PracticeAction({props}) {
  const trigger=useTriggerAction();
  return <button className="visual-note-action" type="button" onClick={()=>trigger("Add visual practice prompt",undefined,{type:"append_field_note",params:{text:props.prompt}})}>
    <Glyph name="pencil" size={18}/><span>Add this prompt to my field note</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="M8 3V13M3 8H13"/></svg>
  </button>;
}
function CourseRoute({props}) {
  const route=[
    ["problem","Find the problem","Is this worth solving?","Lessons 1 to 3","search"],
    ["mvp","Test the offer","Can you deliver value?","Lessons 4 to 6","target"],
    ["pricing","Earn repeat use","Will the need bring them back?","Lessons 7 to 9","route"]
  ];
  return <nav className="visual-route" aria-label="Course sections">{route.map(([id,title,question,range,icon],i)=><a key={id} href={`#lesson=${id}`} className={props.stage===i?"route-station current":"route-station"} aria-current={props.stage===i?"step":undefined}>
    <span className="route-symbol"><Glyph name={icon} size={24}/></span><span className="route-station-text"><span className="route-range">{range}</span><strong>{title}</strong><span>{question}</span></span><span className="route-connector" aria-hidden="true"/>
  </a>)}</nav>;
}

const library=createVisualLibrary({VisualRoot,FlowScene,CompareScene,ScopeScene,OfferScene,ReturnScene,PracticeAction,CourseRoute});
let lessonRoot=null,routeRoot=null;
class VisualErrorBoundary extends Component {
  constructor(props) {super(props);this.state={error:false};}
  static getDerivedStateFromError() {return {error:true};}
  componentDidCatch(error) {this.props.onError(error);}
  render() {return this.state.error?<p className="visual-error" role="alert">The interactive model could not render. The lesson, check, and field note remain available below.</p>:this.props.children;}
}
function VisualRenderer({response,onAction,onError,host}) {
  useEffect(()=>{if(host.dataset.visualState!=="error")host.dataset.visualState="ready";},[host]);
  return <VisualErrorBoundary onError={onError}>
    <Renderer response={response} library={library} isStreaming={false} publishObservability={false} onAction={onAction}
      onError={errors=>{if(errors.length){host.dataset.visualState="error";onError(new Error(errors.map(e=>e.message).join("; ")));}}}/>
  </VisualErrorBoundary>;
}
export function unmountLessonVisual() {
  if(lessonRoot){lessonRoot.unmount();lessonRoot=null;}
}
export function mountLessonVisual(host,id,{onAction,onError}) {
  unmountLessonVisual();
  const response=lessonVisualProgram(id);
  lessonRoot=createRoot(host);
  lessonRoot.render(<VisualRenderer response={response} onAction={onAction} onError={onError} host={host}/>);
}
export function mountCourseRoute(host,stage,{onError}) {
  if(!routeRoot)routeRoot=createRoot(host);
  routeRoot.render(<VisualRenderer response={courseRouteProgram(stage)} onError={onError} host={host}/>);
}
